'use client';

import { Button } from '@canva-web/src/components/base/button/Button';
import { Card, CardContent } from '@canva-web/src/components/base/card/Card';
import type { Message, MessageReply } from '@canva-web/src/models/message.model';
import { ArrowLeft, Send, User } from 'lucide-react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useMessageStore } from '@canva-web/src/store/useMessageStore';
import { MessageService } from '@canva-web/src/services/message.service';
import { toast } from '@canva-web/src/hooks/use-toast';
import { useTranslations } from 'next-intl';
interface MessageThreadProps {
  message: Message;
  onBack: () => void;
}

interface ThreadMessage {
  id: string;
  content: string;
  sender: {
    name: string;
    isAdmin: boolean;
  };
  createdAt: string;
}

export function MessageThread({ message, onBack }: MessageThreadProps) {
  const [replyContent, setReplyContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<Message>(message);
  const { updateMessage } = useMessageStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('user');
  // Build thread messages: original message content is the first message, replies are subsequent messages
  // Use useMemo to ensure proper reactivity when currentMessage updates
  const threadMessages: ThreadMessage[] = useMemo(() => {
    return [
      // First message in thread is the original message content
      {
        id: `message-${currentMessage.id}`,
        content: currentMessage.content,
        sender: {
          name: 'Admin',
          isAdmin: true,
        },
        createdAt: currentMessage.createdAt,
      },
      // Subsequent messages are the replies
      ...(currentMessage.replies || []).map((reply: MessageReply, index: number) => ({
        id: reply.id || `reply-${index}-${currentMessage.id}`,
        content: reply.content,
        sender: {
          name: reply.senderName,
          isAdmin: reply.isAdmin,
        },
        createdAt: reply.createdAt || new Date().toISOString(),
      })),
    ];
  }, [currentMessage]);

  // Fetch message with replies on mount
  useEffect(() => {
    const fetchMessage = async () => {
      try {
        setIsLoading(true);
        const response = await MessageService.getMessage(message.documentId);
        if (response.data) {
          setCurrentMessage(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch message:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessage();
  }, [message.documentId]);

  // Auto-scroll to bottom when threadMessages change (new reply added)
  useEffect(() => {
    if (!isLoading && threadMessages.length > 0 && scrollContainerRef.current) {
      setTimeout(() => {
        const container = scrollContainerRef.current;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      }, 100);
    }
  }, [threadMessages.length, isLoading]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSendReply = async () => {
    if (!replyContent.trim()) return;

    const replyContentToSend = replyContent.trim();
    setReplyContent(''); // Clear input immediately for better UX

    try {
      setIsSending(true);

      const response = await MessageService.sendReplyMessage({
        messageId: currentMessage.documentId,
        content: replyContentToSend,
      });

      // Response structure: BaseResponseModel<Message>
      // The API route returns the Message object directly
      if (response.data) {
        const updatedMessage = response.data;
        
        // Ensure we have the required fields to prevent the thread from disappearing
        if (!updatedMessage.id || !updatedMessage.content) {
          console.error('Invalid message response:', updatedMessage);
          throw new Error('Invalid response: message data is incomplete');
        }
        
        // Update the current message state with the new reply appended
        // The updatedMessage already contains all replies including the new one
        // This will trigger a re-render and threadMessages will be recomputed via useMemo
        setCurrentMessage(updatedMessage);

        // Update the message in the store
        updateMessage(currentMessage.documentId, { 
          messageStatus: updatedMessage.messageStatus,
          replies: updatedMessage.replies,
        });

        // Scroll to bottom to show the new reply - scroll the container, not the window
        setTimeout(() => {
          const container = scrollContainerRef.current;
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        }, 150);
      } else if (response.error) {
        throw new Error(response.error.message || 'Failed to send reply');
      } else {
        throw new Error('Failed to send reply: Invalid response');
      }
    } catch (error) {
      console.error('Failed to send reply:', error);
      // Restore the reply content if sending failed
      setReplyContent(replyContentToSend);
      toast({
        description: (error as Error).message || 'Failed to send reply. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="shrink-0"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold truncate">{message.subject}</h2>
            <p className="text-sm text-muted-foreground">
              {formatDate(message.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Thread Messages */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">{t('loadingMessage')}</p>
          </div>
        ) : (
          <>
            {threadMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender.isAdmin ? '' : 'flex-row-reverse'}`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    msg.sender.isAdmin ? 'bg-primary/10' : 'bg-muted'
                  }`}
                >
                  <User className={`h-5 w-5 ${msg.sender.isAdmin ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <Card
                  className={`max-w-[70%] ${
                    msg.sender.isAdmin ? 'bg-muted/50' : 'bg-primary/10'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <p className="text-sm font-semibold">{msg.sender.isAdmin ? msg.sender.name : ''}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(msg.createdAt)}
                      </p>
                    </div>
                    <p className="text-sm whitespace-pre-wrap break-words" dangerouslySetInnerHTML={{ __html: msg.content }} />
                  </CardContent>
                </Card>
              </div>
            ))}
            {/* Scroll anchor for auto-scrolling to new messages */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Quick Reply */}
      <div className="border-t border-border p-4 bg-background">
        <div className="flex gap-2">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder={t('typeYourReply')}
            className="flex-1 min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handleSendReply();
              }
            }}
          />
          <Button
            onClick={handleSendReply}
            disabled={!replyContent.trim() || isSending}
            className="self-end"
          >
            <Send size={16} />
            {isSending ? t('sending') : t('send')}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {t('pressCtrlCmdEnterToSend')}
        </p>
      </div>
    </div>
  );
}
