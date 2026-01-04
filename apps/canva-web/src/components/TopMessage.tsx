'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '../utils';

interface Configuration {
  top_message?: string;
  top_message_enabled?: boolean;
  top_message_type?: 'info' | 'success' | 'warning' | 'error';
}

const messageTypeStyles = {
  info: 'bg-blue-500 text-white',
  success: 'bg-green-500 text-white',
  warning: 'bg-yellow-500 text-black',
  error: 'bg-red-500 text-white',
};

const SESSION_STORAGE_KEY = 'top_message_dismissed';

export function TopMessage() {
  const [config, setConfig] = useState<Configuration | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchConfiguration = async () => {
      try {
        const response = await fetch('/api/configuration');
        const result = await response.json();
        
        if (result.data) {
          setConfig(result.data);
          
          // Check if this specific message was dismissed in this session
          if (result.data.top_message) {
            const dismissedMessage = sessionStorage.getItem(SESSION_STORAGE_KEY);
            // If the message content matches the dismissed one, hide it
            // This way, if the admin changes the message, it will show again
            if (dismissedMessage === result.data.top_message) {
              setIsVisible(false);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch configuration:', error);
      }
    };

    fetchConfiguration();
  }, []);

  const handleClose = () => {
    if (config?.top_message) {
      // Store the message content in sessionStorage
      sessionStorage.setItem(SESSION_STORAGE_KEY, config.top_message);
      setIsVisible(false);
    }
  };

  // Don't render if message is disabled, empty, or user dismissed it
  if (!config?.top_message_enabled || !config?.top_message || !isVisible) {
    return null;
  }

  const messageType = config.top_message_type || 'info';
  const bgColor = messageTypeStyles[messageType];

  return (
    <div className={cn('w-full text-center py-1 px-4 relative', bgColor)}>
      <div className="mx-auto flex items-center justify-center">
        <p className="text-sm font-medium flex-1">{config.top_message}</p>
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

