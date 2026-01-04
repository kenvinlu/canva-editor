'use client';

import { useEffect } from 'react';
import { useMessageStore } from '@canva-web/src/store/useMessageStore';
import { useUserStore } from '@canva-web/src/store/useUserStore';
import { MessageService } from '@canva-web/src/services/message.service';

// Mock messages for demonstration
const mockMessages = [
  {
    id: '1',
    subject: 'Welcome to CanvaClone!',
    content: 'Thank you for joining us. Get started by exploring our templates.',
    status: 'unread' as const,
    createdAt: new Date().toISOString(),
    sender: { name: 'Admin', email: 'admin@canvaclone.com' },
  },
  {
    id: '2',
    subject: 'New features available',
    content: 'Check out our latest features including collaboration tools and export options.',
    status: 'unread' as const,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    sender: { name: 'Admin', email: 'admin@canvaclone.com' },
  },
  {
    id: '3',
    subject: 'Your design is ready',
    content: 'Your recent design has been processed and is ready for download.',
    status: 'unread' as const,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    sender: { name: 'System', email: 'noreply@canvaclone.com' },
  },
];

export function MessageLoader() {
  const user = useUserStore((state) => state.userData);
  const { setMessages, setTotal, setLoading } = useMessageStore();

  useEffect(() => {
    if (!user) return;

    const loadMessages = async () => {
      try {
        setLoading(true);
        // Try to load real messages, fall back to mock
        try {
          const response = await MessageService.getMessages({
            page: 1,
            pageSize: 50,
          });
          setMessages(response.data?.messages || []);
          setTotal(response.data?.total || 0);
        } catch (error) {
          // Use mock messages if API fails
          console.log('Using mock messages');
          setMessages(mockMessages as any);
          setTotal(mockMessages.length);
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setLoading(false);
      }
    };
    setTimeout(() => {
      loadMessages();
    }, 1000);
  }, [user, setMessages, setTotal, setLoading]);

  return null;
}
