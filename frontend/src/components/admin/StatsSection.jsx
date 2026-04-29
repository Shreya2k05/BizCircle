"use client";

import { Users, Grid, Clock, TrendingUp } from "lucide-react";

export default function StatsSection({ totalGroups, totalMembers, pendingRequests }) {
  const stats = [
    {
      id: "total-groups",
      label: "Total Groups",
      value: totalGroups,
      suffix: "/ 3",
      icon: Grid,
      color: "from-blue-600 to-blue-400",
      accent: "text-blue-600",
      bg: "bg-blue-50/50"
    },
    {
      id: "total-members",
      label: "Total Members",
      value: totalMembers,
      suffix: "",
      icon: Users,
      color: "from-emerald-600 to-teal-400",
      accent: "text-emerald-600",
      bg: "bg-emerald-50/50"
    },
    {
      id: "pending-requests",
      label: "Pending Requests",
      value: pendingRequests,
      suffix: "",
      icon: Clock,
      color: "from-amber-500 to-orange-400",
      accent: "text-amber-600",
      bg: "bg-amber-50/50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            className="premium-card p-6 flex items-center gap-6 group"
          >
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg shadow-blue-100 animate-float-subtle`}>
              <Icon size={28} />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900 font-display tracking-tight">
                  {stat.value}
                </span>
                {stat.suffix && (
                  <span className="text-sm font-bold text-slate-400">
                    {stat.suffix}
                  </span>
                )}
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">
                {stat.label}
              </p>
            </div>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.accent}`}>
                <TrendingUp size={16} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
