import React, { useState } from 'react';
import { User } from '../types';
import { EditIcon, TrashIcon, PlusIcon } from './icons';
import EmployeeForm from './EmployeeForm';

interface EmployeeManagementProps {
    users: User[];
    currentUser: User;
    onAdd: (user: Omit<User, 'id'>) => boolean;
    onUpdate: (user: User) => void;
    onDelete: (id: string) => void;
}

const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ users, currentUser, onAdd, onUpdate, onDelete }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const handleOpenForm = (user: User | null = null) => {
        setEditingUser(user);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingUser(null);
    };

    const handleSave = (user: Omit<User, 'id'> | User) => {
        if ('id' in user) {
            onUpdate(user);
        } else {
            const success = onAdd(user as Omit<User, 'id'>);
            if (!success) return; // Keep form open if add failed (e.g., duplicate username)
        }
        handleCloseForm();
    };

    const handleConfirmDelete = () => {
        if (userToDelete) {
            onDelete(userToDelete.id);
            setUserToDelete(null);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold font-serif">Employee Management</h1>
                <button onClick={() => handleOpenForm()} className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition-colors w-full sm:w-auto justify-center">
                    <PlusIcon className="w-5 h-5" />
                    <span>Add Employee</span>
                </button>
            </div>

            <div className="bg-secondary rounded-lg shadow-lg overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-secondary-light">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Username</th>
                            <th className="p-4">Phone</th>
                            <th className="p-4">Role</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b border-background hover:bg-secondary-light/50">
                                <td className="p-4">{user.name} {user.id === currentUser.id && <span className="text-xs text-accent ml-2">(You)</span>}</td>
                                <td className="p-4 font-mono text-sm">{user.username}</td>
                                <td className="p-4">{user.phone}</td>
                                <td className="p-4 capitalize">{user.role}</td>
                                <td className="p-4">
                                    <div className="flex justify-center space-x-2">
                                        <button onClick={() => handleOpenForm(user)} className="p-2 text-blue-400 hover:text-blue-300"><EditIcon className="w-5 h-5"/></button>
                                        {user.id !== currentUser.id && (
                                            <button onClick={() => setUserToDelete(user)} className="p-2 text-red-400 hover:text-red-300"><TrashIcon className="w-5 h-5"/></button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isFormOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-secondary rounded-lg p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
                       <EmployeeForm 
                         user={editingUser} 
                         onSave={handleSave} 
                         onCancel={handleCloseForm} 
                         isEditingSelf={!!(editingUser && editingUser.id === currentUser.id)}
                       />
                    </div>
                </div>
            )}
            
            {userToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-secondary rounded-lg p-6 sm:p-8 max-w-md w-full">
                       <h2 className="text-2xl font-bold mb-4 font-serif">Confirm Deletion</h2>
                       <p className="text-text-secondary mb-6">Are you sure you want to delete the employee "{userToDelete.name}"?</p>
                       <div className="flex justify-end space-x-3">
                            <button onClick={() => setUserToDelete(null)} className="bg-secondary-light hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-lg transition-colors">
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

export default EmployeeManagement;
