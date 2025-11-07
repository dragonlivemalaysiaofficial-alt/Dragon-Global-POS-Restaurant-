



import React from 'react';
import { Order, RestaurantSettings } from '../types';

interface ReceiptProps {
    order: Order;
    restaurantSettings: RestaurantSettings;
}

const Receipt: React.FC<ReceiptProps> = ({ order, restaurantSettings }) => {
    const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const derivedTax = order.total - (subtotal - (order.discountAmount || 0));

    return (
        <div className="bg-white text-black p-4 font-serif text-sm w-full">
            <div className="text-center mb-4">
                <h2 className="text-2xl font-bold">{restaurantSettings.name}</h2>
                <p>{restaurantSettings.address}</p>
                <p>Phone: {restaurantSettings.phone}</p>
            </div>
            <div className="border-b border-dashed border-black pb-2 mb-2">
                <p><strong>Order ID:</strong> {order.id.slice(-6)}</p>
                <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>
                <p><strong>Order Type:</strong> {order.orderType}</p>
                {order.orderType === 'Dine-In' && order.tableNumber && <p><strong>Table:</strong> {order.tableNumber}</p>}
                {order.orderType === 'Room Service' && order.tableNumber && <p><strong>Room:</strong> {order.tableNumber}</p>}
                {order.waiterName && <p><strong>Server:</strong> {order.waiterName}</p>}
                <p><strong>Customer:</strong> {order.customer.name || 'N/A'}</p>
                <p><strong>Phone:</strong> {order.customer.phone || 'N/A'}</p>
                <p><strong>Payment:</strong> {order.paymentMethod}</p>
            </div>
            <table className="w-full mb-2">
                <thead>
                    <tr>
                        <th className="text-left">Item</th>
                        <th className="text-center">Qty</th>
                        <th className="text-right">Price</th>
                        <th className="text-right">Total</th>
                    </tr>
                </thead>
                <tbody className="border-b border-dashed border-black">
                    {order.items.map(item => (
                        <tr key={item.id}>
                            <td>
                                {item.name}
                                {item.note && (
                                    <div className="text-xs text-gray-600 pl-2">
                                        <em>- {item.note}</em>
                                    </div>
                                )}
                            </td>
                            <td className="text-center">{item.quantity}</td>
                            <td className="text-right">{item.price.toFixed(2)}</td>
                            <td className="text-right">{(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-end mb-2">
                <div className="w-2/3">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>LKR {subtotal.toFixed(2)}</span>
                    </div>
                    {order.discountAmount != null && order.discountAmount > 0 && (
                        <div className="flex justify-between">
                            <span>Discount ({order.discountPercentage}%):</span>
                            <span>- LKR {order.discountAmount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span>Tax (5%):</span>
                        <span>LKR {derivedTax.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between font-bold border-t border-dashed border-black pt-1 mt-1">
                        <span>Total:</span>
                        <span>LKR {order.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            <div className="text-center mt-4">
                <p>Thank you for your visit!</p>
            </div>
        </div>
    );
};

export default Receipt;