
import React, { useState, useRef, useEffect } from 'react';


function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const apiUrl = "https://verbose-telegram-v6jqqrpj77qxcpq5j-8000.app.github.dev/ask";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage.content }),
      });
      const data = await response.json();
      const aiMessage = { role: "ai", content: data.answer || data.error };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "ai", content: "Error connecting to Boom AI backend." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      height: '100vh',
      background: '#181818',
      color: '#fff',
      fontFamily: 'Inter, Arial, sans-serif',
      position: 'relative',
    }}>
      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: sidebarOpen ? 0 : '-260px',
        width: '260px',
        height: '100vh',
        background: '#222',
        color: '#fff',
        boxShadow: '2px 0 8px #22222233',
        zIndex: 100,
        transition: 'left 0.3s',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <h3 style={{ color: '#00bfae', marginBottom: '1rem' }}>Settings & History</h3>
        <div style={{ marginBottom: '2rem' }}>
          <strong>Chat History</strong>
          <div style={{ marginTop: '0.5rem', maxHeight: '40vh', overflowY: 'auto', fontSize: '0.95rem' }}>
            {messages.length === 0 ? (
              <div style={{ color: '#aaa' }}>No chats yet.</div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} style={{
                  marginBottom: '0.5rem',
                  color: msg.role === 'user' ? '#00bfae' : '#fff',
                }}>
                  <span style={{ fontWeight: 'bold' }}>{msg.role === 'user' ? 'You:' : 'Boom AI:'}</span> {msg.content}
                </div>
              ))
            )}
          </div>
        </div>
        <div>
          <strong>Settings</strong>
          <div style={{ marginTop: '0.5rem', color: '#aaa', fontSize: '0.95rem' }}>
            (Settings UI placeholder)
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          style={{
            marginTop: 'auto',
            padding: '0.5rem 1rem',
            background: '#00bfae',
            color: '#181818',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        style={{
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 101,
          background: '#00bfae',
          color: '#181818',
          border: 'none',
          borderRadius: '50%',
          width: '44px',
          height: '44px',
          fontWeight: 'bold',
          fontSize: '1.5rem',
          boxShadow: '0 2px 8px #00bfae33',
          cursor: 'pointer',
          display: sidebarOpen ? 'none' : 'block',
        }}
        aria-label="Open sidebar"
      >
        ≡
      </button>
      {/* Main Chat Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        marginLeft: '0px',
        marginBottom: '80px',
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#00bfae' }}>Boom AI Chat</h2>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#aaa', marginTop: '2rem' }}>
            Start chatting with Boom AI!
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: '1rem',
          }}>
            <div style={{
              maxWidth: '80%',
              background: msg.role === 'user' ? '#00bfae' : '#222',
              color: msg.role === 'user' ? '#181818' : '#fff',
              padding: '0.75rem 1rem',
              borderRadius: '18px',
              fontSize: '1rem',
              wordBreak: 'break-word',
              boxShadow: msg.role === 'user' ? '0 2px 8px #00bfae33' : '0 2px 8px #22222233',
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleAsk} style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        background: '#222',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 -2px 8px #22222233',
      }}>
        <input
          id="boomai-question"
          name="boomai-question"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: '0.75rem',
            fontSize: '1rem',
            borderRadius: '12px',
            border: 'none',
            outline: 'none',
            marginRight: '1rem',
            background: '#333',
            color: '#fff',
          }}
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            borderRadius: '12px',
            border: 'none',
            background: '#00bfae',
            color: '#181818',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
          }}
        >
          {loading ? 'Think...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

export default App;

