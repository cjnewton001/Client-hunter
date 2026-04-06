import React from 'react';
import { User } from 'firebase/auth';
import { auth } from '../firebase';
import { LogOut, Moon, Sun, Briefcase, User as UserIcon, Settings, LayoutDashboard } from 'lucide-react';
import { motion } from 'motion/react';

interface NavbarProps {
  user: User | null;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentView: 'dashboard' | 'leads' | 'settings';
  setView: (view: 'dashboard' | 'leads' | 'settings') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, theme, toggleTheme, currentView, setView }) => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 group cursor-pointer"
            onClick={() => setView('dashboard')}
          >
            <div className="p-2 bg-indigo-600 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-indigo-200 dark:shadow-none">
              <Briefcase className="text-white" size={20} />
            </div>
            <span className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
              Client<span className="text-indigo-600">Hunter</span>
            </span>
          </div>

          {/* Navigation Links (Desktop) */}
          {user && (
            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => setView('dashboard')}
                className={`text-sm font-bold flex items-center gap-2 transition-colors ${currentView === 'dashboard' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </button>
              <button 
                onClick={() => setView('leads')}
                className={`text-sm font-bold flex items-center gap-2 transition-colors ${currentView === 'leads' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
              >
                <UserIcon size={16} />
                Leads
              </button>
              <button 
                onClick={() => setView('settings')}
                className={`text-sm font-bold flex items-center gap-2 transition-colors ${currentView === 'settings' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
              >
                <Settings size={16} />
                Settings
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-300 border border-gray-100 dark:border-slate-700"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {user ? (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-100 dark:border-slate-800">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-black text-gray-900 dark:text-white leading-none mb-1">
                    {user.displayName || 'User'}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                    Pro Plan
                  </p>
                </div>
                <div className="relative group">
                  <img
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'U'}&background=6366f1&color=fff`}
                    alt="Profile"
                    className="w-10 h-10 rounded-xl border-2 border-white dark:border-slate-800 shadow-sm object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="p-4 border-b border-gray-100 dark:border-slate-700">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => auth.signOut()}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-b-2xl"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => auth.signOut()} // This will be handled by the login logic in App.tsx
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none text-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
