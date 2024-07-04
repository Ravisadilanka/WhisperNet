import axios from "axios";
import React, { useEffect, useState } from "react";
import { getAllMessagesRoute, sendMessageRoute } from "../../utils/APIRoutes";
import "./ChatContainer.css";
import Logout from "../Logout/Logout";
import ChatInput from "../ChatInput/ChatInput";
import Messages from "../Messages/Messages";

const ChatContainer = ({ currentChat }) => {
  const [messages, setMessages] = useState([])
  const handleSendMsg = async (msg) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        sendMessageRoute,
        {
          to: currentChat._id,
          message: msg,
        },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          getAllMessagesRoute,
          {
            to: currentChat._id,
          },
          {
            headers: {
              "x-auth-token": token,
            },
          },
        );
        setMessages(response.data)
        console.log(response)
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessage()
  }, [currentChat]);

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
      {/* <Messages className="chat-message" /> */}
      <div className="chat-messages">
        {
          messages.map((message) => {
            return (
              <div>
                <div className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
                  <div className="content">
                    <p>
                      {message.messages}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </div>
  );
};

export default ChatContainer;
