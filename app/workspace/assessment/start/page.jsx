"use client";

import React, { useState } from "react";
import BrainTestQuestions from "./BrainTestQuestions";

export default function StartPage() {
  // Keep answers in state
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Update state when an answer is selected
  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Called when last question is done
  const handleComplete = () => {
    setIsLoading(true);

    // Example: simulate API call or navigation
    setTimeout(() => {
      console.log("Final answers:", answers);
      setIsLoading(false);
      // TODO: redirect to results page if needed
    }, 1000);
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-2xl mx-auto">
      <BrainTestQuestions
        answers={answers}
        onAnswer={handleAnswer}
        onComplete={handleComplete}
        isLoading={isLoading}
      />
      </div>
    </div>
  );
}
