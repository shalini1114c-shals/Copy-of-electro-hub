
import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './store/AppContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import AdminDashboard from './pages/AdminDashboard';
import ChatBot from './components/ChatBot';
import SearchResults from './pages/SearchResults';
import AuthModal from './components/AuthModal';
import Checkout from './pages/Checkout';
import Invoice from './pages/Invoice';

const StaticPage: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="max-w-4xl mx-auto px-4 py-20">
    <h1 className="text-4xl font-black mb-8 text-slate-900">{title}</h1>
    <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
      {children}
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const { state } = useApp();
  const [currentPage, setCurrentPage] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleNavigate = (page: string, params?: any) => {
    // Protected Routes Check
    if (page === 'admin' && state.user?.role !== 'admin') {
      setIsAuthModalOpen(true);
      return;
    }
    if ((page === 'dashboard' || page === 'checkout') && !state.user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (page === 'search-results' && params?.query !== undefined) {
      setSearchQuery(params.query);
    }
    
    if (page === 'order-success' && params?.orderId) {
      setActiveOrderId(params.orderId);
    }

    if (page === 'invoice' && params?.orderId) {
        setActiveOrderId(params.orderId);
    }

    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'shop':
        return <Shop />;
      case 'cart':
        return <Cart onNavigate={handleNavigate} />;
      case 'checkout':
        return <Checkout onNavigate={handleNavigate} />;
      case 'order-success':
        return (
          <div className="max-w-xl mx-auto py-20 text-center px-4">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in duration-500">
              <i className="fa-solid fa-check-circle text-6xl text-emerald-500"></i>
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-4">Order Confirmed!</h1>
            <p className="text-slate-500 mb-10 leading-relaxed">
              Your tech is on the way! We've sent a confirmation email to <span className="font-bold text-slate-900">{state.user?.email}</span>.
              Order ID: <span className="font-bold text-blue-600">#{activeOrderId}</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => handleNavigate('invoice', { orderId: activeOrderId })}
                className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center space-x-2"
              >
                <i className="fa-solid fa-file-invoice"></i>
                <span>View Invoice</span>
              </button>
              <button 
                onClick={() => handleNavigate('home')}
                className="px-8 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all"
              >
                Back to Home
              </button>
            </div>
          </div>
        );
      case 'invoice':
        const orderToView = state.orders.find(o => o.id === activeOrderId);
        return orderToView ? (
          <Invoice order={orderToView} onBack={() => handleNavigate('dashboard')} />
        ) : <Home onNavigate={handleNavigate} />;
      case 'admin':
        return state.user?.role === 'admin' ? <AdminDashboard /> : <Home onNavigate={handleNavigate} />;
      case 'dashboard':
        return (
          <StaticPage title="User Dashboard">
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Account Overview</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-black rounded-full uppercase">Verified User</span>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-3xl text-slate-400">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900">{state.user?.name}</p>
                    <p className="text-slate-400 font-medium">{state.user?.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                <h3 className="text-xl font-bold mb-6">Order History</h3>
                {state.orders.length > 0 ? (
                  <div className="space-y-4">
                    {state.orders.map(order => (
                      <div key={order.id} className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                        <div className="flex items-center space-x-4 mb-4 md:mb-0">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                            <i className="fa-solid fa-box"></i>
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">Order #{order.id}</p>
                            <p className="text-xs text-slate-400">{new Date(order.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-12">
                          <div className="text-center">
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Total</p>
                            <p className="font-black text-slate-900">${order.total.toFixed(2)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Status</p>
                            <span className="px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-black rounded-lg uppercase">{order.status}</span>
                          </div>
                          <button 
                            onClick={() => handleNavigate('invoice', { orderId: order.id })}
                            className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all text-blue-600"
                            title="View Invoice"
                          >
                            <i className="fa-solid fa-file-invoice"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-slate-400">No orders placed yet.</p>
                  </div>
                )}
              </div>
            </div>
          </StaticPage>
        );
      case 'search-results':
        return <SearchResults query={searchQuery} />;
      case 'services':
        return (
          <StaticPage title="Tech Services">
            <p>Our certified technicians provide professional repair and customization services for all your electronic devices.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <i className="fa-solid fa-mobile-screen text-blue-600 text-2xl mb-4"></i>
                <h3 className="font-bold text-lg mb-2">Mobile Repairs</h3>
                <p className="text-sm">Screen replacement, battery upgrades, and software fixes.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <i className="fa-solid fa-laptop text-blue-600 text-2xl mb-4"></i>
                <h3 className="font-bold text-lg mb-2">Laptop Maintenance</h3>
                <p className="text-sm">Internal cleaning, thermal paste re-application, and hardware upgrades.</p>
              </div>
            </div>
          </StaticPage>
        );
      case 'about':
        return (
          <StaticPage title="Our Story">
            <p className="text-lg font-medium text-slate-800">ElectroHub was founded on a simple principle: high-quality tech shouldn't be a luxury.</p>
            <p>Since 2018, we have been scouting the most innovative accessory manufacturers to bring you gear that actually makes your life better. Whether you are a professional gamer or a remote worker, our accessories are designed to withstand the rigors of modern digital life.</p>
            <h3 className="text-2xl font-bold mt-10 text-slate-900">Our Mission</h3>
            <p>To empower digital citizens with durable, efficient, and aesthetically pleasing electronic accessories that enhance productivity and entertainment.</p>
          </StaticPage>
        );
      case 'track-order':
        return (
          <StaticPage title="Track Your Order">
            <div className="max-w-md bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Order ID</label>
                  <input type="text" placeholder="e.g. #EH-12345" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                  <input type="email" placeholder="email@example.com" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
                  Track Status
                </button>
              </div>
            </div>
          </StaticPage>
        );
      case 'warranty':
        return (
          <StaticPage title="Warranty Policy">
            <h3 className="text-xl font-bold text-slate-900">1-Year Limited Warranty</h3>
            <p>Most ElectroHub products come with a standard 1-year limited warranty from the date of purchase. This covers manufacturing defects and hardware failures under normal use conditions.</p>
            <h3 className="text-xl font-bold text-slate-900 mt-6">What's Covered?</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Internal component failure</li>
              <li>Connectivity issues (Bluetooth/Wi-Fi)</li>
              <li>Power delivery inconsistencies</li>
              <li>Manufacturing finish defects</li>
            </ul>
          </StaticPage>
        );
      case 'help':
        return (
          <StaticPage title="Help Center">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-lg mb-2">How do I return an item?</h3>
                <p className="text-sm">You can initiate a return through your dashboard within 30 days of delivery. See our Returns policy for more details.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-lg mb-2">Shipping Times</h3>
                <p className="text-sm">Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business day delivery.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-lg mb-2">Payment Methods</h3>
                <p className="text-sm">We accept all major credit cards, Apple Pay, Google Pay, and PayPal.</p>
              </div>
            </div>
          </StaticPage>
        );
      case 'contact':
        return (
          <StaticPage title="Contact Us">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <p>Have a question or need support? Our team is here to help you 24/7.</p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <i className="fa-solid fa-envelope"></i>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Email Us</p>
                    <p className="font-bold text-slate-800">support@electrohub.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <i className="fa-solid fa-phone"></i>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Call Us</p>
                    <p className="font-bold text-slate-800">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl space-y-4">
                <input type="text" placeholder="Your Name" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                <input type="email" placeholder="Your Email" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                <textarea rows={4} placeholder="How can we help?" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
                <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
                  Send Message
                </button>
              </div>
            </div>
          </StaticPage>
        );
      case 'returns':
        return (
          <StaticPage title="Returns & Refunds">
            <p>We want you to be 100% satisfied with your purchase. If you're not, you can return your item within 30 days of delivery.</p>
            <h3 className="text-xl font-bold text-slate-900 mt-6">Return Conditions</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Items must be in original packaging</li>
              <li>Must include all original accessories and manuals</li>
              <li>Proof of purchase is required</li>
            </ul>
          </StaticPage>
        );
      case 'privacy':
        return (
          <StaticPage title="Privacy Policy">
            <p>At ElectroHub, we take your privacy seriously. This policy describes how we collect, use, and handle your personal information.</p>
            <h3 className="text-xl font-bold text-slate-900 mt-6">Information We Collect</h3>
            <p>We collect information you provide directly to us when you create an account, make a purchase, or contact our support team. This includes your name, email, shipping address, and payment information.</p>
            <h3 className="text-xl font-bold text-slate-900 mt-6">How We Use Your Data</h3>
            <p>Your data is used solely to process orders, improve our services, and communicate with you about your account or purchases. We do not sell your personal data to third parties.</p>
          </StaticPage>
        );
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onNavigate={handleNavigate} onOpenAuth={() => setIsAuthModalOpen(true)} />
      
      <main className="flex-1">
        {renderPage()}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-16 print:hidden">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleNavigate('home')}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <i className="fa-solid fa-bolt-lightning"></i>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">ElectroHub</span>
            </div>
            <p className="text-sm leading-relaxed">
              Premium electronic accessories for those who demand performance, quality, and style.
            </p>
            <div className="flex space-x-4">
              {['facebook', 'twitter', 'instagram', 'youtube'].map(social => (
                <a key={social} href="#" className="hover:text-blue-500 transition-colors">
                  <i className={`fa-brands fa-${social} text-lg`}></i>
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li><button onClick={() => handleNavigate('shop')} className="hover:text-blue-500">All Products</button></li>
              <li><button onClick={() => handleNavigate('services')} className="hover:text-blue-500">Tech Services</button></li>
              <li><button onClick={() => handleNavigate('track-order')} className="hover:text-blue-500">Track Order</button></li>
              <li><button onClick={() => handleNavigate('warranty')} className="hover:text-blue-500">Warranty Policy</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-sm">
              <li><button onClick={() => handleNavigate('help')} className="hover:text-blue-500">Help Center</button></li>
              <li><button onClick={() => handleNavigate('contact')} className="hover:text-blue-500">Contact Us</button></li>
              <li><button onClick={() => handleNavigate('returns')} className="hover:text-blue-500">Returns & Refunds</button></li>
              <li><button onClick={() => handleNavigate('privacy')} className="hover:text-blue-500">Privacy Policy</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Newsletter</h4>
            <p className="text-sm mb-4">Subscribe to get special offers and first look at new arrivals.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Email address"
                className="bg-slate-800 border-none rounded-l-lg px-4 py-2 w-full focus:ring-1 focus:ring-blue-500 text-sm outline-none"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-slate-800 text-center text-xs">
          © 2024 ElectroHub Inc. All rights reserved. Built for the future of tech.
        </div>
      </footer>

      <ChatBot />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
