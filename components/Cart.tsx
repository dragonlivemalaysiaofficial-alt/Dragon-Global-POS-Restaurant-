


import React, { useState, useRef, useEffect, useMemo } from 'react';
import { CartItem, Customer, Order, PaymentMethod, RestaurantSettings, OrderType, CustomerProfile } from '../types';
import { PlusIcon, MinusIcon, TrashIcon, CloseIcon, CashIcon, CreditCardIcon } from './icons';
import Receipt from './Receipt';
import { useToast } from '../contexts/ToastContext';

interface CartProps {
    cart: CartItem[];
    customer: Customer;
    lastOrder: Order | null;
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

const Cart: React.FC<CartProps> = ({ 
    cart, customer, lastOrder, updateCartItemQuantity, updateCartItemNote, 
    clearCart, setCustomer, completeOrder, saveOrUpdateOrder, activeOrderId, 
    discount, setDiscount, paymentMethod, setPaymentMethod, tableNumber, 
    setTableNumber, orderType, setOrderType, restaurantSettings, customerProfiles, onSaveCustomerProfile,
    isDayActive
}) => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = subtotal * (discount / 100);
    const tax = (subtotal - discountAmount) * 0.05;
    const total = subtotal - discountAmount + tax;
    
    const { showToast } = useToast();
    const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [currentNote, setCurrentNote] = useState('');
    const [customerSearch, setCustomerSearch] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
       if (lastOrder) {
            setIsPaid(true);
       } else {
            setIsPaid(false);
       }
    }, [lastOrder]);

    const customerSearchSuggestions = useMemo(() => {
        if (!customerSearch) return [];
        return customerProfiles.filter(p => 
            p.name.toLowerCase().includes(customerSearch.toLowerCase()) || 
            p.phone.includes(customerSearch)
        );
    }, [customerSearch, customerProfiles]);

    const existingProfile = useMemo(() => {
        if (!customer.phone) return null;
        return customerProfiles.find(p => p.phone === customer.phone);
    }, [customer, customerProfiles]);

    const handleCustomerChange = (field: 'name' | 'phone', value: string) => {
        setCustomer({ ...customer, [field]: value });
        if (field === 'name') {
            setCustomerSearch(value);
            setShowSuggestions(true);
        }
    };

    const handleSelectCustomer = (profile: CustomerProfile) => {
        setCustomer({ name: profile.name, phone: profile.phone });
        setCustomerSearch('');
        setShowSuggestions(false);
    };

    const handleSaveOrUpdateCustomer = () => {
        onSaveCustomerProfile(customer);
    };
    
    const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numValue = value === '' ? 0 : parseFloat(value);
        if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
            setDiscount(numValue);
        }
    };

    const handleNoteEditStart = (itemId: string, note: string) => {
        setEditingNoteId(itemId);
        setCurrentNote(note);
    };

    const handleNoteSave = (itemId: string) => {
        updateCartItemNote(itemId, currentNote);
        setEditingNoteId(null);
        setCurrentNote('');
    };

    const handlePayNow = () => {
        if (cart.length > 0) {
            if ((orderType === 'Dine-In' || orderType === 'Room Service') && !tableNumber) {
                showToast(`Please enter a ${orderType === 'Dine-In' ? 'table' : 'room'} number.`);
                return;
            }
            setPaymentModalOpen(true);
        }
    };

     const handleSaveOrder = () => {
        if (cart.length > 0) {
            if ((orderType === 'Dine-In' || orderType === 'Room Service') && !tableNumber) {
                showToast(`Please enter a ${orderType === 'Dine-In' ? 'table' : 'room'} number to save the order.`);
                return;
            }
            saveOrUpdateOrder();
        }
    };
    
    const handleConfirmPayment = () => {
        completeOrder();
        setPaymentModalOpen(false);
    };
    
    const handleNewOrder = () => {
        clearCart();
        setIsPaid(false);
    }
    
    const receiptRef = useRef<HTMLDivElement>(null);
    const handlePrint = () => {
        const receiptElement = receiptRef.current;
        if (!receiptElement) {
            showToast('Could not find receipt content to print.');
            return;
        }

        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.setAttribute('title', 'Print Frame');
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow?.document;
        if (!doc) {
            showToast('Could not create a print frame.');
            document.body.removeChild(iframe);
            return;
        }

        const appHead = document.head.innerHTML;
        const receiptHTML = receiptElement.innerHTML;

        doc.open();
        doc.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Print Receipt</title>
                    ${appHead}
                    <style>
                        @media print {
                            body, html {
                                background: #fff !important;
                                -webkit-print-color-adjust: exact;
                                color-adjust: exact;
                            }
                        }
                        body {
                            margin: 0;
                        }
                    </style>
                </head>
                <body>
                    ${receiptHTML}
                </body>
            </html>
        `);
        doc.close();

        const onIframeLoad = () => {
            setTimeout(() => {
                try {
                    iframe.contentWindow?.focus();
                    iframe.contentWindow?.print();
                } catch (e) {
                    console.error("Printing failed:", e);
                    showToast("Printing failed. Please try again.");
                } finally {
                    setTimeout(() => {
                        if (document.body.contains(iframe)) {
                            document.body.removeChild(iframe);
                        }
                    }, 1000);
                }
            }, 500); // 500ms for Tailwind JIT to run
        };
        
        if (doc.readyState === 'complete') {
            onIframeLoad();
        } else {
            iframe.onload = onIframeLoad;
        }
    };

    const OrderTypeButton: React.FC<{ type: OrderType; label: string; }> = ({ type, label }) => (
        <button
            onClick={() => {
                if(activeOrderId) return; // Prevent switching type when editing an order
                setOrderType(type);
                if (type === 'Take Away') {
                    setTableNumber('');
                }
            }}
            disabled={!!activeOrderId}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
                orderType === type
                    ? 'bg-primary text-white'
                    : 'bg-background hover:bg-secondary-light'
            } ${!!activeOrderId ? 'cursor-not-allowed opacity-70' : ''}`}
        >
            {label}
        </button>
    );

    const PaymentMethodButton: React.FC<{
        method: PaymentMethod;
        icon: React.ReactNode;
        label: string;
        currentMethod: PaymentMethod;
        onClick: (method: PaymentMethod) => void;
    }> = ({ method, icon, label, currentMethod, onClick }) => (
        <button
            onClick={() => onClick(method)}
            className={`flex-1 flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-colors ${
                currentMethod === method
                    ? 'bg-primary border-primary text-white'
                    : 'bg-background border-secondary-light hover:border-primary'
            }`}
        >
            {icon}
            <span className="text-xs mt-1 font-semibold">{label}</span>
        </button>
    );

    if (isPaid && lastOrder) {
        return (
            <div className="flex flex-col h-full">
                <h2 className="text-2xl font-bold mb-4 text-green-400 font-serif">Payment Successful!</h2>
                <div className="flex-grow overflow-y-auto" ref={receiptRef}>
                    <Receipt order={lastOrder} restaurantSettings={restaurantSettings} />
                </div>
                <div className="mt-4 flex flex-col space-y-2">
                    <button onClick={handlePrint} className="w-full bg-accent hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg transition-colors">
                        Print Bill
                    </button>
                    <button onClick={handleNewOrder} className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg transition-colors">
                        New Order
                    </button>
                </div>
            </div>
        );
    }

    const renderActionButtons = () => {
        const isActionDisabled = cart.length === 0 || !isDayActive;
        const payButton = (
            <button onClick={handlePayNow} disabled={isActionDisabled} className="flex-grow bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Pay Now
            </button>
        );

        const saveButton = (
             <button onClick={handleSaveOrder} disabled={isActionDisabled} className="flex-grow bg-accent hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {activeOrderId ? 'Update Order' : 'Save Order'}
            </button>
        );

        if (orderType === 'Take Away') {
            return payButton;
        }

        if (orderType === 'Dine-In' || orderType === 'Room Service') {
            if (activeOrderId) {
                return (
                    <>
                        {saveButton}
                        {payButton}
                    </>
                );
            }
            return saveButton;
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold mb-4 text-text-primary font-serif">{activeOrderId ? `Editing Order (${orderType === 'Dine-In' ? 'Table' : 'Room'}: ${tableNumber})` : 'Current Order'}</h2>
                <div className={`text-xs font-semibold px-2 py-1 rounded-full ${isDayActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                    {isDayActive ? 'DAY ACTIVE' : 'DAY INACTIVE'}
                </div>
            </div>

            <div className="flex bg-secondary-light p-1 rounded-lg mb-4 gap-1">
                <OrderTypeButton type="Dine-In" label="Dine-In" />
                <OrderTypeButton type="Room Service" label="Room Service" />
                <OrderTypeButton type="Take Away" label="Take Away" />
            </div>
            
            <div className="mb-4 space-y-2">
                {(orderType === 'Dine-In' || orderType === 'Room Service') && (
                    <input type="text" placeholder={orderType === 'Dine-In' ? "Table Number" : "Room Number"} value={tableNumber} onChange={e => setTableNumber(e.target.value)} disabled={!!activeOrderId} className={`w-full bg-background border border-secondary-light rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary ${!!activeOrderId ? 'cursor-not-allowed opacity-70' : ''}`} />
                )}
                 <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search Customers or Enter Name" 
                        value={customer.name} 
                        onChange={e => handleCustomerChange('name', e.target.value)} 
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        className="w-full bg-background border border-secondary-light rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" 
                    />
                    {showSuggestions && customerSearchSuggestions.length > 0 && (
                        <ul className="absolute z-10 w-full bg-secondary-light border border-background rounded-md mt-1 max-h-40 overflow-y-auto">
                            {customerSearchSuggestions.map(p => (
                                <li 
                                    key={p.id} 
                                    onMouseDown={() => handleSelectCustomer(p)}
                                    className="px-3 py-2 cursor-pointer hover:bg-primary"
                                >
                                    <p className="font-semibold">{p.name}</p>
                                    <p className="text-xs text-text-secondary">{p.phone}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                 </div>
                 <input type="tel" placeholder="Customer Phone" value={customer.phone} onChange={e => handleCustomerChange('phone', e.target.value)} className="w-full bg-background border border-secondary-light rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
                 {customer.name && customer.phone && (
                    <>
                        {!existingProfile && (
                             <button onClick={handleSaveOrUpdateCustomer} className="w-full text-left text-sm text-green-400 hover:underline px-1 py-1">+ Save Customer Profile</button>
                        )}
                        {existingProfile && existingProfile.name !== customer.name && (
                             <button onClick={handleSaveOrUpdateCustomer} className="w-full text-left text-sm text-yellow-400 hover:underline px-1 py-1">Update Customer Name</button>
                        )}
                    </>
                 )}
            </div>

            <div className="flex-grow overflow-y-auto py-2">
                {cart.length === 0 ? (
                    <p className="text-text-secondary text-center py-10">Your cart is empty.</p>
                ) : (
                    <ul className="divide-y divide-secondary-light">
                        {cart.map(item => (
                            <li key={item.id} className="py-3">
                                <div className="flex items-center space-x-3">
                                    <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-md object-cover flex-shrink-0" />
                                    <div className="flex-grow">
                                        <p className="font-semibold text-text-primary truncate">{item.name}</p>
                                        <p className="text-sm text-text-secondary">LKR {item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)} className="p-1 rounded-full bg-secondary-light hover:bg-primary"><MinusIcon className="w-4 h-4" /></button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)} className="p-1 rounded-full bg-secondary-light hover:bg-primary"><PlusIcon className="w-4 h-4" /></button>
                                        <button onClick={() => updateCartItemQuantity(item.id, 0)} className="p-1 text-red-400 hover:text-red-300"><TrashIcon className="w-5 h-5" /></button>
                                    </div>
                                </div>
                                <div className="pl-16 mt-2">
                                    {editingNoteId === item.id ? (
                                        <form onSubmit={(e) => { e.preventDefault(); handleNoteSave(item.id); }}>
                                            <input
                                                type="text"
                                                value={currentNote}
                                                onChange={(e) => setCurrentNote(e.target.value)}
                                                onBlur={() => handleNoteSave(item.id)}
                                                placeholder="e.g., extra spicy"
                                                className="w-full bg-background border border-secondary-light rounded-md px-2 py-1 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                                autoFocus
                                            />
                                        </form>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            {item.note && (
                                                <p className="text-sm italic text-text-secondary truncate flex-grow">{item.note}</p>
                                            )}
                                            <button 
                                                onClick={() => handleNoteEditStart(item.id, item.note || '')} 
                                                className="text-xs text-primary hover:underline flex-shrink-0"
                                            >
                                                {item.note ? 'Edit Note' : 'Add Note'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            
            {cart.length > 0 && (
                <div className="py-4 space-y-2 text-sm border-t border-secondary-light">
                    <div className="flex justify-between"><span className="text-text-secondary">Subtotal:</span> <span>LKR {subtotal.toFixed(2)}</span></div>
                     <div className="flex items-center justify-between">
                        <label htmlFor="discount" className="text-text-secondary">Discount (%):</label>
                        <input
                            type="number"
                            id="discount"
                            value={discount === 0 ? '' : discount}
                            onChange={handleDiscountChange}
                            placeholder="0"
                            min="0"
                            max="100"
                            className="w-20 bg-background border border-secondary-light rounded-md px-2 py-1 text-right text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    {discountAmount > 0 && (
                        <div className="flex justify-between text-red-400">
                            <span className="text-text-secondary">Discount Amount:</span>
                            <span>- LKR {discountAmount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between"><span className="text-text-secondary">Tax (5%):</span> <span>LKR {tax.toFixed(2)}</span></div>
                    <div className="flex justify-between font-bold text-lg text-accent border-t border-secondary-light pt-2 mt-2"><span className="text-text-primary">Total:</span> <span>LKR {total.toFixed(2)}</span></div>
                </div>
            )}
            
            {cart.length > 0 && (
                <div className="py-4 border-t border-secondary-light">
                    <h3 className="text-sm font-semibold mb-3 text-text-secondary">Payment Method</h3>
                    <div className="flex items-center justify-between gap-2">
                        <PaymentMethodButton
                            method="Cash"
                            icon={<CashIcon className="w-6 h-6"/>}
                            label="Cash"
                            currentMethod={paymentMethod}
                            onClick={setPaymentMethod}
                        />
                         <PaymentMethodButton
                            method="Card"
                            icon={<CreditCardIcon className="w-6 h-6"/>}
                            label="Card"
                            currentMethod={paymentMethod}
                            onClick={setPaymentMethod}
                        />
                    </div>
                </div>
            )}
             {!isDayActive && cart.length > 0 && (
                <div className="text-center p-2 my-2 bg-red-900/50 border border-red-500 rounded-lg">
                    <p className="text-red-300 text-sm font-semibold">An admin must start the sales day before processing orders.</p>
                </div>
            )}

            <div className="mt-auto pt-4 flex space-x-2">
                <button onClick={clearCart} disabled={cart.length === 0} className="bg-secondary-light hover:bg-opacity-80 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Clear
                </button>
                {renderActionButtons()}
            </div>

            {isPaymentModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-secondary rounded-lg p-8 max-w-sm w-full relative">
                        <button onClick={() => setPaymentModalOpen(false)} className="absolute top-3 right-3 text-text-secondary hover:text-text-primary"><CloseIcon className="w-6 h-6"/></button>
                        <h3 className="text-2xl font-bold text-center mb-4 font-serif">Confirm Payment</h3>
                        <p className="text-center text-lg text-text-secondary mb-2">Payment Method: {paymentMethod}</p>
                        <p className="text-center text-3xl font-bold text-accent mb-6">Total: LKR {total.toFixed(2)}</p>
                        <button onClick={handleConfirmPayment} className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-colors">
                            Confirm Payment
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;