import React, { useState, useEffect } from 'react';

interface InfoMessageBarProps {
  messages: string[];
}

const InfoMessageBar: React.FC<InfoMessageBarProps> = ({ messages }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [messages]);
  
  useEffect(() => {
    if (messages.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % messages.length);
      }, 5000); // Duration should match animation
      return () => clearInterval(interval);
    }
  }, [messages.length]);

  if (messages.length === 0) {
    return null;
  }
  
  const currentMessage = messages[currentIndex] || '';
  const displayMessage = currentMessage.startsWith('💡') ? currentMessage.substring('💡'.length).trim() : currentMessage;

  return (
    <div className="bg-sky-500/10 border border-sky-500/30 text-sky-300 rounded-lg p-3 text-center text-sm mb-6 h-12 flex items-center justify-center overflow-hidden">
      <p key={currentIndex} className="animate-fade-in-out">
        <span className="font-bold mr-2">💡</span>{displayMessage}
      </p>
    </div>
  );
};

export default InfoMessageBar;
