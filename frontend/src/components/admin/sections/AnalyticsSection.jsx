"use client";

import { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar, LineChart, Line
} from 'recharts';
import { 
  Download, Calendar, ArrowUpRight, ArrowDownRight, Users, 
  Send, Activity, TrendingUp, Filter, Share2, MoreHorizontal 
} from 'lucide-react';
import api from '@/lib/axios';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20">
        <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-3 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <p className="text-sm font-extrabold text-slate-800">
              {entry.name}: <span className="text-blue-600">{entry.value}</span>
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsSection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState('users');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/api/admin/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse text-lg tracking-tight">Compiling Executive Insights...</p>
      </div>
    );
  }

  const { stats, userGrowth, engagementStats, industryDistribution, referralSuccessRate } = data;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">Executive Suite</span>
             <span className="text-slate-300">•</span>
             <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Real-time Data</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Platform Analytics</h1>
          <p className="text-slate-500 font-medium">Monitoring growth trajectories and ecosystem health.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black text-slate-700 hover:bg-slate-100 transition-all active:scale-95 shadow-sm">
            <Calendar size={14} /> This Quarter
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-2xl text-xs font-black text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95 shadow-md shadow-blue-100">
            <Download size={14} /> Export Intelligence
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="relative overflow-hidden bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm group hover:shadow-xl hover:shadow-slate-100 transition-all duration-500">
            {/* Background Decoration */}
            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity" style={{ backgroundColor: stat.color }} />
            
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 rounded-2xl transition-colors duration-500" style={{ backgroundColor: `${stat.color}10`, color: stat.color }}>
                {stat.icon === 'Users' && <Users size={24} strokeWidth={2.5} />}
                {stat.icon === 'Activity' && <Activity size={24} strokeWidth={2.5} />}
                {stat.icon === 'Grid' && <TrendingUp size={24} strokeWidth={2.5} />}
                {stat.icon === 'Send' && <Send size={24} strokeWidth={2.5} />}
              </div>
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-black ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {stat.trend.startsWith('+') ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.trend}
              </div>
            </div>
            
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value.toLocaleString()}</h3>
              <span className="text-slate-300 text-xs font-bold">Total</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Growth Trajectory - 2/3 width on large screens */}
        <div className="xl:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Growth Trajectory</h3>
              <p className="text-sm font-bold text-slate-400">Comparing user acquisition and referral volume</p>
            </div>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
              <button 
                onClick={() => setActiveMetric('users')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMetric === 'users' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Users
              </button>
              <button 
                onClick={() => setActiveMetric('referrals')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMetric === 'referrals' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Referrals
              </button>
            </div>
          </div>

          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRefs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
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
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontBold: 800, fill: '#94a3b8' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  name="Total Users"
                  dataKey="users" 
                  stroke="#2563eb" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorUsers)" 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  hide={activeMetric === 'referrals'}
                />
                <Area 
                  type="monotone" 
                  name="Total Referrals"
                  dataKey="referrals" 
                  stroke="#7c3aed" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorRefs)" 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  hide={activeMetric === 'users'}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Industry Distribution - 1/3 width */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Industry Focus</h3>
          <p className="text-sm font-bold text-slate-400 mb-8">Active circles by domain</p>
          
          <div className="flex-1 min-h-[280px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={industryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {industryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Domains</span>
              <span className="text-2xl font-black text-slate-900 leading-none">{industryDistribution.length}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            {industryDistribution.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-[10px] font-extrabold text-slate-600 truncate">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row - Pattern Analysis */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Engagement Heatmap */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Engagement Flow</h3>
              <p className="text-sm font-bold text-slate-400">Activity volume across the week</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black">
              <Activity size={14} /> Peak Day
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
                <Tooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltip />} />
                <Bar 
                   dataKey="activity" 
                   fill="#2563eb" 
                   radius={[10, 10, 10, 10]} 
                   barSize={32}
                >
                  {engagementStats.map((entry, index) => (
                    <Cell 
                       key={`cell-${index}`} 
                       fill={entry.activity > 5 ? '#2563eb' : '#dbeafe'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strategic Impact Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden">
          {/* Glass Overlay Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-blue-400 border border-white/5">
                <TrendingUp size={20} />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Strategic Impact</h3>
            </div>

            <div className="space-y-8 mt-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Referral Success Rate</p>
                  <h4 className="text-4xl font-black text-white tracking-tighter">{referralSuccessRate}%</h4>
                </div>
                <div className="w-20 h-20 rounded-full border-8 border-white/5 flex items-center justify-center relative">
                   <div className="absolute inset-0 rounded-full border-8 border-blue-500" style={{ clipPath: `inset(0 0 ${100-referralSuccessRate}% 0)` }} />
                   <span className="text-[10px] font-black text-white">KPI</span>
                </div>
              </div>

              <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Ecosystem Health</span>
                  <span className="text-emerald-400 text-[10px] font-black">OPTIMAL</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-[85%] h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
                </div>
                <p className="text-[10px] text-slate-500 mt-4 font-bold italic">
                  "Platform engagement is trending higher than Q1 baseline."
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
