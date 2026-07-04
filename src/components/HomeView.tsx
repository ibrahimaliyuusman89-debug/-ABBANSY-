/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, Compass, ArrowRight, ShieldCheck, Sparkles, Truck, Award, Star, Search, PlusCircle } from 'lucide-react';
import { ViewType, Testimonial } from '../types';
import { TESTIMONIALS, SERVICES, BUSINESS_INFO } from '../data';
import { getServiceIcon } from './ServicesSection';

interface HomeViewProps {
  setView: (view: ViewType) => void;
  onSearchTracking: (orderId: string) => void;
}

export default function HomeView({ setView, onSearchTracking }: HomeViewProps) {
  const [trackNum, setTrackNum] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackNum.trim()) {
      onSearchTracking(trackNum.trim());
    }
  };

  return (
    <div className="space-y-16 pb-12" id="home-view-wrapper">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden py-16 lg:py-24" id="home-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column Text */}
          <div className="space-y-6 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/40 rounded-full">
              <Sparkles className="h-4 w-4 text-sky-500" />
              <span className="text-xs uppercase font-mono tracking-wider font-extrabold text-sky-600 dark:text-sky-400">
                #1 Premium Laundry in Kano
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-950 dark:text-white tracking-tight leading-[1.1] font-sans">
              Immaculate Fabric Care <span className="text-sky-500">Delivered</span> to Your Door
            </h1>

            <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg leading-relaxed">
              Experience professional dry cleaning and pristine laundry washing. We handle your everyday wear, business suits, and royal Agbadas with unmatched handcraft precision.
            </p>

            {/* CTA Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setView('book-pickup')}
                className="flex items-center justify-center gap-1.5 px-6 py-3.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-sky-500/20 transition-all hover:scale-105 cursor-pointer"
              >
                <Calendar className="h-4.5 w-4.5" />
                Schedule Free Pickup
              </button>
              <button
                onClick={() => setView('services')}
                className="flex items-center justify-center gap-1.5 px-6 py-3.5 bg-white dark:bg-zinc-950 hover:bg-zinc-50 text-zinc-800 dark:text-zinc-100 rounded-xl text-sm font-bold border border-zinc-200 dark:border-zinc-800 transition-all cursor-pointer"
              >
                Explore Pricing Rates
                <ArrowRight className="h-4 w-4 text-zinc-400" />
              </button>
            </div>

            {/* Mini Trust Badges */}
            <div className="flex items-center gap-6 pt-6 border-t border-zinc-100 dark:border-zinc-800/80 text-zinc-500 dark:text-zinc-400 text-xs">
              <div className="flex items-center gap-1.5">
                <Truck className="h-4.5 w-4.5 text-sky-500" />
                <span>Express Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />
                <span>Fabric Protection Insurance</span>
              </div>
            </div>
          </div>

          {/* Right Column Interactive Map/Track Prompt + Image Banner */}
          <div className="space-y-6" id="hero-right-column">
            {/* Beautiful Hero Showcase Image */}
            <div className="relative rounded-3xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-xl group">
              <img
                src="/src/assets/images/laundry_hero_banner_1783180226390.jpg"
                alt="Premium Fabric Care Boutique"
                referrerPolicy="no-referrer"
                className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end p-4">
                <span className="text-white text-[10px] font-mono font-bold tracking-wider uppercase bg-sky-500 px-3 py-1 rounded-full shadow-lg">
                  ABNUR Premium Handcraft Care
                </span>
              </div>
            </div>

            <div className="relative" id="hero-graphic">
              <div className="bg-gradient-to-tr from-sky-400 to-emerald-400 absolute inset-0 rounded-3xl blur-3xl opacity-10 dark:opacity-5" />
              <div className="relative bg-white dark:bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-xl space-y-6">
                
                <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
                  <h3 className="font-extrabold text-zinc-900 dark:text-white text-lg tracking-tight">
                    Where is my laundry courier?
                  </h3>
                  <p className="text-zinc-400 text-xs mt-1">
                    Type your order reference ID below to view our live rider dispatch coordinates on Gwarzo road.
                  </p>
                </div>

                {/* Direct Tracking Quick Form */}
                <form onSubmit={handleTrackSubmit} className="space-y-3">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                      <Search className="h-4.5 w-4.5" />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ABN-9843-K"
                      value={trackNum}
                      onChange={(e) => setTrackNum(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-zinc-900 dark:text-white font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl text-xs hover:opacity-95 transition-all shadow-md cursor-pointer"
                  >
                    Query GPS Coordinates
                  </button>
                </form>

                {/* Business Stats cards */}
                <div className="grid grid-cols-3 gap-2 text-center" id="hero-metrics">
                  <div className="bg-zinc-50 dark:bg-zinc-900/60 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    <span className="block font-sans font-black text-lg text-sky-500">6hr</span>
                    <span className="text-[9px] uppercase font-mono text-zinc-400 block mt-0.5">Express Care</span>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-900/60 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    <span className="block font-sans font-black text-lg text-zinc-900 dark:text-white">100%</span>
                    <span className="text-[9px] uppercase font-mono text-zinc-400 block mt-0.5">Eco Solvents</span>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-900/60 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    <span className="block font-sans font-black text-lg text-zinc-900 dark:text-white">₦3,500</span>
                    <span className="text-[9px] uppercase font-mono text-zinc-400 block mt-0.5">Min Booking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. THE STEP-BY-STEP SERVICE TIMELINE */}
      <section className="bg-zinc-50 dark:bg-zinc-900/40 py-12 border-y border-zinc-100 dark:border-zinc-800/60" id="home-process">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
              Our 4-Step Executive Protocol
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2">
              How we ensure pristine fabric condition and secure doorstep logistics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="process-timeline">
            {[
              { step: '01', title: 'Schedule Online', desc: 'Book a convenient pickup slot. No need to pre-sort clothes; our driver handles it.' },
              { step: '02', title: 'Rider Collection', desc: 'Our professional dispatch agent arrives with secure seal bags to weigh & catalog.' },
              { step: '03', title: 'Executive Washing', desc: 'Garments cleaned under custom chemical temperatures tailored for lace, cotton, or wool.' },
              { step: '04', title: 'Crisp Steam Delivery', desc: 'Delivered hand-pressed, fresh-scented, and hung directly back inside your wardrobe.' }
            ].map((p, i) => (
              <div key={i} className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm relative group hover:border-sky-300 dark:hover:border-sky-900 transition-all">
                <span className="text-3xl font-black text-sky-500/25 dark:text-sky-400/20 block font-mono mb-2">
                  {p.step}
                </span>
                <h3 className="font-extrabold text-zinc-900 dark:text-white text-base tracking-tight mb-2">
                  {p.title}
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. POPULAR RATES PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="home-rates">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
          <div>
            <span className="text-xs uppercase font-mono tracking-wider font-extrabold text-sky-500">Honest Pricing</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight mt-1">
              Popular Service Rates
            </h2>
          </div>
          <button
            onClick={() => setView('services')}
            className="text-xs font-bold text-sky-500 hover:text-sky-600 flex items-center gap-1"
          >
            Check all services & packages
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="popular-services-cards">
          {SERVICES.slice(0, 3).map(service => (
            <div key={service.id} className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="bg-sky-50 dark:bg-sky-950/40 text-sky-500 p-2.5 rounded-xl w-11 h-11 flex items-center justify-center mb-4">
                  {getServiceIcon(service.icon)}
                </div>
                <h3 className="font-extrabold text-zinc-900 dark:text-white text-base mb-1.5">{service.name}</h3>
                <p className="text-zinc-400 text-xs leading-relaxed mb-4">{service.description}</p>
              </div>
              <div className="border-t border-zinc-50 dark:border-zinc-900 pt-4 flex justify-between items-center mt-auto">
                <div>
                  <span className="text-xs text-zinc-400 block">Pricing</span>
                  <span className="font-sans font-black text-zinc-900 dark:text-white">₦{service.price.toLocaleString()}</span>
                  <span className="text-[10px] text-zinc-400 ml-1">{service.unit}</span>
                </div>
                <button
                  onClick={() => setView('book-pickup')}
                  className="px-3.5 py-2 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-500 hover:text-white text-sky-500 dark:text-sky-400 rounded-lg text-xs font-bold transition-all"
                >
                  Book Pickup
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* OUR PREMIUM FACILITIES & CRAFTSMANSHIP SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" id="home-facilities">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-zinc-50 dark:bg-zinc-900/30 p-8 sm:p-12 rounded-3xl border border-zinc-100 dark:border-zinc-800">
          <div className="relative rounded-2xl overflow-hidden shadow-lg group order-last lg:order-first">
            <img
              src="/src/assets/images/laundry_clean_care_1783180242275.jpg"
              alt="State-of-the-art Eco Laundry Facilities"
              referrerPolicy="no-referrer"
              className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
          <div className="space-y-6">
            <span className="text-xs uppercase font-mono tracking-wider font-extrabold text-sky-500">Uncompromising Standards</span>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white tracking-tight">
              State-of-the-Art Washing & Eco-Friendly Care
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
              At ABNUR Laundry, we don't just wash clothes—we prolong the life of your garments. We utilize premium, hypoallergenic, eco-safe detergents and state-of-the-art washing machines that protect delicate fabrics like silk, wool, and intricate lace from wear and color fading.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Gentle Chemistry</h4>
                <p className="text-zinc-400 text-xs">No harsh chlorine or optical brighteners that weaken precious fibers.</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Temperature Controlled</h4>
                <p className="text-zinc-400 text-xs">Customized heat and cycle settings tailored precisely for each individual fabric type.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CUSTOMER TESTIMONIALS */}
      <section className="bg-zinc-50 dark:bg-zinc-900/40 py-12 border-t border-zinc-100 dark:border-zinc-800/60" id="home-testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase font-mono tracking-wider font-extrabold text-sky-500">Client Reviews</span>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white tracking-tight mt-1">
              Loved by Kano’s Families & Professionals
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="testimonials-grid">
            {TESTIMONIALS.map(t => (
              <div key={t.id} className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-4">
                <div className="flex gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed italic">
                  "{t.content}"
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <img
                    src={t.image}
                    alt={t.name}
                    referrerPolicy="no-referrer"
                    className="h-10 w-10 rounded-full object-cover border-2 border-sky-100"
                  />
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-white block text-xs">{t.name}</span>
                    <span className="text-[10px] text-zinc-400 block">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
