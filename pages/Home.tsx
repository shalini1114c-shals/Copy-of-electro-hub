
import React from 'react';
import { MOCK_PRODUCTS, CATEGORY_ICONS } from '../constants.tsx';
import { Category } from '../types';
import { useApp } from '../store/AppContext';

const Home: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { dispatch } = useApp();
  const featured = MOCK_PRODUCTS.filter(p => p.isFeatured);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://picsum.photos/seed/techhero/1920/1080" 
            alt="Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="max-w-xl text-white space-y-6">
            <span className="inline-block px-4 py-1 bg-blue-600 text-xs font-bold uppercase tracking-widest rounded-full">
              New Arrival
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
              Next-Gen <br/> <span className="text-blue-500">Tech Gears.</span>
            </h1>
            <p className="text-lg text-slate-300">
              Upgrade your setup with premium accessories designed for power users and gamers alike.
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={() => onNavigate('shop')}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-lg"
              >
                Shop Now
              </button>
              <button 
                onClick={() => onNavigate('services')}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold rounded-lg transition-all border border-white/30"
              >
                Our Services
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Icons */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.values(Category).map((cat) => (
            <div 
              key={cat}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group text-center"
              onClick={() => onNavigate('shop')}
            >
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-50 transition-colors">
                <i className={`fa-solid ${CATEGORY_ICONS[cat]} text-2xl text-slate-400 group-hover:text-blue-600`}></i>
              </div>
              <h3 className="text-sm font-semibold text-slate-700">{cat}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Featured Picks</h2>
            <p className="text-slate-500">Handpicked gadgets for your digital lifestyle.</p>
          </div>
          <button onClick={() => onNavigate('shop')} className="text-blue-600 font-semibold hover:underline">
            View All <i className="fa-solid fa-arrow-right ml-2"></i>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map(product => (
            <div key={product.id} className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500">
              <div className="relative aspect-square overflow-hidden bg-slate-50">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {product.isNew && (
                  <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">NEW</div>
                )}
                <button 
                  onClick={() => dispatch({ type: 'TOGGLE_WISHLIST', payload: product.id })}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 shadow-sm"
                >
                  <i className="fa-regular fa-heart"></i>
                </button>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{product.name}</h3>
                  <div className="text-xl font-black text-blue-600">${product.price}</div>
                </div>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={`fa-solid fa-star text-xs ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-slate-200'}`}></i>
                  ))}
                  <span className="text-xs text-slate-400 ml-2">({product.reviews})</span>
                </div>
                <button 
                  onClick={() => dispatch({ type: 'ADD_TO_CART', payload: product })}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors flex items-center justify-center space-x-2"
                >
                  <i className="fa-solid fa-cart-plus"></i>
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Banner */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-slate-900 rounded-[3rem] p-12 relative overflow-hidden flex flex-col md:flex-row items-center">
          <div className="relative z-10 md:w-1/2 space-y-6 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black text-white">Save <span className="text-blue-500">20%</span> on Repairs</h2>
            <p className="text-slate-400">Professional maintenance for your mobile, laptops and gaming consoles. Certified technicians only.</p>
            <button 
              onClick={() => onNavigate('services')}
              className="px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-blue-50 transition-colors"
            >
              Book a Service
            </button>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
            <img src="https://picsum.photos/seed/repair/500/300" alt="Repair Service" className="rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
