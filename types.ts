
export enum Category {
  MOBILE = 'Mobile Accessories',
  AUDIO = 'Audio Devices',
  SMART = 'Smart Accessories',
  COMPUTER = 'Computer Accessories',
  GAMING = 'Gaming Accessories',
  SERVICES = 'Repair Services'
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  specs: Record<string, string>;
  stock: number;
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Address {
  fullName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  customerName: string;
  customerEmail: string;
  billingAddress: Address;
  shippingAddress: Address;
  paymentMethod: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  address?: Address;
}
