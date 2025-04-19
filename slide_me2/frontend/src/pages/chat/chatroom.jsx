import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./chatroom.css";

function ChatRoom() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef(null);
  const reconnectTimeout = useRef(null);

  // ดึงข้อมูลผู้ใช้ปัจจุบัน
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || "Unknown";
  const recipient = currentUser === "John" ? "Jane" : "John";

  const connect = useCallback(() => {
    try {
      ws.current = new WebSocket("ws://localhost:8080");

      ws.current.onopen = () => {
        console.log("Connected to WebSocket");
        setIsConnected(true);
        // ลงทะเบียน client
        ws.current.send(JSON.stringify({ type: "register", username: currentUser }));
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        // จัดการประวัติแชท
        if (data.type === 'history') {
          setMessages(data.messages);
        }
        
        // จัดการข้อความใหม่
        if (data.type === 'newMessage') {
          setMessages(prev => [...prev, data.message]);
        }
      };

      ws.current.onclose = () => {
        console.log("Disconnected from WebSocket");
        setIsConnected(false);
        // พยายามเชื่อมต่อใหม่
        reconnectTimeout.current = setTimeout(() => {
          console.log("Attempting to reconnect...");
          connect();
        }, 3000);
      };

    } catch (error) {
      console.error("Connection error:", error);
      setIsConnected(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser === "Unknown") {
      navigate("/");
      return;
    }

    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [currentUser, navigate, connect]);

  const handleSendMessage = () => {
    if (!message.trim() || !isConnected) return;

    if (ws.current?.readyState === WebSocket.OPEN) {
      const msg = {
        type: "message",
        from: currentUser,
        to: recipient,
        message: message.trim()
      };
      ws.current.send(JSON.stringify(msg));
      setMessage("");
    }
  };

  const handleBack = () => {
    if (ws.current) {
      ws.current.close(); // ปิดการเชื่อมต่อ WebSocket
    }
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current); // ยกเลิก timeout การเชื่อมต่อใหม่
    }
    navigate("/chatlist"); // กลับไปยังหน้า chatlist
  };

  return (
    <div className="chatroom-container">
      <div className="chatroom-header">
        <button className="back-btn" onClick={handleBack}>Back</button>
        <h2>Live Chat Room</h2>
        <p>Status: {isConnected ? "Connected" : "Disconnected"}</p>
        <p>You are: {currentUser}</p>
      </div>

      <div className="chatroom-body">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sender === currentUser ? "chat-message-you" : "chat-message"}
          >
            <span className="message-time">{msg.timestamp}</span>
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
      </div>

      <div className="chatroom-footer">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type your message..."
          className="chat-input"
          disabled={!isConnected}
        />
        <button 
          onClick={handleSendMessage} 
          className="send-button"
          disabled={!isConnected}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatRoom;