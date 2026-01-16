
import React from 'react';
import { Order } from '../types';

interface InvoiceProps {
  order: Order;
  onBack: () => void;
}

const Invoice: React.FC<InvoiceProps> = ({ order, onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 print:bg-white print:py-0 print:px-0">
      <div className="max-w-4xl mx-auto">
        {/* Navigation - Hidden on Print */}
        <div className="flex justify-between items-center mb-8 print:hidden">
          <button 
            onClick={onBack}
            className="flex items-center text-slate-500 hover:text-blue-600 font-bold transition-colors"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i>
            Back to Dashboard
          </button>
          <button 
            onClick={handlePrint}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:bg-blue-700 transition-all flex items-center"
          >
            <i className="fa-solid fa-print mr-2"></i>
            Print Invoice
          </button>
        </div>

        {/* Invoice Card */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden print:shadow-none print:border-none print:rounded-none">
          {/* Header */}
          <div className="bg-slate-900 p-10 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 print:bg-white print:text-slate-900 print:border-b print:border-slate-200 print:px-0">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white print:border print:border-blue-600">
                  <i className="fa-solid fa-bolt-lightning text-xl"></i>
                </div>
                <span className="text-2xl font-black tracking-tight">ElectroHub</span>
              </div>
              <p className="text-slate-400 text-sm print:text-slate-500">123 Tech Avenue, Suite 500</p>
              <p className="text-slate-400 text-sm print:text-slate-500">San Francisco, CA 94103</p>
              <p className="text-slate-400 text-sm print:text-slate-500">contact@electrohub.com</p>
            </div>
            <div className="text-right">
              <h1 className="text-4xl font-black uppercase tracking-tighter mb-1">Invoice</h1>
              <p className="text-blue-500 font-bold text-lg">#{order.id}</p>
              <p className="text-slate-400 text-sm mt-2">{formatDate(order.date)}</p>
            </div>
          </div>

          <div className="p-10">
            {/* Customer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 border-b border-slate-100 pb-12 print:pb-8 print:mb-8">
              <div>
                <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4">Billing Information</h3>
                <p className="text-lg font-bold text-slate-900">{order.billingAddress.fullName}</p>
                <p className="text-slate-500 leading-relaxed">{order.billingAddress.street}</p>
                <p className="text-slate-500 leading-relaxed">
                  {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zip}
                </p>
                <p className="text-slate-500 mt-2 font-medium">
                  <i className="fa-solid fa-phone-flip text-xs mr-2 opacity-50"></i>
                  {order.billingAddress.phone}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4">Shipping Destination</h3>
                <p className="text-lg font-bold text-slate-900">{order.shippingAddress.fullName}</p>
                <p className="text-slate-500 leading-relaxed">{order.shippingAddress.street}</p>
                <p className="text-slate-500 leading-relaxed">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                </p>
                <div className="mt-4 inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-lg print:border print:border-blue-100">
                  Status: {order.status}
                </div>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="mb-12 print:mb-8">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-slate-100">
                    <th className="py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Description</th>
                    <th className="py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Price</th>
                    <th className="py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Qty</th>
                    <th className="py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-6">
                        <p className="font-bold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-400">{item.category}</p>
                      </td>
                      <td className="py-6 text-center text-slate-600 font-medium">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="py-6 text-center text-slate-600 font-medium">
                        {item.quantity}
                      </td>
                      <td className="py-6 text-right font-black text-slate-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="flex flex-col md:flex-row justify-between items-start pt-8 border-t border-slate-100 gap-8">
              <div className="max-w-sm text-slate-400 text-xs italic">
                <p className="mb-2">Note: Warranty covers manufacturing defects for 12 months from the date of purchase.</p>
                <p>Payment Method: {order.paymentMethod.toUpperCase()}</p>
              </div>
              <div className="w-full md:w-80 space-y-4">
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Shipping & Handling</span>
                  <span>{order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Estimated Tax (8%)</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t-2 border-slate-100">
                  <span className="text-xl font-black text-slate-900">Amount Paid</span>
                  <span className="text-3xl font-black text-blue-600">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-20 text-center">
              <p className="text-slate-900 font-bold mb-1">Thank you for your business!</p>
              <p className="text-slate-400 text-sm">If you have any questions about this invoice, please reach out to our support team.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
