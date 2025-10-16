"use client";

import React, { useEffect, useState } from "react";
import { Brain, Lightbulb, CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

// ✅ Brain Type Info
const brainTypeInfo = {
  left: {
    label: "Left-Brain Dominant",
    description:
      "You thrive with logic, analysis, and structured approaches to learning.",
    strengths: [
      "Analytical thinking",
      "Detail orientation",
      "Mathematical reasoning",
      "Structured problem-solving",
    ],
    tags: [
      "logical learning",
      "step-by-step methods",
      "structured exercises",
      "data analysis",
    ],
    color: "from-blue-500 to-indigo-500",
  },
  right: {
    label: "Right-Brain Dominant",
    description:
      "You thrive with creative thinking, intuition, and holistic approaches to learning.",
    strengths: [
      "Creative problem-solving",
      "Visual processing",
      "Intuitive understanding",
      "Pattern recognition",
    ],
    tags: ["visual learning", "creative examples", "storytelling", "mind maps"],
    color: "from-purple-500 to-pink-500",
  },
  balanced: {
    label: "Balanced Brain",
    description:
      "You balance logic and creativity, thriving with both structured and open-ended approaches.",
    strengths: [
      "Adaptability",
      "Critical thinking",
      "Collaboration",
      "Holistic problem-solving",
    ],
    tags: [
      "mixed learning methods",
      "group work",
      "case studies",
      "practical projects",
    ],
    color: "from-green-500 to-teal-500",
  },
};

export default function BrainResults({ left: propLeft, right: propRight, dominant: propDominant }) {
  const searchParams = useSearchParams();
  const { user, isLoaded } = useUser();

  // ✅ Use props if passed, else from URL
  const [left, setLeft] = useState(propLeft ?? parseInt(searchParams.get("left") || "0", 10));
  const [right, setRight] = useState(propRight ?? parseInt(searchParams.get("right") || "0", 10));
  const [dominant_side, setDominantSide] = useState(propDominant || null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Fetch assessment results from database if no props provided
  useEffect(() => {
    const fetchAssessmentResults = async () => {
      if (!isLoaded || !user?.id) {
        setIsLoading(false);
        return;
      }

      // If we have props, use them directly (coming from assessment completion)
      if (propLeft !== undefined && propRight !== undefined && propDominant) {
        setIsLoading(false);
        return;
      }

      // Otherwise fetch from database
      try {
        const response = await fetch(`/api/user/${user.id}/assessment`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.leftScore !== undefined) {
            // Use database values
            const dbLeft = data.leftScore || 0;
            const dbRight = data.rightScore || 0;
            
            // Determine dominant side from database scores
            let dominantSide = data.dominantSide || "balanced";
            if (!data.dominantSide) {
              if (dbLeft > dbRight) dominantSide = "left";
              else if (dbRight > dbLeft) dominantSide = "right";
              else dominantSide = "balanced";
            }
            
            // Update state with database values
            setLeft(dbLeft);
            setRight(dbRight);
            setDominantSide(dominantSide);
            console.log("✅ Loaded assessment from database:", { dbLeft, dbRight, dominantSide });
          }
        }
      } catch (error) {
        console.error("❌ Error fetching assessment results:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessmentResults();
  }, [user, isLoaded, propLeft, propRight, propDominant]);

  // ✅ Determine dominant side from URL params if not from props or database
  useEffect(() => {
    if (dominant_side === null && !isLoading) {
      if (left > right) setDominantSide("left");
      else if (right > left) setDominantSide("right");
      else setDominantSide("balanced");
    }
  }, [left, right, dominant_side, isLoading]);

  // ✅ Save only if this is a *new* test (no props)
  useEffect(() => {
    const saveResults = async () => {
      if (!isLoaded || !user?.id || propDominant) return; // Skip if result exists in DB

      try {
        // Save assessment results using the simplified API
        const resAssessment = await fetch(`/api/assessment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            left,
            right,
            dominant_side,
          }),
        });

        if (!resAssessment.ok) {
          const errorData = await resAssessment.json();
          console.error("❌ Failed to save assessment:", errorData);
        } else {
          const result = await resAssessment.json();
          console.log("✅ Assessment saved successfully!", result);
        }
      } catch (error) {
        console.error("❌ Error saving brain results:", error);
      }
    };

    saveResults();
  }, [dominant_side, user, isLoaded, propDominant, left, right]);

  // ✅ Display loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center px-4 py-10 bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-t-2 border-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your assessment results...</p>
        </div>
      </div>
    );
  }

  // ✅ Display info (use actual scores from state)
  const brainType = brainTypeInfo[dominant_side || "balanced"];
  
  const total = left + right || 1;
  const leftPercent = Math.round((left / total) * 100);
  const rightPercent = Math.round((right / total) * 100);

return (
  <div className="min-h-screen flex justify-center items-center px-4 py-10">
    <div className="w-full max-w-4xl bg-white p-6 sm:p-8 md:p-12 rounded-2xl shadow-lg">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="mx-auto w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md mb-4">
          <Lightbulb className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold">Assessment Complete!</h2>
        <p
          className={`text-lg font-semibold bg-gradient-to-r ${brainType.color} bg-clip-text text-transparent`}
        >
          {brainType.label}
        </p>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          {brainType.description}
        </p>
      </div>

      {/* Assessment Result Box - Moved below header */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
        <h3 className="font-medium flex items-center gap-2 mb-4 text-blue-800">
          <Brain className="w-5 h-5" /> Your Brain Dominance Results
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-blue-700 mb-1">Left Brain: {leftPercent}%</p>
            <div className="w-full bg-blue-200 rounded-full h-3 mb-4">
              <div
                className="bg-blue-500 h-3 rounded-full"
                style={{ width: `${leftPercent}%` }}
              />
            </div>
          </div>
          <div>
            <p className="text-sm text-blue-700 mb-1">Right Brain: {rightPercent}%</p>
            <div className="w-full bg-blue-200 rounded-full h-3">
              <div
                className="bg-purple-500 h-3 rounded-full"
                style={{ width: `${rightPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scores + Strengths */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Strengths */}
        <div className="bg-white border rounded-xl p-5 sm:p-6 shadow-sm">
          <h3 className="font-medium flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-green-500" /> Your Strengths
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm sm:text-base">
            {brainType.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

        {/* Learning Style */}
        <div className="bg-white border rounded-xl p-5 sm:p-6 shadow-sm">
          <h3 className="font-medium flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" /> Learning Style
          </h3>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">{brainType.description}</p>
          <div className="flex flex-wrap gap-2">
            {brainType.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs sm:text-sm bg-gray-100 border rounded-full text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ Fixed CTA - Fully Responsive with proper mobile spacing */}
      <div className="mt-8 text-center">
        <Link
          href="/workspace/chat-assistant"
          className="inline-block w-full sm:w-auto bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:opacity-90 transition-all duration-200 text-center"
        >
          Start Your Personalized AI Chat
        </Link>
        <p className="mt-3 text-sm text-gray-500">
          Your AI tutor will adapt to your {brainType.label.toLowerCase()} style.
        </p>
      </div>
      
      {/* Add padding at bottom for mobile to ensure button is visible */}
      <div className="h-6 sm:h-0"></div>
    </div>
  </div>
);
}
