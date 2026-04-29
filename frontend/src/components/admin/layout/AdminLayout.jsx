"use client";

import { useState } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Grid, 
  Flag, 
  AlertCircle, 
  BarChart2, 
  Bell, 
  Settings, 
  FileText,
  Search,
  ChevronRight,
  Menu,
  X,
  LogOut,
  ArrowLeft,
  Shield
} from "lucide-react";
import { useProfile } from "@/lib/useProfile";

const SIDEBAR_ITEMS = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'groups', label: 'Group Management', icon: Grid },
  { id: 'reports', label: 'Reports & Complaints', icon: AlertCircle },
  { id: 'analytics', label: 'Analytics Dashboard', icon: BarChart2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'System Settings', icon: Settings },
  { id: 'logs', label: 'Activity Logs', icon: FileText },
];

export default function AdminLayout({ children, activeSection, setActiveSection }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useProfile();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AD";

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-sans mesh-bg">
      {/* Sidebar */}
      <aside 
        className={`${sidebarOpen ? 'w-64' : 'w-24'} fixed left-0 top-0 h-full glass border-r border-slate-200/50 z-50 transition-all duration-500 ease-in-out`}
      >
        <div className="p-8 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-100">
            <Shield size={18} />
          </div>
          {sidebarOpen && (
            <span className="font-display font-bold text-xl tracking-tight text-slate-900">BizCircle</span>
          )}
        </div>

        <nav className="mt-4 px-4 space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition-all duration-300 ${
                  isActive 
                  ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-100 ring-1 ring-blue-600' 
                  : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50/50'
                }`}
              >
                <Icon size={sidebarOpen ? 18 : 24} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-8 left-0 w-full px-4 space-y-1">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
            title="Back to User View"
          >
            <ArrowLeft size={sidebarOpen ? 18 : 24} />
            {sidebarOpen && <span>User View</span>}
          </button>
          
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('userId');
              window.location.href = '/login';
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
            title="Logout"
          >
            <LogOut size={sidebarOpen ? 18 : 24} />
            {sidebarOpen && <span>Logout</span>}
          </button>

          <div className="pt-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center justify-center p-2 rounded-xl bg-slate-100/50 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-all"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`${sidebarOpen ? 'ml-64' : 'ml-24'} flex-1 flex flex-col transition-all duration-500`}>
        {/* Top Navbar */}
        <header className="h-20 glass border-b border-slate-200/50 sticky top-0 z-40 px-8 flex items-center justify-between shadow-xl shadow-slate-200/20">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search command center..."
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-10 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-800 font-display leading-none mb-1">{user?.name || "Admin"}</p>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{user?.role || "System Admin"}</p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg shadow-blue-100 flex items-center justify-center text-white font-black text-sm border-2 border-white">
                {initials}
              </div>
            </div>
          </div>
        </header>

        {/* Content Section */}
        <div className="p-8 lg:p-12 animate-fade-up">
          {children}
        </div>
      </main>
    </div>
  );
}
