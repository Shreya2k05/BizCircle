"use client";

import { useEffect, useState, use } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import api from '@/lib/axios';
import { Share2, Users, Calendar, MessageSquare, Info, Shield, Globe, Clock, Settings, UserPlus, Award } from 'lucide-react';

import ChatTab from '@/components/groups/ChatTab';
import MembersTab from '@/components/groups/MembersTab';
import EventsTab from '@/components/groups/EventsTab';
import CircleSettingsTab from '@/components/groups/CircleSettingsTab';
import JoinRequestsTab from '@/components/groups/JoinRequestsTab';
import CircleReferralTab from '@/components/groups/CircleReferralTab';

export default function CircleDetailPage({ params }) {
  const unwrappedParams = use(params);
  const { circleId } = unwrappedParams;
  const [circle, setCircle] = useState(null);
  const [circleMembers, setCircleMembers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('meetings');
  const [loading, setLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  const fetchCircle = async () => {
    try {
      const { data } = await api.get(`/api/circles/${circleId}`);
      setCircle(data.circle);
      setCircleMembers(data.members || []);
      setPendingRequests(data.pendingRequests || []);
      setIsJoined(data.isJoined || false);
      setIsPending(data.isPending || false);
      setIsAdmin(data.isAdmin || false);
      
      if (data.isJoined) {
        api.put('/user/opened-circle').catch(err => console.error("Failed to update opened circle flag:", err));
      }
    } catch (err) {
      console.error("Failed to fetch circle:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCircle();
  }, [circleId]);

  const handleJoin = async () => {
    if (isJoined || isPending || isJoining) return;
    setIsJoining(true);
    try {
      await api.post('/api/circles/join', { circleId });
      fetchCircle();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to join");
    } finally {
      setIsJoining(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50 mesh-bg">
        <Sidebar />
        <main className="flex-1 p-8 animate-pulse">
           <div className="h-64 bg-slate-200 rounded-[2.5rem] mb-8" />
           <div className="h-10 bg-slate-200 w-1/3 rounded-lg mb-4" />
           <div className="h-96 bg-slate-200 rounded-[2.5rem]" />
        </main>
      </div>
    );
  }

  if (!circle) {
    return (
      <div className="flex min-h-screen items-center justify-center mesh-bg">
        <div className="text-center animate-fade-up">
          <Info size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-2xl font-black text-slate-800 font-display">Circle not found</h2>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'meetings', label: 'Meetings', icon: Calendar },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'members', label: 'Members', icon: Users },
  ];

  if (isJoined) {
    tabs.push({ id: 'refer', label: 'Refer & Earn', icon: Award });
  }

  if (isAdmin) {
    if (pendingRequests.length > 0) {
      tabs.push({ id: 'requests', label: `Requests (${pendingRequests.length})`, icon: UserPlus });
    }
    tabs.push({ id: 'settings', label: 'Settings', icon: Settings });
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC] mesh-bg font-sans">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto relative">
        {/* Banner Section */}
        <div className="h-48 lg:h-64 relative overflow-hidden bg-slate-900">
          <div className={`absolute inset-0 bg-gradient-to-br ${circle.color || 'from-blue-600 to-indigo-600'} opacity-90`} />
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        </div>

        <div className="max-w-6xl mx-auto px-6 lg:px-10 -mt-24 lg:-mt-32 relative z-10 pb-20">
          {/* Header Card */}
          <div className="premium-card p-8 lg:p-10 mb-8 animate-fade-up">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className={`w-20 h-20 lg:w-24 lg:h-24 rounded-3xl bg-gradient-to-br ${circle.color || 'from-blue-600 to-indigo-600'} text-white flex items-center justify-center text-4xl font-black shadow-2xl shadow-blue-200 animate-float-subtle`}>
                  {circle.icon || circle.name?.charAt(0)}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h1 className="text-3xl lg:text-5xl font-black text-slate-900 font-display tracking-tight leading-none">
                      {circle.name}
                    </h1>
                    <span className="flex items-center text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-widest border border-blue-100 shadow-sm">
                      <Shield size={12} className="mr-1.5" /> Official Circle
                    </span>
                  </div>
                  <p className="text-slate-500 text-lg font-bold mb-5 max-w-2xl leading-relaxed">{circle.description || "Connecting professionals across domains."}</p>
                  
                  <div className="flex items-center flex-wrap gap-3">
                    <span className="flex items-center gap-2 bg-slate-50 text-slate-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border border-slate-100">
                      <Globe size={14} /> {circle.domain}
                    </span>
                    <span className="flex items-center gap-2 bg-slate-50 text-slate-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border border-slate-100">
                      📍 {circle.location}
                    </span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handleShare}
                className={`transition-all font-black text-sm uppercase tracking-widest flex items-center gap-2 px-8 py-4 rounded-2xl border-2 ${
                  showCopied 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600 shadow-lg shadow-emerald-100' 
                  : 'bg-white border-slate-100 text-slate-700 hover:border-blue-200 hover:text-blue-600 hover:shadow-xl hover:shadow-blue-50'
                }`}
              >
                {showCopied ? (
                  <>✓ Copied!</>
                ) : (
                  <>
                    <Share2 size={18} /> Share
                  </>
                )}
              </button>
            </div>
          </div>

          {!isJoined ? (
            /* Membership Required View */
            <div className="premium-card p-12 text-center animate-fade-up">
               <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-float">
                 {isPending ? <Clock size={44} className="text-amber-500" /> : <Shield size={44} className="text-blue-600" />}
               </div>
               <h2 className="text-4xl font-black text-slate-900 mb-4 font-display tracking-tight">{isPending ? "Request Pending" : "Membership Required"}</h2>
               <p className="text-slate-500 text-lg max-w-xl mx-auto mb-10 leading-relaxed font-bold">
                 {isPending 
                   ? "Your request to join this circle is currently under review by the community admin. You will gain access once approved."
                   : "This is a professional community. To access the chat, meetings, and member list, you must first join the circle."}
               </p>
               <button 
                 onClick={handleJoin}
                 disabled={isPending || isJoining}
                 className={`px-12 py-5 rounded-2xl font-black text-lg transition-all shadow-2xl flex items-center gap-3 mx-auto disabled:opacity-50 ${
                    isPending ? 'bg-amber-100 text-amber-700' : 'btn-primary'
                 }`}
               >
                 {isJoining ? "Processing..." : isPending ? "Wait for Approval" : "Join This Circle"}
               </button>
            </div>
          ) : (
            /* Full Member View */
            <div className="space-y-8">
              {/* Navigation Tabs */}
              <div className="flex gap-2 p-2 glass rounded-3xl border border-slate-200/50 w-fit overflow-x-auto shadow-xl shadow-slate-200/20 animate-fade-up">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                        isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50/50'
                      }`}
                    >
                      <Icon size={18} /> {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="animate-fade-up">
                {activeTab === 'meetings' && <EventsTab targetId={circleId} targetModel="Circle" members={circleMembers} isAdmin={isAdmin} />}
                {activeTab === 'chat' && <ChatTab groupId={circleId} />}
                {activeTab === 'members' && <MembersTab members={circleMembers} />}
                {activeTab === 'refer' && <CircleReferralTab circle={circle} />}
                {activeTab === 'requests' && isAdmin && (
                  <JoinRequestsTab circleId={circleId} requests={pendingRequests} onAction={fetchCircle} />
                )}
                {activeTab === 'settings' && isAdmin && (
                  <CircleSettingsTab circle={circle} onUpdate={(updated) => setCircle(updated)} />
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
