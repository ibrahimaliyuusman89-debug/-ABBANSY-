/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'customer' | 'admin' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: Role;
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: 'laundry' | 'dry-cleaning' | 'ironing' | 'premium';
  price: number; // in NGN (Nigerian Naira)
  unit: string; // e.g., "per kg", "per piece"
  duration: string; // e.g., "24 hours", "48 hours"
  description: string;
  icon: string; // Lucide icon name
}

export type OrderStatus = 'pending' | 'pickup_scheduled' | 'picked_up' | 'processing' | 'ready' | 'delivery_scheduled' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  pickupAddress: string;
  pickupDate: string;
  pickupTimeSlot: string;
  deliveryDate: string;
  deliveryTimeSlot: string;
  serviceCategory: 'laundry' | 'dry-cleaning' | 'ironing' | 'premium' | 'all-in-one';
  items: Array<{
    serviceId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  paymentStatus: 'unpaid' | 'paid_stripe' | 'cash_on_delivery';
  paymentMethod: 'card' | 'cash';
  status: OrderStatus;
  statusHistory: Array<{
    status: OrderStatus;
    timestamp: string;
    note: string;
  }>;
  notes?: string;
  createdAt: string;
  trackingCoordinates?: {
    lat: number;
    lng: number;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: string;
  readTime: string;
  date: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'booking' | 'pricing' | 'delivery';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
}

export type ViewType =
  | 'home'
  | 'about'
  | 'services'
  | 'pricing'
  | 'book-pickup'
  | 'track-order'
  | 'contact'
  | 'faq'
  | 'blog'
  | 'login'
  | 'register'
  | 'customer-dashboard'
  | 'admin-dashboard'
  | 'privacy'
  | 'terms'
  | 'refund'
  | '404';
