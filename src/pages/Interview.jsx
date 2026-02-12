import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./intro.css";

export default function Interview() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [review, setReview] = useState(null);
  const [isGeneratingReview, setIsGeneratingReview] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Speech to Text
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser does not support Speech Recognition. Use Chrome/Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      sendMessage(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  // Text to Speech
  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  const startInterview = async () => {
    if (!role) return alert("Enter role");
    setStarted(true);

    // Initial AI greeting
    const greeting = `Hello! I am your AI interviewer for the ${role} position. Tell me about yourself.`;
    setMessages([{ sender: "ai", text: greeting }]);
    speak(greeting);
  };

  const sendMessage = async (text) => {
    const messageText = text || inputText;
    if (!messageText) return;

    const newMessages = [...messages, { sender: "user", text: messageText }];
    setMessages(newMessages);
    setInputText("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/interview-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, history: newMessages }),
      });

      const data = await res.json();
      const aiResponse = data.reply;

      setMessages((prev) => [...prev, { sender: "ai", text: aiResponse }]);
      speak(aiResponse);

    } catch (err) {
      console.error(err);
      alert("Failed to get AI response");
    } finally {
      setLoading(false);
    }
  };

  const endInterview = async () => {
    if (messages.length < 2) {
      navigate("/");
      return;
    }

    setIsGeneratingReview(true);
    window.speechSynthesis.cancel();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/get-interview-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, history: messages }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to generate review");
      }

      setReview(data);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to generate review");
      navigate("/");
    } finally {
      setIsGeneratingReview(false);
    }
  };

  if (review) {
    return (
      <div className="colorlib-page">
        <div className="profile-container" style={{ padding: '100px 8%' }}>
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h2 style={{ fontSize: '2.4rem', marginBottom: '20px' }}>Interview Review 📊</h2>

            <div className="stats-grid" style={{ marginBottom: '30px' }}>
              <div className="stat-item">
                <span className="stat-value">{review.overallScore || 0}%</span>
                <span className="stat-label">Communication Score</span>
              </div>
            </div>

            <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>{review.summary || "No summary available."}</p>

            <div className="review-sections" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', textAlign: 'left' }}>
              <div className="glass-card" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                <h4 style={{ color: '#ef4444', marginBottom: '15px' }}>Mistakes</h4>
                <ul>
                  {review.mistakes?.length > 0 ? review.mistakes.map((m, i) => <li key={i}>{m}</li>) : <li>No notable mistakes.</li>}
                </ul>
              </div>
              <div className="glass-card" style={{ background: 'rgba(34, 211, 238, 0.1)', borderColor: 'rgba(34, 211, 238, 0.2)' }}>
                <h4 style={{ color: '#22d3ee', marginBottom: '15px' }}>Improvements</h4>
                <ul>
                  {review.improvements?.length > 0 ? review.improvements.map((m, i) => <li key={i}>{m}</li>) : <li>Keep up the good work!</li>}
                </ul>
              </div>
            </div>

            <button
              className="get-started"
              style={{ marginTop: '40px' }}
              onClick={() => navigate("/")}
            >
              Done
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="colorlib-page">
      <div className="hero" style={{ justifyContent: "center", alignItems: "flex-start", paddingTop: "100px" }}>

        {!started ? (
          <motion.div
            className="hero-left"
            style={{ maxWidth: "600px" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1>AI Interviewer 🎤</h1>
            <p>Enter your target role to begin a voice or text interview.</p>

            <input
              placeholder="e.g. Frontend Developer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                padding: "16px",
                width: "100%",
                borderRadius: "12px",
                border: "1px solid #ddd",
                marginTop: "20px",
                fontSize: "1.1rem"
              }}
            />

            <button
              className="get-started"
              style={{ marginTop: "24px", width: "100%" }}
              onClick={startInterview}
            >
              Start Interview
            </button>
          </motion.div>
        ) : (
          <motion.div
            className="chat-container interview-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="chat-header">
              <h3>{role} Interview</h3>
              <button
                className="end-btn"
                onClick={endInterview}
                disabled={isGeneratingReview}
              >
                {isGeneratingReview ? "Generating Review..." : "End Interview"}
              </button>
            </div>

            <div className="chat-box">
              {messages.map((msg, index) => (
                <div key={index} className={`chat-bubble ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
              {loading && <div className="chat-bubble ai typing">AI is thinking...</div>}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area hybrid">
              <button
                className={`mic-btn ${isListening ? "listening" : ""}`}
                onClick={startListening}
                title="Voice Input"
              >
                🎤
              </button>

              <input
                placeholder="Type your answer here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />

              <button
                className="send-btn"
                onClick={() => sendMessage()}
                disabled={!inputText.trim()}
              >
                ➔
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
