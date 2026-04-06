/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { auth, signIn } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Settings } from './components/Settings';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { UserSettings, DEFAULT_SETTINGS } from './types';
import { getUserSettings, updateUserSettings, db, collection, where, query, onSnapshot, deleteDoc, doc } from './firebase';
import { updateAccentColor } from './lib/utils';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('theme');
        if (saved === 'light' || saved === 'dark') return saved;
      } catch (e) {
        console.warn('LocalStorage access blocked:', e);
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });
  const [currentView, setCurrentView] = useState<'dashboard' | 'leads' | 'settings'>('dashboard');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const savedSettings = await getUserSettings(currentUser.uid);
        if (savedSettings) {
          setSettings(savedSettings as UserSettings);
          updateAccentColor((savedSettings as UserSettings).accentColor);
        } else {
          // Initialize with default settings
          await updateUserSettings(currentUser.uid, DEFAULT_SETTINGS);
          updateAccentColor(DEFAULT_SETTINGS.accentColor);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      console.warn('LocalStorage access blocked:', e);
    }
    console.log('Theme changed to:', theme, 'Dark class present:', root.classList.contains('dark'));
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      console.log('Toggling theme to:', next);
      return next;
    });
  };

  const handleUpdateSettings = async (newSettings: UserSettings) => {
    if (!user) return;
    await updateUserSettings(user.uid, newSettings);
    setSettings(newSettings);
    updateAccentColor(newSettings.accentColor);
  };

  const handleWipeData = async () => {
    if (!user) return;
    // This is a simplified bulk delete for demo purposes
    // In production, use a cloud function or batch deletes
    const q = query(collection(db, 'businesses'), where('ownerUid', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docs.forEach(async (d) => {
        await deleteDoc(doc(db, 'businesses', d.id));
      });
      unsubscribe();
    });
    setCurrentView('dashboard');
  };

  const handleExportData = () => {
    // This will be handled by the Dashboard's export function or a shared one
    // For now, we'll just trigger the dashboard view
    setCurrentView('dashboard');
    setTimeout(() => {
      const exportBtn = document.querySelector('[data-export-btn]') as HTMLButtonElement;
      if (exportBtn) exportBtn.click();
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center transition-colors duration-500">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 dark:text-slate-400 font-black tracking-widest uppercase text-xs">Initializing Hunter</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500">
        <Navbar 
          user={user} 
          theme={theme} 
          toggleTheme={toggleTheme} 
          currentView={currentView}
          setView={setCurrentView}
        />
        {!user ? (
          <Hero />
        ) : (
          <Layout user={user} onAddClick={() => setShowAddModal(true)}>
            {currentView === 'dashboard' && (
              <Dashboard 
                user={user} 
                showAddModal={showAddModal} 
                setShowAddModal={setShowAddModal} 
                settings={settings}
              />
            )}
            {currentView === 'leads' && (
              <div className="p-8 text-center">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Leads Management</h2>
                <p className="text-gray-500 dark:text-slate-400">This feature is coming soon in the next update!</p>
              </div>
            )}
            {currentView === 'settings' && (
              <Settings 
                user={user} 
                settings={settings} 
                onUpdate={handleUpdateSettings}
                onWipeData={handleWipeData}
                onExportData={handleExportData}
              />
            )}
          </Layout>
        )}
      </div>
    </ErrorBoundary>
  );
}
