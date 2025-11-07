
import React, { useState, useMemo } from 'react';
import { Order, RestaurantSettings } from '../types';
import Receipt from './Receipt';
import { CloseIcon, ExportIcon } from './icons';

interface OrderHistoryProps {
    orders: Order[];
    restaurantSettings: RestaurantSettings;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders, restaurantSettings }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const filteredOrders = useMemo(() => {
        return orders
            .filter(order => {
                const customerInfo = `${order.customer.name} ${order.customer.phone} ${order.waiterName || ''}`.toLowerCase();
                return customerInfo.includes(searchTerm.toLowerCase());
            })
            .filter(order => {
                if (!filterDate) return true;
                // Adjust to compare dates without time
                const orderDate = new Date(order.date).setHours(0,0,0,0);
                const selectedDate = new Date(filterDate).setHours(0,0,0,0);
                return orderDate === selectedDate;
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [orders, searchTerm, filterDate]);

    const handleViewDetails = (order: Order) => {
        setSelectedOrder(order);
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
    };

    const handleExportCSV = () => {
        if (filteredOrders.length === 0) {
            alert("No orders to export.");
            return;
        }

        const headers = ['Order ID', 'Customer Name', 'Customer Phone', 'Date', 'Time', 'Order Type', 'Table/Room Number', 'Payment Method', 'Server', 'Total Amount'];
        
        const rows = filteredOrders.map(order => {
            const date = new Date(order.date);
            return [
                order.id.slice(-6),
                `"${order.customer.name || 'N/A'}"`, // Enclose in quotes to handle potential commas in names
                `"${order.customer.phone || 'N/A'}"`,
                date.toLocaleDateString(),
                date.toLocaleTimeString(),
                order.orderType,
                order.tableNumber || 'N/A',
                order.paymentMethod,
                `"${order.waiterName || 'N/A'}"`,
                order.total.toFixed(2)
            ].join(',');
        });

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `order_history_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportPDF = () => {
        if (filteredOrders.length === 0) {
            alert("No orders to export.");
            return;
        }

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert("Please allow popups for this feature.");
            return;
        }

        const tableRows = filteredOrders.map(order => {
            const date = new Date(order.date);
            return `
                <tr>
                    <td>${order.id.slice(-6)}</td>
                    <td>${order.customer.name || 'N/A'}</td>
                    <td>${date.toLocaleString()}</td>
                    <td>${order.orderType}</td>
                    <td>${order.waiterName || 'N/A'}</td>
                    <td style="text-align: right;">LKR ${order.total.toFixed(2)}</td>
                </tr>
            `;
        }).join('');

        const content = `
            <html>
                <head>
                    <title>Order History Report</title>
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; margin: 2rem; color: #333; }
                        h1 { text-align: center; color: #111; }
                        p { text-align: center; color: #555; }
                        table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; }
                        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                        th { background-color: #f7f7f7; font-weight: 600; }
                        tr:nth-child(even) { background-color: #fdfdfd; }
                    </style>
                </head>
                <body>
                    <h1>Order History Report</h1>
                    <p>Generated on: ${new Date().toLocaleString()}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Order Type</th>
                                <th>Server</th>
                                <th style="text-align: right;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                </body>
            </html>
        `;

        printWindow.document.write(content);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 font-serif">Order History</h1>

            <div className="bg-secondary p-4 rounded-lg shadow-lg mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search by customer, phone, server..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="flex-grow bg-background border border-secondary-light rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                        type="date"
                        value={filterDate}
                        onChange={e => setFilterDate(e.target.value)}
                        className="bg-background border border-secondary-light rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                 <div className="flex gap-2">
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center space-x-2 bg-accent hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg transition-colors"
                        title="Export as CSV"
                    >
                        <ExportIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">Export CSV</span>
                    </button>
                    <button
                        onClick={handleExportPDF}
                        className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition-colors"
                        title="Export as PDF"
                    >
                        <ExportIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">Export PDF</span>
                    </button>
                </div>
            </div>

            <div className="bg-secondary rounded-lg shadow-lg overflow-x-auto">
                {filteredOrders.length > 0 ? (
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-secondary-light">
                            <tr>
                                <th className="p-4">Order ID</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Server</th>
                                <th className="p-4">Order Type</th>
                                <th className="p-4">Table/Room</th>
                                <th className="p-4 text-right">Total</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order.id} className="border-b border-background hover:bg-secondary-light/50 transition-colors">
                                    <td className="p-4 font-mono text-sm text-text-secondary">{order.id.slice(-6)}</td>
                                    <td className="p-4">
                                        <div>{order.customer.name || "N/A"}</div>
                                        <div className="text-xs text-text-secondary">{order.customer.phone || ""}</div>
                                    </td>
                                    <td className="p-4 text-text-secondary">{new Date(order.date).toLocaleString()}</td>
                                    <td className="p-4 text-text-secondary">{order.waiterName || 'N/A'}</td>
                                    <td className="p-4 text-text-secondary">{order.orderType}</td>
                                    <td className="p-4 text-text-secondary">{order.tableNumber || 'N/A'}</td>
                                    <td className="p-4 font-semibold text-right">LKR {order.total.toFixed(2)}</td>
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => handleViewDetails(order)} 
                                            className="bg-primary hover:bg-primary-dark text-white font-bold py-1 px-3 rounded-md text-sm transition-colors"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                     <p className="text-text-secondary text-center py-10">No orders found.</p>
                )}
            </div>

            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
                    <div className="bg-secondary rounded-lg w-full max-w-sm max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-4 border-b border-secondary-light">
                             <h3 className="text-lg font-bold font-serif">Order Details</h3>
                             <button onClick={handleCloseModal} className="text-text-secondary hover:text-text-primary">
                                 <CloseIcon className="w-6 h-6"/>
                             </button>
                        </div>
                        <div className="overflow-y-auto">
                            <Receipt order={selectedOrder} restaurantSettings={restaurantSettings} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderHistory;