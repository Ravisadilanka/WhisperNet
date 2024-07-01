import React, { useEffect, useState } from "react";
import "./Chat.css";
import { useNavigate } from "react-router-dom";
import { allUsersRoute } from "../../utils/APIRoutes";
import {jwtDecode} from "jwt-decode";
import Contacts from "../../components/Contacts/Contacts";

const Chat = () => {
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login');
    }
  },[])

  useEffect(async () => {
    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken._id;
      const response = await axios.get(`${allUsersRoute}/${userId}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      setContacts(response.data);
    } catch (error) {
      console.log(error);
    }
  })

  return (
    <div className="Container">
      <div className="container">
        <Contacts />
      </div>
    </div>
);
};

export default Chat;
