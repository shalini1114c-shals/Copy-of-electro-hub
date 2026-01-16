
import React, { useState } from 'react';
import { MOCK_PRODUCTS } from '../constants.tsx';
import { Category, Product } from '../types';
import { useApp } from '../store/AppContext';

const Shop: React.FC = () => {
  const { state, dispatch } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [priceRange, setPriceRange] = useState<number>(300);

  const filtered = MOCK_PRODUCTS.filter(p => {
    const catMatch = selectedCategory === 'All' || p.category === selectedCategory;
    const priceMatch = p.price <= priceRange;
    return catMatch && priceMatch;
  }).sort((a, b) => {
    if (sortBy === 'low') return a.price - b.price;
    if (sortBy === 'high') return b.price - a.price;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 space-y-8">
          <div>
            <h3 className="text-lg font-bold mb-4 text-slate-800">Categories</h3>
            <div className="space-y-2">
              <button 
                onClick={() => setSelectedCategory('All')}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === 'All' ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-600'}`}
              >
                All Products
              </button>
              {Object.values(Category).map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-600'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-slate-800">Price Range</h3>
            <input 
              type="range" 
              min="0" 
              max="500" 
              step="10"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>$0</span>
              <span className="font-bold text-blue-600">Up to ${priceRange}</span>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <p className="text-slate-500 font-medium">Showing {filtered.length} products</p>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-400">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="featured">Featured</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(product => (
                <div key={product.id} className="bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-xl transition-all group">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 mb-4">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    <button 
                      onClick={() => dispatch({ type: 'TOGGLE_WISHLIST', payload: product.id })}
                      className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${state.wishlist.includes(product.id) ? 'bg-red-50 text-red-500' : 'bg-white text-slate-400'}`}
                    >
                      <i className={`fa-${state.wishlist.includes(product.id) ? 'solid' : 'regular'} fa-heart`}></i>
                    </button>
                  </div>
                  <h3 className="font-bold text-slate-800 line-clamp-1">{product.name}</h3>
                  <p className="text-xs text-slate-400 mb-2">{product.category}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-black text-blue-600">${product.price}</span>
                    <button 
                      onClick={() => dispatch({ type: 'ADD_TO_CART', payload: product })}
                      className="bg-slate-900 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <i className="fa-solid fa-plus"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <i className="fa-solid fa-magnifying-glass text-4xl text-slate-200 mb-4"></i>
              <p className="text-slate-500">No products found matching your filters.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
