


import React, { useState, useMemo } from 'react';
import { CustomerProfile, Order, RestaurantSettings } from '../types';
import { EditIcon, TrashIcon, UsersIcon, ReportIcon, SparklesIcon, ArrowUpIcon, ArrowDownIcon } from './icons';
import CustomerProfileModal from './CustomerProfileModal';

interface CustomerManagementProps {
    customers: CustomerProfile[];
    orders: Order[];
    onUpdate: (profile: CustomerProfile) => void;
    onDelete: (profileId: string) => void;
    restaurantSettings: RestaurantSettings;
}

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; note?: string; }> = ({ icon, title, value, note }) => (
    <div className="bg-secondary p-4 rounded-lg shadow-lg flex items-center space-x-4">
        <div className="bg-secondary-light p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-text-secondary">{title}</p>
            <p className="text-2xl font-bold text-text-primary">{value}</p>
            {note && <p className="text-xs text-text-secondary">{note}</p>}
        </div>
    </div>
);


const CustomerManagement: React.FC<CustomerManagementProps> = ({ customers, orders, onUpdate, onDelete, restaurantSettings }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState<CustomerProfile | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof ReturnType<typeof useMemo>['customerData'][0]; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });


    const customerData = useMemo(() => {
        return customers.map(customer => {
            const customerOrders = orders.filter(o => customer.orderHistory && customer.orderHistory.includes(o.id));
            const totalSpent = customerOrders.reduce((sum, o) => sum + o.total, 0);
            return {
                ...customer,
                orderCount: customerOrders.length,
                totalSpent,
            };
        });
    }, [customers, orders]);
    
    const summaryStats = useMemo(() => {
        const totalValue = customerData.reduce((sum, c) => sum + c.totalSpent, 0);
        const topCustomer = customerData.length > 0 ? customerData.reduce((top, c) => c.totalSpent > top.totalSpent ? c : top, {name: 'N/A', totalSpent: 0}) : {name: 'N/A', totalSpent: 0};
        return {
            count: customerData.length,
            totalValue,
            topCustomer,
        };
    }, [customerData]);


    const filteredCustomers = useMemo(() => {
        return customerData.filter(c => 
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.phone.includes(searchTerm) ||
            (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [customerData, searchTerm]);

    const sortedCustomers = useMemo(() => {
        let sortableItems = [...filteredCustomers];
        sortableItems.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        return sortableItems;
    }, [filteredCustomers, sortConfig]);

    const requestSort = (key: keyof typeof customerData[0]) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };


    const handleOpenModal = (customer: CustomerProfile) => {
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedCustomer(null);
        setIsModalOpen(false);
    };

    const handleSave = (profileData: CustomerProfile) => {
        onUpdate(profileData);
        handleCloseModal();
    };
    
    const handleConfirmDelete = () => {
        if (customerToDelete) {
            onDelete(customerToDelete.id);
            setCustomerToDelete(null);
        }
    };

    const SortableHeader: React.FC<{ label: string; sortKey: keyof typeof customerData[0]; className?: string }> = ({ label, sortKey, className='' }) => {
        const isSorted = sortConfig.key === sortKey;
        return (
            <th className={`p-4 ${className}`}>
                <button onClick={() => requestSort(sortKey)} className="flex items-center space-x-1 font-semibold">
                    <span>{label}</span>
                    {isSorted && (
                        sortConfig.direction === 'asc' 
                        ? <ArrowUpIcon className="w-3 h-3"/> 
                        : <ArrowDownIcon className="w-3 h-3"/>
                    )}
                </button>
            </th>
        );
    };


    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 font-serif">Customer Insights</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard 
                    icon={<UsersIcon className="w-6 h-6 text-accent"/>} 
                    title="Total Customers" 
                    value={summaryStats.count.toString()} 
                />
                <StatCard 
                    icon={<ReportIcon className="w-6 h-6 text-accent"/>} 
                    title="Lifetime Value" 
                    value={`LKR ${summaryStats.totalValue.toFixed(2)}`} 
                />
                <StatCard 
                    icon={<SparklesIcon className="w-6 h-6 text-accent"/>} 
                    title="Top Customer" 
                    value={summaryStats.topCustomer.name} 
                    note={`Spent LKR ${summaryStats.topCustomer.totalSpent.toFixed(2)}`}
                />
            </div>
            
             <div className="bg-secondary p-4 rounded-lg shadow-lg mb-6">
                <input
                    type="text"
                    placeholder="Search by name, phone, or email..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-background border border-secondary-light rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
            
            <div className="bg-secondary rounded-lg shadow-lg overflow-x-auto">
                {sortedCustomers.length > 0 ? (
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-secondary-light">
                            <tr>
                                <SortableHeader label="Name" sortKey="name" />
                                <th className="p-4 font-semibold">Contact</th>
                                <SortableHeader label="Total Orders" sortKey="orderCount" className="text-center"/>
                                <SortableHeader label="Total Spent" sortKey="totalSpent" className="text-right"/>
                                <th className="p-4 text-center font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedCustomers.map(customer => (
                                <tr key={customer.id} className="border-b border-background hover:bg-secondary-light/50 transition-colors">
                                    <td className="p-4">{customer.name}</td>
                                    <td className="p-4">
                                        <div>{customer.phone}</div>
                                        <div className="text-xs text-text-secondary">{customer.email || 'No email'}</div>
                                    </td>
                                    <td className="p-4 text-center">{customer.orderCount}</td>
                                    <td className="p-4 text-right font-semibold">LKR {customer.totalSpent.toFixed(2)}</td>
                                    <td className="p-4">
                                        <div className="flex justify-center space-x-2">
                                            <button onClick={() => handleOpenModal(customer)} className="p-2 text-blue-400 hover:text-blue-300" aria-label={`Edit ${customer.name}`}><EditIcon className="w-5 h-5"/></button>
                                            <button onClick={() => setCustomerToDelete(customer)} className="p-2 text-red-400 hover:text-red-300" aria-label={`Delete ${customer.name}`}><TrashIcon className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-text-secondary text-center py-10">No customers found.</p>
                )}
            </div>

            {isModalOpen && selectedCustomer && (
                <CustomerProfileModal
                    customer={selectedCustomer}
                    orders={orders}
                    onSave={handleSave}
                    onClose={handleCloseModal}
                    restaurantSettings={restaurantSettings}
                />
            )}
            
            {customerToDelete && (
                 <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-secondary rounded-lg p-6 sm:p-8 max-w-md w-full" role="alertdialog" aria-modal="true" aria-labelledby="delete-dialog-title">
                       <h2 id="delete-dialog-title" className="text-2xl font-bold mb-4 font-serif">Confirm Deletion</h2>
                       <p className="text-text-secondary mb-6">Are you sure you want to delete the profile for "{customerToDelete.name}"? This action cannot be undone.</p>
                       <div className="flex justify-end space-x-3">
                            <button onClick={() => setCustomerToDelete(null)} className="bg-secondary-light hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerManagement;