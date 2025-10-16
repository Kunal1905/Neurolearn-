import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, ArrowRight, Lightbulb, Calculator } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function AssessmentIntro({ onStart }) {
  return (
    <div className="flex flex-col items-center text-gray-600 pt-16 px-4">
      {/* Logo */}
      <Image
        src="/Brainlogo.svg"
        width={100}
        height={100}
        alt="Brain Logo"
        className="mb-8"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="text-center max-w-4xl w-full"
      >
        {/* Title */}
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Discover Your Learning Style
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Take our scientifically-designed brain dominance assessment to unlock
          personalized AI tutoring that adapts to your unique thinking patterns.
        </p>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-3xl mx-auto">
          <Card className="brain-card border-0 shadow-sm hover:shadow-md transition">
            <CardContent className="p-6 text-center">
              <Calculator className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Left-Brain Learners</h3>
              <p className="text-slate-600 text-sm">
                Prefer logical, structured, and analytical approaches to learning
              </p>
            </CardContent>
          </Card>

          <Card className="brain-card border-0 shadow-sm hover:shadow-md transition">
            <CardContent className="p-6 text-center">
              <Lightbulb className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Right-Brain Learners</h3>
              <p className="text-slate-600 text-sm">
                Thrive with creative, visual, and intuitive learning methods
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Start Button */}
        <Button
          onClick={onStart}
          size="lg"
          className="neural-gradient text-white px-8 py-3"
        >
          <Link href={"/workspace/assessment/start"}>Start Assessment</Link>
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        {/* Footer Info */}
        <p className="text-sm text-slate-500 mt-4">
          Takes 3-5 minutes • 20 questions • Immediate results
        </p>
      </motion.div>
    </div>
  );
}
