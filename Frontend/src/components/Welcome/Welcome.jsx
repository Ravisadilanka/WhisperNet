import React, { useEffect, useState } from "react";
import Robot from "../../assets/robot.gif";
import { currentUserRoute } from "../../utils/APIRoutes";
import axios from "axios";
import './Welcome.css'

const Welcome = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(currentUserRoute, {
        headers: {
          "x-auth-token": token,
        },
      });
      setCurrentUser(response.data.username);
    };
    fetchUser();
  }, []);
  return (
    <div className="welcome-container">
      <img src={Robot} alt="" />
      <h1>
        Welcome, <span>{currentUser}</span>
      </h1>
      <h3>Please select a chat to start to messaging.</h3>
    </div>
  );
};

export default Welcome;
