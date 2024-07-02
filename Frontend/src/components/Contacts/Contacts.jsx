import React, { useEffect, useState } from "react";
import Logo from "../../assets/logo.svg";
import axios from "axios";
import { currentUserRoute } from "../../utils/APIRoutes";
import "./Contacts.css";

const Contacts = ({ contacts, changeChat }) => {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(currentUserRoute, {
        headers: {
          "x-auth-token": token,
        },
      });
      setCurrentUserImage(response.data.avatarImage);
      setCurrentUserName(response.data.username);
    };
    fetchUser();
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  return (
    <>
      <div className="contacts-container">
        <div className="contacts-brand">
          <img src={Logo} alt="Logo" />
          <h3>WhisperNet</h3>
        </div>
        <div className="contacts">
          {contacts.map((contact, index) => {
            return (
              <div
                className={`contact ${
                  index === currentSelected ?'contact-selected' : ''
                }`}
                key={index}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <div className="avatar">
                  <img
                    src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                    alt="avatar"
                  />
                </div>
                <div className="username">
                  <h3>{contact.username}</h3>
                </div>
              </div>
            );
          })}
        </div>
        <div className="current-user">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentUserImage}`}
              alt="avatar"
            />
          </div>
          <div className="username">
            <h2>{currentUserName}</h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contacts;
