import React, { useState, useEffect } from 'react';
import { Business, BusinessStatus } from '../types';
import { X, Save, Star } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

interface BusinessFormProps {
  business?: Business;
  onSave: (business: Omit<Business, 'id'>) => void;
  onClose: () => void;
  ownerUid: string;
}

const statuses: BusinessStatus[] = ['Not Contacted', 'Contacted', 'Interested', 'Closed'];

export const BusinessForm: React.FC<BusinessFormProps> = ({ business, onSave, onClose, ownerUid }) => {
  const [formData, setFormData] = useState<Omit<Business, 'id' | 'dateAdded' | 'ownerUid' | 'aiScore' | 'aiSummary' | 'aiOutreach' | 'activities'>>({
    name: '',
    rating: 0,
    reviews: 0,
    phoneNumber: '',
    address: '',
    status: 'Not Contacted',
    notes: '',
    nextContactDate: undefined,
  });

  useEffect(() => {
    if (business) {
      setFormData({
        name: business.name,
        rating: business.rating || 0,
        reviews: business.reviews || 0,
        phoneNumber: business.phoneNumber || '',
        address: business.address || '',
        status: business.status,
        notes: business.notes || '',
        nextContactDate: business.nextContactDate,
      });
    }
  }, [business]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      dateAdded: business?.dateAdded || Timestamp.now(),
      ownerUid,
      aiScore: business?.aiScore,
      aiSummary: business?.aiSummary,
      aiOutreach: business?.aiOutreach,
      activities: business?.activities || [],
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-slate-800">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
            {business ? 'Edit Client' : 'Add New Client'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors text-gray-500 dark:text-slate-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 dark:text-slate-300">Business Name *</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. Acme Corp"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 dark:text-slate-300">Rating (0-5)</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating || 0}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setFormData({ ...formData, rating: isNaN(val) ? 0 : val });
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
                <Star className="absolute left-3 top-3 text-amber-400" size={18} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 dark:text-slate-300">Reviews</label>
              <input
                type="number"
                min="0"
                value={formData.reviews || 0}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setFormData({ ...formData, reviews: isNaN(val) ? 0 : val });
                }}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 dark:text-slate-300">Phone Number</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 dark:text-slate-300">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="123 Business St, City, State"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 dark:text-slate-300">Follow-up Date</label>
            <input
              type="date"
              value={formData.nextContactDate ? formData.nextContactDate.toDate().toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const date = e.target.value ? Timestamp.fromDate(new Date(e.target.value)) : undefined;
                setFormData({ ...formData, nextContactDate: date });
              }}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 dark:text-slate-300">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as BusinessStatus })}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none font-bold"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 dark:text-slate-300">Notes</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
              placeholder="Add any relevant details..."
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 font-black rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              <Save size={20} />
              {business ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
