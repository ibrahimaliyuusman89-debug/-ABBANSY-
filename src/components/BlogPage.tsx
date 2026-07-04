/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BLOGS } from '../data';
import { BlogPost } from '../types';
import { Clock, User, Calendar, BookOpen, Search, ArrowRight, X } from 'lucide-react';

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeBlog, setActiveBlog] = useState<BlogPost | null>(null);

  const filteredBlogs = BLOGS.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="blog-page-wrapper">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs uppercase font-mono tracking-wider font-extrabold text-sky-500 bg-sky-50 dark:bg-sky-950/40 px-3 py-1 rounded-full border border-sky-100 dark:border-sky-900/40">
          Clean Cloth Chronicles
        </span>
        <h2 className="text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight mt-3">
          Our Fabric Care & Laundry Blog
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2 leading-relaxed">
          Expert recommendations and fabric care hacks from the professional dry cleaning crew at ABNUR Laundry.
        </p>
      </div>

      {/* Search and category filters */}
      <div className="flex justify-between items-center mb-8 max-w-md mx-auto">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search care guides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="blogs-grid">
        {filteredBlogs.map(blog => (
          <article
            key={blog.id}
            className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                <img
                  src={blog.image}
                  alt={blog.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-sky-500 text-white font-mono uppercase text-[9px] font-bold px-2 py-1 rounded-lg">
                  {blog.category}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3 text-[10px] text-zinc-400 font-mono">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {blog.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {blog.readTime}
                  </span>
                </div>

                <h3 className="font-extrabold text-zinc-900 dark:text-white text-lg tracking-tight hover:text-sky-500 transition-colors cursor-pointer" onClick={() => setActiveBlog(blog)}>
                  {blog.title}
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">
                  {blog.excerpt}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-2">
              <button
                onClick={() => setActiveBlog(blog)}
                className="text-xs font-bold text-sky-500 hover:text-sky-600 flex items-center gap-1 transition-colors cursor-pointer"
              >
                Read Full Guide
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* RICH ARTICLE READER MODAL */}
      {activeBlog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" id="article-reader">
          <div className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl border border-zinc-100 dark:border-zinc-800 flex flex-col max-h-[85vh]">
            <div className="relative h-64 bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
              <img
                src={activeBlog.image}
                alt={activeBlog.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <button
                onClick={() => setActiveBlog(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-5 left-6 right-6">
                <span className="bg-sky-500 text-white font-mono uppercase text-[9px] font-bold px-2 py-0.5 rounded mb-2 inline-block">
                  {activeBlog.category}
                </span>
                <h3 className="text-xl font-extrabold text-white tracking-tight leading-tight">
                  {activeBlog.title}
                </h3>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300 flex-1">
              <div className="flex items-center gap-4 text-[10px] text-zinc-400 font-mono border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <span className="flex items-center gap-1"><User className="h-3 w-3" /> By {activeBlog.author}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {activeBlog.date}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {activeBlog.readTime}</span>
              </div>

              <div className="space-y-3 pt-2 text-sm text-zinc-700 dark:text-zinc-300" id="article-content">
                {activeBlog.content.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
