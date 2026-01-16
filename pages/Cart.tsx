
import React from 'react';
import { useApp } from '../store/AppContext';

const Cart: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { state, dispatch } = useApp();
  const subtotal = state.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (state.cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center px-4">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fa-solid fa-cart-shopping text-4xl text-blue-600"></i>
        </div>
        <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-slate-500 mb-8">Looks like you haven't added anything to your cart yet. Explore our latest tech!</p>
        <button 
          onClick={() => onNavigate('shop')}
          className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black mb-10 text-slate-900">Your <span className="text-blue-600">Shopping Bag</span></h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Items List */}
        <div className="flex-1 space-y-6">
          {state.cart.map(item => (
            <div key={item.id} className="flex items-center space-x-6 bg-white p-6 rounded-3xl border border-slate-100">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-2xl bg-slate-50" />
              <div className="flex-1">
                <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
                <p className="text-sm text-slate-400 mb-4">{item.category}</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                    <button 
                      onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: item.quantity - 1 } })}
                      className="px-3 py-1 bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <i className="fa-solid fa-minus text-xs"></i>
                    </button>
                    <span className="px-4 font-bold text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: item.quantity + 1 } })}
                      className="px-3 py-1 bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <i className="fa-solid fa-plus text-xs"></i>
                    </button>
                  </div>
                  <button 
                    onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item.id })}
                    className="text-red-500 hover:text-red-600 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-xl font-black text-slate-900">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <aside className="w-full lg:w-96">
          <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 space-y-6 sticky top-24 shadow-2xl">
            <h3 className="text-2xl font-bold">Order Summary</h3>
            
            <div className="space-y-4 border-b border-white/10 pb-6">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Est. Taxes (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between text-2xl font-black">
              <span>Total</span>
              <span className="text-blue-500">${total.toFixed(2)}</span>
            </div>

            <div className="space-y-4 pt-4">
              <button 
                onClick={() => onNavigate('checkout')}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
              <button 
                onClick={() => onNavigate('shop')}
                className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-2xl transition-all border border-white/10"
              >
                Continue Shopping
              </button>
            </div>

            <div className="flex justify-center space-x-4 opacity-50 pt-4">
              <i className="fa-brands fa-cc-visa text-2xl"></i>
              <i className="fa-brands fa-cc-mastercard text-2xl"></i>
              <i className="fa-brands fa-cc-apple-pay text-2xl"></i>
              <i className="fa-brands fa-cc-paypal text-2xl"></i>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
