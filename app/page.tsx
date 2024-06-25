"use client";
import { BackgroundPattern } from "./BackgroundPattern";
import LandingForm from "./LandingForm";
import Navbar from "./Navbar";
import BackgroundPatternMobile from "./BackgroundPatternMobile";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  return (
    <main className="h-[100vh] text-white w-[100vw] bg-black relative">
      <Navbar />
      <div className="absolute p-10 top-[50%] space-y-16 -translate-y-[50%] md:left-[50%] md:-translate-x-[50%] z-20">
        <div>
          <h2 className="text-sm md:text-base text-accent font-semibold">
            ELITE GLOBAL AI FREE TRAINING + INTERNSHIP PROGRAM
          </h2>
          <h1 className="text-2xl md:text-5xl !leading-snug">
            Discover AI. Empower Yourself.
            <br className="hidden md:block" /> Shape Tomorrow.
          </h1>
          <p className="text-xs md:text-sm pt-4 w-[80%] text-gray-300">
            Elite Global AI invites you to explore the transformative world of
            artificial intelligence in diverse field such as Digital marketing,
            Content creation, Business Analytics, Data Analytics and Education.
          </p>
          <div className="flex md:hidden mt-8">
            <div
              onClick={() => setShowForm(true)}
              className="border border-accent w-full text-gray-500 text-sm px-3 py-4"
            >
              Enter email
            </div>
            <button
              type="submit"
              className="w-16 hover:animate-pulse bg-accent text-white flex items-center justify-center"
            >
              <ArrowRight />
            </button>
          </div>
        </div>
        <div className="hidden md:block space-y-4">
          <LandingForm setShowForm={setShowForm} />
        </div>
      </div>
      <div className="hidden md:block">
        <BackgroundPattern />
      </div>
      <div className="md:hidden">
        <BackgroundPatternMobile />
      </div>
      {showForm && (
        <div className="fixed w-[100vw] md:hidden overflow-auto px-10 h-[100vh] bg-black z-40 top-0 right-0 space-y-4">
          <LandingForm setShowForm={setShowForm} />
        </div>
      )}
    </main>
  );
}
