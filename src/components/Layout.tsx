import React, { ReactNode } from 'react';
import { auth, logOut, signIn } from '../firebase';
import { User } from 'firebase/auth';
import { LogOut, LogIn, LayoutDashboard, PlusCircle, Search, Filter, Briefcase } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  user: User | null;
  onAddClick: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onAddClick }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col md:flex-row transition-colors duration-500">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-b md:border-r border-gray-100 dark:border-slate-800 flex flex-col transition-colors duration-500">
        <div className="p-6 hidden md:flex items-center gap-3 border-b border-gray-100 dark:border-slate-800">
          <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200 dark:shadow-none">
            <Briefcase size={20} />
          </div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Hunter</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl font-bold transition-all">
            <LayoutDashboard size={20} />
            Dashboard
          </button>
          
          {user && (
            <button 
              onClick={onAddClick}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-xl font-bold transition-all"
            >
              <PlusCircle size={20} />
              Add Client
            </button>
          )}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-slate-800 hidden md:block">
          {user && (
            <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'U'}&background=6366f1&color=fff`} 
                  alt={user.displayName || ''} 
                  className="w-10 h-10 rounded-xl border-2 border-white dark:border-slate-800 shadow-sm" 
                  referrerPolicy="no-referrer" 
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-gray-900 dark:text-white truncate">{user.displayName || 'User'}</p>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Pro Member</p>
                </div>
              </div>
              <button 
                onClick={logOut}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
