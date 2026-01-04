'use client';

import { LogOut, Menu, Shield, User, X, File, Inbox } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from '@canva-web/src/core/actions/session';
import { useState } from 'react';
import { cn } from '../utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './base/dropdown-menu/DropdownMenu';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './base/button/Button';
import { useUserStore } from '@canva-web/src/store/useUserStore';
import { useMessageStore } from '@canva-web/src/store/useMessageStore';
import { useTranslations } from 'next-intl';
import Logo from './Logo';

const DemoBanner = () => {
  const t = useTranslations();
  return (
    <div className="bg-orange-500 text-white text-center">
      {t('header.demoMessage')}
    </div>
  );
};

type Props = {
  isDemo?: boolean;
}

export function Header({ isDemo = false }: Props) {
  const t = useTranslations();
  const pathname = usePathname();
  const user = useUserStore((state) => state.userData);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHydrated = useUserStore((state) => state.hydrated);
  const doLogout = useUserStore((state) => state.logout);
  const router = useRouter();
  const handleSignOut = () => {
    void signOut();
    doLogout();
    router.push('/');
  };

  const navigation = [
    { name: t('header.home'), href: '/' },
    { name: t('header.templates'), href: '/templates' },
    { name: t('header.documentation'), href: '/docs' },
    { name: t('header.blog'), href: '/blog' },
  ];

  if (!user) {
    navigation.push({ name: 'Demo', href: '/demo' });
  }

  const messages = useMessageStore((state) => state.messages);
  const unreadCount = messages?.filter((m) => m.messageStatus === 'unread').length || 0;

  const dropdownMenu: Array<{ name: string; href: string; icon: React.ReactNode; badge?: number }> = [
    { name: t('header.projects'), href: '/projects', icon: <File /> },
    { name: t('header.inbox'), href: '/inbox', icon: <Inbox />, badge: unreadCount },
    { name: t('header.profile'), href: '/profile', icon: <User /> },
    { name: t('header.securitySettings'), href: '/profile?tab=security', icon: <Shield /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {isDemo && <DemoBanner />}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Logo />
            </Link>
            <nav className="hidden md:flex">
              <ul className="flex items-center gap-6">
                {navigation.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/' && pathname?.startsWith(item.href));

                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          'text-sm font-medium transition-colors hover:text-primary',
                          isActive
                            ? 'text-primary font-semibold'
                            : 'text-muted-foreground'
                        )}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isHydrated && (
              <div className="hidden md:block">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        data-testid="user-menu-trigger"
                        className="relative overflow-visible rounded-full"
                      >
                        {user?.avatar ? (
                          <img
                            src={user?.avatar}
                            alt={user?.lastName || 'User'}
                            className="h-9 w-9 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                        {unreadCount > 0 && (
                          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          {user?.avatar ? (
                            <img
                              src={user?.avatar}
                              alt={user?.lastName || 'User'}
                              className="h-7 w-7 rounded-full object-cover"
                              aria-label={user?.lastName || 'User'}
                            />
                          ) : (
                            <User className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className="flex flex-col space-y-0.5">
                          <p className="text-sm font-medium">
                          {user?.firstName || ''} {user?.lastName || ''}
                          </p>
                          <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      {dropdownMenu.map((item) => (
                        <DropdownMenuItem asChild key={item.name}>
                          <Link href={item.href} className="cursor-pointer flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              {item.icon}
                              {item.name}
                            </span>
                            {item.badge && item.badge > 0 ? (
                              <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                {item.badge > 9 ? '9+' : item.badge}
                              </span>
                            ) : null}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        data-testid="logout-button"
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        {t('auth.signOut')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link href="/sign-in">
                      <Button variant="ghost" size="sm">
                        {t('auth.login')}
                      </Button>
                    </Link>
                    <Link href="/sign-up">
                      <Button variant="outline" size="sm">
                        {t('auth.signUp')}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            <ThemeToggle />

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 py-3 border-b">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/' && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'block py-2 px-3 text-base font-medium rounded-md',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-muted/50 hover:text-primary'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {isHydrated && !user && (
            <div className="space-y-1 px-4 py-3 border-b">
              <Link
                href="/auth/sign-in"
                className="block py-2 px-3 text-base font-medium rounded-md hover:bg-muted/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('auth.login')}
              </Link>
              <Link
                href="/auth/sign-up"
                className="block py-2 px-3 text-base font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('auth.signUp')}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
