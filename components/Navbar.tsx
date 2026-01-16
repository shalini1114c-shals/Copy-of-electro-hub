
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { MOCK_PRODUCTS } from '../constants.tsx';
import { Product } from '../types';

const Navbar: React.FC<{ onNavigate: (page: string, params?: any) => void; onOpenAuth: () => void }> = ({ onNavigate, onOpenAuth }) => {
  const { state, dispatch } = useApp();
  const cartCount = state.cart.reduce((acc, item) => acc + item.quantity, 0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Simple Fuzzy Matching Logic
  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const query = searchTerm.toLowerCase();
    const filtered = MOCK_PRODUCTS.filter(product => {
      const name = product.name.toLowerCase();
      const category = product.category.toLowerCase();
      
      const nameWords = name.split(' ');
      const queryWords = query.split(' ');
      
      const isMatch = name.includes(query) || 
                      category.includes(query) ||
                      queryWords.every(q => nameWords.some(n => n.startsWith(q)));
      
      return isMatch;
    }).slice(0, 5);

    setSuggestions(filtered);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (product: Product) => {
    setSearchTerm('');
    setIsSearchOpen(false);
    onNavigate('search-results', { query: product.name });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsSearchOpen(false);
      onNavigate('search-results', { query: searchTerm });
    }
  };

  const handleUserClick = () => {
    if (state.user) {
      setIsUserMenuOpen(!isUserMenuOpen);
    } else {
      onOpenAuth();
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex-shrink-0 flex items-center cursor-pointer group"
            onClick={() => onNavigate('home')}
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white mr-2 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-bolt-lightning text-xl"></i>
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">Electro<span className="text-blue-600">Hub</span></span>
          </div>

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex space-x-8 items-center">
            {['Shop', 'Services', 'About', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => onNavigate(item.toLowerCase())}
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-5">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2 transition-colors ${isSearchOpen ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
            
            {/* User Icon & Menu */}
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={handleUserClick}
                className={`p-2 transition-colors flex items-center space-x-1 ${state.user ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
              >
                <i className={`${state.user ? 'fa-solid' : 'fa-regular'} fa-user text-lg`}></i>
                {state.user && <i className="fa-solid fa-chevron-down text-[10px] opacity-50"></i>}
              </button>

              {isUserMenuOpen && state.user && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 animate-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-slate-50">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Signed in as</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{state.user.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{state.user.email}</p>
                  </div>
                  <div className="py-2">
                    <button onClick={() => { setIsUserMenuOpen(false); onNavigate('dashboard'); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center space-x-3">
                      <i className="fa-solid fa-chart-line text-slate-400"></i>
                      <span>My Dashboard</span>
                    </button>
                    {state.user.role === 'admin' && (
                      <button onClick={() => { setIsUserMenuOpen(false); onNavigate('admin'); }} className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors flex items-center space-x-3">
                        <i className="fa-solid fa-shield-halved"></i>
                        <span className="font-bold">Admin Console</span>
                      </button>
                    )}
                    <button onClick={() => { setIsUserMenuOpen(false); dispatch({ type: 'LOGOUT' }); }} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center space-x-3">
                      <i className="fa-solid fa-right-from-bracket"></i>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => onNavigate('cart')}
              className="relative p-2 text-slate-500 hover:text-blue-600 transition-colors"
            >
              <i className="fa-solid fa-cart-shopping text-lg"></i>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-blue-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Search Overlay */}
      {isSearchOpen && (
        <div ref={searchRef} className="absolute top-16 left-0 w-full bg-white shadow-2xl border-b border-slate-100 animate-in slide-in-from-top duration-300">
          <div className="max-w-3xl mx-auto p-4">
            <form onSubmit={handleSearchSubmit} className="flex items-center space-x-3 bg-slate-100 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <i className="fa-solid fa-magnifying-glass text-slate-400"></i>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search accessories, tech, chargers..."
                className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 font-medium"
                autoFocus
              />
              {searchTerm && (
                <button type="button" onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-slate-600">
                  <i className="fa-solid fa-circle-xmark"></i>
                </button>
              )}
            </form>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="mt-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Suggestions</p>
                <div className="divide-y divide-slate-50">
                  {suggestions.map(product => (
                    <button 
                      key={product.id}
                      onClick={() => handleSuggestionClick(product)}
                      className="w-full flex items-center p-2 hover:bg-slate-50 rounded-xl transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden mr-4">
                        <img src={product.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{product.name}</p>
                        <p className="text-xs text-slate-400">{product.category}</p>
                      </div>
                      <div className="text-sm font-black text-slate-900">${product.price}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {searchTerm.length >= 2 && suggestions.length === 0 && (
              <div className="mt-4 p-8 text-center">
                <i className="fa-solid fa-face-frown text-3xl text-slate-200 mb-2"></i>
                <p className="text-slate-400 text-sm font-medium">No results found for "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
