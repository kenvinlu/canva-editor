'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../utils';
import { useConfigurationStore } from '../store/useConfigurationStore';

const messageTypeStyles = {
  info: 'bg-blue-500 text-white',
  success: 'bg-green-500 text-white',
  warning: 'bg-yellow-500 text-black',
  error: 'bg-red-500 text-white',
};

const SESSION_STORAGE_KEY = 'top_message_dismissed';

export function TopMessage() {
  const [isVisible, setIsVisible] = useState(true);
  // Select individual values directly to avoid creating new objects on each render
  const topMessage = useConfigurationStore((state) => state.topMessage);
  const topMessageEnabled = useConfigurationStore((state) => state.topMessageEnabled);
  const topMessageType = useConfigurationStore((state) => state.topMessageType);

  useEffect(() => {
    // Check if this specific message was dismissed in this session
    if (topMessage) {
      const dismissedMessage = sessionStorage.getItem(SESSION_STORAGE_KEY);
      // If the message content matches the dismissed one, hide it
      // This way, if the admin changes the message, it will show again
      if (dismissedMessage === topMessage) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    }
  }, [topMessage]);

  const handleClose = () => {
    if (topMessage) {
      // Store the message content in sessionStorage
      sessionStorage.setItem(SESSION_STORAGE_KEY, topMessage);
      setIsVisible(false);
    }
  };

  // Don't render if message is disabled, empty, or user dismissed it
  if (!topMessageEnabled || !topMessage || !isVisible) {
    return null;
  }

  const messageType = (topMessageType || 'info') as 'info' | 'success' | 'warning' | 'error';
  const bgColor = messageTypeStyles[messageType];

  return (
    <div className={cn('w-full text-center py-1 px-4 relative', bgColor)}>
      <div className="mx-auto flex items-center justify-center">
        <p className="text-sm font-medium flex-1">{topMessage}</p>
        <button
          onClick={handleClose}
          className="ml-4 p-1 hover:opacity-70 transition-opacity"
          aria-label="Close message"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

