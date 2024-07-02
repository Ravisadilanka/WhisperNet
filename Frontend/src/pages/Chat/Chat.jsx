import React, { useEffect, useState } from "react";
import "./Chat.css";
import { useNavigate } from "react-router-dom";
import { allUsersRoute } from "../../utils/APIRoutes";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import Contacts from "../../components/Contacts/Contacts";
import Welcome from "../../components/Welcome/Welcome";
import ChatContainer from "../../components/ChatContainer/ChatContainer";

const Chat = () => {
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();
  const [currentChat, setCurrentChat] = useState(undefined);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate('/login');
          return;
        }
        const decodedToken = jwtDecode(token);
        const userId = decodedToken._id;
        const response = await axios.get(`${allUsersRoute}/${userId}`, {
          headers: {
            'x-auth-token': token,
          },
        });
        setContacts(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchContacts();
  }, [navigate]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  }

  return (
    <div className="ChatContainer">
      <div className="chat-container">
        <Contacts contacts={contacts} changeChat={handleChatChange}/>
        {
          currentChat === undefined ? (
            <Welcome />
          ) : (
              <ChatContainer currentChat = {currentChat}/>
          )
        }
      </div>
    </div>
  );
};

export default Chat;
