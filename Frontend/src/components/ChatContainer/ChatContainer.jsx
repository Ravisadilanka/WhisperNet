import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { getAllMessagesRoute, sendMessageRoute } from "../../utils/APIRoutes";
import "./ChatContainer.css";
import Logout from "../Logout/Logout";
import ChatInput from "../ChatInput/ChatInput";
import { v4 as uuidv4 } from "uuid";

const ChatContainer = ({ currentChat, socket }) => {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();

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

      if (socket.current && socket.current.connected) {
        socket.current.emit("send-msg", {
          to: currentChat._id,
          message: msg,
        });
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        { fromSelf: true, message: msg },
      ]);
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          getAllMessagesRoute,
          { to: currentChat._id },
          { headers: { "x-auth-token": token } }
        );
        setMessages(response.data);
      } catch (error) {
        console.log("Error fetching messages:", error);
      }
    };

    if (currentChat) {
      fetchMessages();
    }
  }, [currentChat]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-receive", (msg) => {
        console.log("Received message:", msg);
        setMessages((prevMessages) => [
          ...prevMessages,
          { fromSelf: false, message: msg },
        ]);
      });
    }

    return () => {
      if (socket.current) {
        socket.current.off("msg-receive");
      }
    };
  }, [socket]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
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
      <div className="chat-messages">
        {messages.map((message) => (
          <div ref={scrollRef} key={uuidv4()}>
            <div
              className={`message ${message.fromSelf ? "sended" : "received"}`}
            >
              <div className="content">
                <p>{message.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </div>
  );
};

export default ChatContainer;
