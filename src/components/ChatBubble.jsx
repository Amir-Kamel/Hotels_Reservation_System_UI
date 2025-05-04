import React from 'react';

const ChatBubble = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`d-flex mb-3 ${isUser ? 'justify-content-end' : 'justify-content-start'}`}>
      <div 
        className={isUser ? 'chat-bubble-user p-3' : 'chat-bubble-bot p-3'} 
        style={{ maxWidth: '75%' }}
      >
        <div>{message.content}</div>
        {message.model && !isUser && (
          <div className="mt-1 small" style={{ opacity: 0.7 }}>
            via {message.model}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;