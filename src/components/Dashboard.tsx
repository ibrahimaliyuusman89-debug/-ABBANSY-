/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Order, OrderStatus } from '../types';
import { db, SERVICES } from '../data';
import { Key, ShieldCheck, Mail, Phone, MapPin, RefreshCw, Activity, Calendar, Download, Trash, CheckSquare, PlusCircle, BarChart3, TrendingUp, Sparkles, AlertTriangle, User as UserIcon, CreditCard, Coins, Clock, Search } from 'lucide-react';
import TrackingMap from './TrackingMap';

interface DashboardProps {
  user: User;
  onNavigate: (view: any) => void;
  onRefreshOrders: () => void;
}

export default function Dashboard({ user, onNavigate, onRefreshOrders }: DashboardProps) {
  const [orders, setOrders] = useState<Order[]>(db.getOrders());
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Profile update state
  const [profileName, setProfileName] = useState(user.name);
  const [profilePhone, setProfilePhone] = useState(user.phone);
  const [profileAddress, setProfileAddress] = useState(user.address);
  const [profileMessage, setProfileMessage] = useState('');

  // Admin status update notes
  const [statusNote, setStatusNote] = useState('');
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<Order | null>(null);

  // Admin dashboard view tabs & transaction filters
  const [adminTab, setAdminTab] = useState<'orders' | 'payments'>('orders');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid_stripe' | 'cash_on_delivery' | 'unpaid'>('all');
  const [paymentSearch, setPaymentSearch] = useState('');

  // Offline payment form states
  const [manualOrderId, setManualOrderId] = useState('');
  const [manualMethod, setManualMethod] = useState<'card' | 'cash'>('cash');
  const [manualStatus, setManualStatus] = useState<'unpaid' | 'paid_stripe' | 'cash_on_delivery'>('cash_on_delivery');
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState('');

  const refreshLocalOrders = () => {
    const all = db.getOrders();
    setOrders(all);
    if (selectedOrder) {
      const refreshedSelected = all.find(o => o.id === selectedOrder.id);
      if (refreshedSelected) setSelectedOrder(refreshedSelected);
    }
    onRefreshOrders();
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: User = {
      ...user,
      name: profileName,
      phone: profilePhone,
      address: profileAddress
    };
    db.saveUser(updatedUser);
    db.setLoggedInUser(updatedUser);
    setProfileMessage('Profile successfully updated!');
    setTimeout(() => setProfileMessage(''), 3000);
  };

  // Filter orders for customer
  const customerOrders = orders.filter(o => o.customerEmail === user.email);

  // Admin handlers
  const handleUpdateStatus = (orderId: string, nextStatus: OrderStatus) => {
    const orderToUpdate = orders.find(o => o.id === orderId);
    if (!orderToUpdate) return;

    const note = statusNote || `Status updated to ${nextStatus.replace('_', ' ')} by management`;
    const newHistory = [
      ...orderToUpdate.statusHistory,
      {
        status: nextStatus,
        timestamp: new Date().toISOString(),
        note: note
      }
    ];

    const updatedOrder: Order = {
      ...orderToUpdate,
      status: nextStatus,
      statusHistory: newHistory
    };

    db.saveOrder(updatedOrder);
    setStatusNote('');
    refreshLocalOrders();
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm(`Are you sure you want to remove order ${orderId}?`)) {
      db.deleteOrder(orderId);
      refreshLocalOrders();
      if (selectedOrder?.id === orderId) setSelectedOrder(null);
    }
  };

  const handleUpdatePayment = (orderId: string, nextPaymentStatus: 'unpaid' | 'paid_stripe' | 'cash_on_delivery', nextPaymentMethod?: 'card' | 'cash') => {
    const orderToUpdate = orders.find(o => o.id === orderId);
    if (!orderToUpdate) return;

    const finalMethod = nextPaymentMethod || (nextPaymentStatus === 'paid_stripe' ? 'card' : 'cash');
    const note = `Payment status updated to ${
      nextPaymentStatus === 'paid_stripe' ? 'Paid (Card)' : nextPaymentStatus === 'cash_on_delivery' ? 'Paid (Cash)' : 'Unpaid'
    } via ${finalMethod === 'card' ? 'Stripe Secure' : 'Cash'} by management`;

    const newHistory = [
      ...orderToUpdate.statusHistory,
      {
        status: orderToUpdate.status,
        timestamp: new Date().toISOString(),
        note: note
      }
    ];

    const updatedOrder: Order = {
      ...orderToUpdate,
      paymentStatus: nextPaymentStatus,
      paymentMethod: finalMethod,
      statusHistory: newHistory
    };

    db.saveOrder(updatedOrder);
    refreshLocalOrders();
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter =
      paymentFilter === 'all' || order.paymentStatus === paymentFilter;

    const query = paymentSearch.toLowerCase().trim();
    const matchesSearch =
      !query ||
      order.id.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.customerPhone.includes(query) ||
      order.totalAmount.toString().includes(query);

    return matchesFilter && matchesSearch;
  });

  // Calculated Stats (for Admin view)
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled' && o.paymentStatus !== 'unpaid')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length;
  const completedOrders = orders.filter(o => o.status === 'delivered').length;
  const pendingCollections = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="dashboard-wrapper">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider font-bold text-sky-500">
            Welcome back, {user.role === 'admin' ? 'Administrator' : 'Customer'}
          </span>
          <h2 className="text-2xl font-black text-zinc-950 dark:text-white tracking-tight flex items-center gap-1.5 mt-1">
            {user.role === 'admin' ? <ShieldCheck className="h-6 w-6 text-emerald-500" /> : <Activity className="h-6 w-6 text-sky-500" />}
            {user.name}
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            User reference: <span className="font-mono text-zinc-400">{user.id}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={refreshLocalOrders}
            className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-zinc-950 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-200 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-800 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh Data
          </button>
          {user.role !== 'admin' && (
            <button
              onClick={() => onNavigate('book-pickup')}
              className="flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              Book New Pickup
            </button>
          )}
        </div>
      </div>

      {/* 1. ADMIN VIEW */}
      {user.role === 'admin' && (
        <div className="space-y-8" id="admin-dashboard-container">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="admin-stats-cards">
            <div className="bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex justify-between items-center shadow-sm">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400">Total Confirmed Revenue</span>
                <span className="block font-sans font-black text-2xl text-zinc-900 dark:text-white mt-1">
                  ₦{totalRevenue.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-500 flex items-center gap-0.5 mt-1 font-semibold">
                  <TrendingUp className="h-3 w-3" />
                  Stripe + Cash receipts
                </span>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 p-3 rounded-xl">
                <BarChart3 className="h-6 w-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex justify-between items-center shadow-sm">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400">Active Cleaning Jobs</span>
                <span className="block font-sans font-black text-2xl text-sky-500 mt-1">
                  {activeOrders}
                </span>
                <span className="text-[10px] text-zinc-400 block mt-1">Under processing / pickup</span>
              </div>
              <div className="bg-sky-50 dark:bg-sky-950/20 text-sky-500 p-3 rounded-xl">
                <Activity className="h-6 w-6 animate-pulse" />
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex justify-between items-center shadow-sm">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400">Delivered Orders</span>
                <span className="block font-sans font-black text-2xl text-zinc-900 dark:text-white mt-1">
                  {completedOrders}
                </span>
                <span className="text-[10px] text-zinc-400 block mt-1">Fresh laundry dispatched</span>
              </div>
              <div className="bg-zinc-100 dark:bg-zinc-900 text-zinc-500 p-3 rounded-xl">
                <CheckSquare className="h-6 w-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex justify-between items-center shadow-sm">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400">Awaiting Pickup</span>
                <span className="block font-sans font-black text-2xl text-amber-500 mt-1">
                  {pendingCollections}
                </span>
                <span className="text-[10px] text-amber-500 block mt-1 font-semibold">Action needed by rider</span>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/20 text-amber-500 p-3 rounded-xl">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Admin Navigation Tabs */}
          <div className="flex border-b border-zinc-200 dark:border-zinc-800 pb-px gap-6" id="admin-tab-selector">
            <button
              onClick={() => setAdminTab('orders')}
              className={`pb-3 text-xs uppercase font-mono tracking-wider font-extrabold border-b-2 transition-all cursor-pointer ${
                adminTab === 'orders'
                  ? 'border-sky-500 text-sky-500'
                  : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
              }`}
            >
              Order Deliveries & Dispatch
            </button>
            <button
              onClick={() => setAdminTab('payments')}
              className={`pb-3 text-xs uppercase font-mono tracking-wider font-extrabold border-b-2 transition-all cursor-pointer ${
                adminTab === 'payments'
                  ? 'border-sky-500 text-sky-500'
                  : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
              }`}
            >
              Financial & Payment Ledger
            </button>
          </div>

          {adminTab === 'orders' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="admin-workspace">
            {/* Orders Listing Table */}
            <div className="lg:col-span-2 bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-4">
              <h3 className="font-extrabold text-zinc-950 dark:text-white tracking-tight">
                Global Customer Orders List
              </h3>
              <div className="overflow-x-auto" id="admin-orders-table-wrapper">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-2">Order ID</th>
                      <th className="py-3 px-2">Customer</th>
                      <th className="py-3 px-2">Category</th>
                      <th className="py-3 px-2">Date/Amount</th>
                      <th className="py-3 px-2">Payment</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? (
                      orders.map(order => (
                        <tr
                          key={order.id}
                          onClick={() => setSelectedOrder(order)}
                          className={`border-b border-zinc-50 dark:border-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 cursor-pointer transition-colors ${
                            selectedOrder?.id === order.id ? 'bg-sky-50/40 dark:bg-sky-950/10' : ''
                          }`}
                        >
                          <td className="py-4 px-2 font-mono font-bold text-sky-500">{order.id}</td>
                          <td className="py-4 px-2">
                            <span className="font-semibold text-zinc-900 dark:text-white block">{order.customerName}</span>
                            <span className="text-[10px] text-zinc-400">{order.customerPhone}</span>
                          </td>
                          <td className="py-4 px-2 uppercase text-[10px] font-mono font-semibold text-zinc-400">
                            {order.serviceCategory}
                          </td>
                          <td className="py-4 px-2">
                            <span className="block font-medium text-zinc-900 dark:text-white">₦{order.totalAmount.toLocaleString()}</span>
                            <span className="text-[9px] text-zinc-400">{order.pickupDate}</span>
                          </td>
                          <td className="py-4 px-2">
                            <span className={`inline-block px-1.5 py-0.5 rounded-md font-mono text-[9px] uppercase font-bold ${
                              order.paymentStatus === 'paid_stripe'
                                ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 border border-emerald-100'
                                : order.paymentStatus === 'cash_on_delivery'
                                ? 'bg-sky-50 dark:bg-sky-950/20 text-sky-500 border border-sky-100'
                                : 'bg-amber-50 dark:bg-amber-950/20 text-amber-500 border border-amber-100'
                            }`}>
                              {order.paymentStatus === 'paid_stripe' ? 'Paid (Card)' : order.paymentStatus === 'cash_on_delivery' ? 'Paid (Cash)' : 'Unpaid'}
                            </span>
                          </td>
                          <td className="py-4 px-2">
                            <span className={`inline-block px-1.5 py-0.5 rounded-md font-mono text-[9px] uppercase font-semibold ${
                              order.status === 'delivered'
                                ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600'
                                : order.status === 'processing'
                                ? 'bg-sky-50 dark:bg-sky-950/20 text-sky-500'
                                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500'
                            }`}>
                              {order.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-right">
                            <div className="flex gap-1 justify-end" onClick={e => e.stopPropagation()}>
                              <button
                                onClick={() => setInvoiceModalOrder(order)}
                                className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 rounded"
                                title="View/Download Invoice"
                              >
                                <Download className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteOrder(order.id)}
                                className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded"
                                title="Delete Booking"
                              >
                                <Trash className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-zinc-400">
                          No customer orders in database yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Admin Side control details */}
            <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 space-y-6" id="admin-status-controller">
              {selectedOrder ? (
                <div className="space-y-4">
                  <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-sky-500 font-bold block">Active Editor Selection</span>
                    <h4 className="font-extrabold text-zinc-900 dark:text-white text-base">
                      Configure Order: <span className="font-mono text-sky-500">{selectedOrder.id}</span>
                    </h4>
                  </div>

                  <div className="text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Client:</span>
                      <span className="font-bold text-zinc-900 dark:text-white">{selectedOrder.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Address:</span>
                      <span className="font-bold text-zinc-900 dark:text-white truncate max-w-[150px]">{selectedOrder.pickupAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Est. Price:</span>
                      <span className="font-bold text-zinc-900 dark:text-white">₦{selectedOrder.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Status update select list */}
                  <div className="space-y-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono font-bold text-zinc-400 block">Change Status State</label>
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value as OrderStatus)}
                        className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 text-xs font-semibold text-zinc-900 dark:text-white"
                      >
                        <option value="pending">Pending pickup</option>
                        <option value="pickup_scheduled">Pickup Scheduled</option>
                        <option value="picked_up">Picked Up</option>
                        <option value="processing">Processing (Washing)</option>
                        <option value="ready">Ready for delivery</option>
                        <option value="delivery_scheduled">Delivery Scheduled</option>
                        <option value="delivered">Delivered (Completed)</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono font-bold text-zinc-400 block">Status Timeline Note</label>
                      <input
                        type="text"
                        value={statusNote}
                        onChange={(e) => setStatusNote(e.target.value)}
                        placeholder="e.g. Courier is riding down Gwarzo road"
                        className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white"
                      />
                    </div>

                    {/* Manage Order Payment Block */}
                    <div className="space-y-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                      <label className="text-[10px] uppercase font-mono font-bold text-zinc-400 block">Manage Order Payment</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-0.5">
                          <span className="text-[8px] font-mono text-zinc-400 block uppercase">Status</span>
                          <select
                            value={selectedOrder.paymentStatus}
                            onChange={(e) => handleUpdatePayment(selectedOrder.id, e.target.value as any, selectedOrder.paymentMethod)}
                            className="w-full px-2 py-1 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 text-[10px] font-semibold text-zinc-900 dark:text-white"
                          >
                            <option value="unpaid">Unpaid</option>
                            <option value="paid_stripe">Paid (Card)</option>
                            <option value="cash_on_delivery">Paid (Cash)</option>
                          </select>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[8px] font-mono text-zinc-400 block uppercase">Method</span>
                          <select
                            value={selectedOrder.paymentMethod}
                            onChange={(e) => handleUpdatePayment(selectedOrder.id, selectedOrder.paymentStatus, e.target.value as any)}
                            className="w-full px-2 py-1 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 text-[10px] font-semibold text-zinc-900 dark:text-white"
                          >
                            <option value="cash">Cash</option>
                            <option value="card">Card / POS</option>
                          </select>
                        </div>
                      </div>
                      {selectedOrder.paymentStatus === 'unpaid' && (
                        <button
                          type="button"
                          onClick={() => handleUpdatePayment(selectedOrder.id, 'cash_on_delivery', 'cash')}
                          className="w-full mt-2 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-[10px] shadow-sm cursor-pointer"
                        >
                          Quick Settle (Mark as Paid Cash)
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="bg-sky-500/5 dark:bg-sky-950/20 p-3 rounded-xl border border-sky-500/10 text-[10px] text-zinc-500 leading-relaxed">
                    Changing the state instantly updates the timeline logs, financial ledger charts, and live GPS route dots.
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-zinc-400 text-xs bg-white dark:bg-zinc-950 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                  Select a customer record from the left table to change dispatch states or view routes.
                </div>
              )}
            </div>
          </div>
        ) : (
            /* FINANCIAL & PAYMENT LEDGER TAB CONTENT */
            <div className="space-y-6 animate-fadeIn" id="admin-payments-tab-container">
              {/* Visual Analytics Row / Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4" id="financial-stats-grid">
                <div className="bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex justify-between items-center shadow-sm">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400">Card Revenue (Stripe)</span>
                    <span className="block font-sans font-black text-2xl text-emerald-500 mt-1">
                      ₦{orders.filter(o => o.paymentStatus === 'paid_stripe').reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">
                      {orders.filter(o => o.paymentStatus === 'paid_stripe').length} secure card receipts
                    </span>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 p-3 rounded-xl">
                    <CreditCard className="h-6 w-6" />
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex justify-between items-center shadow-sm">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400">Cash Collections</span>
                    <span className="block font-sans font-black text-2xl text-sky-500 mt-1">
                      ₦{orders.filter(o => o.paymentStatus === 'cash_on_delivery').reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">
                      {orders.filter(o => o.paymentStatus === 'cash_on_delivery').length} physical cash orders
                    </span>
                  </div>
                  <div className="bg-sky-50 dark:bg-sky-950/20 text-sky-500 p-3 rounded-xl">
                    <Coins className="h-6 w-6" />
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex justify-between items-center shadow-sm">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400">Unpaid / Outstanding</span>
                    <span className="block font-sans font-black text-2xl text-amber-500 mt-1">
                      ₦{orders.filter(o => o.paymentStatus === 'unpaid').reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-amber-500 block mt-0.5 font-medium">
                      {orders.filter(o => o.paymentStatus === 'unpaid').length} pending collection accounts
                    </span>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950/20 text-amber-500 p-3 rounded-xl">
                    <Clock className="h-6 w-6" />
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex justify-between items-center shadow-sm">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400">Total Gross Value</span>
                    <span className="block font-sans font-black text-2xl text-zinc-900 dark:text-white mt-1">
                      ₦{orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">
                      Across {orders.length} total active bookings
                    </span>
                  </div>
                  <div className="bg-zinc-100 dark:bg-zinc-900 text-zinc-500 p-3 rounded-xl">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main ledger list */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <div>
                      <h3 className="font-extrabold text-zinc-950 dark:text-white tracking-tight text-base">
                        Financial Transaction Ledger
                      </h3>
                      <p className="text-zinc-400 text-xs">Real-time payment collections audit trail & settlement logs.</p>
                    </div>
                    
                    {/* Export button */}
                    <button
                      onClick={() => {
                        alert("Simulating export... Financial ledger CSV report with " + orders.length + " transactions successfully downloaded!");
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      <Download className="h-3 w-3" />
                      Export CSV
                    </button>
                  </div>

                  {/* Search and filter toolbar */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                        <Search className="h-3.5 w-3.5" />
                      </span>
                      <input
                        type="text"
                        placeholder="Search ledger by name or order reference..."
                        value={paymentSearch}
                        onChange={(e) => setPaymentSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-zinc-900 dark:text-white"
                      />
                    </div>
                    <select
                      value={paymentFilter}
                      onChange={(e) => setPaymentFilter(e.target.value as any)}
                      className="px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-xs font-semibold text-zinc-700 dark:text-zinc-200 focus:outline-none"
                    >
                      <option value="all">All States</option>
                      <option value="paid_stripe">Card Paid Only</option>
                      <option value="cash_on_delivery">Cash Collected Only</option>
                      <option value="unpaid">Unpaid Only</option>
                    </select>
                  </div>

                  {/* Ledger Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
                          <th className="py-2 px-1">Ref ID</th>
                          <th className="py-2 px-1">Customer</th>
                          <th className="py-2 px-1 text-right">Amount Due</th>
                          <th className="py-2 px-1">Method</th>
                          <th className="py-2 px-1">Payment Status</th>
                          <th className="py-2 px-1 text-right">Settle Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.length > 0 ? (
                          filteredOrders.map(order => (
                            <tr key={order.id} className="border-b border-zinc-50 dark:border-zinc-900/40 hover:bg-zinc-50 dark:hover:bg-zinc-900/20">
                              <td className="py-3 px-1 font-mono font-bold text-sky-500">{order.id}</td>
                              <td className="py-3 px-1">
                                <span className="font-semibold text-zinc-900 dark:text-white block">{order.customerName}</span>
                                <span className="text-[10px] text-zinc-400">{order.pickupDate}</span>
                              </td>
                              <td className="py-3 px-1 text-right font-bold text-zinc-900 dark:text-white">
                                ₦{order.totalAmount.toLocaleString()}
                              </td>
                              <td className="py-3 px-1 uppercase font-mono text-[10px] text-zinc-500">
                                {order.paymentMethod === 'card' ? 'Secure Card' : 'Cash'}
                              </td>
                              <td className="py-3 px-1">
                                <span className={`inline-block px-1.5 py-0.5 rounded-md font-mono text-[9px] uppercase font-black ${
                                  order.paymentStatus === 'paid_stripe'
                                    ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 border border-emerald-100'
                                    : order.paymentStatus === 'cash_on_delivery'
                                    ? 'bg-sky-50 dark:bg-sky-950/20 text-sky-500 border border-sky-100'
                                    : 'bg-amber-50 dark:bg-amber-950/20 text-amber-500 border border-amber-100'
                                }`}>
                                  {order.paymentStatus === 'paid_stripe' ? 'Paid (Card)' : order.paymentStatus === 'cash_on_delivery' ? 'Paid (Cash)' : 'Unpaid'}
                                </span>
                              </td>
                              <td className="py-3 px-1 text-right">
                                {order.paymentStatus === 'unpaid' ? (
                                  <div className="flex gap-1 justify-end">
                                    <button
                                      onClick={() => handleUpdatePayment(order.id, 'cash_on_delivery', 'cash')}
                                      className="px-2 py-1 bg-sky-500 hover:bg-sky-600 text-white font-bold text-[9px] rounded shadow-sm cursor-pointer"
                                      title="Settle via Cash"
                                    >
                                      Settle Cash
                                    </button>
                                    <button
                                      onClick={() => handleUpdatePayment(order.id, 'paid_stripe', 'card')}
                                      className="px-2 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[9px] rounded shadow-sm cursor-pointer"
                                      title="Settle via Stripe Card"
                                    >
                                      Settle Card
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => {
                                      if (window.confirm("Are you sure you want to refund this order's payment in simulation?")) {
                                        handleUpdatePayment(order.id, 'unpaid');
                                      }
                                    }}
                                    className="px-2 py-1 border border-zinc-200 dark:border-zinc-800 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 text-[9px] font-bold rounded cursor-pointer"
                                  >
                                    Simulate Refund
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-zinc-400">
                              No matching transaction entries.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Sidebar helper controls - Settle Direct Payment Entry */}
                <div className="space-y-6">
                  <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 space-y-4">
                    <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
                      <span className="text-[9px] uppercase font-mono tracking-wider text-sky-500 font-bold block">Terminal Operations</span>
                      <h4 className="font-extrabold text-zinc-900 dark:text-white text-base">
                        Record Offline Payment
                      </h4>
                      <p className="text-zinc-400 text-[11px]">Directly log custom payments received at the laundry dropoff counter.</p>
                    </div>

                    {paymentSuccessMsg && (
                      <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 p-2.5 rounded-xl text-emerald-600 text-xs font-semibold">
                        {paymentSuccessMsg}
                      </div>
                    )}

                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (!manualOrderId) return;
                      handleUpdatePayment(manualOrderId, manualStatus, manualMethod);
                      setPaymentSuccessMsg("Offline payment ledger entry logged successfully!");
                      setTimeout(() => setPaymentSuccessMsg(''), 3000);
                      setManualOrderId('');
                    }} className="space-y-4 text-xs">
                      <div className="space-y-1">
                        <label className="text-zinc-600 dark:text-zinc-400 font-medium">Select Customer Order</label>
                        <select
                          required
                          value={manualOrderId}
                          onChange={(e) => setManualOrderId(e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white font-semibold focus:outline-none"
                        >
                          <option value="">-- Select outstanding order --</option>
                          {orders.map(o => (
                            <option key={o.id} value={o.id}>
                              [{o.id}] {o.customerName} - ₦{o.totalAmount.toLocaleString()} ({o.paymentStatus === 'unpaid' ? 'Unpaid' : 'Paid'})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-zinc-600 dark:text-zinc-400 font-medium">Payment Method</label>
                          <select
                            value={manualMethod}
                            onChange={(e) => setManualMethod(e.target.value as any)}
                            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white font-semibold focus:outline-none"
                          >
                            <option value="cash">Cash receipt</option>
                            <option value="card">Card POS/Stripe</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-zinc-600 dark:text-zinc-400 font-medium">Payment State</label>
                          <select
                            value={manualStatus}
                            onChange={(e) => setManualStatus(e.target.value as any)}
                            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white font-semibold focus:outline-none"
                          >
                            <option value="cash_on_delivery">Paid (Cash)</option>
                            <option value="paid_stripe">Paid (Card)</option>
                            <option value="unpaid">Refund/Unpaid</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={!manualOrderId}
                        className="w-full py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl text-xs hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer"
                      >
                        Log Payment Receipt
                      </button>
                    </form>
                  </div>

                  <div className="bg-sky-500/5 dark:bg-sky-950/10 p-4 rounded-3xl border border-sky-500/10 text-xs text-zinc-500 leading-relaxed space-y-2">
                    <h5 className="font-bold text-zinc-900 dark:text-white flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-sky-500" />
                      Terminal Information
                    </h5>
                    <p className="text-[11px] text-zinc-400">
                      Offline payments instantly update the global revenue matrix and synchronize client receipt records. Customers are automatically notified of settlement changes via their personal dashboard timeline stream.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. CUSTOMER VIEW */}
      {user.role !== 'admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="customer-dashboard-container">
          {/* Profile Card & Info Edits */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-4">
              <h3 className="font-extrabold text-zinc-950 dark:text-white tracking-tight flex items-center gap-1.5">
                <UserIcon className="h-5 w-5 text-sky-500" />
                Customer Account Profile
              </h3>

              <form onSubmit={handleUpdateProfile} className="space-y-3 text-xs">
                {profileMessage && (
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 p-2.5 rounded-xl text-emerald-600 font-semibold">
                    {profileMessage}
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-zinc-600 dark:text-zinc-400 font-medium">Name</label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-600 dark:text-zinc-400 font-medium">Email (Credentials)</label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full px-3 py-2 border border-zinc-100 dark:border-zinc-800 rounded-xl bg-zinc-100 dark:bg-zinc-950 text-zinc-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-600 dark:text-zinc-400 font-medium">Phone</label>
                  <input
                    type="text"
                    required
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-600 dark:text-zinc-400 font-medium">Home Delivery Address</label>
                  <textarea
                    rows={2}
                    required
                    value={profileAddress}
                    onChange={(e) => setProfileAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl text-xs hover:opacity-90 transition-all cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          </div>

          {/* Customer History & Active Tracking map */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active GPS order tracking drawer */}
            {selectedOrder && (
              <div className="animate-fadeIn">
                <TrackingMap order={selectedOrder} onRefresh={refreshLocalOrders} />
              </div>
            )}

            {/* Customer Orders list */}
            <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-4">
              <h3 className="font-extrabold text-zinc-950 dark:text-white tracking-tight">
                My Booking History
              </h3>

              <div className="overflow-x-auto" id="customer-orders-table">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-2">Order Ref</th>
                      <th className="py-3 px-2">Type</th>
                      <th className="py-3 px-2">Pickup Date</th>
                      <th className="py-3 px-2">Amount</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerOrders.length > 0 ? (
                      customerOrders.map(order => (
                        <tr
                          key={order.id}
                          onClick={() => setSelectedOrder(order)}
                          className={`border-b border-zinc-50 dark:border-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 cursor-pointer transition-colors ${
                            selectedOrder?.id === order.id ? 'bg-sky-50/40 dark:bg-sky-950/10' : ''
                          }`}
                        >
                          <td className="py-4 px-2 font-mono font-bold text-sky-500">{order.id}</td>
                          <td className="py-4 px-2 uppercase font-mono text-[9px] text-zinc-400">{order.serviceCategory}</td>
                          <td className="py-4 px-2 font-medium text-zinc-900 dark:text-zinc-100">{order.pickupDate}</td>
                          <td className="py-4 px-2 font-semibold text-zinc-900 dark:text-white">₦{order.totalAmount.toLocaleString()}</td>
                          <td className="py-4 px-2">
                            <span className={`inline-block px-1.5 py-0.5 rounded font-mono text-[9px] uppercase font-bold ${
                              order.status === 'delivered'
                                ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500'
                                : 'bg-sky-50 dark:bg-sky-950/20 text-sky-500'
                            }`}>
                              {order.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-right" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => setInvoiceModalOrder(order)}
                              className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 rounded"
                              title="Download Invoice"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-zinc-400">
                          You haven't placed any cleaning bookings yet. Use the "Book Pickup" button to schedule your first pickup.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE SIMULATED INVOICE MODAL */}
      {invoiceModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" id="invoice-modal">
          <div className="bg-white text-zinc-900 max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl border border-zinc-100 animate-slideUp">
            {/* Invoice Top */}
            <div className="bg-zinc-900 text-white p-6 flex justify-between items-center">
              <div>
                <span className="font-sans font-extrabold text-lg tracking-tight block">ABNUR LAUNDRY SERVICES</span>
                <span className="text-[9px] font-mono tracking-widest text-sky-400 block uppercase">Official Service Invoice</span>
              </div>
              <button
                onClick={() => setInvoiceModalOrder(null)}
                className="text-zinc-400 hover:text-white font-mono text-xs"
              >
                Close (ESC)
              </button>
            </div>

            {/* Invoice Body */}
            <div className="p-6 space-y-6 text-xs">
              <div className="flex justify-between border-b border-zinc-100 pb-4">
                <div>
                  <span className="text-zinc-400 block">Billed To:</span>
                  <span className="font-bold block">{invoiceModalOrder.customerName}</span>
                  <span className="text-zinc-500 block">{invoiceModalOrder.customerPhone}</span>
                  <span className="text-zinc-500 block max-w-[180px]">{invoiceModalOrder.pickupAddress}</span>
                </div>
                <div className="text-right">
                  <span className="text-zinc-400 block">Invoice Reference:</span>
                  <span className="font-mono font-bold text-sky-600 block">{invoiceModalOrder.id}</span>
                  <span className="text-zinc-400 block mt-2">Issued Date:</span>
                  <span className="font-semibold block">{new Date(invoiceModalOrder.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <span className="font-bold uppercase tracking-wider text-[10px] text-zinc-400 block">Itemized Charges</span>
                <div className="space-y-1.5 border-b border-zinc-100 pb-3">
                  {invoiceModalOrder.items.map((it, i) => (
                    <div key={i} className="flex justify-between font-medium">
                      <span>{it.name} <span className="text-zinc-400 font-mono">(x{it.quantity})</span></span>
                      <span>₦{(it.price * it.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="flex justify-between items-center bg-zinc-50 p-4 rounded-xl">
                <div>
                  <span className="text-zinc-400 block">Payment Method:</span>
                  <span className="font-bold block uppercase font-mono text-[10px]">{invoiceModalOrder.paymentMethod === 'card' ? 'Stripe Secured Card' : 'Cash on Delivery'}</span>
                </div>
                <div className="text-right">
                  <span className="text-zinc-400 block">Total Due:</span>
                  <span className="font-sans font-black text-base text-zinc-900">₦{invoiceModalOrder.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Legal Note */}
              <div className="text-[9px] text-zinc-400 leading-relaxed text-center border-t border-zinc-100 pt-4 space-y-1">
                <p>No. 25 Gwarzo Road, Kano, Nigeria | +234 814 311 4440 | ibrahimaliyuusman89@gmail.com</p>
                <p>Thank you for choosing ABNUR. Your garments are insured by our standard Care policy terms.</p>
              </div>
            </div>

            {/* Print trigger */}
            <div className="bg-zinc-50 px-6 py-4 flex justify-end gap-2 border-t border-zinc-100">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-semibold hover:bg-zinc-800 transition-colors"
              >
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
