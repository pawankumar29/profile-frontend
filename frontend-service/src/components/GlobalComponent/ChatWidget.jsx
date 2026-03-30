import React, { useEffect, useMemo, useRef, useState } from 'react'
import './ChatWidget.css'

const API_BASE = import.meta.env.VITE_PROFILE_BACKEND_URL || ''
const SESSION_KEY = 'chat_session_id'

const getSessionId = () => {
  if (typeof window === 'undefined') return ''
  const existing = localStorage.getItem(SESSION_KEY)
  if (existing) return existing
  const generated = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`
  localStorage.setItem(SESSION_KEY, generated)
  return generated
}

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const listRef = useRef(null)

  const sessionId = useMemo(() => getSessionId(), [])

  const loadMessages = async () => {
    if (!sessionId) return
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/api/chat/messages?sessionId=${encodeURIComponent(sessionId)}`)
      const data = await res.json()
      setMessages(Array.isArray(data) ? data : [])
      setError('')
    } catch (err) {
      setError('Unable to load messages right now.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadMessages()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return undefined
    const timer = setInterval(() => {
      loadMessages()
    }, 6000)
    return () => clearInterval(timer)
  }, [isOpen])

  useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, isOpen])

  const sendMessage = async (event) => {
    event.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || !sessionId) return

    const optimistic = {
      id: `temp-${Date.now()}`,
      sessionId,
      senderType: 'user',
      message: trimmed,
      createdAt: new Date().toISOString(),
      pending: true,
    }

    setMessages((prev) => [...prev, optimistic])
    setInput('')

    try {
      const res = await fetch(`${API_BASE}/api/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          senderType: 'user',
          message: trimmed,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.message || 'Unable to send message')
      }
      setMessages((prev) => prev.filter((item) => item.id !== optimistic.id).concat(data))
      setError('')
    } catch (err) {
      setMessages((prev) => prev.map((item) => (item.id === optimistic.id ? { ...item, failed: true } : item)))
      setError('Message failed to send. Please try again.')
    }
  }

  return (
    <div className={`chat-widget ${isOpen ? 'open' : ''}`}>
      <button
        type="button"
        className="chat-widget__toggle"
        onClick={() => setIsOpen((value) => !value)}
        aria-expanded={isOpen}
      >
        {isOpen ? 'Close' : 'Chat'}
        <span className="chat-widget__pulse" />
      </button>

      <div className="chat-widget__panel" aria-hidden={!isOpen}>
        <div className="chat-widget__header">
          <div>
            <h3>Let’s talk</h3>
            <p>Ask anything. We reply soon.</p>
          </div>
          <span className="chat-widget__status">Online</span>
        </div>

        <div className="chat-widget__body" ref={listRef}>
          {loading && messages.length === 0 ? (
            <div className="chat-widget__empty">Loading messages…</div>
          ) : null}
          {!loading && messages.length === 0 ? (
            <div className="chat-widget__empty">Start the conversation.</div>
          ) : null}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-widget__bubble ${message.senderType === 'admin' ? 'admin' : 'user'} ${message.failed ? 'failed' : ''}`}
            >
              <p>{message.message}</p>
              <span>
                {message.senderType === 'admin' ? 'Admin' : 'You'}
                {message.pending ? ' · sending…' : ''}
                {message.failed ? ' · failed' : ''}
              </span>
            </div>
          ))}
        </div>

        <form className="chat-widget__input" onSubmit={sendMessage}>
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type your message..."
          />
          <button type="submit" disabled={!input.trim()}>
            Send
          </button>
        </form>

        {error ? <div className="chat-widget__error">{error}</div> : null}
      </div>
    </div>
  )
}

export default ChatWidget
