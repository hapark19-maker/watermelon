"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, ChevronRight, Sparkles, Award, MousePointerClick, RefreshCw } from "lucide-react";

// Helper function to check if a number is prime
const isPrime = (n: number): boolean => {
  if (n <= 1) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
};

// Helper function to get smallest divisor > 1 for composite numbers
const getSmallestDivisor = (n: number): number => {
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return i;
  }
  return n;
};

export default function SieveOfEratosthenes() {
  const [mode, setMode] = useState<"interactive" | "simulation">("interactive");

  // --- INTERACTIVE CLICK MODE STATE ---
  const [clickedStatus, setClickedStatus] = useState<Record<number, "unclicked" | "prime" | "composite" | "eliminated">>({});
  const [lastFeedback, setLastFeedback] = useState<string>("숫자 카드를 직접 눌러서 소수인지 확인해보세요!");
  const [foundPrimes, setFoundPrimes] = useState<number[]>([]);

  // --- SIMULATION MODE STATE ---
  const [simStep, setSimStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const MAX_SIM_STEP = 6;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && mode === "simulation") {
      timer = setInterval(() => {
        setSimStep((prev) => {
          if (prev >= MAX_SIM_STEP) {
            setIsPlaying(false);
            return MAX_SIM_STEP;
          }
          return prev + 1;
        });
      }, 1600);
    }
    return () => clearInterval(timer);
  }, [isPlaying, mode]);

  // Handle direct click on a number card in Interactive Mode
  const handleCardClick = (num: number) => {
    if (mode !== "interactive") return;

    if (clickedStatus[num] && clickedStatus[num] !== "unclicked") {
      return;
    }

    if (num === 1) {
      setClickedStatus((prev) => ({ ...prev, 1: "composite" }));
      setLastFeedback("1은 1보다 큰 자연수가 아니므로 소수가 아니에요! ❌");
      return;
    }

    if (isPrime(num)) {
      const newStatus = { ...clickedStatus, [num]: "prime" as const };

      const eliminatedMultiples: number[] = [];
      for (let m = num * 2; m <= 100; m += num) {
        if (!newStatus[m] || newStatus[m] === "unclicked") {
          newStatus[m] = "eliminated";
          eliminatedMultiples.push(m);
        }
      }

      setClickedStatus(newStatus);
      if (!foundPrimes.includes(num)) {
        setFoundPrimes((prev) => [...prev, num].sort((a, b) => a - b));
      }

      if (eliminatedMultiples.length > 0) {
        setLastFeedback(`딩동댕! 🌟 ${num}은(는) 소수예요! ${num}의 배수들(${eliminatedMultiples.slice(0, 4).join(", ")}...)도 함께 체로 걸러냈어요!`);
      } else {
        setLastFeedback(`딩동댕! 🌟 ${num}은(는) 소수예요!`);
      }
    } else {
      const div = getSmallestDivisor(num);
      setClickedStatus((prev) => ({ ...prev, [num]: "composite" }));
      setLastFeedback(`아쉬워요! ${num}은(는) ${div}×${num / div}=${num} 이므로 소수가 아니에요! ❌`);
    }
  };

  const handleResetInteractive = () => {
    setClickedStatus({});
    setFoundPrimes([]);
    setLastFeedback("숫자 카드를 직접 눌러서 소수인지 확인해보세요!");
  };

  const handleResetSim = () => {
    setIsPlaying(false);
    setSimStep(0);
  };

  const handleNextSim = () => {
    if (simStep < MAX_SIM_STEP) {
      setSimStep((prev) => prev + 1);
    }
  };

  const handleTogglePlaySim = () => {
    if (simStep >= MAX_SIM_STEP) {
      setSimStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  const getSimNumberStatus = (num: number) => {
    if (num === 1) {
      return simStep >= 1 ? "eliminated" : "default";
    }

    const primes = [2, 3, 5, 7];
    const primesFoundSoFar = [];
    if (simStep >= 2) primesFoundSoFar.push(2);
    if (simStep >= 3) primesFoundSoFar.push(3);
    if (simStep >= 4) primesFoundSoFar.push(5);
    if (simStep >= 5) primesFoundSoFar.push(7);

    const currentActivePrime = simStep === 2 ? 2 : simStep === 3 ? 3 : simStep === 4 ? 5 : simStep === 5 ? 7 : null;

    if (currentActivePrime === num) return "active-prime";
    if (primes.includes(num)) {
      if (primesFoundSoFar.includes(num)) return "prime";
      return "default";
    }

    for (const p of primesFoundSoFar) {
      if (num % p === 0) return "eliminated";
    }

    if (simStep === MAX_SIM_STEP) return "prime";
    return "default";
  };

  const getSimStepDescription = () => {
    switch (simStep) {
      case 0:
        return "1부터 100까지 수 중에서 소수를 찾아볼까요? 아래 '자동 재생' 또는 '다음 단계' 버튼을 누르세요.";
      case 1:
        return "1단계: 1은 소수가 아니므로 지워요.";
      case 2:
        return "2단계: 2는 소수! 2의 배수들(4, 6, 8...)을 지워요.";
      case 3:
        return "3단계: 3은 소수! 3의 배수들(9, 15, 21...)을 지워요.";
      case 4:
        return "4단계: 5는 소수! 5의 배수들(25, 35, 55...)을 지워요.";
      case 5:
        return "5단계: 7은 소수! 7의 배수들(49, 77, 91)을 지워요.";
      case 6:
        return "🎉 자동 탐험 완성이예요! 100 이하의 소수 25개를 모두 찾았어요!";
      default:
        return "";
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white p-6 sm:p-8 rounded-3xl border-4 border-[#5C3A21] shadow-xl flex flex-col items-center gap-6">
      {/* Title */}
      <div className="text-center flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 bg-pastel-pink/30 border border-[#5C3A21]/20 px-4 py-1.5 rounded-full text-[#5C3A21] font-bold text-sm sm:text-base">
          <Sparkles size={18} />
          <span>에라토스테네스의 체 (1~100)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-black">
          소수(Prime Numbers) 탐험대 🔍
        </h2>
        <p className="text-gray-600 text-sm sm:text-base max-w-lg font-medium">
          직접 카드를 눌러보며 소수를 발견해 보세요!
        </p>
      </div>

      {/* Mode Switch Tabs */}
      <div className="flex bg-gray-100 border-2 border-[#5C3A21]/30 p-1.5 rounded-full w-full max-w-md justify-between shadow-inner">
        <button
          onClick={() => {
            setMode("interactive");
            setIsPlaying(false);
          }}
          className={`flex-1 py-2 px-4 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
            mode === "interactive"
              ? "bg-[#5C3A21] text-white shadow-md scale-102"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <MousePointerClick size={16} />
          <span>직접 클릭해보기</span>
        </button>

        <button
          onClick={() => {
            setMode("simulation");
            setIsPlaying(false);
          }}
          className={`flex-1 py-2 px-4 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
            mode === "simulation"
              ? "bg-[#5C3A21] text-white shadow-md scale-102"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Play size={16} />
          <span>자동 시뮬레이션</span>
        </button>
      </div>

      {/* Mode Controls & Description */}
      {mode === "interactive" ? (
        <div className="w-full flex flex-col items-center gap-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold text-[#5C3A21]">
                발견한 소수: <span className="text-pastel-pink text-lg font-extrabold">{foundPrimes.length}</span> / 25개
              </span>
            </div>

            <button
              onClick={handleResetInteractive}
              className="flex items-center gap-1.5 bg-[#5C3A21] text-white px-4 py-2 rounded-full font-bold text-xs sm:text-sm shadow-md hover:scale-105 transition-transform duration-200"
            >
              <RefreshCw size={16} />
              <span>다시 고르기</span>
            </button>
          </div>

          <div className="w-full bg-pastel-lemon/60 border-2 border-[#5C3A21]/20 p-4 rounded-2xl text-center shadow-sm min-h-[60px] flex items-center justify-center">
            <p className="text-gray-800 font-bold text-sm sm:text-base">
              {lastFeedback}
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleTogglePlaySim}
              className="flex items-center gap-2 bg-pastel-pink border-2 border-[#5C3A21] text-white px-5 py-2.5 rounded-full font-bold shadow-md hover:scale-105 transition-transform duration-200"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              <span>{isPlaying ? "일시정지" : simStep === 0 ? "자동 재생" : simStep === MAX_SIM_STEP ? "다시 보기" : "이어서 재생"}</span>
            </button>

            <button
              onClick={handleNextSim}
              disabled={simStep >= MAX_SIM_STEP || isPlaying}
              className="flex items-center gap-1.5 bg-pastel-mint border-2 border-[#5C3A21] text-[#5C3A21] px-5 py-2.5 rounded-full font-bold shadow-md hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              <span>다음 단계</span>
              <ChevronRight size={18} />
            </button>

            <button
              onClick={handleResetSim}
              className="flex items-center gap-1.5 bg-[#5C3A21] text-white px-4 py-2.5 rounded-full font-bold shadow-md hover:scale-105 transition-transform duration-200"
            >
              <RotateCcw size={18} />
              <span>처음부터</span>
            </button>
          </div>

          <div className="w-full bg-pastel-lemon/60 border-2 border-[#5C3A21]/20 p-4 rounded-2xl text-center shadow-sm">
            <p className="text-gray-800 font-bold text-sm sm:text-base">
              {getSimStepDescription()}
            </p>
          </div>
        </div>
      )}

      {/* 100 Grid */}
      <div className="grid grid-cols-10 gap-1.5 sm:gap-2.5 w-full p-2.5 bg-gray-50 border-2 border-[#5C3A21]/20 rounded-2xl">
        {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => {
          if (mode === "interactive") {
            const status = clickedStatus[num] || "unclicked";

            let bgClass = "bg-white text-gray-800 border border-gray-200 shadow-xs hover:scale-105 hover:bg-pastel-pink/20 cursor-pointer";
            if (status === "prime") {
              bgClass = "bg-pastel-pink border-2 border-[#5C3A21] text-white font-bold scale-105 shadow-md animate-bounce";
            } else if (status === "composite") {
              bgClass = "bg-gray-300 border border-gray-400 text-gray-500 opacity-60 scale-95 line-through cursor-default";
            } else if (status === "eliminated") {
              bgClass = "bg-gray-200/70 border border-gray-300 text-gray-400 opacity-40 scale-90 line-through cursor-default";
            }

            return (
              <button
                key={num}
                onClick={() => handleCardClick(num)}
                className={`aspect-square flex items-center justify-center rounded-xl sm:rounded-2xl text-xs sm:text-base font-semibold transition-all duration-200 select-none ${bgClass}`}
              >
                {num}
              </button>
            );
          } else {
            const status = getSimNumberStatus(num);

            let bgClass = "bg-white text-gray-800 border border-gray-200 shadow-xs";
            if (status === "eliminated") {
              bgClass = "bg-gray-200/60 border border-gray-300 text-gray-400 opacity-40 scale-95 line-through";
            } else if (status === "active-prime") {
              bgClass = "bg-pastel-pink border-2 border-[#5C3A21] text-white font-bold scale-110 shadow-lg ring-4 ring-pastel-pink/40 animate-pulse";
            } else if (status === "prime") {
              bgClass = "bg-pastel-mint border-2 border-[#5C3A21] text-[#5C3A21] font-bold scale-105 shadow-md";
            }

            return (
              <div
                key={num}
                className={`aspect-square flex items-center justify-center rounded-xl sm:rounded-2xl text-xs sm:text-base font-semibold transition-all duration-300 select-none ${bgClass}`}
              >
                {num}
              </div>
            );
          }
        })}
      </div>

      {/* Found Primes List */}
      {mode === "interactive" && foundPrimes.length > 0 && (
        <div className="w-full flex flex-col gap-3 bg-pastel-pink/15 border-2 border-[#5C3A21]/30 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#5C3A21] font-bold">
              <Award size={20} />
              <span>내가 수집한 소수 리스트 ({foundPrimes.length}개)</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {foundPrimes.map((prime) => (
              <span
                key={prime}
                className="bg-pastel-pink border border-[#5C3A21]/30 text-white font-bold text-xs sm:text-sm px-3 py-1 rounded-full shadow-xs hover:scale-110 transition-transform duration-200"
              >
                {prime}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
