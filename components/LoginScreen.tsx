import React, { useState } from 'react';
import { User } from '../types';
import { UserIcon, AppIcon, LockClosedIcon } from './icons';
import { useToast } from '../contexts/ToastContext';

interface LoginScreenProps {
    onAuthSuccess: (user: User) => void;
    users: User[];
    onNavigateToSignUp: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onAuthSuccess, users, onNavigateToSignUp }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { showToast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            onAuthSuccess(user);
        } else {
            setError('Invalid username or password. Please try again.');
        }
    };

    const handleForgotPassword = () => {
        showToast('Password reset functionality is not implemented in this demo.', 'info');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-sm p-8 space-y-6 bg-secondary rounded-xl shadow-lg">
                <div className="text-center flex flex-col items-center">
                    <AppIcon className="w-16 h-16 text-accent mb-3" />
                    <h1 className="text-3xl font-serif font-bold text-accent">Dragon Global POS</h1>
                    <p className="mt-2 text-text-secondary">Please sign in to your account</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="sr-only">Username</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <UserIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-3 bg-background border border-secondary-light placeholder-gray-500 text-text-primary focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="Username"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password-input" className="sr-only">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LockClosedIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="password-input"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-3 bg-background border border-secondary-light placeholder-gray-500 text-text-primary focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                        <div className="text-right mt-2">
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="text-sm font-medium text-accent hover:text-yellow-400 focus:outline-none"
                            >
                                Forgot your password?
                            </button>
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
                            Sign In
                        </button>
                    </div>
                </form>

                <p className="text-center text-sm text-text-secondary">
                    Don't have an account?{' '}
                    <button onClick={onNavigateToSignUp} className="font-medium text-accent hover:text-yellow-400 focus:outline-none">
                        Sign up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginScreen;