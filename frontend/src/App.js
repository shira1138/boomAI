
import React, { useState, useRef, useEffect } from 'react';


function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", content: "Welcome to Boom AI! I'm your intelligent assistant, created by Gift Chimwaza from Malawi University of Business and Applied Sciences (MUBAS). I'm here to help with questions, provide information, and chat about various topics!" },
    { role: "user", content: "Tell me about yourself." },
    { role: "ai", content: "I'm Boom AI, an advanced conversational AI designed to assist users with knowledge, problem-solving, and entertainment. I can answer questions on technology, science, programming, general knowledge, and more. My goal is to make interactions fun and informative!" },
    { role: "user", content: "What's special about you?" },
    { role: "ai", content: "What makes me special? I'm built with a focus on user-friendly responses, quick learning, and a touch of humor. Plus, I'm always ready to help, 24/7!" }
  ]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

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

    // Simulate API delay
    setTimeout(() => {
      let aiResponse = "";
      const lowerInput = input.toLowerCase();

      if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("hey") || lowerInput.includes("greetings")) {
        aiResponse = "Hello! How can I assist you today? I'm Boom AI, ready to help with any questions!";
      } else if (lowerInput.includes("who are you") || lowerInput.includes("what are you")) {
        aiResponse = "I am Boom AI, an intelligent assistant created to help with a wide range of questions and tasks. I'm here to provide information, answer queries, and make conversations fun!";
      } else if (lowerInput.includes("who developed you") || lowerInput.includes("who made you")) {
        aiResponse = "I was developed by Gift Chimwaza, a talented developer from Malawi University of Business and Applied Sciences (MUBAS). Gift is passionate about AI and technology!";
      } else if (lowerInput.includes("where is malawi") || lowerInput.includes("what is malawi")) {
        aiResponse = "Malawi is a beautiful landlocked country in southeastern Africa. It's known for its stunning Lake Malawi, friendly people, and diverse wildlife. The capital is Lilongwe!";
      } else if (lowerInput.includes("what is mubas") || lowerInput.includes("malawi university")) {
        aiResponse = "MUBAS stands for Malawi University of Business and Applied Sciences. It's a leading university in Malawi focused on business, applied sciences, and technology education.";
      } else if (lowerInput.includes("how are you") || lowerInput.includes("how do you do")) {
        aiResponse = "I'm doing great, thank you for asking! As an AI, I'm always ready to help. How about you?";
      } else if (lowerInput.includes("thank you") || lowerInput.includes("thanks")) {
        aiResponse = "You're welcome! I'm glad I could help. Feel free to ask me anything else!";
      } else if (lowerInput.includes("time") || lowerInput.includes("what time")) {
        const now = new Date();
        aiResponse = `The current time is ${now.toLocaleTimeString()}.`;
      } else if (lowerInput.includes("date") || lowerInput.includes("today")) {
        const now = new Date();
        aiResponse = `Today's date is ${now.toLocaleDateString()}.`;
      } else if (lowerInput.includes("what is") || lowerInput.includes("explain")) {
        aiResponse = "That's a great question! Based on my knowledge, I can provide detailed explanations. Could you be more specific?";
      } else if (lowerInput.includes("how to") || lowerInput.includes("tutorial")) {
        aiResponse = "I'd be happy to guide you through that! Here's a step-by-step approach: 1. Start with the basics, 2. Build up gradually, 3. Practice consistently. What specific topic are you interested in?";
      } else if (lowerInput.includes("code") || lowerInput.includes("programming")) {
        aiResponse = "Programming is fascinating! Whether it's Python, JavaScript, or any other language, I can help with syntax, algorithms, debugging, and best practices. What are you working on?";
      } else if (lowerInput.includes("weather")) {
        aiResponse = "I don't have real-time weather data, but I can tell you about weather patterns, climate change, or how to build weather apps. What's your location or question?";
      } else if (lowerInput.includes("joke") || lowerInput.includes("funny")) {
        aiResponse = "Why don't scientists trust atoms? Because they make up everything! 😄 Want another one?";
      } else if (lowerInput.includes("bye") || lowerInput.includes("goodbye")) {
        aiResponse = "Goodbye! It was great chatting with you. Feel free to come back anytime!";
      } else if (lowerInput.includes("who created") || lowerInput.includes("developer") || lowerInput.includes("gift")) {
        aiResponse = "I was created by Gift Chimwaza, a talented developer from Malawi University of Business and Applied Sciences (MUBAS). Gift is passionate about AI and technology, aiming to make helpful tools accessible to everyone.";
      } else if (lowerInput.includes("about") && lowerInput.includes("boom ai")) {
        aiResponse = "Boom AI is an intelligent chat assistant designed to provide helpful, accurate, and engaging responses. I'm built to assist with a wide range of topics, from technical questions to casual conversations. My knowledge is continuously updated, and I'm here to make your interactions smarter and more fun!";
      } else if (lowerInput.includes("features") || lowerInput.includes("what can you do")) {
        aiResponse = "I can help with: answering questions, explaining concepts, providing tutorials, coding assistance, telling jokes, general knowledge, and much more. I'm designed to be conversational and user-friendly!";
      } else {
        aiResponse = "That's interesting! I'm here to help with a wide range of topics including technology, science, general knowledge, and more. Could you elaborate on your question?";
      }

      const aiMessage = { role: "ai", content: aiResponse };
      setMessages((prev) => [...prev, aiMessage]);
      setLoading(false);
    }, 1000); // 1 second delay to simulate response time
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
        <button
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'transparent',
            color: '#fff',
            border: 'none',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            zIndex: 101,
          }}
          aria-label="Close sidebar"
        >
          ×
        </button>
        <h3 style={{ color: '#00bfae', marginBottom: '1rem', marginTop: '2.5rem' }}>Settings & History</h3>
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
            (Coming soon)
          </div>
        </div>
        <button
          onClick={() => setMessages([])}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            background: '#00bfae',
            color: '#181818',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Clear Chat
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
        position: 'relative',
      }}>
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          background: '#181818',
          zIndex: 99,
          boxShadow: '0 2px 8px #22222233',
        }}>
          <h2 style={{ textAlign: 'center', margin: 0, padding: '1rem 0', color: '#00bfae', fontSize: '1.5rem' }}>Boom AI Chat</h2>
        </div>
        <div style={{ marginTop: '70px' }}>
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
          {loading && (
            <div style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginBottom: '1rem',
            }}>
              <div style={{
                maxWidth: '80%',
                background: '#222',
                color: '#fff',
                padding: '0.75rem 1rem',
                borderRadius: '18px',
                fontSize: '1rem',
                wordBreak: 'break-word',
                boxShadow: '0 2px 8px #22222233',
              }}>
                Boom AI is typing...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
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
        <textarea
          id="boomai-question"
          name="boomai-question"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Message Boom AI..."
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
            overflow:'auto',
            resize:'none',
          }}
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            borderRadius: '10px',
            border: 'none',
            background: '#00bfae',
            color: '#181818',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
          }}
        >
          {loading ? '⬤' : '🏹'}
        </button>
      </form>
    </div>
  );
}

export default App;

