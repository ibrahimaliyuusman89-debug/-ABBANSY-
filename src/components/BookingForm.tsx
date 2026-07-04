/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Phone, Mail, User, Info, CheckCircle, ArrowRight, ArrowLeft, ShoppingBag, CreditCard, Sparkles } from 'lucide-react';
import { SERVICES, db } from '../data';
import { Order, OrderStatus, User as UserType } from '../types';

interface BookingFormProps {
  user: UserType | null;
  onSuccess: (orderId: string) => void;
  preSelectedServices?: Record<string, number>;
}

export default function BookingForm({ user, onSuccess, preSelectedServices }: BookingFormProps) {
  const [step, setStep] = useState(1);
  
  // Form fields
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(user?.address || '');
  
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTimeSlot, setPickupTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState('02:00 PM - 04:00 PM');
  
  const [items, setItems] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stripeCardNum, setStripeCardNum] = useState('');
  const [stripeExpiry, setStripeExpiry] = useState('');
  const [stripeCvc, setStripeCvc] = useState('');

  // Pre-fill quantities from the estimator if passed in
  useEffect(() => {
    if (preSelectedServices && Object.keys(preSelectedServices).length > 0) {
      setItems(preSelectedServices);
      setStep(2); // Jump to items step if they chose estimate
    }
  }, [preSelectedServices]);

  // Set default dates
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(today.getDate() + 3);

    setPickupDate(tomorrow.toISOString().split('T')[0]);
    setDeliveryDate(dayAfter.toISOString().split('T')[0]);
  }, []);

  const handleItemQtyChange = (id: string, delta: number) => {
    setItems(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const calculateTotal = () => {
    return (Object.entries(items) as [string, number][]).reduce((acc, [id, qty]) => {
      const s = SERVICES.find(srv => srv.id === id);
      return acc + (s ? s.price * qty : 0);
    }, 0);
  };

  const totalItemsCount = (Object.values(items) as number[]).reduce((a, b) => a + b, 0);
  const totalAmount = calculateTotal();

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalAmount < 3500) return;

    setIsSubmitting(true);

    // Simulate Stripe API Latency
    setTimeout(() => {
      const orderId = `ABN-${Math.floor(1000 + Math.random() * 9000)}-K`;
      const orderItems = (Object.entries(items) as [string, number][])
        .filter(([_, qty]) => qty > 0)
        .map(([id, qty]) => {
          const s = SERVICES.find(srv => srv.id === id)!;
          return {
            serviceId: id,
            name: s.name,
            quantity: qty,
            price: s.price
          };
        });

      const newOrder: Order = {
        id: orderId,
        userId: user?.id || 'usr-guest',
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        pickupAddress: address,
        pickupDate,
        pickupTimeSlot,
        deliveryDate,
        deliveryTimeSlot,
        serviceCategory: orderItems.length === 1 ? (SERVICES.find(s => s.id === orderItems[0].serviceId)?.category || 'laundry') : 'all-in-one',
        items: orderItems,
        totalAmount,
        paymentStatus: paymentMethod === 'card' ? 'paid_stripe' : 'unpaid',
        paymentMethod,
        status: 'pending',
        statusHistory: [
          { status: 'pending', timestamp: new Date().toISOString(), note: 'Booking initiated and confirmed online.' }
        ],
        notes: notes || undefined,
        createdAt: new Date().toISOString(),
        trackingCoordinates: { lat: 11.9833, lng: 8.4833 } // Kano default center
      };

      db.saveOrder(newOrder);
      setIsSubmitting(false);
      onSuccess(orderId);
    }, 1500);
  };

  return (
    <div className="bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-xl overflow-hidden" id="booking-wizard">
      {/* Wizard Header Progress */}
      <div className="bg-sky-500/10 dark:bg-sky-950/20 px-6 py-4 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800" id="booking-progress-header">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-sky-500" />
          <h3 className="font-bold text-zinc-900 dark:text-white text-base">Schedule Laundry Pickup</h3>
        </div>
        <div className="flex items-center gap-2" id="step-indicators">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                step === i ? 'w-8 bg-sky-500' : 'w-2.5 bg-zinc-200 dark:bg-zinc-800'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-6 md:p-8" id="booking-wizard-content">
        {/* STEP 1: CONTACTS & SCHEDULING SLOTS */}
        {step === 1 && (
          <div className="space-y-6" id="booking-step-1">
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <User className="h-4 w-4 text-sky-500" />
              1. Contact & Scheduling Details
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alhaji Ibrahim"
                  className="w-full px-3.5 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">WhatsApp / Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +234 814 311 4440"
                  className="w-full px-3.5 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. name@gmail.com"
                  className="w-full px-3.5 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Pickup Address (Kano City Delivery Limits)</label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="No. 25 Gwarzo Road (Opposite Bayero University New Campus gate), Kano"
                className="w-full px-3.5 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              {/* Pickup slots */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-500">
                  <MapPin className="h-4 w-4" />
                  Pickup Slot
                </div>
                <div className="space-y-2">
                  <input
                    type="date"
                    required
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white"
                  />
                  <select
                    value={pickupTimeSlot}
                    onChange={(e) => setPickupTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white"
                  >
                    <option>08:00 AM - 10:00 AM</option>
                    <option>10:00 AM - 12:00 PM</option>
                    <option>12:00 PM - 02:00 PM</option>
                    <option>02:00 PM - 04:00 PM</option>
                    <option>04:00 PM - 06:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Delivery slots */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-500">
                  <CheckCircle className="h-4 w-4" />
                  Delivery Slot
                </div>
                <div className="space-y-2">
                  <input
                    type="date"
                    required
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white"
                  />
                  <select
                    value={deliveryTimeSlot}
                    onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white"
                  >
                    <option>08:00 AM - 10:00 AM</option>
                    <option>10:00 AM - 12:00 PM</option>
                    <option>12:00 PM - 02:00 PM</option>
                    <option>02:00 PM - 04:00 PM</option>
                    <option>04:00 PM - 06:00 PM</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!name || !phone || !address || !pickupDate || !deliveryDate}
                className="flex items-center gap-1.5 px-6 py-3 bg-sky-500 hover:bg-sky-600 disabled:bg-zinc-100 dark:disabled:bg-zinc-900 disabled:text-zinc-400 text-white font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer"
              >
                Choose Items
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT ITEMS */}
        {step === 2 && (
          <div className="space-y-6" id="booking-step-2">
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <ShoppingBag className="h-4 w-4 text-sky-500" />
              2. Add Clothes & Garments
            </h4>

            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Specify estimated quantities. Our delivery agent will re-confirm and catalog everything on arrival.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-1" id="items-scroll-selector">
              {SERVICES.map(service => {
                const qty = items[service.id] || 0;
                return (
                  <div
                    key={service.id}
                    className="flex justify-between items-center p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/40"
                  >
                    <div>
                      <span className="font-semibold text-xs text-zinc-900 dark:text-white block">{service.name}</span>
                      <span className="text-[10px] text-zinc-500">₦{service.price.toLocaleString()} / {service.unit}</span>
                    </div>

                    <div className="flex items-center gap-2 bg-white dark:bg-zinc-950 p-1 rounded-lg border border-zinc-100 dark:border-zinc-800 shadow-sm">
                      <button
                        type="button"
                        onClick={() => handleItemQtyChange(service.id, -1)}
                        className="p-1 text-zinc-400 hover:text-zinc-800 dark:hover:text-white"
                      >
                        -
                      </button>
                      <span className="font-mono text-xs font-bold w-5 text-center text-zinc-900 dark:text-white">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleItemQtyChange(service.id, 1)}
                        className="p-1 text-zinc-400 hover:text-zinc-800 dark:hover:text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Additional Instructions / Special Requests (Optional)</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Please use fabric softener. Starch the Agbada heavily."
                className="w-full px-3.5 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 resize-none"
              />
            </div>

            {totalAmount > 0 ? (
              <div className="bg-sky-500/5 dark:bg-sky-950/25 p-4 rounded-2xl border border-sky-500/15 flex justify-between items-center">
                <div>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">Estimated Total ({totalItemsCount} items)</span>
                  <span className="block font-sans font-extrabold text-lg text-sky-500 dark:text-sky-400">
                    ₦{totalAmount.toLocaleString()}
                  </span>
                </div>
                {totalAmount < 3500 ? (
                  <span className="text-[10px] text-amber-500 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 p-2 rounded-lg max-w-[200px]">
                    Minimum order ₦3,500 required for free pickup.
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-500 uppercase font-mono tracking-wider bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 p-2 rounded-lg font-bold">
                    Free Home Pickup
                  </span>
                )}
              </div>
            ) : null}

            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 text-sm font-semibold"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={totalAmount < 3500}
                className="flex items-center gap-1.5 px-6 py-3 bg-sky-500 hover:bg-sky-600 disabled:bg-zinc-100 dark:disabled:bg-zinc-900 disabled:text-zinc-400 text-white font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer"
              >
                Checkout & Confirm
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PAYMENT & CONFIRMATION */}
        {step === 3 && (
          <form onSubmit={handleBookingSubmit} className="space-y-6" id="booking-step-3">
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <CreditCard className="h-4 w-4 text-sky-500" />
              3. Secure Payment Integration
            </h4>

            {/* Invoice Review Box */}
            <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 space-y-3">
              <span className="text-xs uppercase font-mono tracking-wider font-bold text-sky-500 block">
                Booking Invoice Details
              </span>
              <div className="grid grid-cols-2 gap-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                <span>Customer:</span>
                <span className="font-semibold text-zinc-900 dark:text-white text-right">{name}</span>
                <span>Address:</span>
                <span className="font-semibold text-zinc-900 dark:text-white text-right truncate max-w-[180px] self-end">{address}</span>
                <span>Pickup Time:</span>
                <span className="font-semibold text-zinc-900 dark:text-white text-right">{pickupDate} ({pickupTimeSlot})</span>
                <span>Delivery Time:</span>
                <span className="font-semibold text-zinc-900 dark:text-white text-right">{deliveryDate} ({deliveryTimeSlot})</span>
                <span className="border-t border-zinc-200 dark:border-zinc-800 pt-1.5 mt-1.5">Grand Total:</span>
                <span className="border-t border-zinc-200 dark:border-zinc-800 pt-1.5 mt-1.5 font-bold text-sky-500 text-right text-sm">
                  ₦{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">Payment Method</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === 'cash'
                      ? 'border-sky-500 bg-sky-500/5 text-sky-500 font-bold'
                      : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  <span className="text-xs">Cash on Delivery</span>
                  <span className="text-[9px] font-mono opacity-80">Pay rider at your door</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === 'card'
                      ? 'border-sky-500 bg-sky-500/5 text-sky-500 font-bold'
                      : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  <span className="text-xs flex items-center gap-1">
                    Secure Card Checkout
                    <Sparkles className="h-3 w-3 text-amber-500 fill-current animate-bounce" />
                  </span>
                  <span className="text-[9px] font-mono opacity-80">Stripe Secured Checkout</span>
                </button>
              </div>
            </div>

            {/* Card Inputs if selected */}
            {paymentMethod === 'card' && (
              <div className="space-y-3 bg-zinc-50 dark:bg-zinc-900/40 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 animate-fadeIn" id="stripe-form-panel">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-zinc-500">Card Number</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                      <CreditCard className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      required={paymentMethod === 'card'}
                      value={stripeCardNum}
                      onChange={(e) => setStripeCardNum(e.target.value)}
                      placeholder="4242 •••• •••• 4242"
                      className="w-full pl-9 pr-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-zinc-500">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      required={paymentMethod === 'card'}
                      value={stripeExpiry}
                      onChange={(e) => setStripeExpiry(e.target.value)}
                      placeholder="12/28"
                      className="w-full px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-zinc-500">CVC</label>
                    <input
                      type="password"
                      required={paymentMethod === 'card'}
                      value={stripeCvc}
                      onChange={(e) => setStripeCvc(e.target.value)}
                      placeholder="•••"
                      maxLength={4}
                      className="w-full px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-zinc-500">
                  <Info className="h-3 w-3 text-sky-400" />
                  <span>Your keys are protected by AES-256 Stripe servers.</span>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 text-sm font-semibold"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-1.5 px-6 py-3 bg-sky-500 hover:bg-sky-600 disabled:bg-zinc-300 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-sky-500/10 cursor-pointer"
              >
                {isSubmitting ? 'Securing Transaction...' : `Book Pickup (₦${totalAmount.toLocaleString()})`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
