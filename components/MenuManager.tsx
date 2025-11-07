

import React, { useState, useMemo } from 'react';
import { MenuItem } from '../types';
import MenuItemForm from './MenuItemForm';
import { EditIcon, TrashIcon, PlusIcon } from './icons';

interface MenuManagerProps {
    menu: MenuItem[];
    onAdd: (item: Omit<MenuItem, 'id'>) => void;
    onUpdate: (item: MenuItem) => void;
    onDelete: (id: string) => void;
}

const MenuManager: React.FC<MenuManagerProps> = ({ menu, onAdd, onUpdate, onDelete }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortOrder, setSortOrder] = useState('name-asc');

    const handleOpenForm = (item: MenuItem | null = null) => {
        setEditingItem(item);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingItem(null);
    };

    const handleSave = (item: Omit<MenuItem, 'id'> | MenuItem) => {
        if ('id' in item) {
            onUpdate(item);
        } else {
            onAdd(item);
        }
        handleCloseForm();
    };

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            onDelete(itemToDelete.id);
            setItemToDelete(null);
        }
    };

    const categories = useMemo(() => ['All', ...new Set(menu.map(item => item.category))], [menu]);

    const displayedMenu = useMemo(() => {
        return menu
            .filter(item => selectedCategory === 'All' || item.category === selectedCategory)
            .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => {
                switch (sortOrder) {
                    case 'name-asc':
                        return a.name.localeCompare(b.name);
                    case 'name-desc':
                        return b.name.localeCompare(a.name);
                    case 'price-asc':
                        return a.price - b.price;
                    case 'price-desc':
                        return b.price - a.price;
                    default:
                        return 0;
                }
            });
    }, [menu, searchTerm, selectedCategory, sortOrder]);


    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold font-serif">Manage Menu</h1>
                <button onClick={() => handleOpenForm()} className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition-colors w-full sm:w-auto justify-center">
                    <PlusIcon className="w-5 h-5" />
                    <span>Add New Item</span>
                </button>
            </div>
            
            {/* Controls */}
            <div className="bg-secondary p-4 rounded-lg shadow-lg mb-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <input
                        type="text"
                        placeholder="Search items by name..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-background border border-secondary-light rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                     <select
                        value={sortOrder}
                        onChange={e => setSortOrder(e.target.value)}
                        className="w-full bg-background border border-secondary-light rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                     >
                        <option value="name-asc">Sort by Name (A-Z)</option>
                        <option value="name-desc">Sort by Name (Z-A)</option>
                        <option value="price-asc">Sort by Price (Low-High)</option>
                        <option value="price-desc">Sort by Price (High-Low)</option>
                     </select>
                </div>
                <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${
                                selectedCategory === category 
                                    ? 'bg-primary text-white' 
                                    : 'bg-secondary-light hover:bg-opacity-80'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Menu Grid */}
            {displayedMenu.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {displayedMenu.map(item => (
                        <div key={item.id} className="bg-secondary rounded-lg shadow-lg overflow-hidden flex flex-col group relative">
                            <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
                            <div className="p-4 flex flex-col flex-grow">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-lg text-text-primary flex-grow pr-2">{item.name}</h3>
                                    <p className="text-lg text-accent font-bold flex-shrink-0">LKR {item.price.toFixed(2)}</p>
                                </div>
                                <p className="text-sm text-text-secondary mt-1">{item.category}</p>
                                <p className="text-xs text-text-secondary mt-2 flex-grow">{item.description}</p>
                            </div>
                             <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button onClick={() => handleOpenForm(item)} className="p-2 bg-blue-500/80 hover:bg-blue-500 rounded-full text-white shadow-lg"><EditIcon className="w-5 h-5"/></button>
                                <button onClick={() => setItemToDelete(item)} className="p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white shadow-lg"><TrashIcon className="w-5 h-5" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-secondary rounded-lg shadow-lg text-center py-16">
                    <p className="text-text-secondary">No menu items match your criteria.</p>
                </div>
            )}
            

            {isFormOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-secondary rounded-lg p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
                       <MenuItemForm item={editingItem} onSave={handleSave} onCancel={handleCloseForm} />
                    </div>
                </div>
            )}
            
            {itemToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-secondary rounded-lg p-6 sm:p-8 max-w-md w-full">
                       <h2 className="text-2xl font-bold mb-4 font-serif">Confirm Deletion</h2>
                       <p className="text-text-secondary mb-6">Are you sure you want to delete the item "{itemToDelete.name}"?</p>
                       <div className="flex justify-end space-x-3">
                            <button onClick={() => setItemToDelete(null)} className="bg-secondary-light hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-lg transition-colors">
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

export default MenuManager;