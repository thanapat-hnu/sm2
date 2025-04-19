import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../layouts/footer/footer";
import "./chat.css";

function ChatList() {
  const navigate = useNavigate();

  const handleUserSelect = (user) => {
    localStorage.setItem("currentUser", JSON.stringify(user));
    alert(`Logged in as ${user}`);
    navigate("/chatroom");
  };

  return (
    <div className="main-container">
      <div className="chat-container">
        <h1 className="chat-title">Login</h1>
        <div className="user-select">
          <button onClick={() => handleUserSelect("John")}>Login as John</button>
          <button onClick={() => handleUserSelect("Jane")}>Login as Jane</button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ChatList;
