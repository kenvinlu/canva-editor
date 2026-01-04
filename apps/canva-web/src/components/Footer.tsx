'use client';

import { Github } from "lucide-react";
import Link from "next/link";

import { cn } from "../utils";
import Logo from "./Logo";
import { Button } from "./base/button/Button";
import { useEffect } from "react";
import * as CookieConsent from 'vanilla-cookieconsent';
import pluginConfig from "./cookie/CookieConsentConfig";
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import { getGithubUrl } from "@canva-web/config/Env";
import { useTranslations } from "next-intl";

const footerLinks = [
  {
    label: 'Languages',
    children: [
      {
        label: 'English',
        href: '/en',
      },
      {
        label: 'Tiếng Việt',
        href: '/vi',
      },
      {
        label: '日本語 (Coming soon)',
        href: '/ja',
      },
      {
        label: '中文 (Coming soon)',
        href: '/zh',
      },
      {
        label: '한국어 (Coming soon)',
        href: '/ko',
      },
    ],
  },
  {
    label: '\u00A0',
    children: [
      {
        label: 'Français (Coming soon)',
        href: '/fr',
      },
      {
        label: 'Deutsch (Coming soon)',
        href: '/de',
      },
      {
        label: 'Italiano (Coming soon)',
        href: '/it',
      },
      {
        label: 'Português (Coming soon)',
        href: '/pt',
      },
      {
        label: 'Русский (Coming soon)',
        href: '/ru',
      },
    ],
  },
  {
    label: '\u00A0\u00A0',
    children: [
      {
        label: 'हिन्दी (Coming soon)',
        href: '/in',
      },
      {
        label: 'Español (Coming soon)',
        href: '/es',
      },
      {
        label: 'Türkçe (Coming soon)',
        href: '/tr',
      },
      {
        label: 'العربية (Coming soon)',
        href: '/ar',
      },
      {
        label: 'ไทย (Coming soon)',
        href: '/th',
      },
    ],
  },
];

export function Footer({ className }: { className?: string }) {
  const t = useTranslations('footer');
  useEffect(() => {
    CookieConsent.run(pluginConfig);
  }, []);

  return (
    <footer className={cn("border-t bg-muted/50", className)}>
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Logo />
            </Link>
            <p className="text-sm text-muted-foreground">
              {t('quote')}
            </p>
          </div>
          {footerLinks.map((link) => (
            <div key={link.label}>
              <h3 className="mb-4 text-sm font-semibold">{link.label}</h3>
              <ul className="space-y-2 text-sm">
                {link.children.map((child) => (
                  <li key={child.label}>
                    <Link
                      href={child.href}
                      className="text-muted-foreground hover:text-foreground"
                      aria-label={child.label}
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              {t('copyright', { year: new Date().getFullYear() })}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link
                href={getGithubUrl()}
                target="_blank"
                className="hover:text-foreground flex items-center gap-1"
              >
                <Github className="h-4 w-4" />
                GitHub
              </Link>
              <Link href="/page/privacy" className="hover:text-foreground">
                {t('privacy')}
              </Link>
              <Link href="/page/terms" className="hover:text-foreground">
                {t('terms')}
              </Link>
              <Link href="/sitemap" className="hover:text-foreground">
                {t('sitemap')}
              </Link>
              <Button variant="outline" onClick={CookieConsent.showPreferences}>
                {t('manageCookies')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
