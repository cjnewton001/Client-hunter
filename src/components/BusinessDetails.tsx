import React, { useState } from 'react';
import { Business, Activity } from '../types';
import { X, Phone, MapPin, Calendar, Star, MessageSquare, Info, Zap, Loader2, Mail, CheckCircle2, Plus, Clock, History } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeBusiness } from '../services/geminiService';
import { db, updateDoc, doc, handleFirestoreError, OperationType, Timestamp } from '../firebase';

interface BusinessDetailsProps {
  business: Business;
  onClose: () => void;
}

const statusColors = {
  'Not Contacted': 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  'Contacted': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  'Interested': 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
  'Closed': 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
};

export const BusinessDetails: React.FC<BusinessDetailsProps> = ({ business, onClose }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [showOutreach, setShowOutreach] = useState(false);
  const [newActivity, setNewActivity] = useState({ type: 'Note' as Activity['type'], content: '' });
  const [addingActivity, setAddingActivity] = useState(false);
  
  const dateStr = business.dateAdded.toDate().toLocaleString();

  const handleAnalyze = async () => {
    if (!business.id) return;
    setAnalyzing(true);
    try {
      const result = await analyzeBusiness(business);
      if (result) {
        await updateDoc(doc(db, 'businesses', business.id), {
          aiScore: result.score,
          aiSummary: result.summary,
          aiOutreach: JSON.stringify(result.outreach)
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'businesses');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAddActivity = async () => {
    if (!business.id || !newActivity.content.trim()) return;
    setAddingActivity(true);
    try {
      const activity: Activity = {
        date: Timestamp.now(),
        type: newActivity.type,
        content: newActivity.content.trim()
      };
      const updatedActivities = [activity, ...(business.activities || [])];
      await updateDoc(doc(db, 'businesses', business.id), {
        activities: updatedActivities
      });
      setNewActivity({ type: 'Note', content: '' });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'businesses');
    } finally {
      setAddingActivity(false);
    }
  };

  const outreach = business.aiOutreach ? JSON.parse(business.aiOutreach) : null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-slate-800"
      >
        <div className="relative h-32 bg-indigo-600">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors backdrop-blur-md z-10"
          >
            <X size={20} />
          </button>
          <div className="absolute -bottom-10 left-8 p-1 bg-white dark:bg-slate-900 rounded-2xl shadow-lg">
            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-3xl">
              {business.name.charAt(0)}
            </div>
          </div>
        </div>

        <div className="pt-14 px-8 pb-8">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">{business.name}</h2>
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill={i < (business.rating || 0) ? "currentColor" : "none"} />
                  ))}
                </div>
                <span className="text-sm text-gray-500 dark:text-slate-400 font-bold">{business.rating} ({business.reviews} reviews)</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`px-4 py-1.5 rounded-full text-sm font-black border ${statusColors[business.status]}`}>
                {business.status}
              </span>
              {business.aiScore !== undefined && (
                <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-3 py-1 rounded-lg border border-indigo-100 dark:border-indigo-800">
                  <Zap size={14} className="fill-current" />
                  <span className="text-xs font-black uppercase tracking-wider">Lead Score: {business.aiScore}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Info */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-sm font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Contact Info</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-gray-50 dark:bg-slate-800 rounded-lg text-gray-400 dark:text-slate-500">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 dark:text-slate-500">Phone Number</p>
                      <p className="text-gray-900 dark:text-white font-medium">{business.phoneNumber || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-gray-50 dark:bg-slate-800 rounded-lg text-gray-400 dark:text-slate-500">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 dark:text-slate-500">Address</p>
                      <p className="text-gray-900 dark:text-white font-medium">{business.address || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-gray-50 dark:bg-slate-800 rounded-lg text-gray-400 dark:text-slate-500">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 dark:text-slate-500">Date Added</p>
                      <p className="text-gray-900 dark:text-white font-medium">{dateStr}</p>
                    </div>
                  </div>
                  {business.nextContactDate && (
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-500">
                        <Clock size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-amber-500">Next Follow-up</p>
                        <p className="text-gray-900 dark:text-white font-bold">{business.nextContactDate.toDate().toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">AI Insights</h3>
                  <button 
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="flex items-center gap-2 text-xs font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 disabled:opacity-50 transition-colors"
                  >
                    {analyzing ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                    {business.aiScore ? 'Re-Analyze' : 'Analyze'}
                  </button>
                </div>
                
                <AnimatePresence>
                  {business.aiSummary && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-2xl p-6"
                    >
                      <div className="flex items-center gap-2 mb-2 text-indigo-700 dark:text-indigo-400">
                        <Zap size={18} className="fill-current" />
                        <span className="text-xs font-black uppercase tracking-widest">Strategic Summary</span>
                      </div>
                      <p className="text-indigo-900 dark:text-indigo-200 text-sm font-medium leading-relaxed">
                        {business.aiSummary}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Middle Column: Activities & Notes */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-6">
                <h3 className="text-sm font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <History size={16} />
                  Activity Timeline
                </h3>
                
                {/* Add Activity Form */}
                <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-gray-100 dark:border-slate-800">
                  <div className="flex gap-2 mb-3">
                    {(['Note', 'Call', 'Email', 'Meeting'] as Activity['type'][]).map(type => (
                      <button
                        key={type}
                        onClick={() => setNewActivity({ ...newActivity, type })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          newActivity.type === type 
                            ? 'bg-indigo-600 text-white shadow-md' 
                            : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newActivity.content}
                      onChange={(e) => setNewActivity({ ...newActivity, content: e.target.value })}
                      placeholder="Log an activity or note..."
                      className="flex-1 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <button
                      onClick={handleAddActivity}
                      disabled={addingActivity || !newActivity.content.trim()}
                      className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
                    >
                      {addingActivity ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                    </button>
                  </div>
                </div>

                {/* Timeline List */}
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {business.activities && business.activities.length > 0 ? (
                    business.activities.map((activity, idx) => (
                      <div key={idx} className="relative pl-6 border-l-2 border-gray-100 dark:border-slate-800 pb-4 last:pb-0">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white dark:bg-slate-900 border-2 border-indigo-600 rounded-full"></div>
                        <div className="bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 rounded-xl p-4 shadow-sm">
                          <div className="flex justify-between items-center mb-1">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                              activity.type === 'Call' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                              activity.type === 'Email' ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                              activity.type === 'Meeting' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                              'bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-slate-300'
                            }`}>
                              {activity.type}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500">
                              {activity.date.toDate().toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">{activity.content}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-gray-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-gray-200 dark:border-slate-800">
                      <p className="text-sm text-gray-400 dark:text-slate-500 font-medium">No activities logged yet.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Initial Notes</h3>
                <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-6 relative border border-gray-100 dark:border-slate-800">
                  <MessageSquare className="absolute top-4 right-4 text-gray-200 dark:text-slate-700" size={24} />
                  <p className="text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap italic text-sm">
                    {business.notes || 'No initial notes added.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {outreach && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 border-t border-gray-100 dark:border-slate-800 pt-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">AI Outreach Template</h3>
                  <button 
                    onClick={() => setShowOutreach(!showOutreach)}
                    className="text-indigo-600 dark:text-indigo-400 text-xs font-black hover:underline"
                  >
                    {showOutreach ? 'Hide Template' : 'View Template'}
                  </button>
                </div>
                
                {showOutreach && (
                  <div className="bg-gray-900 dark:bg-black rounded-2xl p-6 text-gray-300 dark:text-slate-300 font-mono text-sm overflow-x-auto border border-gray-800 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-4 text-indigo-400 border-b border-gray-800 dark:border-slate-800 pb-4">
                      <Mail size={16} />
                      <span className="font-bold">Subject: {outreach.subject}</span>
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {outreach.body}
                    </p>
                    <div className="mt-6 flex justify-end">
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(`Subject: ${outreach.subject}\n\n${outreach.body}`);
                          alert('Copied to clipboard!');
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors text-xs shadow-lg shadow-indigo-900/20"
                      >
                        <CheckCircle2 size={14} />
                        Copy to Clipboard
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-10 flex justify-end">
            <button 
              onClick={onClose}
              className="px-8 py-3 bg-gray-900 dark:bg-indigo-600 hover:bg-gray-800 dark:hover:bg-indigo-700 text-white font-black rounded-xl transition-all shadow-xl shadow-gray-200 dark:shadow-none"
            >
              Close Details
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
