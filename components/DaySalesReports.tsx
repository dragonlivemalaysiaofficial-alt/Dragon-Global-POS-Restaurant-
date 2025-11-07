
import React, { useState } from 'react';
import { DaySale } from '../types';
import { CloseIcon, ReportIcon } from './icons';

interface DaySalesReportsProps {
    reports: DaySale[];
}

const ReportDetailModal: React.FC<{ report: DaySale; onClose: () => void }> = ({ report, onClose }) => {
    const differenceColor = report.difference === 0 ? 'text-text-primary' : report.difference > 0 ? 'text-green-400' : 'text-red-400';
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-secondary rounded-lg p-6 sm:p-8 max-w-md w-full" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold font-serif">Day Report</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="text-sm text-text-secondary mb-4">
                    <p><strong>Date:</strong> {new Date(report.startTime).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {new Date(report.startTime).toLocaleTimeString()} - {report.endTime ? new Date(report.endTime).toLocaleTimeString() : 'N/A'}</p>
                    <p><strong>Started By:</strong> {report.startUser}</p>
                    <p><strong>Ended By:</strong> {report.endUser || 'N/A'}</p>
                </div>
                <div className="space-y-2 text-base">
                    <div className="flex justify-between py-2 border-b border-secondary-light"><span>Opening Float:</span> <span>LKR {report.openingFloat.toFixed(2)}</span></div>
                    <div className="flex justify-between py-2 border-b border-secondary-light"><span>Cash Sales:</span> <span>LKR {report.cashSales.toFixed(2)}</span></div>
                    <div className="flex justify-between py-2 border-b border-secondary-light"><span>Card Sales:</span> <span>LKR {report.cardSales.toFixed(2)}</span></div>
                    <div className="flex justify-between py-2 border-b border-secondary-light font-bold"><span>Total Sales:</span> <span>LKR {report.totalSales.toFixed(2)}</span></div>
                    <div className="flex justify-between py-2 border-b border-secondary-light"><span>Expected Cash:</span> <span>LKR {(report.openingFloat + report.cashSales).toFixed(2)}</span></div>
                    <div className="flex justify-between py-2 border-b border-secondary-light"><span>Counted Cash:</span> <span>LKR {(report.closingFloat || 0).toFixed(2)}</span></div>
                    <div className={`flex justify-between py-2 font-bold text-lg ${differenceColor}`}><span>Difference:</span> <span>LKR {report.difference.toFixed(2)}</span></div>
                </div>
            </div>
        </div>
    );
};


const DaySalesReports: React.FC<DaySalesReportsProps> = ({ reports }) => {
    const [selectedReport, setSelectedReport] = useState<DaySale | null>(null);

    const sortedReports = [...reports].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold font-serif mb-6">Day Sales Reports</h1>
            <div className="bg-secondary rounded-lg shadow-lg">
                <ul className="divide-y divide-secondary-light">
                    {sortedReports.length > 0 ? sortedReports.map(report => (
                        <li key={report.id}>
                            <button 
                                onClick={() => setSelectedReport(report)}
                                className="w-full flex justify-between items-center p-4 hover:bg-secondary-light/50 transition-colors text-left"
                            >
                                <div>
                                    <p className="font-bold text-text-primary">{new Date(report.startTime).toDateString()}</p>
                                    <p className="text-sm text-text-secondary">Ended by {report.endUser} at {new Date(report.endTime!).toLocaleTimeString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg text-accent">LKR {report.totalSales.toFixed(2)}</p>
                                    <p className={`text-sm font-semibold ${report.difference === 0 ? 'text-text-secondary' : report.difference > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {report.difference >= 0 ? '+' : ''}LKR {report.difference.toFixed(2)}
                                    </p>
                                </div>
                            </button>
                        </li>
                    )) : (
                        <li className="p-8 text-center text-text-secondary">
                            <ReportIcon className="w-12 h-12 mx-auto mb-4 text-secondary-light" />
                            No day sales reports have been generated yet.
                        </li>
                    )}
                </ul>
            </div>
            {selectedReport && <ReportDetailModal report={selectedReport} onClose={() => setSelectedReport(null)} />}
        </div>
    );
};

export default DaySalesReports;