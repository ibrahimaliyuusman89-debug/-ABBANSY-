/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, ShieldQuestion } from 'lucide-react';
import { FAQS } from '../data';
import { FAQItem } from '../types';

export default function FAQSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'general' | 'booking' | 'pricing' | 'delivery'>('all');
  const [expandedId, setExpandedId] = useState<string | null>('faq-1');

  const filteredFaqs = FAQS.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto" id="faq-wrapper">
      <div className="text-center mb-10">
        <span className="text-xs uppercase font-mono tracking-wider font-extrabold text-sky-500 bg-sky-50 dark:bg-sky-950/40 px-3 py-1 rounded-full border border-sky-100 dark:border-sky-900/40">
          Got Questions?
        </span>
        <h2 className="text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight mt-3">
          Frequently Asked Questions
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2 leading-relaxed">
          Everything you need to know about scheduling, fabric damage insurance policies, and our executive care workflows in Kano.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mb-6 bg-zinc-50 dark:bg-zinc-900 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800">
        <div className="relative w-full sm:w-72">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-zinc-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap gap-1" id="faq-tabs">
          {(['all', 'general', 'booking', 'pricing', 'delivery'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-white'
                  : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3" id="faq-accordion-list">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map(faq => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                  className="w-full flex justify-between items-center p-5 text-left text-zinc-900 dark:text-white hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-all font-semibold text-sm"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="h-4.5 w-4.5 text-sky-500 shrink-0" />
                    {faq.question}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-zinc-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-zinc-400" />
                  )}
                </button>
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed border-t border-zinc-50 dark:border-zinc-900/60 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-zinc-400 text-xs bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
            No matching FAQs found. Ask our support line instead!
          </div>
        )}
      </div>

      <div className="mt-8 text-center bg-zinc-50 dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-left">
          <ShieldQuestion className="h-10 w-10 text-sky-500" />
          <div>
            <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Still have questions?</h4>
            <p className="text-xs text-zinc-400">Our customer support line is available 24/7 on WhatsApp.</p>
          </div>
        </div>
        <a
          href="https://wa.me/2348143114440"
          target="_blank"
          referrerPolicy="no-referrer"
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md transition-all whitespace-nowrap"
        >
          Message on WhatsApp
        </a>
      </div>
    </div>
  );
}
