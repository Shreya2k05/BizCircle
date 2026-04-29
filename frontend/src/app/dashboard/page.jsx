"use client";

import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Stats from "@/components/dashboard/Stats";
import CircleList from "@/components/dashboard/CircleList";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import ProfileCard from "@/components/dashboard/ProfileCard";
import UpcomingMeetings from "@/components/dashboard/UpcomingMeetings";
import NetworkingAnalytics from "@/components/dashboard/NetworkingAnalytics";
import MeetingReminder from "@/components/dashboard/MeetingReminder";
import ReceivedReferralsWidget from "@/components/dashboard/ReceivedReferralsWidget";
import { useProfile } from "@/lib/useProfile";

const DashboardPage = () => {
  const { user, loading: profileLoading } = useProfile();

  // Deduplicate: a circle can appear in both user.circles and user.joinedGroups
  const myCircles = [
    ...new Map(
      [...(user?.circles || []), ...(user?.joinedGroups || [])]
        .filter(Boolean)
        .map(c => [c._id, c])
    ).values()
  ];

  const firstName = user?.name ? user.name.split(" ")[0] : "User";

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC] mesh-bg">
      <Sidebar />
      <MeetingReminder />

      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-10 mt-12 lg:mt-0 animate-fade-up">
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-2 font-display tracking-tight">
              Welcome back, {profileLoading ? "..." : firstName} 👋
            </h1>
            <p className="text-slate-500 font-bold text-lg tracking-tight">
              Here&apos;s what&apos;s happening in your circles today.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column (Main Content) */}
            <div className="xl:col-span-2">
              <NetworkingAnalytics />
              <Stats />

              <CircleList
                id="my-circles"
                title="My Circles"
                circles={myCircles}
                loading={profileLoading}
              />
            </div>

            {/* Right Column (Sidebar Content) */}
            <div className="space-y-8">
              <UpcomingMeetings />
              <ReceivedReferralsWidget />
              <ProfileCard />
              <ActivityFeed />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
