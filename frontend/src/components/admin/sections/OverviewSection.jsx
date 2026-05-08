"use client";

import { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, AreaChart, Area
} from 'recharts';
import { 
  Users, Activity, Grid, FileText, AlertCircle, TrendingUp, TrendingDown,
  ArrowRight, Bell, Calendar, UserPlus, Send, Zap
} from 'lucide-react';
import api from '@/lib/axios';

const StatCard = ({ stat, Icon }) => {
  const isPositive = stat.trend.toString().startsWith('+');
  return (
    <div className="relative overflow-hidden bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm group hover:shadow-xl hover:shadow-slate-100 transition-all duration-500 hover:-translate-y-1">
      <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity" style={{ backgroundColor: stat.color }} />
      
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-2xl bg-slate-50 group-hover:scale-110 transition-transform duration-500" style={{ color: stat.color }}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
        <div className={`flex items-center gap-0.5 px-2.5 py-1 rounded-full text-[10px] font-black ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {stat.trend}
        </div>
      </div>
      
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
      <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{stat.value.toLocaleString()}</h3>
    </div>
  );
};

export default function OverviewSection() {
  const [stats, setStats] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [engagementStats, setEngagementStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/admin/dashboard')
      .then(res => {
        setStats((res.data.stats || []).filter(s => s.label !== 'Posts Today'));
        setUserGrowth(res.data.userGrowth);
        setRecentActivity((res.data.recentActivity || []).filter(a => a.type !== 'post'));
        if (res.data.engagementStats) setEngagementStats(res.data.engagementStats);
      })
      .catch(err => console.error('Failed to fetch admin stats:', err))
      .finally(() => setLoading(false));
  }, []);

  const ICON_MAP = {
    Users: Users,
    Activity: Activity,
    Grid: Grid,
    FileText: FileText,
    AlertCircle: AlertCircle,
    Send: Send
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse tracking-tight">Synchronizing Platform Hub...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Platform Live</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Command Center</h1>
          <p className="text-slate-500 font-medium">Overview of the BizCircle ecosystem performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm">
            <Bell size={18} />
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-[1.2rem] text-sm font-black text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95">
            <Zap size={16} /> Broadcast Update
          </button>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} Icon={ICON_MAP[stat.icon] || Grid} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Influx Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Growth Velocity</h3>
              <p className="text-sm font-bold text-slate-400">Monthly user acquisition trends</p>
            </div>
            <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-wider bg-blue-50 px-3 py-1.5 rounded-full">
              <TrendingUp size={12} /> +12.5% vs Last Year
            </div>
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowth}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontBold: 800, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                   contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#2563eb" 
                  strokeWidth={4} 
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Activity Stream */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Pulse Stream</h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">Live</span>
          </div>
          
          <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {recentActivity.map((activity, idx) => (
              <div key={activity.id} className="relative flex gap-4 group/item">
                {idx !== recentActivity.length - 1 && (
                   <div className="absolute left-[15px] top-8 w-[1px] h-full bg-slate-100 group-hover/item:bg-blue-100 transition-colors" />
                )}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-transform duration-300 group-hover/item:scale-110 ${
                  activity.type === 'user' ? 'bg-blue-50 text-blue-500' : 
                  activity.type === 'referral' ? 'bg-amber-50 text-amber-500' : 
                  activity.type === 'group' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-400'
                }`}>
                   {activity.type === 'user' ? <UserPlus size={14} /> : 
                    activity.type === 'referral' ? <Send size={14} /> : 
                    activity.type === 'group' ? <Grid size={14} /> : <Activity size={14} />}
                </div>
                <div className="pb-4">
                  <p className="text-sm font-black text-slate-800 leading-tight group-hover/item:text-blue-600 transition-colors">{activity.action}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{activity.target}</span>
                    <span className="text-slate-200 text-[10px]">•</span>
                    <span className="text-[10px] font-bold text-slate-300 italic">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-6 py-4 border-t border-slate-50 text-blue-600 text-[11px] font-black uppercase tracking-[0.15em] hover:bg-slate-50/50 transition-colors flex items-center justify-center gap-2 rounded-b-[2rem]">
            Full Activity Log <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Engagement Pulse */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group">
        <div className="flex items-center justify-between mb-8">
           <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Engagement Pulse</h3>
              <p className="text-sm font-bold text-slate-400">Platform interactions over the last 7 days</p>
           </div>
           <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5">
               <div className="w-2 h-2 rounded-full bg-pink-500" />
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Sessions</span>
             </div>
           </div>
        </div>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={engagementStats}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontBold: 800, fill: '#94a3b8' }}
                dy={10}
              />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: '#f8fafc', radius: 12 }}
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
              />
              <Bar 
                 dataKey="activity" 
                 fill="#ec4899" 
                 radius={[12, 12, 12, 12]} 
                 barSize={40}
                 className="hover:fill-pink-600 transition-colors duration-300"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
