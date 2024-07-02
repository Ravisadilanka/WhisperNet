import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SetAvatar.css";
import loader from "../../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { setAvatarRoute } from "../../utils/APIRoutes";
import { Buffer } from "buffer";
import {jwtDecode} from "jwt-decode";

const SetAvatar = () => {
  const api = "https://api.multiavatar.com/45678945";
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("No token found. Please login again.", toastOptions);
          navigate("/login");
          return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken._id;
        console.log(userId)
        const response = await axios.post(
          `${setAvatarRoute}/${userId}`,
          {
            image: avatars[selectedAvatar],
          },
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );

        if (response.data.success) {
          toast.success("Avatar updated successfully", toastOptions);
          setTimeout(() => navigate("/"), 2000);
        } else {
          toast.error("Failed to set avatar. Please try again.", toastOptions);
        }
      } catch (error) {
        toast.error("An error occurred. Please try again.", toastOptions);
        console.error("Error setting avatar:", error);
      }
    }
  };
  useEffect(() => {
    const fetchAvatars = async () => {
      const data = [];
      for (let i = 0; i < 4; i++) {
        const image = await axios.get(
          `${api}/${Math.round(Math.random() * 1000)}`
        );
        const buffer = Buffer.from(image.data);
        data.push(buffer.toString("base64"));
      }
      setAvatars(data);
      setIsLoading(false);
    };

    fetchAvatars();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="container">
          <img src={loader} alt="loader" />
        </div>
      ) : (
        <div className="container">
          <div className="title-container">
            <h1>Pick an avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`avatar ${
                  selectedAvatar === index ? "selected" : ""
                }`}
                onClick={() => setSelectedAvatar(index)}
              >
                <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" />
              </div>
            ))}
          </div>
          <button onClick={setProfilePicture} className="submit-btn">
            Set as Profile Picture
          </button>
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default SetAvatar;
