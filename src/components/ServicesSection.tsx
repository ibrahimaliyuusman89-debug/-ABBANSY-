/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Shirt, Layers, UserCheck, Sparkles, Flame, Zap, Wrench, Plus, Minus, ShoppingCart, Calendar } from 'lucide-react';
import { SERVICES } from '../data';
import { ServiceItem, ViewType } from '../types';

interface ServicesSectionProps {
  setView: (view: ViewType) => void;
  onPreSelectService?: (serviceId: string, quantity: number) => void;
}

export function getServiceIcon(iconName: string, className = 'h-6 w-6') {
  switch (iconName) {
    case 'Shirt': return <Shirt className={className} />;
    case 'Layers': return <Layers className={className} />;
    case 'UserCheck': return <UserCheck className={className} />;
    case 'Sparkles': return <Sparkles className={className} />;
    case 'Flame': return <Flame className={className} />;
    case 'Zap': return <Zap className={className} />;
    case 'Wrench': return <Wrench className={className} />;
    default: return <Shirt className={className} />;
  }
}

export default function ServicesSection({ setView, onPreSelectService }: ServicesSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'laundry' | 'dry-cleaning' | 'ironing' | 'premium'>('all');
  
  // Price Estimator state: holds {[serviceId]: quantity}
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleQuantityChange = (id: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const filteredServices = SERVICES.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPrice = (Object.entries(quantities) as [string, number][]).reduce((acc, [id, qty]) => {
    const item = SERVICES.find(s => s.id === id);
    return acc + (item ? item.price * qty : 0);
  }, 0);

  const totalItemsCount = (Object.values(quantities) as number[]).reduce((a, b) => a + b, 0);

  const handleBookEstimate = () => {
    if (onPreSelectService) {
      (Object.entries(quantities) as [string, number][]).forEach(([id, qty]) => {
        if (qty > 0) {
          onPreSelectService(id, qty);
        }
      });
    }
    setView('book-pickup');
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="services-section-wrapper">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight" id="services-main-heading">
          Our Premium Fabric Care Services
        </h2>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
          From basic wash and folds to majestic cultural Agbadas, we combine handcraft techniques with high-grade ecological solvents for crisp, immaculate results.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="services-layout-grid">
        {/* Left 2 Columns: Services List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Controls: Search and Tabs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800" id="services-filter-panel">
            <div className="relative w-full sm:w-72">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Search garments, services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-zinc-900 dark:text-white"
                id="service-search-input"
              />
            </div>

            <div className="flex flex-wrap gap-1 w-full sm:w-auto" id="category-tabs">
              {(['all', 'laundry', 'dry-cleaning', 'ironing', 'premium'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                    selectedCategory === cat
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="services-cards-grid">
            {filteredServices.length > 0 ? (
              filteredServices.map(service => {
                const qty = quantities[service.id] || 0;
                return (
                  <div
                    key={service.id}
                    className="group bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:border-sky-200 dark:hover:border-sky-950 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-sky-50 dark:bg-sky-950/40 text-sky-500 dark:text-sky-400 p-2.5 rounded-xl transition-colors group-hover:bg-sky-500 group-hover:text-white">
                          {getServiceIcon(service.icon)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-zinc-900 dark:text-white group-hover:text-sky-500 transition-colors">
                            {service.name}
                          </h3>
                          <span className="inline-block text-[10px] uppercase font-mono tracking-wider font-semibold text-zinc-400 px-1.5 py-0.5 bg-zinc-50 dark:bg-zinc-900 rounded-md border border-zinc-100 dark:border-zinc-800 mt-0.5">
                            {service.duration} turnaround
                          </span>
                        </div>
                      </div>
                      <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed mb-4">
                        {service.description}
                      </p>
                    </div>

                    <div className="border-t border-zinc-50 dark:border-zinc-900/60 pt-4 flex items-center justify-between mt-auto">
                      <div>
                        <span className="text-xs text-zinc-400 block">Pricing</span>
                        <span className="font-sans font-bold text-zinc-900 dark:text-white">
                          ₦{service.price.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-zinc-500 ml-1">{service.unit}</span>
                      </div>

                      {/* Incrementor for Cost Estimator */}
                      <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-100 dark:border-zinc-800">
                        <button
                          onClick={() => handleQuantityChange(service.id, -1)}
                          className="p-1 rounded-lg text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-100 w-5 text-center">
                          {qty}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(service.id, 1)}
                          className="p-1 rounded-lg text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-500">
                No services found. Try searching something else!
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Interactive Cost Estimator Sidebar */}
        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm self-start" id="cost-estimator-sidebar">
          <div className="flex items-center gap-2 mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <ShoppingCart className="h-5 w-5 text-sky-500" />
            <h3 className="font-bold text-zinc-900 dark:text-white tracking-tight">
              Cost Estimator
            </h3>
          </div>

          <p className="text-zinc-500 dark:text-zinc-400 text-xs mb-4">
            Select item quantities on the left cards to build an instant quote estimate for pickup and delivery.
          </p>

          {totalItemsCount > 0 ? (
            <div className="space-y-4" id="estimator-items-summary">
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1" id="estimator-selected-list">
                {(Object.entries(quantities) as [string, number][]).map(([id, qty]) => {
                  if (qty === 0) return null;
                  const item = SERVICES.find(s => s.id === id);
                  if (!item) return null;
                  return (
                    <div key={id} className="flex justify-between items-center text-xs bg-white dark:bg-zinc-950 p-2 rounded-xl border border-zinc-100 dark:border-zinc-800">
                      <div className="truncate pr-2">
                        <span className="font-medium text-zinc-900 dark:text-white block truncate">{item.name}</span>
                        <span className="text-[10px] text-zinc-400">₦{item.price} x {qty}</span>
                      </div>
                      <span className="font-bold text-zinc-900 dark:text-white whitespace-nowrap">
                        ₦{(item.price * qty).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3 space-y-1.5">
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Total Items</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">{totalItemsCount}</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Rider Delivery</span>
                  <span className="font-semibold text-emerald-500 uppercase text-[10px] font-mono tracking-wider bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded">
                    Free Pickup
                  </span>
                </div>
                {totalPrice < 3500 && (
                  <div className="bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 p-2.5 rounded-xl text-[10px] leading-relaxed border border-amber-100 dark:border-amber-900/40">
                    Order total is ₦{totalPrice.toLocaleString()}. (Minimum value of ₦3,500 required for free pickup)
                  </div>
                )}
                <div className="flex justify-between text-sm pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <span className="font-bold text-zinc-900 dark:text-white">Estimated Cost</span>
                  <span className="font-sans font-extrabold text-sky-500 dark:text-sky-400 text-lg">
                    ₦{totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleBookEstimate}
                disabled={totalPrice < 3500}
                className="w-full flex items-center justify-center gap-1.5 py-3 bg-sky-500 hover:bg-sky-600 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-600 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-sky-500/10 cursor-pointer"
              >
                <Calendar className="h-4 w-4" />
                Proceed to Book Pickup
              </button>
            </div>
          ) : (
            <div className="text-center py-8 text-zinc-400 text-xs bg-white dark:bg-zinc-950 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
              Your estimator cart is currently empty. Increment any item price card to begin!
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
