

import React, { useState } from 'react';
import { User, RestaurantSettings } from '../types';

interface ProfileProps {
    user: User;
    onUpdateUser: (user: User) => void;
    settings: RestaurantSettings;
    onUpdateSettings: (settings: RestaurantSettings) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser, settings, onUpdateSettings }) => {
    // User form state
    const [name, setName] = useState(user.name);
    const [phone, setPhone] = useState(user.phone);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    
    // Settings form state
    const [restaurantName, setRestaurantName] = useState(settings.name);
    const [restaurantAddress, setRestaurantAddress] = useState(settings.address);
    const [restaurantPhone, setRestaurantPhone] = useState(settings.phone);

    const handleUserSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password && password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const updatedUser: User = {
            ...user,
            name,
            phone,
            password: password || user.password, // Only update password if a new one is provided
        };
        onUpdateUser(updatedUser);
    };

    const handleSettingsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateSettings({
            name: restaurantName,
            address: restaurantAddress,
            phone: restaurantPhone,
        });
    };

    return (
        <div className="max-w-2xl mx-auto space-y-10">
            <div>
                <h1 className="text-3xl font-bold mb-6 font-serif">Manage Profile</h1>
                <div className="bg-secondary p-4 sm:p-8 rounded-lg shadow-lg">
                    <form onSubmit={handleUserSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-text-secondary">Username</label>
                            <input type="text" id="username" value={user.username} readOnly
                                className="mt-1 block w-full bg-background/50 border border-secondary-light rounded-md p-3 text-text-secondary cursor-not-allowed sm:text-sm" />
                        </div>
                         <div>
                            <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Full Name</label>
                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required
                                className="mt-1 block w-full bg-background border border-secondary-light rounded-md p-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm" />
                        </div>
                         <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-text-secondary">Phone</label>
                            <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)}
                                className="mt-1 block w-full bg-background border border-secondary-light rounded-md p-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm" />
                        </div>
                        <div className="border-t border-secondary-light pt-6 space-y-6">
                             <p className="text-text-secondary text-sm">To change your password, enter a new one below. Otherwise, leave these fields blank.</p>
                             <div>
                                <label htmlFor="password"className="block text-sm font-medium text-text-secondary">New Password</label>
                                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full bg-background border border-secondary-light rounded-md p-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword"className="block text-sm font-medium text-text-secondary">Confirm New Password</label>
                                <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="mt-1 block w-full bg-background border border-secondary-light rounded-md p-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm" />
                            </div>
                        </div>
                        {error && <p className="text-sm text-red-400">{error}</p>}
                        <div className="flex justify-end">
                             <button type="submit"
                                className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition-colors">
                                Update Profile
                            </button>
                        </div>
                    </form>
                </div>
            </div>

             <div>
                <h1 className="text-3xl font-bold mb-6 font-serif">Restaurant Settings</h1>
                <div className="bg-secondary p-4 sm:p-8 rounded-lg shadow-lg">
                    <form onSubmit={handleSettingsSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="restaurantName" className="block text-sm font-medium text-text-secondary">Restaurant Name</label>
                            <input type="text" id="restaurantName" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} required
                                className="mt-1 block w-full bg-background border border-secondary-light rounded-md p-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm" />
                        </div>
                         <div>
                            <label htmlFor="restaurantAddress" className="block text-sm font-medium text-text-secondary">Address</label>
                            <input type="text" id="restaurantAddress" value={restaurantAddress} onChange={(e) => setRestaurantAddress(e.target.value)}
                                className="mt-1 block w-full bg-background border border-secondary-light rounded-md p-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm" />
                        </div>
                         <div>
                            <label htmlFor="restaurantPhone" className="block text-sm font-medium text-text-secondary">Contact Phone</label>
                            <input type="tel" id="restaurantPhone" value={restaurantPhone} onChange={(e) => setRestaurantPhone(e.target.value)}
                                className="mt-1 block w-full bg-background border border-secondary-light rounded-md p-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm" />
                        </div>
                        
                        <div className="flex justify-end">
                             <button type="submit"
                                className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition-colors">
                                Save Settings
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;