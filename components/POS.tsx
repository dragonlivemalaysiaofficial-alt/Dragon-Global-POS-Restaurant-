

import React, { useState } from 'react';
import { MenuItem, CartItem, Customer, Order, PaymentMethod, RestaurantSettings, OrderType, CustomerProfile } from '../types';
import MenuItemCard from './MenuItemCard';
import Cart from './Cart';

interface POSProps {
    menu: MenuItem[];
    cart: CartItem[];
    customer: Customer;
    lastOrder: Order | null;
    addToCart: (item: MenuItem) => void;
    updateCartItemQuantity: (itemId: string, quantity: number) => void;
    updateCartItemNote: (itemId: string, note: string) => void;
    clearCart: () => void;
    setCustomer: (customer: Customer) => void;
    completeOrder: () => void;
    saveOrUpdateOrder: () => void;
    activeOrderId: string | null;
    discount: number;
    setDiscount: (discount: number) => void;
    paymentMethod: PaymentMethod;
    setPaymentMethod: (method: PaymentMethod) => void;
    tableNumber: string;
    setTableNumber: (table: string) => void;
    orderType: OrderType;
    setOrderType: (type: OrderType) => void;
    restaurantSettings: RestaurantSettings;
    customerProfiles: CustomerProfile[];
    onSaveCustomerProfile: (customer: Customer) => void;
    isDayActive: boolean;
}

const POS: React.FC<POSProps> = (props) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', ...new Set(props.menu.map(item => item.category))];

    const filteredMenu = props.menu.filter(item => {
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Menu Section */}
            <div className="lg:col-span-2 bg-secondary rounded-lg p-4 flex flex-col h-full min-h-[calc(100vh-10rem)]">
                <h2 className="text-2xl font-bold mb-4 text-text-primary font-serif">Menu</h2>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Search for food..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="flex-grow bg-background border border-secondary-light rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                     <select
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                        className="bg-background border border-secondary-light rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                     >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                     </select>
                </div>
                <div className="overflow-y-auto flex-grow pr-2">
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredMenu.map(item => (
                            <MenuItemCard key={item.id} item={item} onAddToCart={() => props.addToCart(item)} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Billing Section */}
            <div className="lg:col-span-1 bg-secondary rounded-lg p-4 flex flex-col h-full">
                <Cart {...props} />
            </div>
        </div>
    );
};

export default POS;