


import { MenuItem, Room } from './types';

export const INITIAL_MENU: MenuItem[] = [
    { id: '1', name: 'Idly', price: 30, category: 'Breakfast', imageUrl: 'https://picsum.photos/seed/idly/400/300', description: 'Soft, fluffy steamed rice cakes, a South Indian classic.' },
    { id: '2', name: 'Puttu', price: 40, category: 'Breakfast', imageUrl: 'https://picsum.photos/seed/puttu/400/300', description: 'Steamed cylinders of ground rice layered with coconut.' },
    { id: '3', name: 'Poori', price: 50, category: 'Breakfast', imageUrl: 'https://picsum.photos/seed/poori/400/300', description: 'Deep-fried circles of unleavened whole-wheat bread.' },
    { id: '4', name: 'Coffee', price: 20, category: 'Beverages', imageUrl: 'https://picsum.photos/seed/coffee/400/300', description: 'Freshly brewed South Indian filter coffee.' },
    { id: '5', name: 'Dosai', price: 60, category: 'Breakfast', imageUrl: 'https://picsum.photos/seed/dosai/400/300', description: 'A thin, crispy pancake made from a fermented batter.' },
    { id: '6', name: 'Vada', price: 25, category: 'Snacks', imageUrl: 'https://picsum.photos/seed/vada/400/300', description: 'Savory fried fritters made from spiced lentil batter.' },
    { id: '7', name: 'Pazham Pori', price: 15, category: 'Snacks', imageUrl: 'https://picsum.photos/seed/pori/400/300', description: 'Sweet banana fritters, a popular Keralan snack.' },
];

export const INITIAL_ROOMS: Room[] = [
    { id: 'room-101', number: '101', status: 'Vacant' },
    { id: 'room-102', number: '102', status: 'Occupied', guest: { name: 'John Doe', phone: '111-222-3333'} },
    { id: 'room-103', number: '103', status: 'Vacant' },
    { id: 'room-104', number: '104', status: 'Needs Cleaning' },
    { id: 'room-201', number: '201', status: 'Occupied', guest: { name: 'Jane Smith', phone: '444-555-6666'} },
    { id: 'room-202', number: '202', status: 'Out of Service' },
    { id: 'room-203', number: '203', status: 'Vacant' },
    { id: 'room-204', number: '204', status: 'Needs Cleaning' },
    { id: 'room-301', number: '301', status: 'Vacant' },
    { id: 'room-302', number: '302', status: 'Vacant' },
    { id: 'room-303', number: '303', status: 'Occupied', guest: { name: 'Peter Jones', phone: '777-888-9999'} },
    { id: 'room-304', number: '304', status: 'Vacant' },
];