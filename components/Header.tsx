import React, { useState } from 'react';
import { View, User, RestaurantSettings } from '../types';
import { AppIcon, CashIcon, MenuIcon, ReportIcon, LogoutIcon, UserIcon, HistoryIcon, ClipboardListIcon, CloseIcon, KitchenIcon, HotelIcon, UsersIcon, BriefcaseIcon, CashRegisterIcon, LightBulbIcon } from './icons';

interface HeaderProps {
    currentUser: User | null;
    currentView: View;
    setView: (view: View) => void;
    onLogout: () => void;
    restaurantSettings: RestaurantSettings;
}

const NavButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
    isMobile?: boolean;
}> = ({ icon, label, isActive, onClick, isMobile = false }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-3 transition-colors duration-200 ${
            isMobile
                ? `px-4 py-3 text-lg w-full ${isActive ? 'bg-primary text-white' : 'text-text-primary hover:bg-secondary-light'}`
                : `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-primary text-white' : 'text-text-secondary hover:bg-secondary-light hover:text-text-primary'}`
        }`}
    >
        {icon}
        <span className={isMobile ? '' : 'hidden md:inline'}>{label}</span>
    </button>
);

const Header: React.FC<HeaderProps> = ({ currentUser, currentView, setView, onLogout, restaurantSettings }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const handleSetView = (view: View) => {
        setView(view);
        setIsMobileMenuOpen(false);
    };
    

    const navLinks = (isMobile: boolean) => (
         <>
            <NavButton
                icon={<CashIcon className="w-5 h-5" />}
                label="POS"
                isActive={currentView === View.POS}
                onClick={() => handleSetView(View.POS)}
                isMobile={isMobile}
            />
            <NavButton
                icon={<HotelIcon className="w-5 h-5" />}
                label="Hotel"
                isActive={currentView === View.HOTEL}
                onClick={() => handleSetView(View.HOTEL)}
                isMobile={isMobile}
            />
            <NavButton
                icon={<ClipboardListIcon className="w-5 h-5" />}
                label="Open Orders"
                isActive={currentView === View.OPEN_ORDERS}
                onClick={() => handleSetView(View.OPEN_ORDERS)}
                isMobile={isMobile}
            />
             <NavButton
                icon={<KitchenIcon className="w-5 h-5" />}
                label="Kitchen"
                isActive={currentView === View.KDS}
                onClick={() => handleSetView(View.KDS)}
                isMobile={isMobile}
            />
            <NavButton
                icon={<MenuIcon className="w-5 h-5" />}
                label="Manage Menu"
                isActive={currentView === View.MANAGE_MENU}
                onClick={() => handleSetView(View.MANAGE_MENU)}
                isMobile={isMobile}
            />
            <NavButton
                icon={<ReportIcon className="w-5 h-5" />}
                label="Sales Report"
                isActive={currentView === View.SALES_REPORT}
                onClick={() => handleSetView(View.SALES_REPORT)}
                isMobile={isMobile}
            />
            {currentUser?.role === 'admin' && (
                <>
                     <NavButton
                        icon={<LightBulbIcon className="w-5 h-5" />}
                        label="AI Analyst"
                        isActive={currentView === View.AI_ANALYST}
                        onClick={() => handleSetView(View.AI_ANALYST)}
                        isMobile={isMobile}
                    />
                    <NavButton
                        icon={<CashRegisterIcon className="w-5 h-5" />}
                        label="Day Sales"
                        isActive={currentView === View.DAY_SALES}
                        onClick={() => handleSetView(View.DAY_SALES)}
                        isMobile={isMobile}
                    />
                    <NavButton
                        icon={<ClipboardListIcon className="w-5 h-5" />}
                        label="Day Reports"
                        isActive={currentView === View.DAY_SALES_REPORTS}
                        onClick={() => handleSetView(View.DAY_SALES_REPORTS)}
                        isMobile={isMobile}
                    />
                </>
            )}
            <NavButton
                icon={<HistoryIcon className="w-5 h-5" />}
                label="Order History"
                isActive={currentView === View.ORDER_HISTORY}
                onClick={() => handleSetView(View.ORDER_HISTORY)}
                isMobile={isMobile}
            />
            <NavButton
                icon={<UserIcon className="w-5 h-5" />}
                label="Profile"
                isActive={currentView === View.PROFILE}
                onClick={() => handleSetView(View.PROFILE)}
                isMobile={isMobile}
            />
            <NavButton
                icon={<UsersIcon className="w-5 h-5" />}
                label="Customers"
                isActive={currentView === View.CUSTOMERS}
                onClick={() => handleSetView(View.CUSTOMERS)}
                isMobile={isMobile}
            />
            {currentUser?.role === 'admin' && (
                <NavButton
                    icon={<BriefcaseIcon className="w-5 h-5" />}
                    label="Employees"
                    isActive={currentView === View.EMPLOYEES}
                    onClick={() => handleSetView(View.EMPLOYEES)}
                    isMobile={isMobile}
                />
            )}
        </>
    );

    return (
        <header className="bg-secondary shadow-md sticky top-0 z-50 border-b border-secondary-light">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <AppIcon className="w-8 h-8 text-accent mr-2" />
                        <span className="font-bold text-xl text-text-primary hidden sm:inline">POS</span>
                        {currentUser && <span className="ml-4 text-sm text-text-secondary hidden lg:block">Welcome, {currentUser.name}</span>}
                    </div>
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {navLinks(false)}
                         <button
                            onClick={onLogout}
                            className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-text-secondary hover:bg-red-500 hover:text-white"
                            title="Logout"
                        >
                            <LogoutIcon className="w-5 h-5" />
                        </button>
                    </nav>
                     {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-text-secondary hover:text-text-primary p-2">
                            <MenuIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                 <div className="md:hidden fixed inset-0 bg-secondary z-50 flex flex-col">
                     <div className="flex justify-between items-center p-4 border-b border-secondary-light">
                        <span className="font-serif text-xl text-accent">Menu</span>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="text-text-secondary hover:text-text-primary p-2">
                             <CloseIcon className="w-6 h-6"/>
                        </button>
                     </div>
                     <nav className="flex flex-col flex-grow">
                        {navLinks(true)}
                        <div className="mt-auto border-t border-secondary-light">
                            <button
                                onClick={onLogout}
                                className="flex items-center space-x-3 px-4 py-3 text-lg w-full text-red-400 hover:bg-red-500 hover:text-white transition-colors duration-200"
                            >
                                <LogoutIcon className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        </div>
                     </nav>
                </div>
            )}
        </header>
    );
};

export default Header;