
import React from 'react';
import { ToastMessage } from '../contexts/ToastContext';
import { SuccessIcon, InfoIcon, CloseIcon } from './icons';

interface ToastContainerProps {
    toasts: ToastMessage[];
    onRemove: (id: number) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
    return (
        <div className="fixed bottom-5 right-5 z-[100] space-y-3 w-full max-w-xs sm:max-w-sm">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className="flex items-center p-4 rounded-lg shadow-lg bg-secondary-light text-text-primary animate-fade-in-up relative"
                    role="alert"
                >
                    {toast.type === 'success' ? (
                        <SuccessIcon className="w-6 h-6 text-green-400 mr-3 flex-shrink-0" />
                    ) : (
                        <InfoIcon className="w-6 h-6 text-blue-400 mr-3 flex-shrink-0" />
                    )}
                    <span className="flex-grow">{toast.message}</span>
                    <button onClick={() => onRemove(toast.id)} className="ml-3 text-text-secondary hover:text-text-primary">
                        <CloseIcon className="w-5 h-5"/>
                    </button>
                </div>
            ))}
            <style>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ToastContainer;
