import React, { useState, useEffect } from 'react';
import axios from 'axios';


function ChatComponent({ selectedUserId, selectedUserName, socket, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [unreadMessages, setUnreadMessages] = useState({});

  useEffect(() => {
    const receiveMessage = (message) => {
      if (message.sender === currentUser._id || message.receiver === currentUser._id) {
        setMessages((prevMessages) => [...prevMessages, message]);
        // If message is not from the current user, increment the unread count
        if (message.sender !== currentUser._id) {
          setUnreadMessages((prevUnread) => ({
            ...prevUnread,
            [message.sender]: (prevUnread[message.sender] || 0) + 1,
          }));
        }
      }
    };

    socket.on('receive_private_message', receiveMessage);

    const loadMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/messages/conversation/${currentUser._id}/${selectedUserId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        setMessages(response.data);
        // Reset the unread messages count for the selected user
        setUnreadMessages((prevUnread) => ({
          ...prevUnread,
          [selectedUserId]: 0,
        }));
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (selectedUserId) {
      loadMessages();
    }

    return () => {
      socket.off('receive_private_message', receiveMessage);
    };
  }, [socket, currentUser._id, selectedUserId]);

  const sendMessage = () => {
    if (input.trim()) {
      const message = {
        sender: currentUser._id,
        receiver: selectedUserId,
        text: input,
      };
      socket.emit('send_private_message', message);
      setInput('');
      setMessages((prevMessages) => [...prevMessages, message]);
    }
  };

  return (
    <div className="chat-component">
      <div className="chat-header">{selectedUserName}</div>
      <ul className="messages-list">
        {messages.map((msg, index) => (
          <li key={index} className={`message ${msg.sender === currentUser._id ? 'message-sent' : 'message-received'}`}>
            <div className={`initial-circle ${msg.sender === currentUser._id ? 'hidden' : ''}`}>
              {msg.sender !== currentUser._id ? selectedUserName.charAt(0) : null}
            </div>
            <span className="message-text">{msg.text}</span>
            {/* format and display message time here */}
          </li>
        ))}
      </ul>
      <div className="message-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatComponent;
