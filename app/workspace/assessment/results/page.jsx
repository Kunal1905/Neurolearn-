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
  const left = propLeft ?? parseInt(searchParams.get("left") || "0", 10);
  const right = propRight ?? parseInt(searchParams.get("right") || "0", 10);
  const [dominant_side, setDominantSide] = useState(propDominant || "balanced");

  // ✅ Determine dominant side if not passed
  useEffect(() => {
    if (!propDominant) {
      if (left > right) setDominantSide("left");
      else if (right > left) setDominantSide("right");
      else setDominantSide("balanced");
    }
  }, [left, right, propDominant]);

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

  // ✅ Display info
  const brainType = brainTypeInfo[dominant_side];
  const total = left + right || 1;
  const leftPercent = Math.round((left / total) * 100);
  const rightPercent = Math.round((right / total) * 100);

  return (
    <div className="min-h-screen flex justify-center items-center px-4 py-10">
      <div className="w-full max-w-4xl bg-white p-8 md:p-12 rounded-2xl shadow-lg">
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
          <p className="text-gray-600 mt-2">{brainType.description}</p>
        </div>

        {/* Scores + Strengths */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Scores */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="font-medium flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-blue-500" /> Brain Dominance Scores
            </h3>
            <p className="text-sm text-gray-600 mb-1">
              Left Brain: {leftPercent}%
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className="bg-blue-500 h-3 rounded-full"
                style={{ width: `${leftPercent}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mb-1">
              Right Brain: {rightPercent}%
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-purple-500 h-3 rounded-full"
                style={{ width: `${rightPercent}%` }}
              />
            </div>
          </div>

          {/* Strengths */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="font-medium flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-500" /> Your Strengths
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {brainType.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Learning Style */}
        <div className="bg-white border rounded-xl p-6 shadow-sm mb-8">
          <h3 className="font-medium flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" /> Your Personalized
            Learning Style
          </h3>
          <p className="text-gray-600 mb-4">{brainType.description}</p>
          <div className="flex flex-wrap gap-2">
            {brainType.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 text-sm bg-gray-100 border rounded-full text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/workspace/chat-assistant"
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl shadow-lg hover:opacity-90 transition"
          >
            Start Your Personalized AI Chat
          </Link>
          <p className="mt-2 text-sm text-gray-500">
            Your AI tutor will adapt to your {brainType.label.toLowerCase()} style.
          </p>
        </div>
      </div>
    </div>
  );
}
