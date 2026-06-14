'use client';

import { Button } from '@canva-web/src/components/base/button/Button';
import { Input } from '@canva-web/src/components/base/input/Input';
import { Label } from '@canva-web/src/components/base/label/Label';
import { MessageService } from '@canva-web/src/services/message.service';
import { useMessageStore } from '@canva-web/src/store/useMessageStore';
import { Send } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
interface SendMessageFormProps {
  onSuccess?: () => void;
}

export function SendMessageForm({ onSuccess }: SendMessageFormProps = {}) {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { addMessage } = useMessageStore();
  const t = useTranslations('user');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!subject.trim() || !content.trim()) {
      setError(t('messages.pleaseFillInAllFields'));
      return;
    }

    try {
      setIsSending(true);
      const response = await MessageService.sendMessage({
        subject: subject.trim(),
        content: content.trim(),
      });

      if (response.data?.success) {
        addMessage(response.data.message);
        setSubject('');
        setContent('');
        setSuccess(t('messages.messageSentSuccessfully'));
        setTimeout(() => {
          setSuccess('');
          onSuccess?.();
        }, 1500);
      }
    } catch {
      setError(t('messages.failedToSendMessage'));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="subject">{t('messageSubjectPlaceholder')}</Label>
        <Input
          id="subject"
          type="text"
          placeholder={t('enterMessageSubjectPlaceholder')}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={isSending}
          maxLength={200}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">{t('message')}</Label>
        <textarea
          id="content"
          className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
          placeholder={t('typeYourMessageToAdminPlaceholder')}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSending}
          maxLength={1000}
        />
        <p className="text-xs text-muted-foreground text-right">
          {content.length}/1000
        </p>
      </div>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-3 py-2 rounded-md">
          {success}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isSending}>
        <Send />
        {isSending ? t('sending') : t('sendMessage')}
      </Button>
    </form>
  );
}
