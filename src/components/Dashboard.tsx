import React, { useState, useEffect, useMemo } from 'react';
import { db, collection, onSnapshot, query, where, orderBy, addDoc, updateDoc, deleteDoc, doc, handleFirestoreError, OperationType } from '../firebase';
import { Business, BusinessStatus } from '../types';
import { User } from 'firebase/auth';
import { BusinessCard } from './BusinessCard';
import { BusinessForm } from './BusinessForm';
import { BusinessDetails } from './BusinessDetails';
import { Search, Filter, Plus, Briefcase, Loader2, AlertCircle, Zap, Download, BarChart3, Clock, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardProps {
  user: User;
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, showAddModal, setShowAddModal }) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<BusinessStatus | 'All'>('All');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [viewingBusiness, setViewingBusiness] = useState<Business | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'businesses'),
      where('ownerUid', '==', user.uid),
      orderBy(sortBy === 'date' ? 'dateAdded' : 'aiScore', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Business[];
      setBusinesses(data);
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'businesses');
      setError('Failed to load businesses. Please check your connection.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user.uid, sortBy]);

  const filteredBusinesses = useMemo(() => {
    return businesses.filter(b => {
      const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [businesses, searchTerm, statusFilter]);

  const funnelStats = useMemo(() => {
    const stats = {
      'Not Contacted': 0,
      'Contacted': 0,
      'Interested': 0,
      'Closed': 0,
    };
    businesses.forEach(b => {
      if (stats[b.status] !== undefined) stats[b.status]++;
    });
    return stats;
  }, [businesses]);

  const overdueFollowups = useMemo(() => {
    const now = new Date();
    return businesses.filter(b => b.nextContactDate && b.nextContactDate.toDate() <= now && b.status !== 'Closed');
  }, [businesses]);

  const exportToCSV = () => {
    const headers = ['Name', 'Status', 'Rating', 'Reviews', 'Phone', 'Address', 'Date Added', 'Notes'];
    const rows = businesses.map(b => [
      b.name,
      b.status,
      b.rating || 0,
      b.reviews || 0,
      b.phoneNumber || '',
      b.address || '',
      b.dateAdded.toDate().toLocaleDateString(),
      (b.notes || '').replace(/,/g, ';')
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `client_hunter_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleSave = async (data: Omit<Business, 'id'>) => {
    try {
      if (editingBusiness?.id) {
        await updateDoc(doc(db, 'businesses', editingBusiness.id), data);
      } else {
        await addDoc(collection(db, 'businesses'), data);
      }
      setShowAddModal(false);
      setEditingBusiness(null);
    } catch (err) {
      handleFirestoreError(err, editingBusiness ? OperationType.UPDATE : OperationType.CREATE, 'businesses');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await deleteDoc(doc(db, 'businesses', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, 'businesses');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading your clients...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">My Clients</h2>
          <p className="text-gray-500 dark:text-slate-400 font-medium">Manage and track your potential business leads.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => setShowAnalytics(!showAnalytics)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              showAnalytics ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-300 border border-gray-100 dark:border-slate-800'
            }`}
          >
            <BarChart3 size={18} />
            Analytics
          </button>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-300 border border-gray-100 dark:border-slate-800 rounded-xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Analytics Section */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {(Object.entries(funnelStats) as [BusinessStatus, number][]).map(([status, count]) => (
                <div key={status} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
                  <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">{status}</p>
                  <div className="flex items-end justify-between">
                    <p className="text-3xl font-black text-gray-900 dark:text-white">{count}</p>
                    <TrendingUp size={20} className={count > 0 ? "text-green-500" : "text-gray-200 dark:text-slate-800"} />
                  </div>
                  <div className="mt-4 h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 rounded-full" 
                      style={{ width: `${businesses.length > 0 ? (count / businesses.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overdue Reminders */}
      {overdueFollowups.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-500 text-white rounded-lg">
              <Clock size={20} />
            </div>
            <h3 className="text-lg font-bold text-amber-900 dark:text-amber-400">Follow-up Reminders</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {overdueFollowups.map(b => (
              <button 
                key={b.id}
                onClick={() => setViewingBusiness(b)}
                className="px-4 py-2 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/30 text-amber-900 dark:text-amber-400 text-sm font-bold rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/20 transition-all shadow-sm"
              >
                {b.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-3.5 text-gray-400 dark:text-slate-500" size={20} />
          <input
            type="text"
            placeholder="Search by business name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-gray-900 dark:text-white rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <Zap className="absolute left-4 top-3.5 text-gray-400 dark:text-slate-500" size={20} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="pl-12 pr-10 py-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none font-bold text-gray-700 dark:text-slate-300"
            >
              <option value="date">Sort by Date</option>
              <option value="score">Sort by AI Score</option>
            </select>
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-3.5 text-gray-400 dark:text-slate-500" size={20} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="pl-12 pr-10 py-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none font-bold text-gray-700 dark:text-slate-300"
            >
              <option value="All">All Statuses</option>
              <option value="Not Contacted">Not Contacted</option>
              <option value="Contacted">Contacted</option>
              <option value="Interested">Interested</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none flex items-center gap-2"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add Client</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      {filteredBusinesses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredBusinesses.map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                onEdit={(b) => {
                  setEditingBusiness(b);
                  setShowAddModal(true);
                }}
                onDelete={handleDelete}
                onView={setViewingBusiness}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 text-gray-300 rounded-full mb-6">
            <Briefcase size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No clients found</h3>
          <p className="text-gray-500 max-w-xs mx-auto">
            {searchTerm || statusFilter !== 'All' 
              ? "Try adjusting your search or filters to find what you're looking for." 
              : "Start by adding your first business lead to the system."}
          </p>
          {!searchTerm && statusFilter === 'All' && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="mt-6 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200"
            >
              Add Your First Client
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <BusinessForm
          business={editingBusiness || undefined}
          onSave={handleSave}
          onClose={() => {
            setShowAddModal(false);
            setEditingBusiness(null);
          }}
          ownerUid={user.uid}
        />
      )}

      {viewingBusiness && (
        <BusinessDetails
          business={viewingBusiness}
          onClose={() => setViewingBusiness(null)}
        />
      )}
    </div>
  );
};
