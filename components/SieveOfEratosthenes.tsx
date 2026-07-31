"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, ChevronRight, Sparkles, Award } from "lucide-react";

export default function SieveOfEratosthenes() {
  const [step, setStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Maximum step is 6 (0: start, 1: 1 eliminated, 2: prime 2, 3: prime 3, 4: prime 5, 5: prime 7, 6: finished)
  const MAX_STEP = 6;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setStep((prev) => {
          if (prev >= MAX_STEP) {
            setIsPlaying(false);
            return MAX_STEP;
          }
          return prev + 1;
        });
      }, 1600);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleReset = () => {
    setIsPlaying(false);
    setStep(0);
  };

  const handleNext = () => {
    if (step < MAX_STEP) {
      setStep((prev) => prev + 1);
    }
  };

  const handleTogglePlay = () => {
    if (step >= MAX_STEP) {
      setStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  // Helper to determine status of each number (1 ~ 100)
  const getNumberStatus = (num: number) => {
    if (num === 1) {
      if (step >= 1) return "eliminated";
      return "default";
    }

    const primes = [2, 3, 5, 7];
    const primesFoundSoFar = [];

    if (step >= 2) primesFoundSoFar.push(2);
    if (step >= 3) primesFoundSoFar.push(3);
    if (step >= 4) primesFoundSoFar.push(5);
    if (step >= 5) primesFoundSoFar.push(7);

    // Current prime being actively processed
    const currentActivePrime = step === 2 ? 2 : step === 3 ? 3 : step === 4 ? 5 : step === 5 ? 7 : null;

    if (currentActivePrime === num) {
      return "active-prime";
    }

    if (primes.includes(num)) {
      if (primesFoundSoFar.includes(num)) return "prime";
      return "default";
    }

    // Check if eliminated by any of the processed primes
    for (const p of primesFoundSoFar) {
      if (num % p === 0) {
        return "eliminated";
      }
    }

    // Final step: all non-eliminated numbers > 1 are prime!
    if (step === MAX_STEP) {
      return "prime";
    }

    return "default";
  };

  // Calculate count of found primes
  const getPrimeNumbers = () => {
    const primes: number[] = [];
    for (let i = 1; i <= 100; i++) {
      if (getNumberStatus(i) === "prime" || getNumberStatus(i) === "active-prime") {
        primes.push(i);
      }
    }
    return primes;
  };

  const currentPrimes = getPrimeNumbers();

  const getStepDescription = () => {
    switch (step) {
      case 0:
        return "1부터 100까지 수 중에서 소수(1과 자신으로만 나누어지는 특별한 수)를 찾아볼까요? 아래 '시작하기' 버튼을 눌러주세요!";
      case 1:
        return "1단계: 1은 소수가 아니에요! 1을 먼저 지워줍니다.";
      case 2:
        return "2단계: 2는 소수예요! 2를 제외한 2의 배수들(4, 6, 8, 10...)을 모두 지워요.";
      case 3:
        return "3단계: 3은 소수예요! 3을 제외한 3의 배수들(9, 15, 21...)을 지워요.";
      case 4:
        return "4단계: 5는 소수예요! 5를 제외한 5의 배수들(25, 35, 55...)을 지워요.";
      case 5:
        return "5단계: 7은 소수예요! 7을 제외한 7의 배수들(49, 77, 91)을 지워요.";
      case 6:
        return "🎉 탐험 완성이예요! 100 이하의 소수 25개를 모두 찾았어요!";
      default:
        return "";
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col items-center gap-6 border-none">
      {/* Header Info */}
      <div className="text-center flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 bg-pastel-pink/30 px-4 py-1.5 rounded-full text-pastel-pink font-bold text-sm sm:text-base">
          <Sparkles size={18} />
          <span>에라토스테네스의 체 (1~100)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          소수(Prime Numbers) 탐험대 🔍
        </h2>
        <p className="text-gray-600 text-sm sm:text-base max-w-lg">
          체로 곡식을 걸러내듯 배수들을 지워나가면 반짝이는 소수들만 남게 돼요!
        </p>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={handleTogglePlay}
          className="flex items-center gap-2 bg-pastel-pink text-white px-5 py-2.5 rounded-full font-bold shadow-md hover:scale-105 transition-transform duration-200"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          <span>{isPlaying ? "일시정지" : step === 0 ? "자동 재생" : step === MAX_STEP ? "다시 보기" : "이어서 재생"}</span>
        </button>

        <button
          onClick={handleNext}
          disabled={step >= MAX_STEP || isPlaying}
          className="flex items-center gap-1.5 bg-pastel-mint text-white px-5 py-2.5 rounded-full font-bold shadow-md hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
        >
          <span>다음 단계</span>
          <ChevronRight size={18} />
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 bg-pastel-blue text-white px-4 py-2.5 rounded-full font-bold shadow-md hover:scale-105 transition-transform duration-200"
        >
          <RotateCcw size={18} />
          <span>처음부터</span>
        </button>
      </div>

      {/* Dynamic Status Banner */}
      <div className="w-full bg-pastel-lemon/40 p-4 rounded-2xl text-center border-none shadow-sm">
        <p className="text-gray-800 font-bold text-base sm:text-lg">
          {getStepDescription()}
        </p>
      </div>

      {/* 100 Grid */}
      <div className="grid grid-cols-10 gap-1.5 sm:gap-2.5 w-full p-2 bg-gray-50/50 rounded-2xl">
        {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => {
          const status = getNumberStatus(num);

          let bgClass = "bg-white text-gray-700 shadow-xs hover:scale-105";
          if (status === "eliminated") {
            bgClass = "bg-gray-200/60 text-gray-400 opacity-40 scale-95 line-through";
          } else if (status === "active-prime") {
            bgClass = "bg-pastel-pink text-white font-bold scale-110 shadow-lg ring-4 ring-pastel-pink/40 animate-pulse";
          } else if (status === "prime") {
            bgClass = "bg-pastel-mint text-white font-bold scale-105 shadow-md";
          }

          return (
            <div
              key={num}
              className={`aspect-square flex items-center justify-center rounded-xl sm:rounded-2xl text-xs sm:text-base font-semibold transition-all duration-300 select-none ${bgClass}`}
            >
              {num}
            </div>
          );
        })}
      </div>

      {/* Result Section */}
      {currentPrimes.length > 0 && (
        <div className="w-full flex flex-col gap-3 bg-pastel-pink/10 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-pastel-pink font-bold">
              <Award size={20} />
              <span>현재 발견한 소수 ({currentPrimes.length}개)</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {currentPrimes.map((prime) => (
              <span
                key={prime}
                className="bg-pastel-pink text-white font-bold text-xs sm:text-sm px-3 py-1 rounded-full shadow-xs hover:scale-110 transition-transform duration-200"
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
