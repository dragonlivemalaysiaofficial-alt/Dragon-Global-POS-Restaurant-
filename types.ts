export type PaymentMethod = 'Cash' | 'Card';
export type OrderType = 'Dine-In' | 'Take Away' | 'Room Service';
export type Role = 'admin' | 'worker';
export type OrderStatus = 'open' | 'ready' | 'completed';
export type RoomStatus = 'Vacant' | 'Occupied' | 'Needs Cleaning' | 'Out of Service';

export interface MenuItem {
    id: string;
    name: string;
    price: number;
    category: string;
    imageUrl: string;
    description?: string;
}

export interface CartItem extends MenuItem {
    quantity: number;
    note?: string;
}

export interface Customer {
    name: string;
    phone: string;
    email?: string;
    address?: string;
}

export interface CustomerProfile extends Customer {
    id: string;
    orderHistory: string[];
}

export interface User extends Customer {
    id: string;
    username: string;
    password: string; // In a real app, this should be hashed
    role: Role;
}

export interface Room {
    id: string;
    number: string;
    status: RoomStatus;
    guest?: Customer;
}

export interface Order {
    id:string;
    items: CartItem[];
    total: number;
    customer: Customer;
    date: string;
    discountPercentage?: number;
    discountAmount?: number;
    paymentMethod: PaymentMethod;
    tableNumber?: string;
    orderType: OrderType;
    status: OrderStatus;
    waiterName?: string;
}

export interface DaySale {
    id: string;
    startTime: string;
    endTime?: string;
    startUser: string;
    endUser?: string;
    openingFloat: number;
    closingFloat?: number;
    cashSales: number;
    cardSales: number;
    totalSales: number;
    difference: number;
    status: 'active' | 'ended';
    orderIds: string[];
}

export enum View {
    POS = 'POS',
    HOTEL = 'HOTEL',
    OPEN_ORDERS = 'OPEN_ORDERS',
    KDS = 'KDS',
    MANAGE_MENU = 'MANAGE_MENU',
    SALES_REPORT = 'SALES_REPORT',
    AI_ANALYST = 'AI_ANALYST',
    DAY_SALES = 'DAY_SALES',
    DAY_SALES_REPORTS = 'DAY_SALES_REPORTS',
    ORDER_HISTORY = 'ORDER_HISTORY',
    PROFILE = 'PROFILE',
    CUSTOMERS = 'CUSTOMERS',
    EMPLOYEES = 'EMPLOYEES',
}

export interface RestaurantSettings {
    name: string;
    address: string;
    phone: string;
}