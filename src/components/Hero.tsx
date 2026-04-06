import React from 'react';
import { motion } from 'motion/react';
import { Zap, LogIn, ShieldCheck, Briefcase, TrendingUp, Target, Users } from 'lucide-react';
import { signIn } from '../firebase';

export const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-500">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-10"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full font-black text-xs uppercase tracking-widest border border-indigo-100 dark:border-indigo-800 shadow-sm">
              <Zap size={14} className="animate-pulse" />
              Revolutionize Your Sales Pipeline
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white leading-[0.95] tracking-tighter">
              Hunt Better. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Close Faster.
              </span>
            </h1>
            
            <p className="text-xl text-gray-500 dark:text-slate-400 leading-relaxed max-w-xl font-medium">
              The ultimate CRM for modern teams. Track leads, manage relationships, and scale your business with AI-powered insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={signIn}
                className="px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all shadow-2xl shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-3 text-lg"
              >
                <LogIn size={24} />
                Get Started Now
              </motion.button>
              <button className="px-10 py-5 bg-white dark:bg-slate-900 text-gray-900 dark:text-white font-black rounded-2xl border-2 border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all text-lg">
                View Demo
              </button>
            </div>
            
            <div className="flex items-center gap-8 pt-8">
              <div className="flex items-center gap-2 text-gray-400 dark:text-slate-500 font-black text-xs uppercase tracking-widest">
                <ShieldCheck size={18} className="text-green-500" />
                Enterprise Grade
              </div>
              <div className="flex items-center gap-2 text-gray-400 dark:text-slate-500 font-black text-xs uppercase tracking-widest">
                <Briefcase size={18} className="text-indigo-500" />
                Lead Management
              </div>
            </div>
          </motion.div>

          {/* 2D Animation Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Main Card */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[3rem] shadow-2xl p-8 z-20"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center">
                    <Users className="text-white" size={28} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded-full w-3/4"></div>
                    <div className="h-3 bg-gray-50 dark:bg-slate-800/50 rounded-full w-1/2"></div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.2 }}
                      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800"
                    >
                      <div className={`w-10 h-10 rounded-xl ${i === 1 ? 'bg-green-100 text-green-600' : i === 2 ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'} flex items-center justify-center`}>
                        {i === 1 ? <TrendingUp size={20} /> : i === 2 ? <Target size={20} /> : <Zap size={20} />}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="h-2.5 bg-gray-200 dark:bg-slate-700 rounded-full w-2/3"></div>
                        <div className="h-2 bg-gray-100 dark:bg-slate-700/50 rounded-full w-1/3"></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{ 
                  x: [0, 30, 0],
                  y: [0, -30, 0],
                  rotate: [0, 10, 0]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-600 rounded-3xl shadow-xl z-30 flex items-center justify-center text-white"
              >
                <TrendingUp size={48} />
              </motion.div>

              <motion.div
                animate={{ 
                  x: [0, -40, 0],
                  y: [0, 40, 0],
                  rotate: [0, -15, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 -left-10 w-28 h-28 bg-purple-600 rounded-3xl shadow-xl z-10 flex items-center justify-center text-white"
              >
                <Target size={40} />
              </motion.div>

              {/* Decorative Rings */}
              <div className="absolute -inset-10 border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-full animate-[spin_20s_linear_infinite] pointer-events-none"></div>
              <div className="absolute -inset-20 border border-gray-50 dark:border-slate-900 rounded-full animate-[spin_30s_linear_infinite_reverse] pointer-events-none"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
