'use client';

import { Twitter, Facebook, Linkedin, Link2, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../base/button/Button';
import { cn } from '@canva-web/src/utils';
import { useTranslations } from 'next-intl';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

export function ShareButtons({ url, title, description, className }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const t = useTranslations('blog');
  const fullUrl = window.location.origin + url;
  const shareText = description ? `${title} - ${description}` : title;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(fullUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
        {t('shareLabel')}
      </span>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('twitter')}
        className="gap-2"
        aria-label={t('shareTwitter')}
      >
        <Twitter className="w-4 h-4" />
        <span className="hidden sm:inline">{t('shareTwitter')}</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('facebook')}
        className="gap-2"
        aria-label={t('shareFacebook')}
      >
        <Facebook className="w-4 h-4" />
        <span className="hidden sm:inline">{t('shareFacebook')}</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('linkedin')}
        className="gap-2"
        aria-label={t('shareLinkedIn')}
      >
        <Linkedin className="w-4 h-4" />
        <span className="hidden sm:inline">{t('shareLinkedIn')}</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="gap-2"
        aria-label={t('shareCopy')}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            <span className="hidden sm:inline">{t('shareCopied')}</span>
          </>
        ) : (
          <>
            <Link2 className="w-4 h-4" />
            <span className="hidden sm:inline">{t('shareCopy')}</span>
          </>
        )}
      </Button>
    </div>
  );
}

