"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import PaidLandingForm from "./PaidLandingForm";
import Navbar from "./Navbar";
import { BackgroundPattern } from "./BackgroundPattern";
import BackgroundPatternMobile from "./BackgroundPatternMobile";

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  return (
    <main className="h-[100vh] overflow-hidden text-white w-[100vw] bg-black relative">
      <Navbar />
      <div className="relative h-[calc(100vh-8rem)] overflow-y-scroll mt-[15%] md:mt-0">
        <div className="w-full h-max bg-transparent relative z-20">
          <div className="relative p-10 h-max md:max-w-3xl space-y-16  md:-translate-y-0 md:top-0 md:left-[50%] md:-translate-x-[50%] z-20">
            <div className="">
              <h2 className="text-sm md:text-base text-accent font-semibold">
                ELITE GLOBAL AI PAID INTERNSHIP PROGRAM
              </h2>
              <h1 className="text-2xl md:text-5xl !leading-snug">
                Discover a whole new realm of AI learning.
                {/* <br className="hidden md:block" /> Shape Tomorrow. */}
              </h1>
              <p className="text-xs md:text-sm pt-4 w-[80%] text-gray-300">
                Elite Global AI invites you to explore the transformative world
                of artificial intelligence in diverse field such as Digital
                marketing, Content creation, Business Analytics, Data Analytics
                and Education.
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
              <PaidLandingForm setShowForm={setShowForm} />
            </div>
          </div>
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
          <PaidLandingForm setShowForm={setShowForm} />
        </div>
      )}
    </main>
  );
}
