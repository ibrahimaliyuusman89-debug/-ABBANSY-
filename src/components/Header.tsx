/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shirt, Menu, X, User, LogOut, Sun, Moon, Calendar, ShieldCheck, Activity } from 'lucide-react';
import { ViewType, User as UserType } from '../types';

interface HeaderProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  user: UserType | null;
  onLogout: () => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
}

export default function Header({ currentView, setView, user, onLogout, isDark, setIsDark }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems: Array<{ label: string; view: ViewType }> = [
    { label: 'Home', view: 'home' },
    { label: 'About', view: 'about' },
    { label: 'Services', view: 'services' },
    { label: 'Pricing', view: 'pricing' },
    { label: 'Track Order', view: 'track-order' },
    { label: 'FAQ', view: 'faq' },
    { label: 'Blog', view: 'blog' },
    { label: 'Contact', view: 'contact' },
  ];

  const handleNavClick = (view: ViewType) => {
    setView(view);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800 transition-colors duration-200" id="app-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick('home')} id="logo-container">
            <div className="bg-sky-500 text-white p-2 rounded-xl flex items-center justify-center shadow-md shadow-sky-500/20">
              <Shirt className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <span className="font-sans font-bold text-lg tracking-tight text-zinc-900 dark:text-white block">
                ABNUR
              </span>
              <span className="text-[10px] font-mono tracking-wider uppercase text-zinc-500 dark:text-zinc-400 block -mt-1">
                Laundry Services
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex space-x-1 items-center" id="desktop-nav">
            {navigationItems.map((item) => (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  currentView === item.view
                    ? 'bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400'
                    : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center space-x-3" id="header-actions">
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-zinc-700" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleNavClick(user.role === 'admin' ? 'admin-dashboard' : 'customer-dashboard')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                >
                  {user.role === 'admin' ? (
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Activity className="h-4 w-4 text-sky-500" />
                  )}
                  {user.name.split(' ')[0]}
                </button>
                <button
                  onClick={onLogout}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  Register
                </button>
              </div>
            )}

            <button
              onClick={() => handleNavClick('book-pickup')}
              className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg text-sm font-semibold transition-all shadow-md shadow-zinc-950/10"
            >
              <Calendar className="h-4 w-4" />
              Book Pickup
            </button>
          </div>

          {/* Mobile Menu & Theme Button */}
          <div className="flex items-center lg:hidden gap-2" id="mobile-controls">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
            >
              {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-zinc-700" />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              id="mobile-menu-btn"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 pt-2 pb-4 space-y-1 shadow-lg" id="mobile-drawer">
          {navigationItems.map((item) => (
            <button
              key={item.view}
              onClick={() => handleNavClick(item.view)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-base font-medium transition-all ${
                currentView === item.view
                  ? 'bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400'
                  : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="border-t border-zinc-100 dark:border-zinc-800 my-2 pt-2">
            {user ? (
              <div className="space-y-1">
                <button
                  onClick={() => handleNavClick(user.role === 'admin' ? 'admin-dashboard' : 'customer-dashboard')}
                  className="w-full text-left px-4 py-2.5 rounded-lg text-base font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  My Dashboard ({user.name})
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 rounded-lg text-base font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 px-2 py-1">
                <button
                  onClick={() => handleNavClick('login')}
                  className="w-full py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-center text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="w-full py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-center text-sm font-medium"
                >
                  Register
                </button>
              </div>
            )}
            <div className="px-2 mt-2">
              <button
                onClick={() => handleNavClick('book-pickup')}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg text-sm font-semibold hover:opacity-90 transition-all"
              >
                <Calendar className="h-4 w-4" />
                Book Pickup
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
