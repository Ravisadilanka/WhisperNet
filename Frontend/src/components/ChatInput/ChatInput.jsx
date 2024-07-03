import React, { useState } from "react";
import "./ChatInput.css";
import Picker from "emoji-picker-react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";


const ChatInput = ({handleSendMsg}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState("");

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
    console.log(emojiObject.emoji);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  }

  return (
    <div className="chat-input-container">
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && (
            <div className="emoji-picker-wrapper">
              <Picker onEmojiClick={handleEmojiClick} theme="dark" width={300} height={400}/>
            </div>
          )}
        </div>
      </div>
      <form className="input-container" onSubmit={(e) => sendChat(e)}>
        <input
          type="text"
          placeholder="Type your message here..."
          className="input"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <div className="submit">
          <button type="submit" className="submit">
            <IoMdSend />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
