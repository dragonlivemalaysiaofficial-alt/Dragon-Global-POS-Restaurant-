import React, { useState } from 'react';
import { User, Role } from '../types';

interface EmployeeFormProps {
    user: Omit<User, 'id' | 'role'> | User | null;
    onSave: (user: Omit<User, 'id'> | User) => void;
    onCancel: () => void;
    isEditingSelf: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ user, onSave, onCancel, isEditingSelf }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        username: user?.username || '',
        phone: user?.phone || '',
        password: '',
        role: 'role' in (user || {}) ? (user as User).role : 'worker',
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (user && 'id' in user) {
            // Editing existing user
            const updatedUser: User = {
                ...(user as User),
                name: formData.name,
                username: formData.username,
                phone: formData.phone,
                role: formData.role as Role,
                password: formData.password ? formData.password : user.password,
            };
            onSave(updatedUser);
        } else {
            // Creating new user
            if (!formData.password) {
                setError('Password is required for new employees.');
                return;
            }
            const newUser: Omit<User, 'id'> = {
                name: formData.name,
                username: formData.username,
                phone: formData.phone,
                password: formData.password,
                role: formData.role as Role,
            };
            onSave(newUser);
        }
    };

    const isEditing = user && 'id' in user;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold mb-4 font-serif">{isEditing ? 'Edit' : 'Add'} Employee</h2>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Full Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full bg-background border border-secondary-light rounded-md p-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-text-secondary">Username</label>
                <input type="text" name="username" id="username" value={formData.username} onChange={handleChange} required className="mt-1 block w-full bg-background border border-secondary-light rounded-md p-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-text-secondary">Phone</label>
                <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full bg-background border border-secondary-light rounded-md p-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-secondary">Password</label>
                <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} placeholder={isEditing ? 'Leave blank to keep unchanged' : ''} required={!isEditing} className="mt-1 block w-full bg-background border border-secondary-light rounded-md p-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
                <label htmlFor="role" className="block text-sm font-medium text-text-secondary">Role</label>
                <select name="role" id="role" value={formData.role} onChange={handleChange} disabled={isEditingSelf} className="mt-1 block w-full bg-background border border-secondary-light rounded-md p-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed">
                    <option value="worker">Worker</option>
                    <option value="admin">Admin</option>
                </select>
                {isEditingSelf && <p className="text-xs text-text-secondary mt-1">You cannot change your own role.</p>}
            </div>
            {error && <p className="text-sm text-red-400 text-center">{error}</p>}
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="bg-secondary-light hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition-colors">Save</button>
            </div>
        </form>
    );
};

export default EmployeeForm;
