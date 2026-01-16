
import React, { useState, useMemo } from 'react';
import { MOCK_PRODUCTS } from '../constants.tsx';
import { Category } from '../types';
import { useApp } from '../store/AppContext';

interface SearchResultsProps {
  query: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ query }) => {
  const { state, dispatch } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [priceRange, setPriceRange] = useState<number>(500);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    return MOCK_PRODUCTS.filter(product => {
      const name = product.name.toLowerCase();
      const category = product.category.toLowerCase();
      const desc = product.description.toLowerCase();
      
      const nameWords = name.split(' ');
      const queryWords = q.split(' ');
      
      const isSearchMatch = name.includes(q) || 
                            category.includes(q) ||
                            desc.includes(q) ||
                            queryWords.every(qw => nameWords.some(nw => nw.startsWith(qw)));

      const isCategoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
      const isPriceMatch = product.price <= priceRange;

      return isSearchMatch && isCategoryMatch && isPriceMatch;
    }).sort((a, b) => {
      if (sortBy === 'low') return a.price - b.price;
      if (sortBy === 'high') return b.price - a.price;
      // Default: relevance (by name match depth or featured status)
      if (sortBy === 'relevance') {
          if (a.name.toLowerCase().startsWith(q) && !b.name.toLowerCase().startsWith(q)) return -1;
          if (!a.name.toLowerCase().startsWith(q) && b.name.toLowerCase().startsWith(q)) return 1;
      }
      return 0;
    });
  }, [query, selectedCategory, priceRange, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900">
          Search Results <span className="text-blue-600">for "{query}"</span>
        </h1>
        <p className="text-slate-500 mt-2 font-medium">Found {results.length} matching products</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 space-y-8">
          <div>
            <h3 className="text-lg font-bold mb-4 text-slate-800">Filter by Category</h3>
            <div className="space-y-2">
              <button 
                onClick={() => setSelectedCategory('All')}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === 'All' ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-600'}`}
              >
                All Categories
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
            <h3 className="text-lg font-bold mb-4 text-slate-800">Max Price</h3>
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
              <span className="font-bold text-blue-600">${priceRange}</span>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="flex justify-end mb-8">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-400 font-medium">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="relevance">Relevance</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {results.map(product => (
                <div key={product.id} className="bg-white rounded-[2rem] border border-slate-100 p-4 hover:shadow-2xl transition-all group overflow-hidden">
                  <div className="relative aspect-square rounded-[1.5rem] overflow-hidden bg-slate-50 mb-6">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <button 
                      onClick={() => dispatch({ type: 'TOGGLE_WISHLIST', payload: product.id })}
                      className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-md backdrop-blur-md ${state.wishlist.includes(product.id) ? 'bg-red-500 text-white' : 'bg-white/80 text-slate-400 hover:text-red-500'}`}
                    >
                      <i className={`fa-${state.wishlist.includes(product.id) ? 'solid' : 'regular'} fa-heart`}></i>
                    </button>
                    {product.isNew && (
                      <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                        New
                      </div>
                    )}
                  </div>
                  <div className="px-2">
                    <h3 className="font-bold text-lg text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                    <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">{product.category}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-2xl font-black text-slate-900">${product.price}</span>
                        {product.oldPrice && <span className="text-sm text-slate-300 line-through font-medium">${product.oldPrice}</span>}
                      </div>
                      <button 
                        onClick={() => dispatch({ type: 'ADD_TO_CART', payload: product })}
                        className="bg-slate-900 text-white w-12 h-12 rounded-2xl hover:bg-blue-600 hover:-translate-y-1 transition-all flex items-center justify-center shadow-lg"
                      >
                        <i className="fa-solid fa-plus text-lg"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fa-solid fa-magnifying-glass text-4xl text-slate-200"></i>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">No results found</h2>
              <p className="text-slate-400 max-w-xs mx-auto">We couldn't find any products matching your search. Try different keywords or browse our categories.</p>
              <button 
                onClick={() => setSelectedCategory('All')}
                className="mt-8 text-blue-600 font-bold hover:underline"
              >
                View all products
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchResults;
