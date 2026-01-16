
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Address, Order } from '../types';

const Checkout: React.FC<{ onNavigate: (page: string, params?: any) => void }> = ({ onNavigate }) => {
  const { state, dispatch } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [shippingAddress, setShippingAddress] = useState<Address>({
    fullName: state.user?.name || '',
    email: state.user?.email || '',
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('card');

  const subtotal = state.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingCost = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Mock payment delay
    setTimeout(() => {
      const newOrder: Order = {
        id: `EH-${Math.floor(100000 + Math.random() * 900000)}`,
        items: [...state.cart],
        subtotal,
        tax,
        shipping: shippingCost,
        total,
        status: 'pending',
        date: new Date().toISOString(),
        customerName: shippingAddress.fullName,
        customerEmail: shippingAddress.email,
        shippingAddress: { ...shippingAddress },
        billingAddress: { ...shippingAddress }, // Assume same for simplicity
        paymentMethod
      };

      dispatch({ type: 'PLACE_ORDER', payload: newOrder });
      setIsProcessing(false);
      onNavigate('order-success', { orderId: newOrder.id });
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black mb-10 text-slate-900">Checkout</h1>
      
      <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-10">
          {/* Shipping Info */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm mr-3">1</span>
              Shipping Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                <input required type="text" value={shippingAddress.fullName} onChange={e => setShippingAddress({...shippingAddress, fullName: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                <input required type="email" value={shippingAddress.email} onChange={e => setShippingAddress({...shippingAddress, email: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Phone</label>
                <input required type="tel" value={shippingAddress.phone} onChange={e => setShippingAddress({...shippingAddress, phone: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+1 (555) 000-0000" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">Street Address</label>
                <input required type="text" value={shippingAddress.street} onChange={e => setShippingAddress({...shippingAddress, street: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="123 Tech Lane" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">City</label>
                <input required type="text" value={shippingAddress.city} onChange={e => setShippingAddress({...shippingAddress, city: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="San Francisco" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Zip / Postal Code</label>
                <input required type="text" value={shippingAddress.zip} onChange={e => setShippingAddress({...shippingAddress, zip: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="94103" />
              </div>
            </div>
          </section>

          {/* Payment Info */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm mr-3">2</span>
              Payment Method
            </h2>
            <div className="space-y-4">
              <label className={`flex items-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100'}`}>
                <input type="radio" className="hidden" name="payment" value="card" checked={paymentMethod === 'card'} onChange={e => setPaymentMethod(e.target.value)} />
                <i className="fa-solid fa-credit-card text-2xl text-slate-400 mr-4"></i>
                <div className="flex-1">
                  <p className="font-bold text-slate-800">Credit / Debit Card</p>
                  <p className="text-xs text-slate-500">Secure payment via Stripe</p>
                </div>
                {paymentMethod === 'card' && <i className="fa-solid fa-circle-check text-blue-600"></i>}
              </label>
              <label className={`flex items-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === 'paypal' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100'}`}>
                <input type="radio" className="hidden" name="payment" value="paypal" checked={paymentMethod === 'paypal'} onChange={e => setPaymentMethod(e.target.value)} />
                <i className="fa-brands fa-paypal text-2xl text-slate-400 mr-4"></i>
                <div className="flex-1">
                  <p className="font-bold text-slate-800">PayPal</p>
                  <p className="text-xs text-slate-500">Pay with your PayPal account</p>
                </div>
                {paymentMethod === 'paypal' && <i className="fa-solid fa-circle-check text-blue-600"></i>}
              </label>
            </div>

            {paymentMethod === 'card' && (
              <div className="mt-6 p-6 bg-slate-50 rounded-2xl space-y-4 animate-in slide-in-from-top-2">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1 tracking-widest">Card Number</label>
                  <div className="relative">
                    <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="0000 0000 0000 0000" />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex space-x-1">
                       <i className="fa-brands fa-cc-visa text-slate-300"></i>
                       <i className="fa-brands fa-cc-mastercard text-slate-300"></i>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1 tracking-widest">Expiry Date</label>
                    <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none" placeholder="MM/YY" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1 tracking-widest">CVV</label>
                    <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none" placeholder="123" />
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Order Summary Overlay */}
        <aside className="w-full lg:w-96">
          <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 space-y-6 sticky top-24 shadow-2xl">
            <h3 className="text-2xl font-bold">Review Order</h3>
            
            <div className="max-h-64 overflow-y-auto space-y-4 scrollbar-hide">
              {state.cart.map(item => (
                <div key={item.id} className="flex items-center space-x-3 text-sm">
                  <div className="relative">
                    <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <span className="absolute -top-2 -right-2 bg-blue-600 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">{item.quantity}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold line-clamp-1">{item.name}</p>
                    <p className="text-slate-400">${item.price}</p>
                  </div>
                  <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 border-t border-white/10 pt-6">
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Estimated Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between text-2xl font-black">
              <span>Total</span>
              <span className="text-blue-500">${total.toFixed(2)}</span>
            </div>

            <button 
              type="submit"
              disabled={isProcessing}
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-xl flex items-center justify-center space-x-3 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                  <span>Securing Payment...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-shield-check"></i>
                  <span>Complete Purchase</span>
                </>
              )}
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
};

export default Checkout;
