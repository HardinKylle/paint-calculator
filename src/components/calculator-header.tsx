"use client";
import React, { useState, useEffect } from "react";
import { PigmentaLogo } from "@/components/pigmenta-logo";
import { cn } from "@/lib/utils";

interface CalculatorHeaderProps {
  roomsCount: number;
  totalArea: number;
}

export const CalculatorHeader: React.FC<CalculatorHeaderProps> = ({ roomsCount, totalArea }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 100);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 print:hidden transition-all duration-200 ease-in-out border border-stone-850",
        isScrolled 
          ? "top-[-1px] bg-stone-900/90 backdrop-blur-md py-3 px-4 sm:px-6 rounded-b-xl rounded-t-none shadow-lg border-t-0" 
          : "bg-stone-900 py-4 px-5 sm:p-6 rounded-2xl shadow-md"
      )}
      style={{ willChange: "background-color, padding, box-shadow" }}
    >
      <div className="relative z-10 flex items-center justify-between w-full">
        {/* Left Side: Logo and Title */}
        <div className="flex items-center gap-3">
          <PigmentaLogo 
            className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 hover:-translate-y-0.5 cursor-pointer transition-transform duration-200" 
            priority 
          />
          <div>
            <h1 className="font-extrabold tracking-tight text-white text-base sm:text-2xl leading-none">
              Pigmenta
              <span className="hidden sm:inline font-normal text-stone-300"> Paint Calculator</span>
            </h1>
            <p className={cn(
              "hidden sm:block text-stone-400 text-[11px] sm:text-xs mt-1 transition-all duration-200 origin-top overflow-hidden",
              isScrolled ? "max-h-0 opacity-0 pointer-events-none mt-0" : "max-h-12 opacity-100"
            )}>
              Estimate paint volumes, tin recommendations, labour hours, and costs.
            </p>
          </div>
        </div>

        {/* Right Side: Stats */}
        <div className="flex items-center gap-4 sm:gap-6 border-l border-stone-800 pl-4 sm:pl-6 py-0.5">
          <div className="text-left">
            <span className="block text-[8px] sm:text-[9px] text-stone-500 font-bold uppercase tracking-wider">Rooms</span>
            <span className="font-bold text-white text-sm sm:text-xl mt-0.5 block leading-none">{roomsCount}</span>
          </div>
          <div className="text-left">
            <span className="block text-[8px] sm:text-[9px] text-stone-500 font-bold uppercase tracking-wider">Total Area</span>
            <span className="font-bold text-white text-sm sm:text-xl mt-0.5 block leading-none">{totalArea.toFixed(1)} m²</span>
          </div>
        </div>
      </div>
    </header>
  );
};
