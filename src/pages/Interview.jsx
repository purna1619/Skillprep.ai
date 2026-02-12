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
    if (!text) return;

    const newMessages = [...messages, { sender: "user", text }];
    setMessages(newMessages);
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
            <p>Enter your target role to begin a real-time voice interview.</p>

            <input
              placeholder="e.g. Frontend Developer / Data Scientist"
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
            className="chat-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="chat-header">
              <h3>Creating {role} Interview</h3>
              <button
                className="close-btn"
                style={{ position: 'static', background: '#ff4d4d' }}
                onClick={() => navigate("/")}
              >
                End
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

            <div className="chat-input-area">
              <button
                className={`mic-btn ${isListening ? "listening" : ""}`}
                onClick={startListening}
              >
                {isListening ? "Listening..." : "🎤 Tap to Speak"}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
