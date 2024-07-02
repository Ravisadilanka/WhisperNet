import React from "react";
import './Logout.css'
import { BiPowerOff } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate('/login');
      };

  return (
    <button onClick={handleLogout} className="Button">
      <BiPowerOff />
    </button>
  );
};

export default Logout;
