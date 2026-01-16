
import React from 'react';
import { Order } from '../types';

interface InvoiceProps {
  order: Order;
  onClose?: () => void;
}

const Invoice: React.FC<InvoiceProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl max-w-4xl mx-auto border border-slate-100 print:shadow-none print:border-none">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <i className="fa-solid fa-bolt-lightning text-xl"></i>
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">Electro<span className="text-blue-600">Hub</span></span>
          </div>
          <p className="text-slate-400 text-sm">123 Technology Park, Silicon Valley, CA</p>
        </div>
        <div className="text-right">
          <h1 className="text-3xl font-black text-slate-900 uppercase">Invoice</h1>
          <p className="text-slate-500 font-bold">#{order.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div>
          <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4">Billed To</h4>
          <p className="font-bold text-slate-800">{order.billingAddress.fullName}</p>
          <p className="text-sm text-slate-500">{order.billingAddress.street}</p>
          <p className="text-sm text-slate-500">{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zip}</p>
          <p className="text-sm text-slate-500">{order.billingAddress.email}</p>
        </div>
        <div className="text-right">
          <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4">Order Details</h4>
          <p className="text-sm text-slate-500"><span className="font-bold text-slate-800">Date:</span> {new Date(order.date).toLocaleDateString()}</p>
          <p className="text-sm text-slate-500"><span className="font-bold text-slate-800">Payment:</span> {order.paymentMethod.toUpperCase()}</p>
          <p className="text-sm text-slate-500"><span className="font-bold text-slate-800">Status:</span> Paid</p>
        </div>
      </div>

      <table className="w-full mb-12">
        <thead>
          <tr className="border-b-2 border-slate-100 text-left">
            <th className="py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Item Description</th>
            <th className="py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Qty</th>
            <th className="py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Price</th>
            <th className="py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map(item => (
            <tr key={item.id} className="border-b border-slate-50">
              <td className="py-5">
                <p className="font-bold text-slate-800">{item.name}</p>
                <p className="text-xs text-slate-400">{item.category}</p>
              </td>
              <td className="py-5 text-center text-slate-600 font-medium">{item.quantity}</td>
              <td className="py-5 text-right text-slate-600">${item.price.toFixed(2)}</td>
              <td className="py-5 text-right font-bold text-slate-800">${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-full md:w-64 space-y-3">
          <div className="flex justify-between text-sm text-slate-500">
            <span>Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-500">
            <span>Shipping</span>
            <span>${order.shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-500">
            <span>Tax (8%)</span>
            <span>${order.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-2xl font-black text-slate-900 border-t border-slate-100 pt-4">
            <span>Total</span>
            <span className="text-blue-600">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-slate-50 text-center text-slate-400 text-xs flex flex-col items-center gap-4 print:hidden">
        <div className="flex space-x-4">
          <button 
            onClick={handlePrint}
            className="px-6 py-2 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-colors"
          >
            <i className="fa-solid fa-print mr-2"></i> Print Invoice
          </button>
          {onClose && (
            <button 
              onClick={onClose}
              className="px-6 py-2 border border-slate-200 text-slate-600 font-bold rounded-full hover:bg-slate-50 transition-colors"
            >
              Back to Dashboard
            </button>
          )}
        </div>
        <p>Thank you for shopping with ElectroHub! If you have any questions, contact us at support@electrohub.com</p>
      </div>
    </div>
  );
};

export default Invoice;
