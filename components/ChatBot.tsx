
import React, { useState, useRef, useEffect } from 'react';
import { getShoppingAdvice } from '../services/geminiService';
import { MOCK_PRODUCTS } from '../constants.tsx';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string, sender: 'user' | 'bot' }[]>([
    { text: "Hi! I'm ElectroBot. How can I help you find the perfect tech today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    setIsLoading(true);

    const botResponse = await getShoppingAdvice(userMsg, MOCK_PRODUCTS);
    setMessages(prev => [...prev, { text: botResponse || '...', sender: 'bot' }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl w-80 md:w-96 flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in duration-200">
          <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <i className="fa-solid fa-robot"></i>
              <span className="font-semibold">ElectroBot AI</span>
            </div>
            <button onClick={() => setIsOpen(false)}><i className="fa-solid fa-xmark"></i></button>
          </div>
          
          <div ref={scrollRef} className="h-96 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                  m.sender === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-2 rounded-2xl text-sm border border-slate-100 italic text-slate-400">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-100 bg-white">
            <div className="flex space-x-2">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about compatibility..."
                className="flex-1 text-sm bg-slate-100 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300"
        >
          <i className="fa-solid fa-robot text-2xl"></i>
        </button>
      )}
    </div>
  );
};

export default ChatBot;
