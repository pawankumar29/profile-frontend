import React, { useEffect, useRef, useState } from 'react'
import './AdminChat.css'

const API_BASE = import.meta.env.VITE_PROFILE_BACKEND_URL || ''

function AdminChat() {
  const [sessions, setSessions] = useState([])
  const [activeSessionId, setActiveSessionId] = useState('')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const listRef = useRef(null)

  const loadSessions = async () => {
    try {

      const res = await fetch(`${API_BASE}/api/chat/sessions`)
      const data = await res.json()
      const nextSessions = Array.isArray(data) ? data : []
      setSessions(nextSessions)
      if (!activeSessionId && nextSessions[0]) {
        setActiveSessionId(nextSessions[0].sessionId)
      }
    } catch (err) {
      setError('Unable to load sessions.')
    }
  }

  const loadMessages = async (sessionId) => {
    if (!sessionId) return
    try {
      setLoading(true)
      console.log('message running ');
      const res = await fetch(`${API_BASE}/api/chat/messages?sessionId=${encodeURIComponent(sessionId)}`)
            console.log('message running-1 ',JSON.stringify(res));
      const data = await res.json()
                  console.log('message running-2 ',JSON.stringify(res));

      setMessages(Array.isArray(data) ? data : [])
      setError('')
    } catch (err) {
      setError('Unable to load messages.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSessions()
    const timer = setInterval(loadSessions, 8000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    loadMessages(activeSessionId)
    const timer = setInterval(() => loadMessages(activeSessionId), 5000)
    return () => clearInterval(timer)
  }, [activeSessionId])

  useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, activeSessionId])

  const sendMessage = async (event) => {
    event.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || !activeSessionId) return

    const optimistic = {
      id: `temp-${Date.now()}`,
      sessionId: activeSessionId,
      senderType: 'admin',
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
          sessionId: activeSessionId,
          senderType: 'admin',
          message: trimmed,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.message || 'Unable to send message')
      }
      setMessages((prev) => prev.filter((item) => item.id !== optimistic.id).concat(data))
      setError('')
      loadSessions()
    } catch (err) {
      setMessages((prev) => prev.map((item) => (item.id === optimistic.id ? { ...item, failed: true } : item)))
      setError('Message failed to send.')
    }
  }

  return (
    <div className="admin-chat">
      <aside className="admin-chat__sidebar">
        <header>
          <h2>Admin Inbox</h2>
          <p>Active chat sessions</p>
        </header>
        <div className="admin-chat__sessions">
          {sessions.length === 0 ? (
            <div className="admin-chat__empty">No sessions yet.</div>
          ) : null}
          {sessions.map((session) => (
            <button
              key={session.sessionId}
              type="button"
              className={`admin-chat__session ${activeSessionId === session.sessionId ? 'active' : ''}`}
              onClick={() => setActiveSessionId(session.sessionId)}
            >
              <div>
                <strong>Session {session.sessionId.slice(0, 6)}</strong>
                <span>{session.lastMessage || 'No message yet.'}</span>
              </div>
              <small>{session.lastMessageAt ? new Date(session.lastMessageAt).toLocaleString() : ''}</small>
            </button>
          ))}
        </div>
      </aside>

      <section className="admin-chat__main">
        <header>
          <div>
            <h3>Session Details</h3>
            <p>{activeSessionId ? `ID: ${activeSessionId}` : 'Select a session to start.'}</p>
          </div>
        </header>

        <div className="admin-chat__messages" ref={listRef}>
          {loading && messages.length === 0 ? (
            <div className="admin-chat__empty">Loading messages…</div>
          ) : null}
          {!loading && messages.length === 0 ? (
            <div className="admin-chat__empty">No messages yet.</div>
          ) : null}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`admin-chat__bubble ${message.senderType === 'admin' ? 'admin' : 'user'} ${message.failed ? 'failed' : ''}`}
            >
              <p>{message.message}</p>
              <span>
                {message.senderType === 'admin' ? 'Admin' : 'User'}
                {message.pending ? ' · sending…' : ''}
              </span>
            </div>
          ))}
        </div>

        <form className="admin-chat__input" onSubmit={sendMessage}>
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Reply as admin..."
          />
          <button type="submit" disabled={!input.trim() || !activeSessionId}>
            Send
          </button>
        </form>

        {error ? <div className="admin-chat__error">{error}</div> : null}
      </section>
    </div>
  )
}

export default AdminChat
