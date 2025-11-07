
import React, { useState } from 'react';
import { User } from '../types';
import { AppIcon, UserIcon, EnvelopeIcon, PhoneIcon, LockClosedIcon } from './icons';

interface SignUpScreenProps {
    onSignUp: (newUser: Omit<User, 'id' | 'role'>) => boolean;
    onNavigateToLogin: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSignUp, onNavigateToLogin }) => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        const success = onSignUp({ name, username, phone, password });
        if (!success) {
            // Error toast is shown in App.tsx, can set local error if needed
            // setError('Username already exists.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-sm p-8 space-y-6 bg-secondary rounded-xl shadow-lg">
                <div className="text-center flex flex-col items-center">
                    <AppIcon className="w-16 h-16 text-accent mb-3" />
                    <h1 className="text-3xl font-serif font-bold text-accent">Create Account</h1>
                    <p className="mt-2 text-text-secondary">Join the team by creating an account</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label htmlFor="name" className="sr-only">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <UserIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="name" type="text" autoComplete="name" required value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-3 bg-background border border-secondary-light placeholder-gray-500 text-text-primary focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="Full Name"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="username-signup" className="sr-only">Username</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="username-signup" type="text" autoComplete="username" required value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-3 bg-background border border-secondary-light placeholder-gray-500 text-text-primary focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="Username"
                            />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="phone" className="sr-only">Phone</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <PhoneIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="phone" type="tel" autoComplete="tel" required value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-3 bg-background border border-secondary-light placeholder-gray-500 text-text-primary focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="Phone Number"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password-signup" className="sr-only">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LockClosedIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="password-signup" type="password" autoComplete="new-password" required value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-3 bg-background border border-secondary-light placeholder-gray-500 text-text-primary focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LockClosedIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="confirm-password" type="password" autoComplete="new-password" required value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-3 bg-background border border-secondary-light placeholder-gray-500 text-text-primary focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="Confirm Password"
                            />
                        </div>
                    </div>
                    
                    {error && (
                        <p className="text-center text-sm text-red-400">{error}</p>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary focus:ring-primary transition-colors"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>

                 <p className="text-center text-sm text-text-secondary">
                    Already have an account?{' '}
                    <button onClick={onNavigateToLogin} className="font-medium text-accent hover:text-yellow-400 focus:outline-none">
                        Sign in
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SignUpScreen;
