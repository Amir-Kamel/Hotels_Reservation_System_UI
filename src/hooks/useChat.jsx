// hooks/useChat.js
import { useState } from 'react';
import { sendQuestion } from '../services/api';

const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (message, model) => {
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: message
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/chat/query/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: message,
          model: model
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add bot response to chat
      const botMessage = {
        id: data.id,
        role: 'assistant',
        content: data.answer,
        model: data.model_used,
        timestamp: data.timestamp
      };
      
      setMessages(prev => [...prev, botMessage]);
      return true;
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to get response from the server. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat
  };
};

export default useChat;