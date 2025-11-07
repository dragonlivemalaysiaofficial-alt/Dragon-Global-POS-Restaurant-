
import React, { useState, useMemo } from 'react';
import { DaySale, Order } from '../types';
import { CloseIcon, ReportIcon } from './icons';

interface DaySalesProps {
    activeDaySale: DaySale | null;
    completedOrders: Order[];
    onStartDay: (openingFloat: number) => void;
    onEndDay: (closingFloat: number) => void;
}

const StatDisplay: React.FC<{ label: string; value: string; className?: string }> = ({ label, value, className = '' }) => (
    <div className={`flex justify-between items-center py-3 border-b border-secondary-light ${className}`}>
        <span className="text-text-secondary">{label}</span>
        <span className="font-bold text-text-primary">{value}</span>
    </div>
);

const DaySales: React.FC<DaySalesProps> = ({ activeDaySale, completedOrders, onStartDay, onEndDay }) => {
    const [openingFloat, setOpeningFloat] = useState('');
    const [isEndDayModalOpen, setEndDayModalOpen] = useState(false);
    const [countedCash, setCountedCash] = useState('');

    const handleStartDaySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const floatValue = parseFloat(openingFloat);
        if (!isNaN(floatValue) && floatValue >= 0) {
            onStartDay(floatValue);
            setOpeningFloat('');
        }
    };

    const handleEndDaySubmit = () => {
        const countedValue = parseFloat(countedCash);
        if (!isNaN(countedValue) && countedValue >= 0) {
            onEndDay(countedValue);
            setCountedCash('');
            setEndDayModalOpen(false);
        }
    };

    const daySalesData = useMemo(() => {
        if (!activeDaySale) return null;
        const dayOrders = completedOrders.filter(o => activeDaySale.orderIds.includes(o.id));
        const cashSales = dayOrders.filter(o => o.paymentMethod === 'Cash').reduce((sum, o) => sum + o.total, 0);
        const cardSales = dayOrders.filter(o => o.paymentMethod === 'Card').reduce((sum, o) => sum + o.total, 0);
        const totalSales = cashSales + cardSales;
        const expectedCash = activeDaySale.openingFloat + cashSales;
        return { cashSales, cardSales, totalSales, expectedCash };
    }, [activeDaySale, completedOrders]);

    if (!activeDaySale) {
        return (
            <div className="max-w-md mx-auto mt-10">
                <div className="bg-secondary p-8 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold font-serif mb-2 text-center">Start Day Sales</h1>
                    <p className="text-center text-text-secondary mb-6">Enter the starting cash amount in the register.</p>
                    <form onSubmit={handleStartDaySubmit} className="space-y-4">
                        <div>
                            <label htmlFor="openingFloat" className="block text-sm font-medium text-text-secondary">Opening Float (LKR)</label>
                            <input
                                type="number"
                                id="openingFloat"
                                value={openingFloat}
                                onChange={e => setOpeningFloat(e.target.value)}
                                required
                                min="0"
                                step="0.01"
                                className="mt-1 block w-full bg-background border border-secondary-light rounded-md p-3 text-text-primary text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="e.g., 5000.00"
                            />
                        </div>
                        <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-colors text-lg">
                            Start Day
                        </button>
                    </form>
                </div>
            </div>
        );
    }
    
    const difference = daySalesData ? parseFloat(countedCash || '0') - daySalesData.expectedCash : 0;

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="bg-secondary p-8 rounded-lg shadow-lg">
                 <div className="text-center">
                    <span className="inline-block px-3 py-1 text-sm font-semibold text-green-200 bg-green-800/50 rounded-full mb-4">
                        Day In Progress
                    </span>
                    <h1 className="text-3xl font-bold font-serif mb-2">Sales Day Active</h1>
                    <p className="text-text-secondary mb-6">Day started by {activeDaySale.startUser} at {new Date(activeDaySale.startTime).toLocaleTimeString()}.</p>
                </div>

                <div className="space-y-2 mb-8">
                    <StatDisplay label="Opening Float" value={`LKR ${activeDaySale.openingFloat.toFixed(2)}`} />
                    <StatDisplay label="Current Cash Sales" value={`LKR ${daySalesData?.cashSales.toFixed(2) || '0.00'}`} />
                    <StatDisplay label="Current Card Sales" value={`LKR ${daySalesData?.cardSales.toFixed(2) || '0.00'}`} />
                    <StatDisplay label="Current Total Sales" value={`LKR ${daySalesData?.totalSales.toFixed(2) || '0.00'}`} className="!text-accent !font-bold" />
                </div>
                
                <button 
                    onClick={() => setEndDayModalOpen(true)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors text-lg">
                    End Day Sales
                </button>
            </div>

             {isEndDayModalOpen && daySalesData && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-secondary rounded-lg p-6 sm:p-8 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold font-serif">End of Day Summary</h2>
                            <button onClick={() => setEndDayModalOpen(false)} className="text-text-secondary hover:text-text-primary">
                                <CloseIcon className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                            <StatDisplay label="Opening Float" value={`LKR ${activeDaySale.openingFloat.toFixed(2)}`} />
                            <StatDisplay label="Cash Sales" value={`LKR ${daySalesData.cashSales.toFixed(2)}`} />
                            <StatDisplay label="Card Sales" value={`LKR ${daySalesData.cardSales.toFixed(2)}`} />
                            <StatDisplay label="Total Sales" value={`LKR ${daySalesData.totalSales.toFixed(2)}`} className="!text-accent !font-bold" />
                            <hr className="border-secondary-light my-2"/>
                            <StatDisplay label="Expected Cash in Drawer" value={`LKR ${daySalesData.expectedCash.toFixed(2)}`} className="font-bold text-lg"/>
                        </div>

                        <div className="my-6">
                             <label htmlFor="countedCash" className="block text-sm font-medium text-text-secondary">Counted Cash Amount (LKR)</label>
                            <input
                                type="number"
                                id="countedCash"
                                value={countedCash}
                                onChange={e => setCountedCash(e.target.value)}
                                required
                                min="0"
                                step="0.01"
                                className="mt-1 block w-full bg-background border border-secondary-light rounded-md p-3 text-text-primary text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Enter final cash amount"
                            />
                        </div>

                        {countedCash && (
                            <div className="mb-6">
                                <StatDisplay 
                                    label="Difference" 
                                    value={`LKR ${difference.toFixed(2)}`} 
                                    className={`text-lg ${difference === 0 ? '' : difference > 0 ? 'text-green-400' : 'text-red-400'}`}
                                />
                                <p className="text-xs text-center text-text-secondary mt-1">
                                    {difference === 0 ? 'Balanced' : difference > 0 ? 'Surplus' : 'Shortage'}
                                </p>
                            </div>
                        )}
                        
                       <div className="flex justify-end space-x-3">
                            <button onClick={() => setEndDayModalOpen(false)} className="bg-secondary-light hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleEndDaySubmit} disabled={!countedCash} className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                Confirm & End Day
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DaySales;