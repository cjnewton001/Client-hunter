import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Bot, 
  Bell, 
  Palette, 
  Database, 
  Settings as SettingsIcon,
  Save,
  Trash2,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Mail,
  Shield,
  Zap,
  Target,
  MessageSquare
} from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { UserSettings, DEFAULT_SETTINGS } from '../types';

interface SettingsProps {
  user: FirebaseUser;
  settings: UserSettings;
  onUpdate: (newSettings: UserSettings) => Promise<void>;
  onWipeData: () => Promise<void>;
  onExportData: () => void;
}

const ACCENT_PRESETS = [
  { name: 'Indigo', color: '#4f46e5', hover: '#4338ca', light: '#eef2ff' },
  { name: 'Emerald', color: '#10b981', hover: '#059669', light: '#ecfdf5' },
  { name: 'Rose', color: '#f43f5e', hover: '#e11d48', light: '#fff1f2' },
  { name: 'Amber', color: '#f59e0b', hover: '#d97706', light: '#fffbeb' },
  { name: 'Sky', color: '#0ea5e9', hover: '#0284c7', light: '#f0f9ff' },
  { name: 'Violet', color: '#8b5cf6', hover: '#7c3aed', light: '#f5f3ff' },
];

export const Settings: React.FC<SettingsProps> = ({ 
  user, 
  settings, 
  onUpdate, 
  onWipeData, 
  onExportData 
}) => {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);
  const [activeTab, setActiveTab] = useState<'profile' | 'ai' | 'notifications' | 'crm' | 'appearance' | 'data'>('profile');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await onUpdate(localSettings);
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'ai', label: 'AI Strategy', icon: Bot },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'crm', label: 'CRM Config', icon: SettingsIcon },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'data', label: 'Data Control', icon: Database },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-2">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 px-4">Settings</h2>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none' 
                  : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-xl p-6 md:p-10 min-h-[600px] relative">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <img 
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=random`} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-3xl shadow-xl border-4 border-white dark:border-slate-800"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">{user.displayName}</h3>
                    <p className="text-gray-500 dark:text-slate-400 font-medium">{user.email}</p>
                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-black uppercase tracking-wider">
                      <Shield size={12} />
                      Pro Member
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-slate-800">
                  <h4 className="text-sm font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4">Usage Limits</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm font-bold mb-2">
                        <span className="text-gray-700 dark:text-slate-300">AI Analysis Credits</span>
                        <span className="text-indigo-600 dark:text-indigo-400">15 / 50</span>
                      </div>
                      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '30%' }}
                          className="h-full bg-indigo-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Strategy Tab */}
            {activeTab === 'ai' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Outreach Tone</label>
                    <select 
                      value={localSettings.aiTone}
                      onChange={(e) => setLocalSettings({...localSettings, aiTone: e.target.value as any})}
                      className="w-full p-4 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    >
                      <option>Professional</option>
                      <option>Friendly</option>
                      <option>Aggressive</option>
                      <option>Consultative</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Auto-Analyze Leads</label>
                    <div className="flex items-center h-[60px]">
                      <button 
                        onClick={() => setLocalSettings({...localSettings, autoAnalyze: !localSettings.autoAnalyze})}
                        className={`w-14 h-8 rounded-full transition-colors relative ${localSettings.autoAnalyze ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-slate-700'}`}
                      >
                        <motion.div 
                          animate={{ x: localSettings.autoAnalyze ? 24 : 4 }}
                          className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                        />
                      </button>
                      <span className="ml-4 font-bold text-gray-700 dark:text-slate-300">Enable AI Scoring on Import</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Focus Keywords</label>
                  <textarea 
                    value={localSettings.focusKeywords}
                    onChange={(e) => setLocalSettings({...localSettings, focusKeywords: e.target.value})}
                    placeholder="e.g. high-ticket, tech startups, local service businesses..."
                    className="w-full p-4 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-32"
                  />
                  <p className="text-xs text-gray-400 dark:text-slate-500 font-medium">AI will prioritize leads matching these keywords.</p>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-8">
                <div className="p-6 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-slate-800 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
                        <Mail size={24} />
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 dark:text-white">Daily Morning Summary</h4>
                        <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Get an email every morning with your tasks.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setLocalSettings({...localSettings, emailAlerts: !localSettings.emailAlerts})}
                      className={`w-14 h-8 rounded-full transition-colors relative ${localSettings.emailAlerts ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-slate-700'}`}
                    >
                      <motion.div 
                        animate={{ x: localSettings.emailAlerts ? 24 : 4 }}
                        className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                      />
                    </button>
                  </div>

                  <div className="pt-6 border-t border-gray-100 dark:border-slate-700">
                    <label className="text-sm font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest block mb-4">Follow-up Threshold</label>
                    <div className="flex items-center gap-6">
                      <input 
                        type="range" 
                        min="1" 
                        max="14" 
                        value={localSettings.followUpThreshold}
                        onChange={(e) => setLocalSettings({...localSettings, followUpThreshold: parseInt(e.target.value)})}
                        className="flex-1 accent-indigo-600"
                      />
                      <span className="w-20 text-center p-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl font-black text-indigo-600 dark:text-indigo-400">
                        {localSettings.followUpThreshold} Days
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-gray-400 dark:text-slate-500 font-medium">Leads will be marked as "Urgent" this many days before the follow-up date.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-sm font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest block">Accent Color</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                    {ACCENT_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => setLocalSettings({...localSettings, accentColor: preset.color})}
                        className={`group relative aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${
                          localSettings.accentColor === preset.color 
                            ? 'ring-4 ring-indigo-500 ring-offset-4 dark:ring-offset-slate-900 scale-105' 
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: preset.color }}
                      >
                        {localSettings.accentColor === preset.color && (
                          <CheckCircle2 className="text-white" size={24} />
                        )}
                        <span className="absolute -bottom-6 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-slate-800">
                  <h4 className="text-sm font-black text-gray-900 dark:text-white mb-2">Theme Preview</h4>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-600"></div>
                    <div className="w-8 h-8 rounded-full bg-indigo-400"></div>
                    <div className="w-8 h-8 rounded-full bg-indigo-200"></div>
                  </div>
                  <p className="mt-4 text-sm text-gray-500 dark:text-slate-400 font-medium">
                    This will update all buttons, icons, and highlights across the entire application.
                  </p>
                </div>
              </div>
            )}

            {/* Data Control Tab */}
            {activeTab === 'data' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button 
                    onClick={onExportData}
                    className="p-6 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-3xl hover:shadow-xl transition-all text-left group"
                  >
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                      <Download size={24} />
                    </div>
                    <h4 className="font-black text-gray-900 dark:text-white">Export All Data</h4>
                    <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Download your leads and activities as a CSV file.</p>
                  </button>

                  <button className="p-6 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-3xl hover:shadow-xl transition-all text-left group opacity-50 cursor-not-allowed">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                      <Upload size={24} />
                    </div>
                    <h4 className="font-black text-gray-900 dark:text-white">Bulk Import (CSV)</h4>
                    <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Upload a CSV to import leads in bulk. (Coming Soon)</p>
                  </button>
                </div>

                <div className="p-8 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/20">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl">
                      <AlertCircle size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-red-900 dark:text-red-400">Danger Zone</h4>
                      <p className="text-sm text-red-600/70 dark:text-red-400/60 font-medium mb-6">
                        Deleting your data is permanent and cannot be undone. All leads, notes, and AI analysis will be lost.
                      </p>
                      <button 
                        onClick={() => {
                          if (window.confirm('Are you absolutely sure you want to delete ALL your data? This cannot be undone.')) {
                            onWipeData();
                          }
                        }}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl transition-all flex items-center gap-2"
                      >
                        <Trash2 size={18} />
                        Wipe All CRM Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CRM Config Tab */}
            {activeTab === 'crm' && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-sm font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest block">Sales Funnel Statuses</label>
                  <div className="flex flex-wrap gap-2">
                    {localSettings.customStatuses.map((status, idx) => (
                      <div key={idx} className="px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-xl font-bold flex items-center gap-2">
                        {status}
                        <button className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                      </div>
                    ))}
                    <button className="px-4 py-2 border-2 border-dashed border-gray-200 dark:border-slate-700 text-gray-400 dark:text-slate-500 rounded-xl font-bold hover:border-indigo-500 hover:text-indigo-500 transition-all">
                      + Add Status
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest block">Activity Types</label>
                  <div className="flex flex-wrap gap-2">
                    {localSettings.activityTypes.map((type, idx) => (
                      <div key={idx} className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold flex items-center gap-2">
                        {type}
                        <button className="text-indigo-300 hover:text-red-500"><Trash2 size={14} /></button>
                      </div>
                    ))}
                    <button className="px-4 py-2 border-2 border-dashed border-indigo-100 dark:border-indigo-900/30 text-indigo-300 dark:text-indigo-500 rounded-xl font-bold hover:border-indigo-500 hover:text-indigo-500 transition-all">
                      + Add Type
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Footer Save Button */}
          <div className="absolute bottom-6 right-6 flex items-center gap-4">
            {message && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm ${
                  message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}
              >
                {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                {message.text}
              </motion.div>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-200 dark:shadow-none flex items-center gap-3 disabled:opacity-50"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={20} />
              )}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
