


import React from 'react';
import { Order } from '../types';

interface OpenOrdersProps {
    orders: Order[];
    onSelectOrder: (orderId: string) => void;
}

const OpenOrders: React.FC<OpenOrdersProps> = ({ orders, onSelectOrder }) => {
    
    const sortedOrders = [...orders].sort((a, b) => {
        const tableA = parseInt(a.tableNumber || '0', 10);
        const tableB = parseInt(b.tableNumber || '0', 10);
        return tableA - tableB;
    });
    
    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 font-serif">Open Orders</h1>
            {sortedOrders.length === 0 ? (
                <div className="bg-secondary p-8 rounded-lg text-center text-text-secondary">
                    <p>There are no open orders at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sortedOrders.map(order => (
                        <div key={order.id} className="bg-secondary p-5 rounded-lg shadow-lg flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-bold text-accent font-serif">
                                            {order.orderType === 'Room Service' ? 'Room' : 'Table'} {order.tableNumber}
                                        </h3>
                                    </div>
                                    <span className="text-xs font-mono text-text-secondary">{order.id.slice(-6)}</span>
                                </div>
                                <div className="mb-2">
                                     {order.status === 'ready' ? (
                                        <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">Ready for Pickup</span>
                                    ) : (
                                        <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">In Kitchen</span>
                                    )}
                                </div>
                                <p className="text-sm text-text-secondary mb-1 truncate">
                                    Customer: {order.customer.name || 'N/A'}
                                </p>
                                <p className="text-sm text-text-secondary mb-4">
                                    Items: {order.items.reduce((acc, item) => acc + item.quantity, 0)}
                                </p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-right mb-4">LKR {order.total.toFixed(2)}</p>
                                <button
                                    onClick={() => onSelectOrder(order.id)}
                                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                >
                                    Load Order
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OpenOrders;