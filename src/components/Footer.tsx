/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shirt, Phone, MapPin, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';
import { ViewType } from '../types';
import { BUSINESS_INFO } from '../data';

interface FooterProps {
  setView: (view: ViewType) => void;
}

export default function Footer({ setView }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-900 text-zinc-300 dark:bg-black border-t border-zinc-800" id="app-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8" id="footer-links-grid">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')} id="footer-logo">
              <div className="bg-sky-500 text-white p-2 rounded-xl flex items-center justify-center">
                <Shirt className="h-5 w-5" />
              </div>
              <div>
                <span className="font-sans font-bold text-lg tracking-tight text-white block">
                  ABNUR
                </span>
                <span className="text-[10px] font-mono tracking-wider uppercase text-sky-400 block -mt-1">
                  Laundry Services
                </span>
              </div>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Premium fabric care and executive dry cleaning services. Operating with pristine standard procedures and custom delivery right to your doorstep in Kano.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <ShieldCheck className="h-4 w-4 text-sky-400" />
              <span>Registered & Certified Professional Cleaners</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Explore Services
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => setView('services')} className="hover:text-white hover:underline transition-colors text-zinc-400">
                  Wash & Fold
                </button>
              </li>
              <li>
                <button onClick={() => setView('services')} className="hover:text-white hover:underline transition-colors text-zinc-400">
                  Executive Dry Cleaning
                </button>
              </li>
              <li>
                <button onClick={() => setView('services')} className="hover:text-white hover:underline transition-colors text-zinc-400">
                  Steam Ironing
                </button>
              </li>
              <li>
                <button onClick={() => setView('services')} className="hover:text-white hover:underline transition-colors text-zinc-400">
                  Traditional Gown Spa
                </button>
              </li>
              <li>
                <button onClick={() => setView('pricing')} className="hover:text-white hover:underline transition-colors text-zinc-400">
                  Premium Packages
                </button>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Support & Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => setView('faq')} className="hover:text-white hover:underline transition-colors text-zinc-400">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => setView('about')} className="hover:text-white hover:underline transition-colors text-zinc-400">
                  About Our Crew
                </button>
              </li>
              <li>
                <button onClick={() => setView('blog')} className="hover:text-white hover:underline transition-colors text-zinc-400">
                  Fabric Care Blog
                </button>
              </li>
              <li>
                <button onClick={() => setView('privacy')} className="hover:text-white hover:underline transition-colors text-zinc-400">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => setView('terms')} className="hover:text-white hover:underline transition-colors text-zinc-400">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => setView('refund')} className="hover:text-white hover:underline transition-colors text-zinc-400">
                  Refund & Care Guarantee
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Get in Touch
            </h3>
            <div className="flex items-start gap-2.5 text-sm text-zinc-400">
              <MapPin className="h-5 w-5 text-sky-400 shrink-0 mt-0.5" />
              <span>{BUSINESS_INFO.address}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-zinc-400">
              <Phone className="h-4 w-4 text-sky-400 shrink-0" />
              <a href={`tel:${BUSINESS_INFO.phone}`} className="hover:text-white transition-colors">{BUSINESS_INFO.phone}</a>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-zinc-400">
              <Mail className="h-4 w-4 text-sky-400 shrink-0" />
              <a href={`mailto:${BUSINESS_INFO.email}`} className="hover:text-white transition-colors break-all">{BUSINESS_INFO.email}</a>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-zinc-400">
              <Clock className="h-4 w-4 text-sky-400 shrink-0" />
              <span>Mon - Sat: 8:00 AM - 7:00 PM</span>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-500" id="footer-bottom">
          <p>© {currentYear} {BUSINESS_INFO.name}. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-4 md:mt-0">
            Crafted with <Heart className="h-3 w-3 text-red-500 fill-current" /> for families and executives across Kano, Nigeria.
          </p>
        </div>
      </div>
    </footer>
  );
}
