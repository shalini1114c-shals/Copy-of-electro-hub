
import { Category, Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'NitroCharge 65W GaN Charger',
    category: Category.MOBILE,
    price: 49.99,
    oldPrice: 59.99,
    rating: 4.8,
    reviews: 124,
    image: 'https://picsum.photos/seed/charger1/600/600',
    description: 'High-speed 65W GaN charger with dual USB-C ports. Compact design for travel.',
    specs: { 'Power': '65W', 'Port': '2x USB-C', 'Tech': 'GaN III' },
    stock: 50,
    isFeatured: true,
    isNew: true
  },
  {
    id: '2',
    name: 'SonicWave X7 Hybrid ANC',
    category: Category.AUDIO,
    price: 129.99,
    rating: 4.9,
    reviews: 88,
    image: 'https://picsum.photos/seed/audio1/600/600',
    description: 'Premium noise-cancelling headphones with 40-hour battery life.',
    specs: { 'Battery': '40h', 'Driver': '40mm', 'Weight': '250g' },
    stock: 15,
    isFeatured: true
  },
  {
    id: '3',
    name: 'Titan Gaming Mouse G50',
    category: Category.GAMING,
    price: 79.99,
    oldPrice: 99.99,
    rating: 4.7,
    reviews: 210,
    image: 'https://picsum.photos/seed/gaming1/600/600',
    description: 'Ultra-lightweight gaming mouse with customizable RGB and 25k DPI sensor.',
    specs: { 'DPI': '25,600', 'Switches': 'Optical', 'Weight': '63g' },
    stock: 32,
    isFeatured: true
  },
  {
    id: '4',
    name: 'PixelTrack Watch S2',
    category: Category.SMART,
    price: 199.99,
    rating: 4.5,
    reviews: 56,
    image: 'https://picsum.photos/seed/smart1/600/600',
    description: 'Advanced fitness tracker with heart rate, SpO2, and GPS monitoring.',
    specs: { 'Display': '1.4" AMOLED', 'Battery': '10 days', 'Waterproof': '5 ATM' },
    stock: 12
  },
  {
    id: '5',
    name: 'USB-C Hybrid Hub Pro',
    category: Category.COMPUTER,
    price: 64.99,
    rating: 4.6,
    reviews: 42,
    image: 'https://picsum.photos/seed/hub1/600/600',
    description: '10-in-1 USB-C hub with HDMI, Ethernet, and SD card slots.',
    specs: { 'Output': 'HDMI 4K@60Hz', 'Power Delivery': '100W' },
    stock: 85
  },
  {
    id: '6',
    name: 'UltraCore Braided Cable 2m',
    category: Category.MOBILE,
    price: 14.99,
    oldPrice: 19.99,
    rating: 4.8,
    reviews: 320,
    image: 'https://picsum.photos/seed/cable1/600/600',
    description: 'Military-grade braided USB-C cable for fast charging and data sync.',
    specs: { 'Length': '2m', 'Max Current': '5A' },
    stock: 150
  }
];

export const CATEGORY_ICONS: Record<Category, string> = {
  [Category.MOBILE]: 'fa-mobile-screen-button',
  [Category.AUDIO]: 'fa-headphones',
  [Category.SMART]: 'fa-clock',
  [Category.COMPUTER]: 'fa-laptop',
  [Category.GAMING]: 'fa-gamepad',
  [Category.SERVICES]: 'fa-screwdriver-wrench'
};
