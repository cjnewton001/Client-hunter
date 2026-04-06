import React from 'react';
import { Business } from '../types';
import { Star, Phone, MapPin, Calendar, MoreVertical, Edit2, Trash2, ExternalLink, Zap, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface BusinessCardProps {
  business: Business;
  onEdit: (business: Business) => void;
  onDelete: (id: string) => void;
  onView: (business: Business) => void;
}

const statusColors = {
  'Not Contacted': 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  'Contacted': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  'Interested': 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
  'Closed': 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
};

export const BusinessCard: React.FC<BusinessCardProps> = ({ business, onEdit, onDelete, onView }) => {
  const dateStr = business.dateAdded.toDate().toLocaleDateString();
  const isOverdue = business.nextContactDate && business.nextContactDate.toDate() <= new Date();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md dark:hover:shadow-indigo-900/10 transition-all p-5 flex flex-col h-full group relative"
    >
      {isOverdue && (
        <div className="absolute -top-2 -right-2 bg-amber-500 text-white p-1.5 rounded-full shadow-lg z-10 animate-bounce" title="Follow-up Overdue!">
          <Clock size={16} />
        </div>
      )}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer" onClick={() => onView(business)}>
            {business.name}
          </h3>
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center gap-1">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < (business.rating || 0) ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">({business.reviews || 0})</span>
            </div>
            {business.aiScore !== undefined && (
              <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter">
                <Zap size={10} className="fill-current" />
                Score: {business.aiScore}
              </div>
            )}
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusColors[business.status]}`}>
          {business.status}
        </span>
      </div>

      <div className="space-y-2.5 mb-6 flex-1">
        {business.phoneNumber && (
          <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-slate-400">
            <Phone size={16} className="text-gray-400 dark:text-slate-500" />
            <span className="truncate">{business.phoneNumber}</span>
          </div>
        )}
        {business.address && (
          <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-slate-400">
            <MapPin size={16} className="text-gray-400 dark:text-slate-500" />
            <span className="truncate">{business.address}</span>
          </div>
        )}
        <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-slate-400">
          <Calendar size={16} className="text-gray-400 dark:text-slate-500" />
          <span>Added {dateStr}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-slate-800">
        <div className="flex gap-1">
          <button 
            onClick={() => onEdit(business)}
            className="p-2 text-gray-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
            title="Edit"
          >
            <Edit2 size={18} />
          </button>
          <button 
            onClick={() => business.id && onDelete(business.id)}
            className="p-2 text-gray-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
        <button 
          onClick={() => onView(business)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
        >
          Details
          <ExternalLink size={14} />
        </button>
      </div>
    </motion.div>
  );
};
