import React, { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import './AdminChat.css'

const API_BASE = import.meta.env.VITE_PROFILE_BACKEND_URL || 'http://localhost:8009'
const CHAT_SERVICE_BASE = 'http://localhost:8010'

function AdminChat() {
  const [rooms, setRooms] = useState([])
  const [activeRoomId, setActiveRoomId] = useState('')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [adminEmail, setAdminEmail] = useState(() => sessionStorage.getItem('chat_user_email') || '')
  
  const listRef = useRef(null)
  const socketRef = useRef(null)

  // Socket Initialization
  useEffect(() => {
    socketRef.current = io(CHAT_SERVICE_BASE)

    socketRef.current.on('connect', () => {
      socketRef.current.emit('getRooms')
    })

    socketRef.current.on('roomList', (list) => {
      setRooms(list)
    })

    socketRef.current.on('messageHistory', (history) => {
      setMessages(history)
      setLoading(false)
    })

    socketRef.current.on('newMessage', (msg) => {
      if (msg.roomId === activeRoomId) {
        setMessages((prev) => {
          if (prev.find(m => m._id === msg._id)) return prev
          return [...prev, msg]
        })
      }
    })

    return () => {
      if (socketRef.current) socketRef.current.disconnect()
    }
  }, [activeRoomId])

  useEffect(() => {
    if (activeRoomId && socketRef.current) {
      setLoading(true)
      socketRef.current.emit('joinRoom', {
        roomId: activeRoomId,
        userEmail: adminEmail,
        isAdmin: true
      })
    }
  }, [activeRoomId, adminEmail])

  useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, activeRoomId])

  const sendMessage = async (event) => {
    event.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || !activeRoomId) return

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('sendMessage', {
        roomId: activeRoomId,
        senderType: 'admin',
        senderEmail: adminEmail,
        text: trimmed,
      })
      setInput('')
    } else {
      setError('Connection lost.')
    }
  }

  const activeRoom = rooms.find(r => r.roomId === activeRoomId)

  return (
    <div className="admin-chat-layout">
      <aside className="admin-chat-sidebar">
        <header className="sidebar-header">
          <h2>Active Chats</h2>
          <button onClick={() => socketRef.current?.emit('getRooms')} className="refresh-btn">🔄</button>
        </header>
        <div className="session-list">
          {rooms.map((room) => (
            <div
              key={room.roomId}
              className={`session-item ${activeRoomId === room.roomId ? 'active' : ''}`}
              onClick={() => setActiveRoomId(room.roomId)}
            >
              <div className="session-avatar">
                {room.userName?.slice(0, 1).toUpperCase() || 'U'}
              </div>
              <div className="session-info">
                <div className="session-top">
                  <span className="session-id">{room.userName || room.userEmail}</span>
                  <span className="session-time">
                    {room.updatedAt ? new Date(room.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
                <p className="session-last-msg">{room.lastMessage || 'No messages'}</p>
                <div className="session-meta">
                  <small>{room.userPhone} | {room.userCountry}</small>
                </div>
              </div>
            </div>
          ))}
          {rooms.length === 0 && <p className="no-rooms">No active chat rooms found.</p>}
        </div>
      </aside>

      <main className="admin-chat-main">
        {activeRoomId ? (
          <>
            <header className="chat-header">
              <div className="chat-avatar">
                {activeRoom?.userName?.slice(0, 1).toUpperCase() || 'U'}
              </div>
              <div className="chat-user-info">
                <h3>{activeRoom?.userName} ({activeRoom?.userEmail})</h3>
                <p>{activeRoom?.userCountry} | {activeRoom?.userPhone}</p>
              </div>
            </header>

            <div className="chat-messages-container" ref={listRef}>
              <div className="messages-bg"></div>
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`message-bubble ${msg.senderType === 'admin' ? 'admin' : 'user'}`}
                >
                  <p>{msg.text}</p>
                  <span className="message-time">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              {loading && <div className="loading-overlay">Loading history...</div>}
            </div>

            <form className="chat-input-area" onSubmit={sendMessage}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message"
              />
              <button type="submit" disabled={!input.trim()} className="send-btn">
                <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M1.101,21.757L23.8,12.028L1.101,2.3l0.011,7.912l13.623,1.816L1.112,13.845L1.101,21.757z"></path></svg>
              </button>
            </form>
          </>
        ) : (
          <div className="no-session-selected">
            <div className="intro-icon">💬</div>
            <h2>Pocket Admin Chat</h2>
            <p>Select a room to start messaging in real-time.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminChat
