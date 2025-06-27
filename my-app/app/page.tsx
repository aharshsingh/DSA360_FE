import React from "react";
import { CanvasRevealEffect } from "@/components/CanvasRevealEffect";
import { Code, CheckCircle, BarChart2, ListChecks } from "lucide-react";
import { Navbar } from "@/components/ui/mini-navbar";
import Link from "next/link";

const features = [
  {
    icon: <Code className="w-6 h-6 text-blue-400" />,
    title: "Curated DSA Questions",
    description:
      "Handpicked problems from top tech companies and coding platforms.",
  },
  {
    icon: <CheckCircle className="w-6 h-6 text-green-400" />,
    title: "Track Your Progress",
    description: "Monitor your mastery of each topic with real-time insights.",
  },
  {
    icon: <BarChart2 className="w-6 h-6 text-orange-400" />,
    title: "Detailed Analytics",
    description:
      "Get performance breakdowns and identify weak areas instantly.",
  },
  {
    icon: <ListChecks className="w-6 h-6 text-purple-400" />,
    title: "Topic-wise Practice",
    description: "Master topics like Arrays, Trees, and more.",
  },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <CanvasRevealEffect
          animationSpeed={3}
          containerClassName="bg-black"
          colors={[[120, 120, 120]]}
          dotSize={6}
          reverse={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      </div>

      <Navbar />

      <div className="relative z-10 px-6 py-16 mt-[15%]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Code. Compile. <span className="text-indigo-500">Conquer.</span>
          </h1>
          <p className="mt-6 text-lg text-gray-300">
            Built for developers. Designed for speed, collaboration, and
            scalability.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href='/app/dashboard'>
              <button className="bg-white text-black font-semibold px-6 py-2 rounded-full hover:bg-gray-200">
                Get Started
              </button>
            </Link>
            <button className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-black">
              Learn More
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-10 mt-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="w-[280px] h-[250px] rounded-[20px] p-6 relative overflow-hidden bg-white/5 border border-white/5 backdrop-blur-[8px] shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-300"
            >
              <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/2 to-transparent z-0 pointer-events-none" />
              <div className="relative z-10 flex flex-col justify-between h-full text-white">
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-white/80">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
