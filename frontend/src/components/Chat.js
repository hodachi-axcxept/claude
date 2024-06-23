import React, { useState } from 'react';
import axios from 'axios';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const newMessage = { text: input, sender: 'user' };
    setMessages([...messages, newMessage]);
    setInput('');

    try {
      const response = await axios.post('http://localhost:5000/api/chat', { message: input });
      const botMessage = { text: response.data.message, sender: 'bot' };
      setMessages(messages => [...messages, botMessage]);
      
      // コードを ReactExecutor コンポーネントに送信
      window.dispatchEvent(new CustomEvent('newCode', { detail: response.data.code }));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="メッセージを入力..."
        />
        <button onClick={sendMessage}>送信</button>
      </div>
    </div>
  );
}

export default Chat;