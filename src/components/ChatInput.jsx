import React, { useState } from 'react';

const ChatInput = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
        />
        <button 
          className="btn btn-primary" 
          type="submit"
          disabled={isLoading || !inputValue.trim()}
        >
          <i className="bi bi-send-fill"></i>
        </button>
      </div>
    </form>
  );
};

export default ChatInput;