// components/ChatbotWidget.jsx
import React, { useState, useRef, useEffect } from 'react';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import useChat from '../hooks/useChat';

// Add this CSS class to your existing CSS file:
const styles = `
.chat-widget {
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 350px;
  height: 500px;
  z-index: 1040;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.chat-bubble-user {
  background-color: var(--bs-primary);
  color: white;
  border-radius: 15px 15px 0 15px;
}

.chat-bubble-bot {
  background-color: var(--bs-info);
  color: var(--bs-dark);
  border-radius: 15px 15px 15px 0;
}

.chat-toggle-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1050;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--bs-primary);
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  transition: all 0.3s ease;
}

.messages-container {
  flex-grow: 1;
  overflow-y: auto;
  padding: 15px;
  background-color: var(--bs-light);
}`;


const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini');
  const { messages, isLoading, error, sendMessage, clearChat } = useChat();
  const messagesEndRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = (message) => {
    sendMessage(message, selectedModel);
  };

  // Auto-scroll to bottom when new messages come in
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  return (
    <>
    <style>{styles}</style>
      {/* Chat toggle button */}
      <button onClick={toggleChat} className="chat-toggle-btn">
        {isOpen ? (
          <i className="bi bi-x-lg fs-4"></i>
        ) : (
          <i className="bi bi-chat-dots-fill fs-4"></i>
        )}
      </button>
      
      {/* Chat widget */}
      {isOpen && (
        <div className="chat-widget">
          {/* Header */}
          <div className="bg-primary text-white p-3 d-flex justify-content-between align-items-center">
            <h5 className="mb-0">AI Assistant</h5>
            <div className="d-flex align-items-center">
              <select 
                className="form-select form-select-sm me-2" 
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="gemini">Gemini</option>
                <option value="ollama">Ollama</option>
              </select>
              <button 
                className="btn btn-sm text-white" 
                onClick={clearChat}
                title="Clear chat"
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          </div>
          
          {/* Messages area */}
          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="d-flex align-items-center justify-content-center h-100 text-secondary">
                <p>Send a message to start chatting</p>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <ChatBubble key={msg.id} message={msg} />
                ))}
                
                {isLoading && (
                  <div className="d-flex justify-content-start mb-3">
                    <div className="chat-bubble-bot p-3">
                      <div className="d-flex">
                        <div className="spinner-grow spinner-grow-sm mx-1" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <div className="spinner-grow spinner-grow-sm mx-1" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <div className="spinner-grow spinner-grow-sm mx-1" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="alert alert-danger p-2 mb-3 small" role="alert">
                    {error}
                  </div>
                )}
                
                <div ref={messagesEndRef}></div>
              </>
            )}
          </div>
          
          {/* Input area */}
          <div className="p-3 bg-white border-top">
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;