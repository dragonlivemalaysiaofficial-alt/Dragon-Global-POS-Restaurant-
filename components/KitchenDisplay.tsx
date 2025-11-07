

import React, { useState, useEffect } from 'react';
import { Order } from '../types';

interface KitchenDisplayProps {
    orders: Order[];
    onMarkAsReady: (orderId: string) => void;
}

const ElapsedTime: React.FC<{ startTime: string }> = ({ startTime }) => {
    const [elapsed, setElapsed] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            const start = new Date(startTime).getTime();
            const now = new Date().getTime();
            const diff = now - start;
            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            setElapsed(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }, 1000);

        return () => clearInterval(timer);
    }, [startTime]);

    const timeInMinutes = parseFloat(elapsed.replace(':', '.'));
    let textColor = 'text-green-400';
    if (timeInMinutes > 5) textColor = 'text-yellow-400';
    if (timeInMinutes > 10) textColor = 'text-red-400';
    
    return <span className={`font-mono text-xl font-bold ${textColor}`}>{elapsed}</span>;
};


const KitchenDisplay: React.FC<KitchenDisplayProps> = ({ orders, onMarkAsReady }) => {

    const sortedOrders = [...orders].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className="max-w-full mx-auto">
            <h1 className="text-3xl font-bold mb-6 font-serif">Kitchen Orders</h1>
            {sortedOrders.length === 0 ? (
                <div className="bg-secondary p-8 rounded-lg text-center text-text-secondary">
                    <p>No orders in the kitchen.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                    {sortedOrders.map(order => (
                        <div key={order.id} className="bg-secondary p-4 rounded-lg shadow-lg flex flex-col h-full border-t-4 border-accent">
                            <div className="flex justify-between items-center mb-3">
                                <div className="font-bold text-lg">
                                    {order.orderType === 'Dine-In' && `Table ${order.tableNumber}`}
                                    {order.orderType === 'Room Service' && `Room ${order.tableNumber}`}
                                    {order.orderType === 'Take Away' && 'Take Away'}
                                </div>
                                <ElapsedTime startTime={order.date} />
                            </div>
                            <div className="flex-grow border-y border-secondary-light py-2 my-2 space-y-2 overflow-y-auto max-h-60">
                                {order.items.map(item => (
                                    <div key={item.id}>
                                        <div className="flex items-start">
                                            <span className="font-bold text-accent mr-2">{item.quantity}x</span>
                                            <span className="flex-grow">{item.name}</span>
                                        </div>
                                         {item.description && (
                                            <p className="ml-6 text-xs text-text-secondary italic">
                                                {item.description}
                                            </p>
                                        )}
                                         {item.note && (
                                            <p className="ml-6 text-sm italic text-yellow-300 bg-yellow-900/50 px-2 py-1 rounded-md mt-1">
                                                Note: {item.note}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => onMarkAsReady(order.id)}
                                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors text-lg"
                            >
                                Mark as Ready
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default KitchenDisplay;