
import React, { useMemo } from 'react';
import { Order } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SalesReportProps {
    orders: Order[];
}

interface MonthlyData {
    month: string;
    totalSales: number;
    totalOrders: number;
}

const SalesReport: React.FC<SalesReportProps> = ({ orders }) => {

    const monthlyData = useMemo(() => {
        const data: { [key: string]: { totalSales: number; totalOrders: number } } = {};

        orders.forEach(order => {
            const date = new Date(order.date);
            const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
            
            if (!data[month]) {
                data[month] = { totalSales: 0, totalOrders: 0 };
            }
            data[month].totalSales += order.total;
            data[month].totalOrders += 1;
        });

        return Object.entries(data)
            .map(([month, values]) => ({ month, ...values }))
            .sort((a,b) => new Date(a.month).getTime() - new Date(b.month).getTime());

    }, [orders]);

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrdersCount = orders.length;
    const sortedOrders = useMemo(() => {
        return [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [orders]);

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold font-serif">Sales Report</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-secondary p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold text-text-secondary">Total Revenue</h3>
                    <p className="text-4xl font-bold text-accent">LKR {totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-secondary p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold text-text-secondary">Total Orders</h3>
                    <p className="text-4xl font-bold text-accent">{totalOrdersCount}</p>
                </div>
            </div>

            <div className="bg-secondary p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 font-serif">Monthly Sales</h2>
                {monthlyData.length > 0 ? (
                    <div style={{ width: '100%', height: 400 }}>
                        <ResponsiveContainer>
                            <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="month" stroke="#A9A9A9" />
                                <YAxis stroke="#A9A9A9" tickFormatter={(value) => `LKR ${value}`} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(215, 55, 55, 0.1)' }}
                                    contentStyle={{ backgroundColor: '#2C2C2C', border: '1px solid #3A3A3A', color: '#EAEAEA' }}
                                />
                                <Legend />
                                <Bar dataKey="totalSales" fill="#D73737" name="Total Sales (LKR)" />
                                <Bar dataKey="totalOrders" fill="#FBBF24" name="Number of Orders" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <p className="text-text-secondary text-center py-10">No sales data available to generate a report.</p>
                )}
            </div>

            <div className="bg-secondary p-6 rounded-lg shadow-lg">
                 <h2 className="text-2xl font-bold mb-4 font-serif">Recent Transactions</h2>
                 <div className="overflow-x-auto">
                    {sortedOrders.length > 0 ? (
                        <table className="w-full text-left min-w-[600px]">
                            <thead className="bg-secondary-light">
                                <tr>
                                    <th className="p-4">Order ID</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Customer</th>
                                    <th className="p-4">Server</th>
                                    <th className="p-4 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedOrders.map(order => (
                                    <tr key={order.id} className="border-b border-background hover:bg-secondary-light/50">
                                        <td className="p-4 font-mono text-sm text-text-secondary">{order.id.slice(-6)}</td>
                                        <td className="p-4 text-text-secondary">{new Date(order.date).toLocaleString()}</td>
                                        <td className="p-4">{order.customer.name || "N/A"}</td>
                                        <td className="p-4 text-text-secondary">{order.waiterName || "N/A"}</td>
                                        <td className="p-4 font-semibold text-right">LKR {order.total.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-text-secondary text-center py-10">No transactions to display.</p>
                    )}
                 </div>
            </div>
        </div>
    );
};

export default SalesReport;