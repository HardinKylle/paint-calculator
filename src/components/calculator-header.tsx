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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky z-50 print:hidden overflow-hidden transition-all duration-300 ease-in-out border border-stone-850 shadow-md",
      isScrolled 
        ? "top-[-1px] bg-stone-900/90 backdrop-blur-md p-3 sm:py-3.5 sm:px-6 rounded-b-xl rounded-t-none shadow-lg border-t-0" 
        : "top-0 bg-stone-900 p-5 sm:p-8 rounded-2xl"
    )}>
      <div className={cn(
        "relative z-10 flex justify-between w-full transition-all duration-300", 
        isScrolled ? "flex-row items-center gap-3 sm:gap-5" : "flex-col md:flex-row md:items-center gap-5"
      )}>
        <div className={cn("flex items-center transition-all duration-300", isScrolled ? "gap-2 sm:gap-3" : "gap-3.5")}>
          <PigmentaLogo 
            className={cn(
              "shrink-0 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer", 
              isScrolled ? "h-7 w-7 sm:h-8 sm:w-8" : "h-10 w-10 sm:h-12 sm:w-12"
            )} 
            priority 
          />
          <div>
            <h1 className={cn(
              "font-extrabold tracking-tight text-white transition-all duration-300", 
              isScrolled ? "text-sm sm:text-lg" : "text-xl sm:text-3xl"
            )}>
              Pigmenta
              <span className={cn(
                "transition-all duration-300", 
                isScrolled ? "hidden min-[480px]:inline" : "inline"
              )}> Paint Calculator</span>
            </h1>
            <p className={cn(
              "text-stone-400 transition-all duration-305 origin-top overflow-hidden",
              isScrolled 
                ? "max-h-0 opacity-0 mt-0 pointer-events-none" 
                : "max-h-20 opacity-100 mt-1 text-[11px] sm:text-xs leading-relaxed"
            )}>
              Estimate paint volumes, tin recommendations, labour hours, and costs for interior walls and ceilings.
            </p>
          </div>
        </div>

        <div className={cn(
          "flex border-stone-800 transition-all duration-300",
          isScrolled 
            ? "border-l pl-4 sm:pl-6 pt-0 items-center gap-4 sm:gap-6" 
            : "flex gap-6 justify-start md:justify-start md:self-auto border-t md:border-t-0 md:border-l pt-4 md:pt-0 pl-[54px] md:pl-8 items-start"
        )}>
          <div className="text-left min-w-[50px] sm:min-w-[60px]">
            <span className="block text-[8px] sm:text-[9px] text-stone-500 font-bold uppercase tracking-wider">Rooms</span>
            <span className={cn(
              "font-bold text-white mt-0.5 block leading-none transition-all duration-300", 
              isScrolled ? "text-sm sm:text-lg" : "text-xl sm:text-2xl"
            )}>{roomsCount}</span>
          </div>
          <div className="text-left min-w-[70px] sm:min-w-[80px]">
            <span className="block text-[8px] sm:text-[9px] text-stone-500 font-bold uppercase tracking-wider">Total Area</span>
            <span className={cn(
              "font-bold text-white mt-0.5 block leading-none transition-all duration-300", 
              isScrolled ? "text-sm sm:text-lg" : "text-xl sm:text-2xl"
            )}>{totalArea.toFixed(1)} m²</span>
          </div>
        </div>
      </div>
    </header>
  );
};
