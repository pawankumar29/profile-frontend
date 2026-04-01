import React, { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import './ChatWidget.css'

const API_BASE = import.meta.env.VITE_PROFILE_BACKEND_URL || 'http://localhost:8009'
const CHAT_SERVICE_BASE = 'http://localhost:8010'
const SESSION_KEY = 'chat_session_id'
const USER_EMAIL_KEY = 'chat_user_email'

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Admin List State
  const [rooms, setRooms] = useState([])
  const [activeRoomId, setActiveRoomId] = useState(null)
  
  // Form Inputs
  const [emailInput, setEmailInput] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [phoneInput, setPhoneInput] = useState('')
  const [countryInput, setCountryInput] = useState('')

  const [userEmail, setUserEmail] = useState(() => sessionStorage.getItem(USER_EMAIL_KEY) || '')
  const [isIdentified, setIsIdentified] = useState(() => !!sessionStorage.getItem(USER_EMAIL_KEY))
  const [isAdmin, setIsAdmin] = useState(() => (sessionStorage.getItem('chat_is_admin') === 'true'))
  const [onlineUsers, setOnlineUsers] = useState(new Set())
  
  const listRef = useRef(null)
  const socketRef = useRef(null)

  // Socket Initialization
  useEffect(() => {
    if (!isIdentified) return

    socketRef.current = io(CHAT_SERVICE_BASE)

    socketRef.current.on('connect', () => {
      socketRef.current.emit('getOnlineUsers')
      if (isAdmin) {
        // Admin just wants to see the list first
        socketRef.current.emit('getRooms')
      } else {
        // Regular user instantly joins their own room
        socketRef.current.emit('joinRoom', {
          roomId: userEmail,
          userEmail,
          userName: sessionStorage.getItem('chat_user_name') || nameInput,
          userPhone: phoneInput,
          userCountry: countryInput,
          isAdmin: false
        })
        setActiveRoomId(userEmail)
      }
    })

    socketRef.current.on('onlineUsersList', (list) => {
      setOnlineUsers(new Set(list))
    })

    socketRef.current.on('userStatusUpdate', ({userEmail, isOnline}) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev)
        if (isOnline) next.add(userEmail)
        else next.delete(userEmail)
        return next
      })
    })

    socketRef.current.on('roomList', (list) => {
      if (isAdmin) setRooms(list)
    })

    socketRef.current.on('messageHistory', (history) => {
      setMessages(history)
      setLoading(false)
    })

    socketRef.current.on('newMessage', (msg) => {
      setMessages((prev) => {
        if (prev.find(m => m._id === msg._id)) return prev
        return [...prev, msg]
      })
    })

    return () => {
      if (socketRef.current) socketRef.current.disconnect()
    }
  }, [isIdentified, userEmail, isAdmin])

  // Scroll to bottom when messages update
  useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, isOpen, activeRoomId])

  const handleIdentification = async (e) => {
    e.preventDefault()
    const trimmedEmail = emailInput.trim().toLowerCase()
    if (!trimmedEmail) return

    try {
      setLoading(true)
      
      const setUserRes = await fetch(`${API_BASE}/api/setUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: trimmedEmail,
          name: nameInput,
          phone: phoneInput,
          country: countryInput
        }),
      })
      
      if (!setUserRes.ok) throw new Error('Failed to sync user')

      const adminRes = await fetch(`${API_BASE}/api/isAdmin?email=${encodeURIComponent(trimmedEmail)}`)
      const adminData = await adminRes.json()
      
      setUserEmail(trimmedEmail)
      setIsAdmin(!!adminData.isAdmin)
      setIsIdentified(true)
      sessionStorage.setItem(USER_EMAIL_KEY, trimmedEmail)
      sessionStorage.setItem('chat_user_name', nameInput)
      sessionStorage.setItem('chat_is_admin', !!adminData.isAdmin ? 'true' : 'false')
      setError('')
    } catch (err) {
      setError('Identification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const joinAdminRoom = (roomId) => {
    setActiveRoomId(roomId)
    setLoading(true)
    setMessages([])
    if (socketRef.current) {
      socketRef.current.emit('joinRoom', {
        roomId,
        userEmail: userEmail,
        isAdmin: true
      })
    }
  }

  const sendMessage = async (event) => {
    event.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || !activeRoomId) return

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('sendMessage', {
        roomId: activeRoomId,
        senderType: isAdmin ? 'admin' : 'user',
        senderEmail: userEmail,
        senderName: isAdmin ? 'Admin' : sessionStorage.getItem('chat_user_name') || userEmail,
        text: trimmed,
      })
      setInput('')
    } else {
      setError('Connection lost. Please refresh.')
    }
  }

  const activeRoomData = rooms.find(r => r.roomId === activeRoomId)

  // Render Admin Room List View
  const renderAdminRoomList = () => (
    <div className="chat-widget__admin-list">
      <div className="chat-widget__admin-list-header">
        <h4>Active Chats</h4>
        <button className="chat-widget__refresh" onClick={() => socketRef.current?.emit('getRooms')}>🔄</button>
      </div>
      <div className="chat-widget__rooms">
        {rooms.length === 0 ? <p style={{padding: '1rem', textAlign: 'center'}}>No active chats.</p> : null}
        {rooms.map((room) => (
          <div key={room.roomId} className="chat-widget__room-item" onClick={() => joinAdminRoom(room.roomId)}>
            <div className="chat-widget__room-avatar">
              {room.userName?.slice(0, 1).toUpperCase() || 'U'}
            </div>
            <div className="chat-widget__room-info">
              <div className="chat-widget__room-top">
                <strong>{room.userName || room.userEmail} {onlineUsers.has(room.userEmail) ? '🟢' : ''}</strong>
                <small>{room.updatedAt ? new Date(room.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</small>
              </div>
              <span className="chat-widget__room-lastmsg">{room.lastMessage || 'No messages'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

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
          {isAdmin && activeRoomId ? (
            <button className="chat-widget__back-btn" onClick={() => setActiveRoomId(null)}>← Back to Rooms</button>
          ) : (
            <div className="chat-widget__avatar">{isAdmin ? 'AD' : 'SU'}</div>
          )}
          
          <div className="chat-widget__header-info">
            {isAdmin && activeRoomId && activeRoomData ? (
               <>
                 <h3>{activeRoomData.userName} {onlineUsers.has(activeRoomData.userEmail) ? '🟢' : ''}</h3>
                 <p>{activeRoomData.userCountry} | {activeRoomData.userPhone} • {onlineUsers.has(activeRoomData.userEmail) ? 'Online' : 'Offline'}</p>
               </>
            ) : (
               <>
                 <h3>{isAdmin ? 'Admin Console' : 'Support Chat'}</h3>
                 <p>{isIdentified ? (onlineUsers.has('admin_general_status') ? '🟢 Support Online' : '⚪ Support Offline') : 'Online'}</p>
               </>
            )}
          </div>
        </div>

        {!isIdentified ? (
          <div className="chat-widget__body identify">
            <form className="chat-widget__identify" onSubmit={handleIdentification}>
              <h4>Welcome!</h4>
              <p>Please fill in your details to start chatting</p>
              <input type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)} placeholder="Full Name" required />
              <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} placeholder="Email Address" required />
              <input type="text" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} placeholder="Phone Number" required />
              <input type="text" value={countryInput} onChange={(e) => setCountryInput(e.target.value)} placeholder="Country" required />
              <button type="submit" disabled={loading}>{loading ? 'Entering...' : 'Start Chat'}</button>
              {error && <div className="chat-widget__error-msg">{error}</div>}
            </form>
          </div>
        ) : (
          isAdmin && !activeRoomId ? (
             renderAdminRoomList()
          ) : (
            <>
              <div className="chat-widget__body whatsapp-style" ref={listRef}>
                {loading && <div style={{textAlign: 'center', padding: '10px'}}>Loading messages...</div>}
                {messages.map((message) => {
                  const isMe = (isAdmin && message.senderType === 'admin') || (!isAdmin && message.senderType === 'user');
                  return (
                    <div
                      key={message._id}
                      className={`chat-widget__bubble ${message.senderType === 'admin' ? 'admin' : 'user'} ${isMe ? 'me' : 'them'}`}
                    >
                      <div style={{fontSize: '11px', fontWeight: 'bold', marginBottom: '2px', color: isMe ? 'rgba(255,255,255,0.7)' : '#00a884'}}>
                        {message.senderName || (message.senderType === 'admin' ? 'Admin' : 'User')}
                      </div>
                      <p>{message.text}</p>
                      <div className="chat-widget__time">
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <form className="chat-widget__input-container" onSubmit={sendMessage}>
                <input
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Type a message"
                />
                <button type="submit" disabled={!input.trim()} className="chat-widget__send-btn">
                  <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M1.101,21.757L23.8,12.028L1.101,2.3l0.011,7.912l13.623,1.816L1.112,13.845L1.101,21.757z"></path></svg>
                </button>
              </form>
            </>
          )
        )}
      </div>
    </div>
  )
}

export default ChatWidget

