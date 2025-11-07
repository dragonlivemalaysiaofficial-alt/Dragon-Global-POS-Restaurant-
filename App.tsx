import React, { useState, useEffect } from 'react';
import { MenuItem, CartItem, Order, Customer, View, User, PaymentMethod, RestaurantSettings, OrderType, OrderStatus, Room, RoomStatus, CustomerProfile, DaySale } from './types';
import { INITIAL_MENU, INITIAL_ROOMS } from './constants';
import useLocalStorage from './hooks/useLocalStorage';
import LoginScreen from './components/LoginScreen';
import SignUpScreen from './components/SignUpScreen';
import Header from './components/Header';
import POS from './components/POS';
import MenuManager from './components/MenuManager';
import SalesReport from './components/SalesReport';
import Profile from './components/Profile';
import OrderHistory from './components/OrderHistory';
import OpenOrders from './components/OpenOrders';
import KitchenDisplay from './components/KitchenDisplay';
import HotelView from './components/HotelView';
import CustomerManagement from './components/CustomerManagement';
import EmployeeManagement from './components/EmployeeManagement';
import DaySales from './components/DaySales';
import DaySalesReports from './components/DaySalesReports';
import AIAnalyst from './components/AIAnalyst';
import { useToast } from './contexts/ToastContext';

const DEFAULT_USERS: User[] = [
    {
        id: 'user-admin',
        username: 'admin',
        password: 'admin',
        name: 'Admin',
        phone: '999-999-9999',
        role: 'admin'
    },
    {
        id: 'user-cw1',
        username: 'worker1',
        password: 'password1',
        name: 'Suresh',
        phone: '111-222-3333',
        role: 'worker'
    },
    {
        id: 'user-cw2',
        username: 'worker2',
        password: 'password2',
        name: 'Ramesh',
        phone: '444-555-6666',
        role: 'worker'
    }
];

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);
    const [users, setUsers] = useLocalStorage<User[]>('users', []);
    const [view, setView] = useLocalStorage<View>('currentView', View.POS);
    const [authView, setAuthView] = useState<'login' | 'signup'>('login');

    const [menu, setMenu] = useLocalStorage<MenuItem[]>('menu', INITIAL_MENU);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [customer, setCustomer] = useLocalStorage<Customer>('customer', { name: '', phone: '' });
    const [orders, setOrders] = useLocalStorage<Order[]>('orders', []);
    const [lastOrder, setLastOrder] = useState<Order | null>(null);
    const [discount, setDiscount] = useState<number>(0);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
    const [tableNumber, setTableNumber] = useState<string>('');
    const [orderType, setOrderType] = useState<OrderType>('Dine-In');
    const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
    const [rooms, setRooms] = useLocalStorage<Room[]>('rooms', []);
    const [customerProfiles, setCustomerProfiles] = useLocalStorage<CustomerProfile[]>('customerProfiles', []);

    // Day Sales State
    const [activeDaySale, setActiveDaySale] = useLocalStorage<DaySale | null>('activeDaySale', null);
    const [daySalesHistory, setDaySalesHistory] = useLocalStorage<DaySale[]>('daySalesHistory', []);

    const { showToast } = useToast();

    const [restaurantSettings, setRestaurantSettings] = useLocalStorage<RestaurantSettings>('restaurantSettings', {
        name: 'Dragon Global POS',
        address: '123 Spice Street, Food City',
        phone: '(123) 456-7890',
    });

    useEffect(() => {
        const storedUsers = window.localStorage.getItem('users');
        if (!storedUsers || JSON.parse(storedUsers).length === 0) {
            setUsers(DEFAULT_USERS);
        }
    }, [setUsers]);

    useEffect(() => {
        const storedRooms = window.localStorage.getItem('rooms');
        if (!storedRooms || JSON.parse(storedRooms).length === 0) {
            setRooms(INITIAL_ROOMS);
        }
    }, [setRooms]);
    
    const kdsOrders = orders.filter(o => o.status === 'open');
    const openAndReadyOrders = orders.filter(o => o.status === 'open' || o.status === 'ready');
    const completedOrders = orders.filter(o => o.status === 'completed');

    const handleAuthSuccess = (user: User) => {
        setCurrentUser(user);
        setCustomer({ name: user.name, phone: user.phone });
        setView(View.POS);
    };

    const handleSignUp = (newUser: Omit<User, 'id' | 'role'>) => {
        const existingUser = users.find(u => u.username === newUser.username);
        if (existingUser) {
            showToast('Username already exists. Please choose another one.');
            return false;
        }

        const user: User = {
            ...newUser,
            id: `user-${Date.now()}`,
            role: 'worker',
        };

        setUsers(prev => [...prev, user]);
        handleAuthSuccess(user);
        showToast('Account created successfully!', 'success');
        return true;
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setView(View.POS);
        clearCart();
        setAuthView('login');
    };

    const handleProfileUpdate = (updatedUser: User) => {
        setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
        setCurrentUser(updatedUser);
        setCustomer({ name: updatedUser.name, phone: updatedUser.phone });
        showToast('Profile updated successfully!', 'success');
        setView(View.POS);
    };

    const handleUpdateSettings = (settings: RestaurantSettings) => {
        setRestaurantSettings(settings);
        showToast('Restaurant settings updated successfully!', 'success');
    };

    const addUser = (userToAdd: Omit<User, 'id'>): boolean => {
        const existingUser = users.find(u => u.username === userToAdd.username);
        if (existingUser) {
            showToast(`Username "${userToAdd.username}" already exists.`);
            return false;
        }

        const newUser: User = {
            ...userToAdd,
            id: `user-${Date.now()}`,
        };
        setUsers(prev => [...prev, newUser]);
        showToast('Employee created successfully!', 'success');
        return true;
    };

    const updateUser = (updatedUser: User) => {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
        if (currentUser && currentUser.id === updatedUser.id) {
            setCurrentUser(updatedUser);
        }
        showToast('Employee updated successfully!', 'success');
    };

    const deleteUser = (userId: string) => {
        if (currentUser && currentUser.id === userId) {
            showToast("You cannot delete your own account.", 'info');
            return;
        }
        setUsers(prev => prev.filter(u => u.id !== userId));
        showToast('Employee deleted.', 'info');
    };

    const addToCart = (item: MenuItem) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(cartItem => cartItem.id === item.id && !cartItem.note);
            if (existingItem) {
                return prevCart.map(cartItem =>
                    cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
                );
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
    };

    const updateCartItemQuantity = (itemId: string, quantity: number) => {
        setCart(prevCart => {
            if (quantity <= 0) {
                return prevCart.filter(item => item.id !== itemId);
            }
            return prevCart.map(item =>
                item.id === itemId ? { ...item, quantity } : item
            );
        });
    };
    
    const updateCartItemNote = (itemId: string, note: string) => {
        setCart(prevCart => prevCart.map(item =>
            item.id === itemId ? { ...item, note: note.trim() } : item
        ));
    };

    const clearCart = () => {
        setCart([]);
        if (currentUser) {
            setCustomer({ name: currentUser.name, phone: currentUser.phone });
        } else {
            setCustomer({ name: '', phone: '' });
        }
        setLastOrder(null);
        setDiscount(0);
        setPaymentMethod('Cash');
        setTableNumber('');
        setOrderType('Dine-In');
        setActiveOrderId(null);
    };
    
    const saveOrUpdateOrder = () => {
        if (cart.length === 0) return;
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const discountAmount = subtotal * (discount / 100);
        const tax = (subtotal - discountAmount) * 0.05;
        const total = subtotal - discountAmount + tax;

        const orderData = {
            items: cart,
            total,
            customer,
            date: new Date().toISOString(),
            discountPercentage: discount,
            discountAmount: discountAmount,
            paymentMethod: paymentMethod,
            tableNumber: tableNumber,
            orderType: orderType,
            status: 'open' as const,
            waiterName: currentUser?.name,
        };

        if (activeOrderId) {
            // Preserve original date when updating
            const existingOrder = orders.find(o => o.id === activeOrderId);
            const updatedOrderData = { ...existingOrder, ...orderData, date: existingOrder?.date || new Date().toISOString() };
            setOrders(prev => prev.map(o => o.id === activeOrderId ? updatedOrderData : o));
            showToast(`Order for ${orderType === 'Dine-In' ? 'table' : 'room'} ${tableNumber} updated successfully!`, 'success');
        } else {
            const newOrder: Order = { id: `order-${Date.now()}`, ...orderData };
            setOrders(prev => [...prev, newOrder]);
            showToast(`Order for ${orderType === 'Dine-In' ? 'table' : 'room'} ${tableNumber} saved successfully!`, 'success');
        }
        clearCart();
    };

    const loadOrderToCart = (orderId: string) => {
        const order = orders.find(o => o.id === orderId);
        if (order) {
            setActiveOrderId(order.id);
            setCart(order.items);
            setCustomer(order.customer);
            setTableNumber(order.tableNumber || '');
            setDiscount(order.discountPercentage || 0);
            setPaymentMethod(order.paymentMethod);
            setOrderType(order.orderType);
            setView(View.POS);
        }
    };

    const completeOrder = () => {
        if (cart.length === 0) return;
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const discountAmount = subtotal * (discount / 100);
        const tax = (subtotal - discountAmount) * 0.05;
        const total = subtotal - discountAmount + tax;
        
        const finalOrderData = {
            items: cart,
            total,
            customer,
            date: new Date().toISOString(),
            discountPercentage: discount,
            discountAmount: discountAmount,
            paymentMethod: paymentMethod,
            tableNumber: (orderType === 'Dine-In' || orderType === 'Room Service') ? tableNumber : '',
            orderType: orderType,
            status: 'completed' as const,
            waiterName: currentUser?.name,
        };

        let completedOrder: Order;

        if (activeOrderId) {
            const existingOrder = orders.find(o => o.id === activeOrderId);
            completedOrder = { ...existingOrder!, ...finalOrderData };
            setOrders(prev => prev.map(o => o.id === activeOrderId ? completedOrder : o));
        } else {
            completedOrder = { id: `order-${Date.now()}`, ...finalOrderData };
            setOrders(prevOrders => [...prevOrders, completedOrder]);
        }
        
        if (activeDaySale) {
            setActiveDaySale(prev => {
                if (!prev) return null;
                // Avoid duplicating order IDs if an order is updated and completed multiple times within the same day
                const newOrderIds = prev.orderIds.includes(completedOrder.id) 
                    ? prev.orderIds 
                    : [...prev.orderIds, completedOrder.id];
                return { ...prev, orderIds: newOrderIds };
            });
        }
        
        // Link order to customer profile
        if (customer.phone) {
            setCustomerProfiles(prevProfiles => {
                const profileIndex = prevProfiles.findIndex(p => p.phone === customer.phone);
                if (profileIndex > -1) {
                    const updatedProfiles = [...prevProfiles];
                    const profile = { ...updatedProfiles[profileIndex] };
                    if (!profile.orderHistory) {
                        profile.orderHistory = [];
                    }
                    if (!profile.orderHistory.includes(completedOrder.id)) {
                        profile.orderHistory.push(completedOrder.id);
                    }
                    updatedProfiles[profileIndex] = profile;
                    return updatedProfiles;
                }
                return prevProfiles;
            });
        }

        setLastOrder(completedOrder);
        setCart([]);
        setActiveOrderId(null);
    };

    const markOrderAsReady = (orderId: string) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'ready' } : o));
    };

    const handleUpdateRoomStatus = (roomId: string, status: RoomStatus) => {
        setRooms(prevRooms => prevRooms.map(r => r.id === roomId ? { ...r, status } : r));
        showToast(`Room status updated successfully!`, 'success');
    };

    const handleStartDay = (openingFloat: number) => {
        if (activeDaySale) {
            showToast("A sales day is already in progress.", 'info');
            return;
        }
        if (!currentUser) {
            showToast("No user logged in.", 'info');
            return;
        }
        const newDaySale: DaySale = {
            id: `day-${Date.now()}`,
            startTime: new Date().toISOString(),
            startUser: currentUser.name,
            openingFloat,
            status: 'active',
            orderIds: [],
            cashSales: 0,
            cardSales: 0,
            totalSales: 0,
            difference: 0,
        };
        setActiveDaySale(newDaySale);
        showToast(`Day started with an opening float of LKR ${openingFloat.toFixed(2)}.`, 'success');
        setView(View.POS);
    };

    const handleEndDay = (closingFloat: number) => {
        if (!activeDaySale || !currentUser) {
            showToast("No active sales day to end.", 'info');
            return;
        }
        
        const dayOrders = completedOrders.filter(o => activeDaySale.orderIds.includes(o.id));
        
        const cashSales = dayOrders
            .filter(o => o.paymentMethod === 'Cash')
            .reduce((sum, o) => sum + o.total, 0);

        const cardSales = dayOrders
            .filter(o => o.paymentMethod === 'Card')
            .reduce((sum, o) => sum + o.total, 0);

        const totalSales = cashSales + cardSales;
        const expectedCash = activeDaySale.openingFloat + cashSales;
        const difference = closingFloat - expectedCash;

        const endedDay: DaySale = {
            ...activeDaySale,
            endTime: new Date().toISOString(),
            endUser: currentUser.name,
            status: 'ended',
            cashSales,
            cardSales,
            totalSales,
            closingFloat,
            difference,
        };

        setDaySalesHistory(prev => [...prev, endedDay]);
        setActiveDaySale(null);
        showToast("Day sales ended successfully. Report generated.", 'success');
        setView(View.DAY_SALES_REPORTS);
    };
    
    // Menu CRUD Operations
    const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
        const newItem: MenuItem = { ...item, id: `menu-${Date.now()}` };
        setMenu(prevMenu => [...prevMenu, newItem]);
    };

    const updateMenuItem = (updatedItem: MenuItem) => {
        setMenu(prevMenu => prevMenu.map(item => item.id === updatedItem.id ? updatedItem : item));
    };

    const deleteMenuItem = (itemId: string) => {
        setMenu(prevMenu => prevMenu.filter(item => item.id !== itemId));
    };

    const handleSaveCustomerProfile = (customerToSave: Customer) => {
        const name = customerToSave.name?.trim();
        const phone = customerToSave.phone?.trim();

        if (!name || !phone) {
            showToast('Customer name and phone are required to save profile.');
            return;
        }

        const existingByPhone = customerProfiles.find(p => p.phone === phone);

        if (existingByPhone) {
            if (existingByPhone.name !== name) {
                setCustomerProfiles(prev => prev.map(p => p.id === existingByPhone.id ? { ...p, name } : p));
                showToast(`Customer name updated for phone ${phone}.`, 'success');
            } else {
                showToast(`Customer profile with phone ${phone} already exists.`, 'info');
            }
        } else {
            const newProfile: CustomerProfile = {
                id: `cust-${Date.now()}`,
                name,
                phone,
                email: customerToSave.email || '',
                address: customerToSave.address || '',
                orderHistory: [],
            };
            setCustomerProfiles(prev => [...prev, newProfile]);
            showToast('New customer profile created successfully!', 'success');
        }
    };

    const handleUpdateCustomerProfile = (updatedProfile: CustomerProfile) => {
        setCustomerProfiles(prev => prev.map(p => p.id === updatedProfile.id ? updatedProfile : p));
        showToast('Customer profile updated successfully!', 'success');
    };

    const handleDeleteCustomerProfile = (customerId: string) => {
        setCustomerProfiles(prev => prev.filter(p => p.id !== customerId));
        showToast('Customer profile deleted.', 'info');
    };


    const renderView = () => {
        switch (view) {
            case View.POS:
                return <POS 
                    menu={menu}
                    cart={cart}
                    customer={customer}
                    lastOrder={lastOrder}
                    addToCart={addToCart}
                    updateCartItemQuantity={updateCartItemQuantity}
                    updateCartItemNote={updateCartItemNote}
                    clearCart={clearCart}
                    setCustomer={setCustomer}
                    completeOrder={completeOrder}
                    saveOrUpdateOrder={saveOrUpdateOrder}
                    activeOrderId={activeOrderId}
                    discount={discount}
                    setDiscount={setDiscount}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    tableNumber={tableNumber}
                    setTableNumber={setTableNumber}
                    orderType={orderType}
                    setOrderType={setOrderType}
                    restaurantSettings={restaurantSettings}
                    customerProfiles={customerProfiles}
                    onSaveCustomerProfile={handleSaveCustomerProfile}
                    isDayActive={!!activeDaySale}
                />;
            case View.MANAGE_MENU:
                return <MenuManager menu={menu} onAdd={addMenuItem} onUpdate={updateMenuItem} onDelete={deleteMenuItem} />;
            case View.SALES_REPORT:
                return <SalesReport orders={completedOrders} />;
            case View.PROFILE:
                return currentUser && <Profile user={currentUser} onUpdateUser={handleProfileUpdate} settings={restaurantSettings} onUpdateSettings={handleUpdateSettings}/>;
            case View.ORDER_HISTORY:
                return <OrderHistory orders={completedOrders} restaurantSettings={restaurantSettings}/>;
            case View.OPEN_ORDERS:
                return <OpenOrders orders={openAndReadyOrders} onSelectOrder={loadOrderToCart} />;
            case View.KDS:
                return <KitchenDisplay orders={kdsOrders} onMarkAsReady={markOrderAsReady} />;
            case View.HOTEL:
                return <HotelView rooms={rooms} onUpdateStatus={handleUpdateRoomStatus} />;
            case View.CUSTOMERS:
                return <CustomerManagement 
                    customers={customerProfiles} 
                    orders={orders}
                    onUpdate={handleUpdateCustomerProfile}
                    onDelete={handleDeleteCustomerProfile}
                    restaurantSettings={restaurantSettings}
                />;
            case View.EMPLOYEES:
                return currentUser?.role === 'admin' ? (
                    <EmployeeManagement 
                        users={users}
                        currentUser={currentUser}
                        onAdd={addUser}
                        onUpdate={updateUser}
                        onDelete={deleteUser}
                    />
                ) : <p className="text-center text-red-500">Access Denied. You must be an admin to view this page.</p>;
            case View.DAY_SALES:
                return currentUser?.role === 'admin' ? (
                    <DaySales
                        activeDaySale={activeDaySale}
                        completedOrders={completedOrders}
                        onStartDay={handleStartDay}
                        onEndDay={handleEndDay}
                    />
                ) : <p className="text-center text-red-500">Access Denied. You must be an admin to view this page.</p>;
            case View.DAY_SALES_REPORTS:
                 return currentUser?.role === 'admin' ? (
                    <DaySalesReports reports={daySalesHistory} />
                ) : <p className="text-center text-red-500">Access Denied. You must be an admin to view this page.</p>;
            case View.AI_ANALYST:
                return currentUser?.role === 'admin' ? (
                    <AIAnalyst orders={completedOrders} />
                ) : <p className="text-center text-red-500">Access Denied. You must be an admin to view this page.</p>;
            default:
                return <POS 
                    menu={menu}
                    cart={cart}
                    customer={customer}
                    lastOrder={lastOrder}
                    addToCart={addToCart}
                    updateCartItemQuantity={updateCartItemQuantity}
                    updateCartItemNote={updateCartItemNote}
                    clearCart={clearCart}
                    setCustomer={setCustomer}
                    completeOrder={completeOrder}
                    saveOrUpdateOrder={saveOrUpdateOrder}
                    activeOrderId={activeOrderId}
                    discount={discount}
                    setDiscount={setDiscount}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    tableNumber={tableNumber}
                    setTableNumber={setTableNumber}
                    orderType={orderType}
                    setOrderType={setOrderType}
                    restaurantSettings={restaurantSettings}
                    customerProfiles={customerProfiles}
                    onSaveCustomerProfile={handleSaveCustomerProfile}
                    isDayActive={!!activeDaySale}
                />;
        }
    };

    if (!currentUser) {
        if (authView === 'signup') {
            return <SignUpScreen onSignUp={handleSignUp} onNavigateToLogin={() => setAuthView('login')} />;
        }
        return <LoginScreen onAuthSuccess={handleAuthSuccess} users={users} onNavigateToSignUp={() => setAuthView('signup')} />;
    }

    return (
        <div className="min-h-screen bg-background">
            <Header
                currentUser={currentUser}
                currentView={view}
                setView={setView}
                onLogout={handleLogout}
                restaurantSettings={restaurantSettings}
            />
            <main className="p-4 sm:p-6">
                {renderView()}
            </main>
        </div>
    );
};

export default App;