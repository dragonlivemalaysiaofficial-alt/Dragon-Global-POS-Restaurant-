


import React from 'react';
import { MenuItem } from '../types';

interface MenuItemCardProps {
    item: MenuItem;
    onAddToCart: () => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart }) => {
    return (
        <div 
            className="bg-background rounded-lg shadow-lg overflow-hidden flex flex-col justify-between transform hover:-translate-y-1 transition-all duration-300"
        >
            <div>
                <img src={item.imageUrl} alt={item.name} className="w-full h-32 object-cover" />
                <div className="p-3">
                    <h3 className="font-semibold text-text-primary truncate">{item.name}</h3>
                     {item.description && (
                        <p className="text-xs text-text-secondary mt-1 h-8 overflow-hidden text-ellipsis">
                            {item.description}
                        </p>
                    )}
                    <p className="text-lg text-accent font-bold mt-1">LKR {item.price.toFixed(2)}</p>
                </div>
            </div>
            <div className="p-3 pt-0">
                 <button
                    onClick={onAddToCart}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-3 rounded-md text-sm transition-colors"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default MenuItemCard;