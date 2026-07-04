/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Compass, Calendar, CheckCircle, Clock, Truck, ShieldAlert, RefreshCw } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface TrackingMapProps {
  order: Order;
  onRefresh?: () => void;
}

export default function TrackingMap({ order, onRefresh }: TrackingMapProps) {
  // We'll simulate courier position along the Gwarzo road path depending on the order status
  const [courierPosition, setCourierPosition] = useState({ x: 120, y: 150 });
  const [etaText, setEtaText] = useState('Determining...');

  const getStatusStep = (status: OrderStatus): number => {
    switch (status) {
      case 'pending': return 1;
      case 'pickup_scheduled': return 2;
      case 'picked_up': return 3;
      case 'processing': return 4;
      case 'ready': return 5;
      case 'delivery_scheduled': return 6;
      case 'delivered': return 7;
      default: return 1;
    }
  };

  useEffect(() => {
    const step = getStatusStep(order.status);
    
    // Custom simulated locations on the Kano/Gwarzo Road map based on order status
    let pos = { x: 80, y: 140 }; // default: BUK Campus Gate
    let eta = 'Will update soon';

    if (step === 1) {
      pos = { x: 50, y: 120 }; // Hub / Gwarzo road No 25
      eta = 'Pickup tomorrow morning';
    } else if (step === 2) {
      pos = { x: 120, y: 150 }; // Rider moving towards BUK
      eta = 'Courier arriving in 20 mins';
    } else if (step === 3) {
      pos = { x: 200, y: 160 }; // Clothes picked up, moving to Hub
      eta = 'In transit to central Hub';
    } else if (step === 4) {
      pos = { x: 50, y: 120 }; // Currently at Hub No 25
      eta = 'Processing (Under washing)';
    } else if (step === 5) {
      pos = { x: 50, y: 120 }; // Ready at Hub
      eta = 'Awaiting courier dispatch';
    } else if (step === 6) {
      pos = { x: 280, y: 180 }; // Dispatcher delivering
      eta = 'Out for delivery (arriving in 15 mins)';
    } else if (step === 7) {
      pos = { x: 350, y: 220 }; // Delivered
      eta = 'Order completed';
    }

    setCourierPosition(pos);
    setEtaText(eta);
  }, [order.status]);

  return (
    <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-lg" id="tracking-container">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-sky-500 font-bold block">
            Real-Time Tracking Panel
          </span>
          <h3 className="font-extrabold text-zinc-900 dark:text-white text-lg tracking-tight">
            Order Reference: <span className="font-mono text-sky-500">{order.id}</span>
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-500 rounded-xl border border-zinc-100 dark:border-zinc-800 transition-colors flex items-center gap-1 text-xs font-semibold"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Sync Status
            </button>
          )}
          <span className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-semibold text-xs rounded-xl border border-emerald-100 dark:border-emerald-900/40">
            GPS Live Connection
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="tracking-inner-grid">
        {/* SVG Interactive Vector Map of Kano - Gwarzo Road */}
        <div className="lg:col-span-2 relative bg-sky-50/50 dark:bg-zinc-900/30 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden h-[300px]" id="vector-map-frame">
          <svg className="w-full h-full absolute inset-0 text-zinc-300 dark:text-zinc-800" viewBox="0 0 400 300">
            {/* Grid Map Guidelines */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Gwarzo Road Highway Path */}
            <path
              d="M 20 100 Q 100 130 180 150 T 320 200 T 400 240"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="5"
              strokeLinecap="round"
              strokeOpacity="0.3"
            />
            {/* Dynamic Road border */}
            <path
              d="M 20 100 Q 100 130 180 150 T 320 200 T 400 240"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="4 4"
            />

            {/* Secondary Intersecting streets */}
            <path d="M 100 0 L 120 300" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.2" />
            <path d="M 280 0 L 300 300" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.2" />

            {/* Landmarks Pins */}
            {/* Hub: No. 25 Gwarzo Road */}
            <circle cx="50" cy="120" r="14" className="fill-sky-500/10 stroke-sky-500 stroke-2" />
            <circle cx="50" cy="120" r="5" className="fill-sky-500" />
            <text x="50" y="145" textAnchor="middle" className="font-sans font-bold text-[8px] fill-zinc-900 dark:fill-white">
              ABNUR Hub (No. 25)
            </text>

            {/* landmark: Bayero University Kano Gate */}
            <circle cx="150" cy="150" r="6" className="fill-zinc-400 dark:fill-zinc-700" />
            <text x="150" y="165" textAnchor="middle" className="font-mono text-[7px] fill-zinc-500">
              BUK Campus Gate
            </text>

            {/* landmark: Nassarawa GRA delivery */}
            <circle cx="330" cy="210" r="6" className="fill-zinc-400 dark:fill-zinc-700" />
            <text x="330" y="225" textAnchor="middle" className="font-mono text-[7px] fill-zinc-500">
              Nassarawa GRA
            </text>

            {/* Destination Pin (Simulated pickup address) */}
            <g transform={`translate(${getStatusStep(order.status) >= 6 ? 330 : 150}, ${getStatusStep(order.status) >= 6 ? 210 : 150})`}>
              <path d="M0 -12 C-5 -12 -9 -8 -9 -3 C-9 4 0 12 0 12 C0 12 9 4 9 -3 C9 -8 5 -12 0 -12 Z" className="fill-emerald-500" />
              <circle cx="0" cy="-3" r="3" className="fill-white" />
            </g>

            {/* Animated Dispatch Rider dot */}
            {getStatusStep(order.status) > 1 && getStatusStep(order.status) < 7 && (
              <g transform={`translate(${courierPosition.x}, ${courierPosition.y})`} className="animate-bounce">
                <circle cx="0" cy="0" r="12" className="fill-sky-500 animate-ping opacity-25" />
                <circle cx="0" cy="0" r="8" className="fill-sky-500 stroke-white stroke-2" />
                <circle cx="0" cy="0" r="3" className="fill-white" />
              </g>
            )}
          </svg>

          {/* Overlay Map Badge */}
          <div className="absolute bottom-3 left-3 right-3 bg-white/95 dark:bg-zinc-950/95 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-md flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-sky-500 animate-spin" />
              <div>
                <span className="font-semibold text-zinc-900 dark:text-white block">Simulated dispatch rider coordinates</span>
                <span className="text-[10px] font-mono text-zinc-400">Lat: 11.9833, Lng: 8.4833 (Gwarzo Road Kano)</span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold bg-sky-50 dark:bg-sky-950/40 text-sky-500 p-1 rounded">
              ETA: {etaText}
            </span>
          </div>
        </div>

        {/* Vertical Timeline Tracker */}
        <div className="space-y-4" id="tracking-timeline-box">
          <h4 className="text-xs uppercase font-mono tracking-wider font-bold text-zinc-400 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            Activity Timeline Logs
          </h4>

          <div className="space-y-4 max-h-[240px] overflow-y-auto pr-1" id="timeline-list">
            {order.statusHistory.slice().reverse().map((history, idx) => (
              <div key={idx} className="flex gap-3 relative">
                {idx < order.statusHistory.length - 1 && (
                  <div className="absolute left-[9px] top-4 bottom-[-16px] w-[2px] bg-zinc-200 dark:bg-zinc-800" />
                )}
                <div className="mt-1">
                  <div className="h-5 w-5 rounded-full bg-sky-100 dark:bg-sky-950/50 flex items-center justify-center text-sky-500 z-10 border border-white dark:border-zinc-900">
                    <CheckCircle className="h-3 w-3" />
                  </div>
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-zinc-900 dark:text-white uppercase text-[10px] font-mono">
                    {history.status.replace('_', ' ')}
                  </div>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                    {history.note}
                  </p>
                  <span className="text-[9px] font-mono text-zinc-400 block mt-1">
                    {new Date(history.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
