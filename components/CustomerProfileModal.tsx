

import React, { useState } from 'react';
import { CustomerProfile, Order, RestaurantSettings } from '../types';
import { CloseIcon } from './icons';
import Receipt from './Receipt';

interface CustomerProfileModalProps {
    customer: CustomerProfile;
    orders: Order[];
    onSave: (profile: CustomerProfile) => void;
    onClose: () => void;
    restaurantSettings: RestaurantSettings;
}

const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({ customer, orders, onSave, onClose, restaurantSettings }) => {
    const [formData, setFormData] = useState<CustomerProfile>(customer);
    const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');
    const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

    const customerOrders = React.useMemo(() => {
        if (!customer || !customer.orderHistory) return [];
        return orders
            .filter(o => customer.orderHistory.includes(o.id))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [customer, orders]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const TabButton: React.FC<{ tab: 'details' | 'history'; label: string }> = ({ tab, label }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-sm font-semibold rounded-t-md transition-colors ${
                activeTab === tab
                    ? 'bg-secondary-light text-text-primary'
                    : 'bg-background hover:bg-secondary-light/50 text-text-secondary'
            }`}
            role="tab"
            aria-selected={activeTab === tab}
        >
            {label}
        </button>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-secondary rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col" role="dialog" aria-modal="true" aria-labelledby="customer-modal-title" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-secondary-light">
                    <h2 id="customer-modal-title" className="text-xl font-bold font-serif">Editing {customer.name}</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary" aria-label="Close modal">
                        <CloseIcon className="w-6 h-6"/>
                    </button>
                </div>
                
                <div className="flex border-b border-secondary-light" role="tablist">
                    <TabButton tab="details" label="Profile Details" />
                    <TabButton tab="history" label={`Order History (${customerOrders.length})`} />
                </div>

                <div className="p-6 overflow-y-auto flex-grow">
                    {activeTab === 'details' && (
                        <form onSubmit={handleSubmit} className="space-y-4" role="tabpanel">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Name</label>
                                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full bg-background border border-secondary-light rounded-md p-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-text-secondary">Phone</label>
                                <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} required className="mt-1 block w-full bg-background border border-secondary-light rounded-md p-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                             <div>
                                <label htmlFor="email" className="block text-sm font-medium text-text-secondary">Email</label>
                                <input type="email" name="email" id="email" value={formData.email || ''} onChange={handleChange} className="mt-1 block w-full bg-background border border-secondary-light rounded-md p-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-text-secondary">Address</label>
                                <textarea name="address" id="address" value={formData.address || ''} onChange={handleChange} rows={3} className="mt-1 block w-full bg-background border border-secondary-light rounded-md p-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
                            </div>
                             <div className="flex justify-end pt-4">
                                <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition-colors">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    )}

                    {activeTab === 'history' && (
                        <div role="tabpanel">
                            {customerOrders.length > 0 ? (
                                <ul className="divide-y divide-secondary-light">
                                    {customerOrders.map(order => (
                                        <li key={order.id} className="py-3 flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold">{new Date(order.date).toLocaleString()}</p>
                                                <p className="text-sm text-text-secondary">ID: {order.id.slice(-6)} - {order.items.reduce((sum, i) => sum + i.quantity, 0)} items</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-accent">LKR {order.total.toFixed(2)}</p>
                                                <button onClick={() => setViewingOrder(order)} className="text-xs text-primary hover:underline">View Receipt</button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center text-text-secondary py-8">No order history for this customer.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {viewingOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4" onClick={() => setViewingOrder(null)}>
                     <div className="bg-secondary rounded-lg w-full max-w-sm max-h-[90vh] flex flex-col" role="dialog" aria-modal="true" aria-labelledby="receipt-modal-title" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-4 border-b border-secondary-light">
                             <h3 id="receipt-modal-title" className="text-lg font-bold font-serif">Order Details</h3>
                             <button onClick={() => setViewingOrder(null)} className="text-text-secondary hover:text-text-primary" aria-label="Close receipt">
                                 <CloseIcon className="w-6 h-6"/>
                             </button>
                        </div>
                        <div className="overflow-y-auto">
                            <Receipt order={viewingOrder} restaurantSettings={restaurantSettings} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerProfileModal;