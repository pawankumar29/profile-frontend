import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./ChatWidget.css";
import {
  PROFILE_API_BASE,
  CHAT_API_BASE,
  withProfileAuth,
  getSocketOptions,
} from "../../lib/api";
import {
  USER_EMAIL_KEY,
  USER_NAME_KEY,
  USER_COUNTRY_KEY,
  hasStoredUserSession,
  storeAuthSession,
  USER_PHONE_KEY,
  USER_IS_ADMIN_KEY,
} from "../../lib/auth";

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const appendLocalSystemMessage = (text) => {
    const sysMsg = {
      _id: `sys-${Date.now()}`,
      roomId: activeRoomId,
      senderType: "admin",
      senderName: "Support Bot",
      senderEmail: "support@automated",
      text,
      createdAt: new Date().toISOString(),
      auto: true,
    };
    setMessages((prev) => [...prev, sysMsg]);
  };
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Admin List State
  const [rooms, setRooms] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState(null);

  // Form Inputs
  const [emailInput, setEmailInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [countryInput, setCountryInput] = useState("");
  // Field error state
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [userEmail, setUserEmail] = useState(
    () => sessionStorage.getItem(USER_EMAIL_KEY) || "",
  );
  const [isIdentified, setIsIdentified] = useState(() =>
    hasStoredUserSession(),
  );
  const [isAdmin, setIsAdmin] = useState(
    () => sessionStorage.getItem(USER_IS_ADMIN_KEY) === "true",
  );
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [isTyping, setIsTyping] = useState(false);

  const listRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimerRef = useRef(null);
  const pendingReplyTimerRef = useRef(null);
  const lastTypingAutoSentRef = useRef(0);

  // Socket Initialization
  useEffect(() => {
    if (!isIdentified) return;
    console.log(
      "Initializing socket for",
      CHAT_API_BASE,
      "with options",
      JSON.stringify(getSocketOptions()),
    );
    socketRef.current = io(CHAT_API_BASE, getSocketOptions());

    socketRef.current.on("connect", () => {
      socketRef.current.emit("getOnlineUsers");

      if (isAdmin) {
        // Admins don't join their own room, they fetch all rooms
        socketRef.current.emit("getRooms");
        setActiveRoomId(null);
      } else {
        // Normal users join their own room immediately
        socketRef.current.emit("joinRoom", {
          roomId: userEmail,
          userEmail,
          userName: sessionStorage.getItem(USER_NAME_KEY) || "",
          userPhone: sessionStorage.getItem(USER_PHONE_KEY) || "",
          userCountry: sessionStorage.getItem(USER_COUNTRY_KEY) || "",
        });
        setActiveRoomId(userEmail);
      }
    });

    socketRef.current.on("onlineUsersList", (list) => {
      setOnlineUsers(new Set(list));
    });

    socketRef.current.on("userStatusUpdate", ({ userEmail, isOnline }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        if (isOnline) next.add(userEmail);
        else next.delete(userEmail);
        return next;
      });
    });

    socketRef.current.on("roomList", (list) => {
      setRooms(list);
    });

    socketRef.current.on("messageHistory", (history) => {
      setMessages(history);
      setLoading(false);
    });

    socketRef.current.on("newMessage", (msg) => {
      setMessages((prev) => {
        if (prev.find((m) => m._id === msg._id)) return prev;
        // If admin replied, clear any pending auto-reply timers
        if (msg.senderType === "admin" && pendingReplyTimerRef.current) {
          clearTimeout(pendingReplyTimerRef.current);
          pendingReplyTimerRef.current = null;
        }
        return [...prev, msg];
      });
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Admin Socket Connect Error:", err);
      setError(`Connection Error: ${err.message}`);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [isIdentified, userEmail]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, isOpen, activeRoomId]);

  // Clear timers on unmount or when activeRoomId changes
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      if (pendingReplyTimerRef.current)
        clearTimeout(pendingReplyTimerRef.current);
    };
  }, [activeRoomId]);

  const handleIdentification = async (e) => {
    e.preventDefault();
    const trimmedEmail = emailInput.trim().toLowerCase();

    // Client-side validation
    const validate = () => {
      let ok = true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!nameInput.trim() || nameInput.trim().length < 2) {
        setNameError("Please enter your full name");
        ok = false;
      } else setNameError("");

      if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
        setEmailError("Please enter a valid email address");
        ok = false;
      } else setEmailError("");

      const digits = phoneInput.replace(/\D/g, "");
      if (!digits || digits.length < 7) {
        setPhoneError("Please enter a valid phone number");
        ok = false;
      } else setPhoneError("");

      return ok;
    };

    if (!validate()) return;

    try {
      setLoading(true);

      const setUserRes = await fetch(`${PROFILE_API_BASE}/api/setUser`, {
        method: "POST",
        headers: await withProfileAuth({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          email: trimmedEmail,
          name: nameInput,
          phone: phoneInput,
          country: countryInput,
        }),
      });

      if (!setUserRes.ok) throw new Error("Failed to sync user");
      const setUserData = await setUserRes.json();

      setUserEmail(trimmedEmail);
      setIsIdentified(true);
      setIsAdmin(setUserData.user?.isAdmin || false);

      storeAuthSession({
        email: trimmedEmail,
        name: nameInput,
        phone: phoneInput,
        country: countryInput,
        isAdmin: setUserData.user?.isAdmin || false,
      });
      setError("");
    } catch {
      setError("Identification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const joinAdminRoom = (roomId) => {
    setActiveRoomId(roomId);
    setLoading(true);
    setMessages([]);
    if (socketRef.current) {
      socketRef.current.emit("joinRoom", {
        roomId,
        userEmail,
      });
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || !activeRoomId) return;

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("sendMessage", {
        roomId: activeRoomId,
        senderType: activeRoomId === userEmail ? "user" : "admin",
        senderEmail: userEmail,
        senderName: sessionStorage.getItem(USER_NAME_KEY) || userEmail,
        text: trimmed,
      });
      setInput("");
      // start pending-reply timer for user messages (auto-reply if no admin response)
      if (!isAdmin) {
        if (pendingReplyTimerRef.current)
          clearTimeout(pendingReplyTimerRef.current);
        pendingReplyTimerRef.current = setTimeout(() => {
          appendLocalSystemMessage(
            "Thanks for connecting — we will reply to you soon. We have saved your message.",
          );
        }, 60 * 1000);
      }
    } else {
      setError("Connection lost. Please refresh.");
    }
  };

  const activeRoomData = rooms.find((r) => r.roomId === activeRoomId);

  // Render Admin Room List View
  const renderAdminRoomList = () => (
    <div className="chat-widget__admin-list">
      <div className="chat-widget__admin-list-header">
        <h4>Active Chats</h4>
        <button
          className="chat-widget__refresh"
          onClick={() => socketRef.current?.emit("getRooms")}
        >
          🔄
        </button>
      </div>
      <div className="chat-widget__rooms">
        {rooms.length === 0 ? (
          <p style={{ padding: "1rem", textAlign: "center" }}>
            No active chats.
          </p>
        ) : null}
        {rooms.map((room) => (
          <div
            key={room.roomId}
            className="chat-widget__room-item"
            onClick={() => joinAdminRoom(room.roomId)}
          >
            <div className="chat-widget__room-avatar">
              {room.userName?.slice(0, 1).toUpperCase() || "U"}
            </div>
            <div className="chat-widget__room-info">
              <div className="chat-widget__room-top">
                <strong>
                  {room.userName || room.userEmail}{" "}
                  {onlineUsers.has(room.userEmail) ? "🟢" : ""}
                </strong>
                <small>
                  {room.updatedAt
                    ? new Date(room.updatedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </small>
              </div>
              <span className="chat-widget__room-lastmsg">
                {room.lastMessage || "No messages"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`chat-widget ${isOpen ? "open" : ""}`}>
      <button
        type="button"
        className="chat-widget__toggle"
        onClick={() => setIsOpen((value) => !value)}
        aria-expanded={isOpen}
      >
        {isOpen ? "Close" : "Chat"}
        <span className="chat-widget__pulse" />
      </button>

      <div className="chat-widget__panel" aria-hidden={!isOpen}>
        <div className="chat-widget__header">
          {activeRoomId && activeRoomId !== userEmail ? (
            <button
              className="chat-widget__back-btn"
              onClick={() => setActiveRoomId(null)}
            >
              ← Back to Rooms
            </button>
          ) : (
            <div className="chat-widget__avatar">
              {activeRoomId && activeRoomId !== userEmail ? "AD" : "SU"}
            </div>
          )}

          <div className="chat-widget__header-info">
            {activeRoomId && activeRoomId !== userEmail && activeRoomData ? (
              <>
                <h3>
                  {activeRoomData.userName}{" "}
                  {onlineUsers.has(activeRoomData.userEmail) ? "🟢" : ""}
                </h3>
                <p>
                  {activeRoomData.userCountry} | {activeRoomData.userPhone} •{" "}
                  {onlineUsers.has(activeRoomData.userEmail)
                    ? "Online"
                    : "Offline"}
                </p>
              </>
            ) : (
              <>
                <h3>Support Chat</h3>
                <p>We typiclly response within a day for immediate concerns please email us</p>
                <p>{isIdentified ? "Connected" : "Online"}</p>
              </>
            )}
          </div>
        </div>

        {!isIdentified ? (
          <div className="chat-widget__body identify">
            <form
              className="chat-widget__identify"
              onSubmit={handleIdentification}
            >
              <h4>Welcome!</h4>
              <p>Please fill in your details to start chatting</p>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Full Name"
                required
              />
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Email Address"
                required
              />
              <input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="Phone Number"
                required
              />
              <input
                type="text"
                value={countryInput}
                onChange={(e) => setCountryInput(e.target.value)}
                placeholder="Country"
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? "Entering..." : "Start Chat"}
              </button>
              {error && <div className="chat-widget__error-msg">{error}</div>}
            </form>
          </div>
        ) : activeRoomId === null ? (
          renderAdminRoomList()
        ) : (
          <>
            <div className="chat-widget__body whatsapp-style" ref={listRef}>
              {loading && (
                <div style={{ textAlign: "center", padding: "10px" }}>
                  Loading messages...
                </div>
              )}
              {messages.map((message) => {
                const isMe = message.senderEmail === userEmail;
                return (
                  <div
                    key={message._id}
                    className={`chat-widget__bubble ${message.senderType === "admin" ? "admin" : "user"} ${isMe ? "me" : "them"}`}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: "bold",
                        marginBottom: "2px",
                        color: isMe ? "rgba(255,255,255,0.7)" : "#00a884",
                      }}
                    >
                      {message.senderName ||
                        (message.senderType === "admin" ? "Admin" : "User")}
                    </div>
                    <p>{message.text}</p>
                    <div className="chat-widget__time">
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                );
              })}
              {isTyping && (
                <div className={`chat-widget__bubble user typing me`}>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "bold",
                      marginBottom: "2px",
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    {sessionStorage.getItem(USER_NAME_KEY) || userEmail}
                  </div>
                  <p>
                    typing<span className="typing-dots">...</span>
                  </p>
                </div>
              )}
            </div>

            <form
              className="chat-widget__input-container"
              onSubmit={sendMessage}
            >
              <input
                type="text"
                value={input}
                onChange={(event) => {
                  const v = event.target.value;
                  setInput(v);
                  // typing debounce: if user stops typing for 40s, send auto-message
                  // if (!isAdmin) {
                  //   setIsTyping(true);
                  //   if (typingTimerRef.current)
                  //     clearTimeout(typingTimerRef.current);
                  //   typingTimerRef.current = setTimeout(() => {
                  //     setIsTyping(false);
                  //     const now = Date.now();
                  //     // avoid spamming auto messages more than once per 30s
                  //     if (now - lastTypingAutoSentRef.current > 30 * 1000) {
                  //       appendLocalSystemMessage(
                  //         "We have recorded your input and will get back to you soon. Thanks for connecting.",
                  //       );
                  //       lastTypingAutoSentRef.current = now;
                  //     }
                  //   }, 30 * 1000);
                  // }
                }}
                placeholder="Type a message"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="chat-widget__send-btn"
              >
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path
                    fill="currentColor"
                    d="M1.101,21.757L23.8,12.028L1.101,2.3l0.011,7.912l13.623,1.816L1.112,13.845L1.101,21.757z"
                  ></path>
                </svg>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ChatWidget;
