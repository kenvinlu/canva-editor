'use client';

import { Button } from '@canva-web/src/components/base/button/Button';
import BaseSkeleton from '@canva-web/src/components/base/skeleton/BaseSkeleton';
import { MessageService } from '@canva-web/src/services/message.service';
import { useMessageStore } from '@canva-web/src/store/useMessageStore';
import { Inbox, Mail, MailOpen, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from '@canva-web/src/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { SendMessageForm } from './SendMessageForm';
import { MessageThread } from './MessageThread';
import type { Message } from '@canva-web/src/models/message.model';
import { useTranslations } from 'next-intl';

type TabType = 'all' | 'unread' | 'read' | 'compose';

export function InboxSplitView() {
  const t = useTranslations('user');
  const router = useRouter();
  const searchParams = useSearchParams();
  const messageId = searchParams.get('id');
  const composeParam = searchParams.get('compose');

  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const {
    messages,
    isLoading,
    error,
    updateMessage,
    fetchMessages,
  } = useMessageStore();

  // Removed initial fetch - messages will be loaded from Header or when user explicitly refreshes

  // Handle URL-based message selection
  useEffect(() => {
    if (composeParam === 'true') {
      setActiveTab('compose');
      setSelectedMessage(null);
    } else if (messageId && messages && messages.length > 0) {
      const message = messages.find((m) => m.documentId === messageId);

      if (message) {
        setSelectedMessage(message);
        if (message.messageStatus === 'unread') {
          MessageService.markAsRead(message.documentId)
            .then(() => updateMessage(message.documentId, { messageStatus: 'read' }))
            .catch((err) => console.error('Failed to mark as read:', err));
        }
      }
    }
  }, [messageId, composeParam, messages, updateMessage]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSelectedMessage(null);
    router.push('/inbox', { scroll: false });
    if (tab === 'all') {
      fetchMessages();
    } else if (tab === 'unread') {
      fetchMessages('unread');
    } else if (tab === 'read') {
      fetchMessages('read');
    }
  };

  const handleRefresh = async () => {
    if (activeTab === 'all') {
      await fetchMessages();
    } else if (activeTab === 'unread') {
      await fetchMessages('unread');
    } else if (activeTab === 'read') {
      await fetchMessages('read');
    }
  };

  const handleSelectMessage = async (message: Message) => {
    setSelectedMessage(message);
    router.push(`/inbox?id=${message.documentId}`, { scroll: false });
    if (message.messageStatus === 'unread') {
      try {
        await MessageService.markAsRead(message.documentId);
        updateMessage(message.documentId, { messageStatus: 'read' });
      } catch (err) {
        console.error('Failed to mark as read:', err);
      }
    }
  };

  const handleBackToList = () => {
    setSelectedMessage(null);
    router.push('/inbox', { scroll: false });
  };

  // const handleCompose = () => {
  //   setActiveTab('compose');
  //   setSelectedMessage(null);
  //   router.push('/inbox?compose=true', { scroll: false });
  // };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return minutes <= 1 ? 'Just now' : `${minutes}m ago`;
      }
      return `${hours}h ago`;
    }
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const unreadCount = messages?.filter((m) => m.messageStatus === 'unread').length || 0;

  return (
    <div className="flex h-[calc(100vh-12rem)] border border-border rounded-lg overflow-hidden">
      {/* Left Sidebar - Message List */}
      <div className="w-80 border-r border-border flex flex-col shrink-0">
        {/* Tabs */}
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Inbox className="size-5" />
              <h2 className="font-semibold">{t('inbox')}</h2>
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-semibold text-white bg-primary rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                disabled={isLoading}
                title={t('refreshMessages')}
              >
                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              </Button>
              {/* <Button
                variant={activeTab === 'compose' ? 'default' : 'ghost'}
                size="icon"
                onClick={handleCompose}
                title="New Message"
              >
                <Send size={16} />
              </Button> */}
            </div>
          </div>

          <div className="flex gap-2 text-sm">
            <button
              onClick={() => handleTabChange('all')}
              className={`px-3 py-1.5 rounded-md transition-colors ${activeTab === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
                }`}
            >
              {t('allMessages')}
            </button>
            <button
              onClick={() => handleTabChange('unread')}
              className={`px-3 py-1.5 rounded-md transition-colors ${activeTab === 'unread'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
                }`}
            >
              {t('unreadMessages')} {unreadCount > 0 && `(${unreadCount})`}
            </button>
            <button
              onClick={() => handleTabChange('read')}
              className={`px-3 py-1.5 rounded-md transition-colors ${activeTab === 'read'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
                }`}
            >
              {t('readMessages')}
            </button>
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <BaseSkeleton style={{ height: '16px', width: '80%' }} />
                  <BaseSkeleton style={{ height: '12px', width: '60%' }} />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-4 text-center">
              <p className="text-sm text-destructive mb-2">{error}</p>
              <Button size="sm" onClick={() => fetchMessages()}>
                Retry
              </Button>
            </div>
          ) : !messages || messages.length === 0 ? (
            <div className="p-8 text-center" data-testid="inbox-empty">
              <Inbox className="size-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No messages</p>
            </div>
          ) : (
            <div className="divide-y divide-border" data-testid="inbox-message-list">
              {messages.map((message) => (
                <button
                  key={message.id}
                  data-testid={`inbox-message-${message.id}`}
                  data-message-subject={message.subject}
                  onClick={() => handleSelectMessage(message)}
                  className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${selectedMessage?.id === message.id ? 'bg-muted' : ''
                    } ${message.messageStatus === 'unread' ? 'border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
                >
                  <div className="flex items-start gap-2 mb-1">
                    {message.messageStatus === 'unread' ? (
                      <Mail className="size-4 text-primary shrink-0 mt-0.5" />
                    ) : (
                      <MailOpen className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm truncate ${message.messageStatus === 'unread' ? 'font-semibold' : 'font-normal'
                          }`}
                        data-testid="message-subject"
                      >
                        {message.subject}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-1" data-testid="message-content" dangerouslySetInnerHTML={{ __html: message.content }} />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(message.createdAt)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Message Detail or Compose */}
      <div className="flex-1 flex flex-col bg-muted/20">
        {activeTab === 'compose' ? (
          <div className="p-8">
            <h2 className="text-xl font-semibold mb-6">New Message</h2>
            <SendMessageForm onSuccess={() => {
              setActiveTab('all');
              router.push('/inbox', { scroll: false });
              fetchMessages();
            }} />
          </div>
        ) : selectedMessage ? (
          <MessageThread
            message={selectedMessage}
            onBack={handleBackToList}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-center p-8">
            <div>
              <Inbox className="size-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">{t('selectMessages')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('noMessagesDescription')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
