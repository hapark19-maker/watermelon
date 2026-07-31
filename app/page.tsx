"use client";

import React, { useState } from "react";
import { Calculator, Sparkles, ArrowRight, Award, Circle, ArrowLeft } from "lucide-react";
import SieveOfEratosthenes from "@/components/SieveOfEratosthenes";
import MathQuiz from "@/components/MathQuiz";
import ShapeExplorer from "@/components/ShapeExplorer";

export default function Home() {
  const [activeActivity, setActiveActivity] = useState<"sieve" | "quiz" | "shape" | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 gap-8">
      {/* Header */}
      <header className="w-full max-w-5xl flex items-center justify-between p-4 bg-pastel-pink rounded-full shadow-md">
        <div
          className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-200"
          onClick={() => setActiveActivity(null)}
        >
          <div className="bg-white p-2 rounded-full shadow-sm text-pastel-pink">
            <Calculator size={24} />
          </div>
          <h1 className="text-2xl font-bold text-white">현아의 수학교실</h1>
        </div>
        <nav>
          <ul className="flex gap-4 pr-4">
            <li
              onClick={() => setActiveActivity(null)}
              className="text-white font-bold hover:scale-105 transition-transform duration-200 cursor-pointer"
            >
              메인 홈
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-5xl flex flex-col items-center gap-8">
        {activeActivity === null ? (
          <>
            {/* Hero Banner */}
            <section className="w-full bg-pastel-mint p-8 sm:p-10 rounded-3xl shadow-lg text-center flex flex-col items-center gap-3">
              <div className="bg-white/30 text-white font-bold px-4 py-1 rounded-full text-sm inline-flex items-center gap-1.5">
                <Sparkles size={16} />
                <span>재미있는 맞춤형 수학 놀이터</span>
              </div>
              <h2 className="text-3xl sm:text-4xl text-white font-bold tracking-wide">
                안녕! 현아의 수학교실에 온 걸 환영해! 👋
              </h2>
              <p className="text-base sm:text-lg text-white/90 font-medium max-w-xl">
                아래 카드 뉴스에서 마음에 드는 수학 활동을 선택해 신나게 탐험해 보세요!
              </p>
            </section>

            {/* Card News Section Header */}
            <div className="w-full flex items-center justify-between px-2">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span>오늘의 수학 탐험 카드 📰</span>
              </h3>
              <span className="text-sm font-bold text-gray-500">카드를 누르면 시작돼요!</span>
            </div>

            {/* Card News Grid: Exactly 3 items per row on medium/large screens */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {/* Card 1: Sieve of Eratosthenes */}
              <div
                onClick={() => setActiveActivity("sieve")}
                className="bg-pastel-pink p-7 rounded-3xl shadow-lg flex flex-col justify-between gap-6 cursor-pointer hover:scale-105 transition-transform duration-200 text-white group"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-white/30 px-3 py-1 rounded-full text-xs font-bold">활동 1</span>
                    <Sparkles size={24} className="text-white/80" />
                  </div>
                  <h4 className="text-2xl font-bold tracking-wide">
                    에라토스테네스의 체 🔍
                  </h4>
                  <p className="text-white/90 text-sm font-medium leading-relaxed">
                    1부터 100까지 숫자 카드를 직접 누르며 소수를 체로 걸러내어 찾아보아요!
                  </p>
                </div>
                <div className="flex items-center justify-between font-bold bg-white/20 p-3.5 rounded-2xl group-hover:bg-white group-hover:text-pastel-pink transition-colors duration-200">
                  <span>소수 탐험 시작하기</span>
                  <ArrowRight size={18} />
                </div>
              </div>

              {/* Card 2: Math Quiz */}
              <div
                onClick={() => setActiveActivity("quiz")}
                className="bg-pastel-mint p-7 rounded-3xl shadow-lg flex flex-col justify-between gap-6 cursor-pointer hover:scale-105 transition-transform duration-200 text-white group"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-white/30 px-3 py-1 rounded-full text-xs font-bold">활동 2</span>
                    <Award size={24} className="text-white/80" />
                  </div>
                  <h4 className="text-2xl font-bold tracking-wide">
                    톡톡 덧셈 뺄셈 왕 🎯
                  </h4>
                  <p className="text-white/90 text-sm font-medium leading-relaxed">
                    신나는 덧셈과 뺄셈 퀴즈를 풀면서 나의 셈하기 실력을 쑥쑥 키워보아요!
                  </p>
                </div>
                <div className="flex items-center justify-between font-bold bg-white/20 p-3.5 rounded-2xl group-hover:bg-white group-hover:text-pastel-mint transition-colors duration-200">
                  <span>퀴즈 도전하기</span>
                  <ArrowRight size={18} />
                </div>
              </div>

              {/* Card 3: Shape Explorer */}
              <div
                onClick={() => setActiveActivity("shape")}
                className="bg-pastel-blue p-7 rounded-3xl shadow-lg flex flex-col justify-between gap-6 cursor-pointer hover:scale-105 transition-transform duration-200 text-white group"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-white/30 px-3 py-1 rounded-full text-xs font-bold">활동 3</span>
                    <Circle size={24} className="text-white/80" />
                  </div>
                  <h4 className="text-2xl font-bold tracking-wide">
                    동글동글 도형 탐험 📐
                  </h4>
                  <p className="text-white/90 text-sm font-medium leading-relaxed">
                    동그라미, 세모, 네모, 하트 등 다양한 도형 친구들의 특징을 알아보아요!
                  </p>
                </div>
                <div className="flex items-center justify-between font-bold bg-white/20 p-3.5 rounded-2xl group-hover:bg-white group-hover:text-pastel-blue transition-colors duration-200">
                  <span>도형 탐험하기</span>
                  <ArrowRight size={18} />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full flex flex-col items-center gap-6">
            <div className="w-full flex justify-start">
              <button
                onClick={() => setActiveActivity(null)}
                className="flex items-center gap-2 bg-pastel-pink text-white px-5 py-2.5 rounded-full font-bold shadow-md hover:scale-105 transition-transform duration-200"
              >
                <ArrowLeft size={18} />
                <span>메인 카드뉴스 목록으로</span>
              </button>
            </div>

            {activeActivity === "sieve" && <SieveOfEratosthenes />}
            {activeActivity === "quiz" && <MathQuiz onBack={() => setActiveActivity(null)} />}
            {activeActivity === "shape" && <ShapeExplorer onBack={() => setActiveActivity(null)} />}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl text-center p-4 text-pastel-blue font-bold">
        <p>© {new Date().getFullYear()} 현아의 수학교실. All rights reserved.</p>
      </footer>
    </div>
  );
}
