

import React, { useState } from 'react';
import { MenuItem } from '../types';
import { GoogleGenAI } from '@google/genai';
import { SparklesIcon } from './icons';
import { useToast } from '../contexts/ToastContext';

interface MenuItemFormProps {
    item: MenuItem | null;
    onSave: (item: Omit<MenuItem, 'id'> | MenuItem) => void;
    onCancel: () => void;
}

const MenuItemForm: React.FC<MenuItemFormProps> = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: item?.name || '',
        price: item?.price || 0,
        category: item?.category || '',
        imageUrl: item?.imageUrl || '',
        description: item?.description || '',
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const { showToast } = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        // For price, ensure it's a number
        if (name === 'price') {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerateDescription = async () => {
        if (!formData.name) {
            showToast("Please enter an item name first.");
            return;
        }
        setIsGenerating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Generate a short, delicious-sounding menu description for an item named '${formData.name}' in the '${formData.category}' category. The tone should be appealing to customers in an Indian restaurant. Keep it under 150 characters.`;
            
            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
            });

            const description = response.text.trim().replace(/^"|"$/g, ''); // Remove quotes
            setFormData(prev => ({ ...prev, description }));
            showToast("Description generated successfully!", "success");

        } catch (error) {
            console.error("Error generating description:", error);
            showToast("Failed to generate description. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalData = { ...formData };

        if (!item && !finalData.imageUrl) {
            finalData.imageUrl = `https://picsum.photos/seed/${encodeURIComponent(finalData.name) || 'item'}/400/300`;
        }

        if (item) {
             onSave({ ...item, ...finalData });
        } else {
             onSave(finalData);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold mb-4 font-serif">{item ? 'Edit' : 'Add'} Menu Item</h2>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full bg-background border border-secondary-light rounded-md p-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-text-secondary">Price</label>
                    <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" className="mt-1 block w-full bg-background border border-secondary-light rounded-md p-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-text-secondary">Category</label>
                    <input type="text" name="category" id="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full bg-background border border-secondary-light rounded-md p-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
            </div>
             <div>
                <div className="flex justify-between items-center">
                    <label htmlFor="description" className="block text-sm font-medium text-text-secondary">Description</label>
                    <button type="button" onClick={handleGenerateDescription} disabled={isGenerating || !formData.name} className="flex items-center space-x-1 text-xs text-accent hover:underline disabled:opacity-50 disabled:cursor-not-allowed">
                        <SparklesIcon className="w-4 h-4" />
                        <span>{isGenerating ? 'Generating...' : 'Generate with AI'}</span>
                    </button>
                </div>
                <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full bg-background border border-secondary-light rounded-md p-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
            </div>
             <div>
                <label className="block text-sm font-medium text-text-secondary">Image</label>
                <div className="mt-2 flex items-center space-x-4">
                    <img 
                        src={formData.imageUrl || `https://via.placeholder.com/96/1e293b/f8fafc?text=No+Image`}
                        alt="Menu item preview" 
                        className="w-24 h-24 object-cover rounded-md bg-background"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer bg-secondary-light hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">
                        Upload Image
                        <input id="image-upload" name="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                    </label>
                </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="bg-secondary-light hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition-colors">Save</button>
            </div>
        </form>
    );
};

export default MenuItemForm;
