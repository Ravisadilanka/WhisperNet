import axios from "axios";
import React, { useEffect, useState } from "react";
import { currentUserRoute } from "../../utils/APIRoutes";
import './ChatContainer.css'
import Logout from "../Logout/Logout";
import ChatInput from "../ChatInput/ChatInput";
import Messages from "../Messages/Messages";

const ChatContainer = ({ currentChat }) => {
  const handleSendMsg = async (msg) => {
    alert(msg)
  }

  return (
    <div className="chatcontainer">
      <div className="chat-header">
        <div className="user-details">
          <div className="chat-avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt="avatar"
            />
          </div>
          <div className="chat-username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <Logout />
      </div>
      <Messages className='chat-message'/>
      <ChatInput handleSendMsg={handleSendMsg}/>
    </div>
  );
};

export default ChatContainer;
