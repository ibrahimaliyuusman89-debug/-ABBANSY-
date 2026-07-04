/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewType, User, Order } from './types';
import { db, BUSINESS_INFO } from './data';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import ServicesSection from './components/ServicesSection';
import BookingForm from './components/BookingForm';
import TrackingMap from './components/TrackingMap';
import Dashboard from './components/Dashboard';
import FAQSection from './components/FAQSection';
import BlogPage from './components/BlogPage';
import { Lock, Mail, Phone, MapPin, Award, CheckCircle, Info, Shield, Heart, Clock, Send, AlertTriangle } from 'lucide-react';

export default function App() {
  const [currentView, setView] = useState<ViewType>('home');
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  // Tracking search state
  const [trackingIdInput, setTrackingIdInput] = useState('');
  const [trackingOrderResult, setTrackingOrderResult] = useState<Order | null>(null);
  const [trackingError, setTrackingError] = useState('');

  // Cost estimator pre-selection buffer
  const [bookingPreSelect, setBookingPreSelect] = useState<Record<string, number>>({});

  // Auth form states
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authAddress, setAuthAddress] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessageText, setContactMessageText] = useState('');
  const [contactSuccessMsg, setContactSuccessMsg] = useState('');

  // Load user from db on startup
  useEffect(() => {
    const loggedIn = db.getLoggedInUser();
    if (loggedIn) {
      setUser(loggedIn);
    }
  }, []);

  // Theme effect
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const handleLogout = () => {
    db.setLoggedInUser(null);
    setUser(null);
    setView('home');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    const users = db.getUsers();
    // Simple demo validation: matching by email. Password can be anything for demo!
    const found = users.find(u => u.email.toLowerCase() === authEmail.toLowerCase());
    
    if (found) {
      db.setLoggedInUser(found);
      setUser(found);
      setAuthSuccess('Sign in successful!');
      setTimeout(() => {
        setAuthSuccess('');
        setView(found.role === 'admin' ? 'admin-dashboard' : 'customer-dashboard');
        // Clear fields
        setAuthEmail('');
        setAuthPassword('');
      }, 1000);
    } else {
      // Auto-create standard customer for user testing comfort
      const newUser: User = {
        id: `usr-${Math.floor(100 + Math.random() * 900)}`,
        name: authEmail.split('@')[0].toUpperCase(),
        email: authEmail,
        phone: '+234 800 000 0000',
        address: 'Kano City, Nigeria',
        role: 'customer',
        createdAt: new Date().toISOString()
      };
      db.saveUser(newUser);
      db.setLoggedInUser(newUser);
      setUser(newUser);
      setView('customer-dashboard');
      setAuthEmail('');
      setAuthPassword('');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const users = db.getUsers();
    if (users.find(u => u.email.toLowerCase() === authEmail.toLowerCase())) {
      setAuthError('Email address already registered!');
      return;
    }

    // Role detection: if registering with ibrahimaliyuusman89@gmail.com, make them admin!
    const role = authEmail.toLowerCase() === 'ibrahimaliyuusman89@gmail.com' ? 'admin' : 'customer';

    const newUser: User = {
      id: `usr-${Math.floor(100 + Math.random() * 900)}`,
      name: authName,
      email: authEmail,
      phone: authPhone,
      address: authAddress || 'Kano City, Nigeria',
      role,
      createdAt: new Date().toISOString()
    };

    db.saveUser(newUser);
    db.setLoggedInUser(newUser);
    setUser(newUser);
    setAuthSuccess('Account created successfully!');
    setTimeout(() => {
      setAuthSuccess('');
      setView(role === 'admin' ? 'admin-dashboard' : 'customer-dashboard');
      // Clear fields
      setAuthEmail('');
      setAuthName('');
      setAuthPhone('');
      setAuthAddress('');
      setAuthPassword('');
    }, 1000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccessMsg('Message submitted successfully! Our help desk will email you shortly.');
    setContactName('');
    setContactEmail('');
    setContactSubject('');
    setContactMessageText('');
    setTimeout(() => setContactSuccessMsg(''), 5000);
  };

  // Direct search handler for order tracking
  const handleQueryTracking = (orderId: string) => {
    const orders = db.getOrders();
    const found = orders.find(o => o.id.toLowerCase() === orderId.toLowerCase().trim());
    if (found) {
      setTrackingOrderResult(found);
      setTrackingError('');
      setView('track-order');
    } else {
      setTrackingOrderResult(null);
      setTrackingError('Order ID not found. Double check your receipt or contact support.');
      setView('track-order');
    }
  };

  // Cost estimator selection callback
  const handlePreSelectService = (serviceId: string, quantity: number) => {
    setBookingPreSelect(prev => ({ ...prev, [serviceId]: quantity }));
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 flex flex-col justify-between font-sans transition-colors duration-200">
      
      {/* Dynamic Header */}
      <Header
        currentView={currentView}
        setView={setView}
        user={user}
        onLogout={handleLogout}
        isDark={isDark}
        setIsDark={setIsDark}
      />

      {/* Main Page Routing Frame */}
      <main className="flex-grow">
        
        {/* VIEW: HOME */}
        {currentView === 'home' && (
          <HomeView
            setView={setView}
            onSearchTracking={handleQueryTracking}
          />
        )}

        {/* VIEW: ABOUT */}
        {currentView === 'about' && (
          <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12" id="about-view">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs uppercase font-mono tracking-wider font-extrabold text-sky-500 bg-sky-50 dark:bg-sky-950/40 px-3 py-1 rounded-full border border-sky-100 dark:border-sky-900/40">
                Who We Are
              </span>
              <h2 className="text-3xl font-black text-zinc-950 dark:text-white tracking-tight mt-3">
                About ABNUR Laundry Services
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2 leading-relaxed">
                Premium fabric care crafted for busy executives and families across Kano, Nigeria.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center" id="about-details">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                  Our Mission & Values
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">
                  Founded in Kano with the goal of redefining dry cleaning convenience, ABNUR provides premium washing solutions. We pair high-performance washing machines with natural, fabric-safe soaps to keep your whites white, your colors glowing, and your native attire completely immaculate.
                </p>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">
                  We value reliability, absolute precision, honest pricing structures, and dynamic rider delivery services. From our central hub on Gwarzo Road, we travel to all surrounding neighborhoods.
                </p>
              </div>

              {/* Graphic cards */}
              <div className="bg-zinc-100 dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="bg-sky-500 text-white p-2 rounded-xl">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Certified Fabric Experts</h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">Writers, technicians, and hand-pressers trained in dealing with delicate fabrics, lace, and Agbada embroidery.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="bg-emerald-500 text-white p-2 rounded-xl">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Primacy Care Policy</h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">Every garment is numbered, sealed in transit bags, and fully insured under our standard care policies.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: SERVICES & PRICING */}
        {(currentView === 'services' || currentView === 'pricing') && (
          <ServicesSection
            setView={setView}
            onPreSelectService={handlePreSelectService}
          />
        )}

        {/* VIEW: BOOK PICKUP */}
        {currentView === 'book-pickup' && (
          <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto" id="book-pickup-view">
            <BookingForm
              user={user}
              preSelectedServices={bookingPreSelect}
              onSuccess={(orderId) => {
                setBookingPreSelect({});
                setView(user ? (user.role === 'admin' ? 'admin-dashboard' : 'customer-dashboard') : 'home');
                alert(`Order ${orderId} successfully scheduled! You can track its live status in your dashboard.`);
              }}
            />
          </div>
        )}

        {/* VIEW: TRACK ORDER */}
        {currentView === 'track-order' && (
          <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6" id="track-order-view">
            {/* If there is an active tracking search result */}
            {trackingOrderResult ? (
              <TrackingMap order={trackingOrderResult} onRefresh={() => handleQueryTracking(trackingOrderResult.id)} />
            ) : (
              <div className="bg-white dark:bg-zinc-950 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 max-w-xl mx-auto shadow-md space-y-6 text-center">
                <span className="text-xs uppercase font-mono tracking-wider font-extrabold text-sky-500">Live GPS Query</span>
                <h2 className="text-2xl font-black text-zinc-950 dark:text-white tracking-tight">
                  Track Your Clothes
                </h2>
                
                {trackingError && (
                  <div className="bg-red-50 dark:bg-red-950/20 text-red-500 border border-red-100 p-3 rounded-xl text-xs font-semibold">
                    {trackingError}
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleQueryTracking(trackingIdInput);
                  }}
                  className="space-y-3"
                >
                  <input
                    type="text"
                    required
                    placeholder="Enter order ID (e.g. ABN-9843-K)"
                    value={trackingIdInput}
                    onChange={(e) => setTrackingIdInput(e.target.value)}
                    className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm font-mono focus:outline-none text-zinc-900 dark:text-white text-center"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-xs shadow-md shadow-sky-500/10 cursor-pointer"
                  >
                    Track Dispatcher Route
                  </button>
                </form>

                <div className="text-zinc-400 text-[11px] leading-relaxed">
                  For demonstration and guest testing: paste the active order reference ID <span className="font-mono text-zinc-500 font-bold bg-zinc-50 dark:bg-zinc-900 p-1 rounded">ABN-9843-K</span> to test!
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW: FAQ */}
        {currentView === 'faq' && (
          <FAQSection />
        )}

        {/* VIEW: BLOG */}
        {currentView === 'blog' && (
          <BlogPage />
        )}

        {/* VIEW: CONTACT */}
        {currentView === 'contact' && (
          <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8" id="contact-view">
            {/* Info panel */}
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase font-mono tracking-wider font-extrabold text-sky-500">Contact Us</span>
                <h2 className="text-3xl font-black text-zinc-950 dark:text-white tracking-tight mt-1">Get In Touch</h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2 leading-relaxed">
                  Need custom laundry arrangements or monthly corporate subscription dry cleaning contracts? Message us directly.
                </p>
              </div>

              <div className="space-y-4" id="contact-detail-items">
                <div className="flex gap-3 items-start">
                  <div className="bg-sky-500/10 text-sky-500 p-2.5 rounded-xl border border-sky-100 dark:border-sky-950">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-zinc-400 font-bold block">Central Hub Address</span>
                    <span className="font-semibold text-zinc-900 dark:text-white text-xs">{BUSINESS_INFO.address}</span>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="bg-sky-500/10 text-sky-500 p-2.5 rounded-xl border border-sky-100 dark:border-sky-950">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-zinc-400 font-bold block">Support Hotline</span>
                    <a href={`tel:${BUSINESS_INFO.phone}`} className="font-semibold text-zinc-900 dark:text-white text-xs hover:underline">{BUSINESS_INFO.phone}</a>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="bg-sky-500/10 text-sky-500 p-2.5 rounded-xl border border-sky-100 dark:border-sky-950">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-zinc-400 font-bold block">Corporate Email</span>
                    <a href={`mailto:${BUSINESS_INFO.email}`} className="font-semibold text-zinc-900 dark:text-white text-xs hover:underline break-all">{BUSINESS_INFO.email}</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Email form panel */}
            <div className="bg-white dark:bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-md">
              <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                {contactSuccessMsg && (
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 p-3 rounded-xl text-emerald-600 font-semibold">
                    {contactSuccessMsg}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-zinc-600 dark:text-zinc-400 font-semibold">Your Name</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Alhaji Bashir"
                      className="w-full px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-600 dark:text-zinc-400 font-semibold">Email Address</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. name@gmail.com"
                      className="w-full px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-600 dark:text-zinc-400 font-semibold">Subject</label>
                  <input
                    type="text"
                    required
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    placeholder="e.g. Agbada fabric care inquiry"
                    className="w-full px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-600 dark:text-zinc-400 font-semibold">Your Message</label>
                  <textarea
                    rows={4}
                    required
                    value={contactMessageText}
                    onChange={(e) => setContactMessageText(e.target.value)}
                    placeholder="Explain your fabric care query or laundry pickup preferences..."
                    className="w-full px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Send className="h-4 w-4" />
                  Submit Inquiry Message
                </button>
              </form>
            </div>
          </div>
        )}

        {/* VIEW: LOGIN */}
        {currentView === 'login' && (
          <div className="py-16 px-4 max-w-md mx-auto" id="login-view">
            <div className="bg-white dark:bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-xl space-y-6">
              <div className="text-center">
                <span className="text-xs uppercase font-mono tracking-wider font-extrabold text-sky-500 bg-sky-50 dark:bg-sky-950/40 px-3 py-1 rounded-full">Secure Sign In</span>
                <h2 className="text-2xl font-black text-zinc-950 dark:text-white mt-3">Welcome Back</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Access orders, tracking details, and invoices.</p>
              </div>

              {authSuccess && (
                <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border border-emerald-100 p-2.5 rounded-xl text-xs font-semibold text-center">
                  {authSuccess}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-600 dark:text-zinc-400">Email Address</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="e.g. customer@gmail.com"
                    className="w-full px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-600 dark:text-zinc-400">Password</label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Sign In to Account
                </button>
              </form>

              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-2 text-[10px] text-zinc-500 text-center leading-relaxed">
                <p>Don't have an account? <button onClick={() => setView('register')} className="text-sky-500 font-bold hover:underline">Register here</button></p>
                <div className="bg-zinc-50 dark:bg-zinc-900/60 p-2.5 rounded-xl text-left border border-zinc-100 dark:border-zinc-800/60">
                  <span className="font-bold text-zinc-700 dark:text-zinc-300 block">Demonstration Credentials:</span>
                  <p>• Admin: <span className="font-mono text-sky-500 font-semibold">ibrahimaliyuusman89@gmail.com</span></p>
                  <p>• Customer: <span className="font-mono text-sky-500 font-semibold">customer@gmail.com</span></p>
                  <p className="opacity-85 mt-1 font-mono italic">(Input any dummy password to log in)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: REGISTER */}
        {currentView === 'register' && (
          <div className="py-12 px-4 max-w-md mx-auto" id="register-view">
            <div className="bg-white dark:bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-xl space-y-5">
              <div className="text-center">
                <span className="text-xs uppercase font-mono tracking-wider font-extrabold text-sky-500 bg-sky-50 dark:bg-sky-950/40 px-3 py-1 rounded-full">New Account</span>
                <h2 className="text-2xl font-black text-zinc-950 dark:text-white mt-3">Create Profile</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Get free home pickups, history, and status updates.</p>
              </div>

              {authError && (
                <div className="bg-red-50 dark:bg-red-950/20 text-red-500 border border-red-100 p-2.5 rounded-xl text-xs font-semibold text-center">
                  {authError}
                </div>
              )}

              {authSuccess && (
                <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border border-emerald-100 p-2.5 rounded-xl text-xs font-semibold text-center">
                  {authSuccess}
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-600 dark:text-zinc-400">Full Name</label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="e.g. Aisha Bello"
                    className="w-full px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-600 dark:text-zinc-400">Email Address</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="e.g. name@gmail.com"
                    className="w-full px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-600 dark:text-zinc-400">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    placeholder="e.g. +234 814 311 4440"
                    className="w-full px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-600 dark:text-zinc-400">Delivery Address</label>
                  <textarea
                    rows={2}
                    required
                    value={authAddress}
                    onChange={(e) => setAuthAddress(e.target.value)}
                    placeholder="No. 25 Gwarzo Road, Kano"
                    className="w-full px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-600 dark:text-zinc-400">Password</label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Create Account
                </button>
              </form>

              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3 text-[10px] text-zinc-500 text-center">
                Already registered? <button onClick={() => setView('login')} className="text-sky-500 font-bold hover:underline">Log in instead</button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: CUSTOMER DASHBOARD */}
        {currentView === 'customer-dashboard' && user && (
          <Dashboard
            user={user}
            onNavigate={setView}
            onRefreshOrders={() => {}}
          />
        )}

        {/* VIEW: ADMIN DASHBOARD */}
        {currentView === 'admin-dashboard' && user && user.role === 'admin' && (
          <Dashboard
            user={user}
            onNavigate={setView}
            onRefreshOrders={() => {}}
          />
        )}

        {/* VIEW: PRIVACY POLICY */}
        {currentView === 'privacy' && (
          <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-6" id="privacy-policy-view">
            <h2 className="text-2xl font-black text-zinc-950 dark:text-white tracking-tight">Privacy Policy</h2>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed space-y-4">
              <p className="font-mono text-[9px] text-zinc-400">Effective Date: July 4, 2026</p>
              <p>At ABNUR Laundry Services, we protect your personal information with absolute integrity. This policy outlines how we handle data when you book pickups, update addresses, or interact with our dashboard services.</p>
              <h4 className="font-bold text-zinc-800 dark:text-white">1. Data Collection</h4>
              <p>We gather basic credentials necessary for home pickup dispatch: your full name, phone/WhatsApp number, physical delivery address in Kano, and email address.</p>
              <h4 className="font-bold text-zinc-800 dark:text-white">2. Usage Rights</h4>
              <p>Your details are used strictly to coordinate dispatch riders, send automated timeline statuses (such as picked up, dry cleaning complete), and process Stripe-ready card invoices securely.</p>
              <h4 className="font-bold text-zinc-800 dark:text-white">3. Third Party Policy</h4>
              <p>We do not share, sell, or compromise your coordinates. Only secure partner payment servers (like Stripe) have access to card details during secure checkout transitions.</p>
            </div>
          </div>
        )}

        {/* VIEW: TERMS & CONDITIONS */}
        {currentView === 'terms' && (
          <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-6" id="terms-conditions-view">
            <h2 className="text-2xl font-black text-zinc-950 dark:text-white tracking-tight">Terms & Conditions</h2>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed space-y-4">
              <p className="font-mono text-[9px] text-zinc-400">Effective Date: July 4, 2026</p>
              <p>By scheduling laundry services with ABNUR Laundry Services (No. 25 Gwarzo Road, Kano), you agree to these legal binding terms.</p>
              <h4 className="font-bold text-zinc-800 dark:text-white">1. Minimum Billing Limit</h4>
              <p>To qualify for free courier pickups across Kano, orders must total a minimum estimated value of ₦3,500. Surcharges of ₦500 apply if the final weight count falls below the minimum.</p>
              <h4 className="font-bold text-zinc-800 dark:text-white">2. Laundry Inspection</h4>
              <p>Our dispatch riders examine and weigh garments upon pickup. If we detect pre-existing tears, bleach stains, or missing buttons, we will log them on your tracking receipt immediately.</p>
              <h4 className="font-bold text-zinc-800 dark:text-white">3. Turnaround Schedules</h4>
              <p>Standard laundry requires 24 hours. Executive dry cleaning and Agbada gown spa require 48 hours. Express care priority jobs are completed within 6 hours flat.</p>
            </div>
          </div>
        )}

        {/* VIEW: REFUND POLICY */}
        {currentView === 'refund' && (
          <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-6" id="refund-policy-view">
            <h2 className="text-2xl font-black text-zinc-950 dark:text-white tracking-tight">Refund & Care Guarantee</h2>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed space-y-4">
              <p className="font-mono text-[9px] text-zinc-400">Effective Date: July 4, 2026</p>
              <p>We pride ourselves on royalty-grade fabric care. If you are not satisfied with the crispness of your ironed clothes, we will re-wash and hand-press them again, completely free of charge!</p>
              <h4 className="font-bold text-zinc-800 dark:text-white">1. Damaged Garment Liability</h4>
              <p>In the highly unlikely event that a garment experiences color bleeding or fiber damage directly due to our processing errors, we offer store credits or insurance payouts matching up to 10x the service charge of that item.</p>
              <h4 className="font-bold text-zinc-800 dark:text-white">2. Claims Turnaround</h4>
              <p>Any claims of damaged or missing items must be submitted to ibrahimaliyuusman89@gmail.com with photos of the garment and order reference ID within 24 hours of delivery.</p>
            </div>
          </div>
        )}

        {/* VIEW: 404 */}
        {currentView === '404' && (
          <div className="py-24 text-center space-y-4" id="404-view">
            <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto animate-bounce" />
            <h2 className="text-3xl font-black text-zinc-950 dark:text-white tracking-tight">Page Not Found</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">We couldn't locate that service directory. Let's get you back home.</p>
            <button
              onClick={() => setView('home')}
              className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-xs shadow-md"
            >
              Back to Home Screen
            </button>
          </div>
        )}

      </main>

      {/* Dynamic Footer */}
      <Footer setView={setView} />
    </div>
  );
}
