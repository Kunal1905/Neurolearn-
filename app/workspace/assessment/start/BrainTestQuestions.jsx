"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowRight, Brain } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

const questions = [
  // ... (20 questions remain unchanged)
  { id: 1, question: "When solving a problem, I prefer to:", options: [{ value: "left", label: "Break it down into logical steps and analyze each part" }, { value: "right", label: "Look at the big picture and trust my intuition" }] },
  { id: 2, question: "When learning something new, I learn best through:", options: [{ value: "left", label: "Reading detailed instructions and following procedures" }, { value: "right", label: "Visual examples and hands-on experimentation" }] },
  { id: 3, question: "In conversations, I tend to:", options: [{ value: "left", label: "Focus on facts, details, and logical arguments" }, { value: "right", label: "Pay attention to emotions, tone, and overall meaning" }] },
  { id: 4, question: "When organizing my workspace, I prefer:", options: [{ value: "left", label: "Everything in its designated place, neat and systematic" }, { value: "right", label: "A creative, comfortable environment that inspires me" }] },
  { id: 5, question: "When making decisions, I usually:", options: [{ value: "left", label: "Analyze pros and cons methodically" }, { value: "right", label: "Go with my gut feeling" }] },
  { id: 6, question: "I'm better at remembering:", options: [{ value: "left", label: "Names, dates, and specific details" }, { value: "right", label: "Faces, places, and general impressions" }] },
  { id: 7, question: "When explaining something to others, I:", options: [{ value: "left", label: "Use clear, sequential explanations with examples" }, { value: "right", label: "Paint a picture with metaphors and stories" }] },
  { id: 8, question: "I prefer to work:", options: [{ value: "left", label: "In a quiet, structured environment" }, { value: "right", label: "With background music or in collaborative spaces" }] },
  { id: 9, question: "When reading, I tend to:", options: [{ value: "left", label: "Read word by word, focusing on details" }, { value: "right", label: "Skim for main ideas and overall themes" }] },
  { id: 10, question: "I'm naturally drawn to:", options: [{ value: "left", label: "Mathematics, science, and technical subjects" }, { value: "right", label: "Art, music, and creative pursuits" }] },
  { id: 11, question: "When planning a project, I:", options: [{ value: "left", label: "Create detailed timelines and checkpoints" }, { value: "right", label: "Start with the vision and adapt as I go" }] },
  { id: 12, question: "I prefer instructions that are:", options: [{ value: "left", label: "Written step-by-step with clear objectives" }, { value: "right", label: "Visual with diagrams and examples" }] },
  { id: 13, question: "When problem-solving in groups, I:", options: [{ value: "left", label: "Contribute logical analysis and systematic thinking" }, { value: "right", label: "Offer creative alternatives and synthesize ideas" }] },
  { id: 14, question: "I'm most productive when:", options: [{ value: "left", label: "Following a schedule and completing tasks in order" }, { value: "right", label: "Working on multiple projects based on my mood" }] },
  { id: 15, question: "When learning a new skill, I prefer to:", options: [{ value: "left", label: "Master the basics before moving to advanced concepts" }, { value: "right", label: "Jump in and learn through trial and error" }] },
  { id: 16, question: "I communicate best through:", options: [{ value: "left", label: "Precise language and concrete examples" }, { value: "right", label: "Expressive language and abstract concepts" }] },
  { id: 17, question: "When studying, I prefer:", options: [{ value: "left", label: "Quiet focus with detailed notes and outlines" }, { value: "right", label: "Visual aids, mind maps, and group discussions" }] },
  { id: 18, question: "I tend to be:", options: [{ value: "left", label: "Punctual and deadline-oriented" }, { value: "right", label: "Flexible with time and process-oriented" }] },
  { id: 19, question: "When faced with complex information, I:", options: [{ value: "left", label: "Organize it into categories and hierarchies" }, { value: "right", label: "Look for patterns and connections" }] },
  { id: 20, question: "I'm most confident when:", options: [{ value: "left", label: "I have clear guidelines and expectations" }, { value: "right", label: "I can be creative and express my individuality" }] }
];

export default function BrainTestQuestions({ 
  answers, 
  onAnswer, 
  onComplete, 
  isLoading 
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  const currentAnswer = answers[currentQ.id];

  const handleNext = () => {
    if (currentQuestion === questions.length - 1) {
  const leftCount = Object.values(answers).filter((a) => a === "left").length;
  const rightCount = Object.values(answers).filter((a) => a === "right").length;

  console.log("➡️ Redirecting with counts:", leftCount, rightCount);

  // DEBUG: check the URL you’re building
  const resultUrl = `/workspace/assessment/results?left=${leftCount}&right=${rightCount}`;
  console.log("🔗 Redirect URL:", resultUrl);

  window.location.href = resultUrl;
}
else{
  setCurrentQuestion((q) => q + 1);
}
  };

  return (
 <motion.div
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: -20 }}
>
  {/* Top-aligned container with padding */}
  <div className="min-h-screen pt-12 px-5 flex justify-center">
    <div className="w-full max-w-2xl">
      <div className="mb-8 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-slate-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <span className="text-sm text-slate-500">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
<Card className="border-0 shadow-lg p-6 w-[600px] max-w-full mx-auto flex flex-col">
  <CardHeader className="pb-4">
    <CardTitle className="text-xl text-slate-900 break-words">
      {currentQ.question}
    </CardTitle>
  </CardHeader>

  <CardContent className="flex flex-col gap-6 p-0">
    <RadioGroup
      value={currentAnswer || ""}
      onValueChange={(value) => onAnswer(currentQ.id, value)}
      className="space-y-4"
    >
      {currentQ.options.map((option, index) => (
        <div
          key={index}
          className="flex items-start space-x-3 p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer"
          onClick={() => onAnswer(currentQ.id, option.value)}
        >
          <RadioGroupItem value={option.value} id={`option-${index}`} className="mt-0.5" />
          <Label
            htmlFor={`option-${index}`}
            className="text-slate-700 flex-1 leading-relaxed break-words"
          >
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>

    <div className="flex justify-between items-center">
      <span className="text-sm text-slate-500">
        Select your preferred approach
      </span>
      <Button
        onClick={handleNext}
        disabled={!currentAnswer || isLoading}
        className="neural-gradient text-white px-6"
      >
        {isLoading
          ? "Processing..."
          : currentQuestion === questions.length - 1
          ? "Complete Assessment"
          : (
            <>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
      </Button>
    </div>
  </CardContent>
</Card>


    </div>
  </div>
</motion.div>

  );
}