"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Brain, Lightbulb, MessageSquare } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const brainTypeInfo = {
  left: {
    label: "Left-Brain Dominant",
    description: "You thrive with logic, analysis, and structured approaches.",
    strengths: [
      "Analytical thinking",
      "Detail orientation",
      "Math reasoning",
      "Structured problem-solving",
    ],
    tags: ["logical learning", "step-by-step methods", "data analysis"],
    color: "from-blue-500 to-indigo-500",
  },
  right: {
    label: "Right-Brain Dominant",
    description:
      "You thrive with creativity, intuition, and holistic approaches.",
    strengths: [
      "Creative problem-solving",
      "Visual processing",
      "Intuitive understanding",
      "Pattern recognition",
    ],
    tags: ["visual learning", "storytelling", "mind maps"],
    color: "from-purple-500 to-pink-500",
  },
  balanced: {
    label: "Balanced Brain",
    description: "You balance logic and creativity in learning.",
    strengths: [
      "Adaptability",
      "Critical thinking",
      "Collaboration",
      "Holistic problem-solving",
    ],
    tags: ["mixed learning methods", "case studies", "practical projects"],
    color: "from-green-500 to-teal-500",
  },
};

export default function ProfilePage() {
  const { user } = useUser();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching data for user:', user.id);
        
        // Run both API calls in parallel for better performance
        const [statsRes, assessRes] = await Promise.all([
          fetch(`/api/user/${user.id}/stats`),
          fetch(`/api/user/${user.id}/assessment`)
        ]);
        
        const statsData = statsRes.ok ? await statsRes.json() : {};
        const assessData = assessRes.ok ? await assessRes.json() : null;
        
        console.log('Stats API response:', statsData);
        console.log('Assessment API response:', assessData);
        
        const combinedStats = {
          ...statsData,
          dominant_side: assessData?.dominantSide,
          left_score: assessData?.leftScore,
          right_score: assessData?.rightScore,
        };
        
        console.log('Combined stats data:', combinedStats);
        setStats(combinedStats);
      } catch (error) {
        console.error('Error fetching stats or assessment:', error);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user) return <p>Please log in to see your profile.</p>;
  
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-t-2 border-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  const brainType = stats?.dominant_side
    ? brainTypeInfo[stats.dominant_side]
    : null;

return (
  <div className="min-h-screen bg-white">
    {/* Header */}
    <div className="px-8 pt-10">
      <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
      <p className="text-gray-500 mt-1">
        Your personalized learning profile and brain dominance insights
      </p>
    </div>

    {/* Content Grid */}
    <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT COLUMN */}
      <div className="flex flex-col gap-8 lg:col-span-1">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex flex-col items-center text-center space-y-3">
            <UserButton />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {user.fullName ||
                  `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
                  "User"}
              </h2>
              <p className="text-sm text-gray-500">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
            <span className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-full">
              Neural Learner
            </span>
            <p className="text-xs text-gray-400">Member since 2025</p>
          </div>
        </div>

        {/* Learning Stats */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="font-semibold flex items-center gap-2 text-gray-800 mb-4">
            <MessageSquare className="w-4 h-4" /> Learning Statistics
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-4 text-center space-y-1 bg-gray-50 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-8 mx-auto mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-12 mx-auto"></div>
                </div>
              ))
            ) : (
              <>
                <StatBox label="Total Chats" value={stats?.totalChats ?? 0} />
                <StatBox label="Messages" value={stats?.totalMessages ?? 0} />
                <StatBox label="Avg per Chat" value={stats?.avgPerChat ?? 0} />
                <StatBox label="Days Learning" value={stats?.daysLearning ?? 0} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN - Brain Result */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 flex flex-col justify-center">
        {brainType ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h1 className="font-semibold flex items-center gap-2 text-gray-800 text-3xl">
                <Brain className="w-5 h-5 text-blue-500" /> Brain
                Dominance Results
              </h1>
            </div>

            {/* Result Summary */}
            <div>
              
              <h3
                className={`text-2xl font-bold bg-gradient-to-r ${brainType.color} bg-clip-text text-transparent`}
              >
                {brainType.label}
              </h3>
              <p className="text-gray-600 mt-2">{brainType.description}</p>
            </div>

            {/* Progress Bars */}
            <div className="flex items-center gap-6 mt-6">
              {/* Left Brain */}
              <div className="w-1/2">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium text-gray-500">
                    Left Brain Score
                  </p>
                  <p className="text-sm font-semibold text-gray-700">
                    {stats?.left_score && stats?.right_score
                      ? Math.round(
                          (stats.left_score /
                            (stats.left_score + stats.right_score)) *
                            100
                        )
                      : 0}
                    %
                  </p>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div
                    className="h-2 bg-blue-500 rounded-full"
                    style={{
                      width: `${
                        stats?.left_score
                          ? Math.round(
                              (stats.left_score /
                                (stats.left_score + stats.right_score)) *
                                100
                            )
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Right Brain */}
              <div className="w-1/2">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium text-gray-500">
                    Right Brain Score
                  </p>
                  <p className="text-sm font-semibold text-gray-700">
                    {stats?.right_score && stats?.left_score
                      ? Math.round(
                          (stats.right_score /
                            (stats.left_score + stats.right_score)) *
                            100
                        )
                      : 0}
                    %
                  </p>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div
                    className="h-2 bg-purple-500 rounded-full"
                    style={{
                      width: `${
                        stats?.right_score
                          ? Math.round(
                              (stats.right_score /
                                (stats.left_score + stats.right_score)) *
                                100
                            )
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Strengths */}
            <div className="mt-6">
              <h3 className="font-medium text-gray-800 mb-2">
                Your Key Characteristics:
              </h3>
              <ul className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                {brainType.strengths.map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    ✅ {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-800 mb-2">
                Personalized Learning Preferences
              </h4>
              <div className="flex flex-wrap gap-2">
                {brainType.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <Brain className="w-12 h-12 text-gray-400" />
            <h1 className="text-gray-600 font-bold">No assessment results</h1>
            <h2 className="text-sm text-gray-500 max-w-md">
              Take the brain dominance assessment to unlock personalized
              learning.
            </h2>
            <button className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
              <Link href={"/workspace/assessment/start"}>Take Assessment</Link>
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);



}

function StatBox({ label, value }) {
  // Handle different value types and format appropriately
  const displayValue = () => {
    if (value === null || value === undefined) return '0';
    if (typeof value === 'number') {
      // For averages, show up to 1 decimal place if needed
      if (label.includes('Avg') && value % 1 !== 0) {
        return value.toFixed(1);
      }
      return Math.round(value).toString();
    }
    return value.toString();
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 text-center space-y-1 bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
      <p className="text-xl font-bold text-gray-900">{displayValue()}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
