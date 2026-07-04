/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ServiceItem, BlogPost, FAQItem, Testimonial, Order, User } from './types';

// Business Details
export const BUSINESS_INFO = {
  name: 'ABNUR Laundry Services',
  address: 'No. 25 Gwarzo Road, Kano, Nigeria',
  phone: '+234 814 311 4440',
  email: 'ibrahimaliyuusman89@gmail.com',
  coords: { lat: 11.9833, lng: 8.4833 } // Kano coordinate
};

// Available services
export const SERVICES: ServiceItem[] = [
  {
    id: 'laundry-wash-dry',
    name: 'Wash & Fold Laundry',
    category: 'laundry',
    price: 850,
    unit: 'per kg',
    duration: '24 hours',
    description: 'Everyday clothing washed, perfectly dried, and neatly folded with premium hypoallergenic detergents.',
    icon: 'Shirt'
  },
  {
    id: 'laundry-bedding',
    name: 'Duvet & Bedding Cleaning',
    category: 'laundry',
    price: 3500,
    unit: 'per piece',
    duration: '48 hours',
    description: 'Deep cleansing for duvets, blankets, pillows, and sheets to remove dust mites and restore freshness.',
    icon: 'Layers'
  },
  {
    id: 'dry-cleaning-suit',
    name: 'Executive Suit Dry Cleaning',
    category: 'dry-cleaning',
    price: 4500,
    unit: 'per set',
    duration: '48 hours',
    description: 'Professional solvents care for suits, blazers, and ties. Finished with executive hand pressing.',
    icon: 'UserCheck'
  },
  {
    id: 'dry-cleaning-gown',
    name: 'Traditional Gowns & Agbada',
    category: 'dry-cleaning',
    price: 6000,
    unit: 'per piece',
    duration: '48 hours',
    description: 'Specialty care and precision ironing for premium cultural attire, Agbadas, Babarigas, and lace dresses.',
    icon: 'Sparkles'
  },
  {
    id: 'ironing-shirts',
    name: 'Steam Pressing & Ironing',
    category: 'ironing',
    price: 400,
    unit: 'per shirt',
    duration: '12 hours',
    description: 'Crisp, crisp creases on shirts, trousers, and skirts using commercial grade state-of-the-art steam tables.',
    icon: 'Flame'
  },
  {
    id: 'premium-delivery',
    name: 'Same-Day Express Care',
    category: 'premium',
    price: 15000,
    unit: 'flat rate',
    duration: '6 hours',
    description: 'Ultra-fast priority processing. Picked up, professionally cleaned, and delivered within 6 hours flat.',
    icon: 'Zap'
  },
  {
    id: 'leather-suede',
    name: 'Leather, Suede & Shoe Spa',
    category: 'premium',
    price: 8000,
    unit: 'per pair/item',
    duration: '72 hours',
    description: 'Delicate rejuvenation and restoration for fine designer leather garments, jackets, luxury handbags, and shoes.',
    icon: 'Wrench'
  }
];

// FAQs
export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'general',
    question: 'How do I schedule a pickup with ABNUR Laundry?',
    answer: 'Simply tap the "Book Pickup" button on our navigation bar or home screen. Choose your desired laundry service, provide your address in Kano, pick a date & time slot for pickup and delivery, and place your request.'
  },
  {
    id: 'faq-2',
    category: 'booking',
    question: 'What happens after I place a booking?',
    answer: 'Our professional dispatch rider will arrive at your door during your selected pickup time slot. They will weigh or count your items, log them in your presence, and secure them in safe transit bags.'
  },
  {
    id: 'faq-3',
    category: 'pricing',
    question: 'Is there a minimum order charge?',
    answer: 'Yes, to keep our pickup and delivery services cost-effective, we maintain a minimum order value of ₦3,500. Orders below this threshold will carry a small utility surcharge.'
  },
  {
    id: 'faq-4',
    category: 'delivery',
    question: 'Where do you offer your pickup and delivery services?',
    answer: 'We proudly serve Gwarzo Road, Nassarawa, Tarauni, Fagge, Gwale, Kano Municipal, Hotoro, and other primary areas within Kano City.'
  },
  {
    id: 'faq-5',
    category: 'pricing',
    question: 'How do payments work?',
    answer: 'We accept secure online card payments (powered by our upcoming Stripe integration) or Cash on Delivery when our rider hands back your clean laundry.'
  }
];

// Blog posts
export const BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: '5 Crucial Secrets to Extend the Lifetime of Your Agbada',
    excerpt: 'Traditional fabrics require meticulous handling. Learn how to prevent color bleeding and keep fibers strong.',
    content: `Traditional attire is more than just clothing; it represents cultural pride, legacy, and heavy investment. Agbadas, Babarigas, and richly embroidered lace garments are vulnerable to standard washing cycles.
    
    1. **Never Machine Wash Heavy Embroidery:** The metallic threads and beads can easily pull, shredding fine lace.
    2. **Avoid Harsh Industrial Detergents:** Opt for ph-neutral liquid soaps or leave them to professional solvent care.
    3. **Store with Care:** Heavy Agbadas should be folded flat inside breathable cotton bags rather than hung on thin plastic hangers which warp shoulders.
    4. **Handle Sweating Immediately:** Deodorants and sweat react with dye. Clean stained armpits promptly before dry sweat sets permanently.
    
    At ABNUR Laundry Services, we treat traditional attire as fine art. We hand-inspect, use delicate custom solvents, and hand-press to maintain immaculate shape.`,
    category: 'Attire Care',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    author: 'Ibrahim Usman',
    readTime: '4 min read',
    date: 'July 2, 2026'
  },
  {
    id: 'blog-2',
    title: 'Why Professional Dry Cleaning Beats Home Washing for Suits',
    excerpt: 'Find out why putting your wool blazers in standard washing machines destroys their structural integrity.',
    content: `Many suit owners make the mistake of attempting to wash wool suits, coats, or designer blazers in standard household washing machines on a "gentle" cycle. 
    
    Here is why that destroys the suit's inner canvasing:
    
    * **Inner Canvas Shrinkage:** High-quality blazers contain canvas interlinings made of horsehair or wool. When wet, this interlining shrinks unevenly, causing permanent bubbling on the suit chest.
    * **Water Temperature Shock:** Wet wool loses half of its tensile strength, rendering it highly prone to shape distortion.
    * **Lack of Tension-Pressing:** Household steam irons cannot replicate the high-pressure tension tables used by professionals to reshape blazer shoulders and lapels.
    
    Leaving your business wear to ABNUR Laundry Services guarantees deep cleaning without structural risk.`,
    category: 'Pro Tips',
    image: 'https://images.unsplash.com/photo-1489274495757-95c7c837b101?auto=format&fit=crop&w=800&q=80',
    author: 'Laundry Specialist',
    readTime: '3 min read',
    date: 'June 28, 2026'
  }
];

// Testimonials
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Alhaji Bashir Gwarzo',
    role: 'Business Owner',
    content: 'ABNUR Laundry is unmatched in Kano. They pick up my Babariga garments from Gwarzo Road and deliver them in crisp, perfect, royal condition every single week.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 't-2',
    name: 'Fatima Yar’Adua',
    role: 'Corporate Executive',
    content: 'The tracking system is wonderful! I can watch my laundry dispatch rider move in real time. Very dependable, highly recommended.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  }
];

// Local Storage Keys
const USERS_KEY = 'abnur_users';
const ORDERS_KEY = 'abnur_orders';
const LOGGED_IN_USER_KEY = 'abnur_logged_in';

// Initial Users
const DEFAULT_USERS: User[] = [
  {
    id: 'usr-admin',
    name: 'Ibrahim Usman',
    email: 'ibrahimaliyuusman89@gmail.com',
    phone: '+234 814 311 4440',
    address: 'No. 25 Gwarzo Road, Kano, Nigeria',
    role: 'admin',
    createdAt: '2026-06-01T12:00:00Z'
  },
  {
    id: 'usr-customer-1',
    name: 'Aisha Bello',
    email: 'customer@gmail.com',
    phone: '+234 803 123 4567',
    address: 'Nassarawa GRA, Kano',
    role: 'customer',
    createdAt: '2026-06-15T12:00:00Z'
  }
];

// Initial Orders
const DEFAULT_ORDERS: Order[] = [
  {
    id: 'ABN-9843-K',
    userId: 'usr-customer-1',
    customerName: 'Aisha Bello',
    customerPhone: '+234 803 123 4567',
    customerEmail: 'customer@gmail.com',
    pickupAddress: 'Nassarawa GRA, Kano',
    pickupDate: '2026-07-04',
    pickupTimeSlot: '10:00 AM - 12:00 PM',
    deliveryDate: '2026-07-06',
    deliveryTimeSlot: '02:00 PM - 04:00 PM',
    serviceCategory: 'dry-cleaning',
    items: [
      { serviceId: 'dry-cleaning-gown', name: 'Traditional Gowns & Agbada', quantity: 1, price: 6000 }
    ],
    totalAmount: 6000,
    paymentStatus: 'paid_stripe',
    paymentMethod: 'card',
    status: 'processing',
    statusHistory: [
      { status: 'pending', timestamp: '2026-07-04T08:30:00Z', note: 'Order submitted by customer' },
      { status: 'pickup_scheduled', timestamp: '2026-07-04T09:00:00Z', note: 'Dispatch rider assigned' },
      { status: 'picked_up', timestamp: '2026-07-04T10:15:00Z', note: 'Items gathered, transit sealed' },
      { status: 'processing', timestamp: '2026-07-04T11:00:00Z', note: 'Garments sorted and dry-cleaned' }
    ],
    createdAt: '2026-07-04T08:30:00Z',
    trackingCoordinates: { lat: 11.9863, lng: 8.4843 }
  },
  {
    id: 'ABN-1049-K',
    userId: 'usr-customer-1',
    customerName: 'Aisha Bello',
    customerPhone: '+234 803 123 4567',
    customerEmail: 'customer@gmail.com',
    pickupAddress: 'Nassarawa GRA, Kano',
    pickupDate: '2026-07-02',
    pickupTimeSlot: '02:00 PM - 04:00 PM',
    deliveryDate: '2026-07-03',
    deliveryTimeSlot: '12:00 PM - 02:00 PM',
    serviceCategory: 'laundry',
    items: [
      { serviceId: 'laundry-wash-dry', name: 'Wash & Fold Laundry', quantity: 5, price: 850 }
    ],
    totalAmount: 4250,
    paymentStatus: 'unpaid',
    paymentMethod: 'cash',
    status: 'delivered',
    statusHistory: [
      { status: 'pending', timestamp: '2026-07-02T14:10:00Z', note: 'Order placed' },
      { status: 'picked_up', timestamp: '2026-07-02T14:40:00Z', note: 'Rider picked up clothes' },
      { status: 'processing', timestamp: '2026-07-02T16:00:00Z', note: 'Under processing' },
      { status: 'ready', timestamp: '2026-07-03T09:00:00Z', note: 'Freshly folded' },
      { status: 'delivered', timestamp: '2026-07-03T13:30:00Z', note: 'Delivered at destination address' }
    ],
    createdAt: '2026-07-02T14:10:00Z',
    trackingCoordinates: { lat: 11.9833, lng: 8.4833 }
  }
];

// Database Utilities
export const db = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    if (!data) {
      localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return JSON.parse(data);
  },

  saveUser: (user: User) => {
    const users = db.getUsers();
    const updated = [...users.filter(u => u.id !== user.id), user];
    localStorage.setItem(USERS_KEY, JSON.stringify(updated));
  },

  getOrders: (): Order[] => {
    const data = localStorage.getItem(ORDERS_KEY);
    if (!data) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(DEFAULT_ORDERS));
      return DEFAULT_ORDERS;
    }
    return JSON.parse(data);
  },

  saveOrder: (order: Order) => {
    const orders = db.getOrders();
    const updated = [...orders.filter(o => o.id !== order.id), order];
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  },

  deleteOrder: (orderId: string) => {
    const orders = db.getOrders();
    const updated = orders.filter(o => o.id !== orderId);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  },

  getLoggedInUser: (): User | null => {
    const data = localStorage.getItem(LOGGED_IN_USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  setLoggedInUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOGGED_IN_USER_KEY);
    }
  }
};
