"use client";

import React, { useState } from "react";
import { Calculator, Sparkles, ArrowRight, Award, Circle, ArrowLeft, TrendingUp, Database, Zap } from "lucide-react";
import SieveOfEratosthenes from "@/components/SieveOfEratosthenes";
import MathQuiz from "@/components/MathQuiz";
import ShapeExplorer from "@/components/ShapeExplorer";
import WaterGraphActivity from "@/components/WaterGraphActivity";
import IntegerQuizActivity from "@/components/IntegerQuizActivity";
import JumpGameActivity from "@/components/JumpGameActivity";

export default function Home() {
  const [activeActivity, setActiveActivity] = useState<"sieve" | "quiz" | "shape" | "water-graph" | "integer-quiz" | "jump-game" | null>(null);

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
            <section className="w-full bg-pastel-mint p-8 sm:p-10 rounded-3xl shadow-lg text-center flex flex-col items-center gap-3 border-none">
              <div className="bg-white/30 text-white font-bold px-4 py-1 rounded-full text-sm inline-flex items-center gap-1.5 shadow-xs">
                <Sparkles size={16} />
                <span>신나는 플래시 장애물 점프 게임 출시</span>
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
              <h3 className="text-2xl font-bold text-[#5C3A21] flex items-center gap-2">
                <span>오늘의 수학 탐험 카드 📰</span>
              </h3>
              <span className="text-sm font-bold text-gray-600">카드를 누르면 시작돼요!</span>
            </div>

            {/* Card News Grid: 3 columns per row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {/* Card 1: Sieve of Eratosthenes */}
              <div
                onClick={() => setActiveActivity("sieve")}
                className="bg-white p-7 rounded-3xl border-2 border-[#5C3A21] shadow-lg flex flex-col justify-between gap-6 cursor-pointer hover:scale-105 transition-transform duration-200 group"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-pastel-pink/30 text-[#5C3A21] border border-[#5C3A21]/30 px-3.5 py-1 rounded-full text-xs font-bold">
                      활동 1
                    </span>
                    <Sparkles size={24} className="text-pastel-pink" />
                  </div>
                  <h4 className="text-2xl font-bold tracking-wide text-black">
                    에라토스테네스의 체 🔍
                  </h4>
                  <p className="text-gray-700 text-sm font-medium leading-relaxed">
                    1부터 100까지 숫자 카드를 직접 누르며 소수를 체로 걸러내어 찾아보아요!
                  </p>
                </div>
                <div className="flex items-center justify-between font-bold bg-pastel-pink/20 text-[#5C3A21] p-3.5 rounded-2xl border border-[#5C3A21]/30 group-hover:bg-[#5C3A21] group-hover:text-white transition-colors duration-200">
                  <span>소수 탐험 시작하기</span>
                  <ArrowRight size={18} />
                </div>
              </div>

              {/* Card 2: Math Quiz */}
              <div
                onClick={() => setActiveActivity("quiz")}
                className="bg-white p-7 rounded-3xl border-2 border-[#5C3A21] shadow-lg flex flex-col justify-between gap-6 cursor-pointer hover:scale-105 transition-transform duration-200 group"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-pastel-mint/40 text-[#5C3A21] border border-[#5C3A21]/30 px-3.5 py-1 rounded-full text-xs font-bold">
                      활동 2
                    </span>
                    <Award size={24} className="text-pastel-mint" />
                  </div>
                  <h4 className="text-2xl font-bold tracking-wide text-black">
                    톡톡 덧셈 뺄셈 왕 🎯
                  </h4>
                  <p className="text-gray-700 text-sm font-medium leading-relaxed">
                    신나는 덧셈과 뺄셈 퀴즈를 풀면서 나의 셈하기 실력을 쑥쑥 키워보아요!
                  </p>
                </div>
                <div className="flex items-center justify-between font-bold bg-pastel-mint/30 text-[#5C3A21] p-3.5 rounded-2xl border border-[#5C3A21]/30 group-hover:bg-[#5C3A21] group-hover:text-white transition-colors duration-200">
                  <span>퀴즈 도전하기</span>
                  <ArrowRight size={18} />
                </div>
              </div>

              {/* Card 3: Shape Explorer */}
              <div
                onClick={() => setActiveActivity("shape")}
                className="bg-white p-7 rounded-3xl border-2 border-[#5C3A21] shadow-lg flex flex-col justify-between gap-6 cursor-pointer hover:scale-105 transition-transform duration-200 group"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-pastel-blue/40 text-[#5C3A21] border border-[#5C3A21]/30 px-3.5 py-1 rounded-full text-xs font-bold">
                      활동 3
                    </span>
                    <Circle size={24} className="text-pastel-blue" />
                  </div>
                  <h4 className="text-2xl font-bold tracking-wide text-black">
                    동글동글 도형 탐험 📐
                  </h4>
                  <p className="text-gray-700 text-sm font-medium leading-relaxed">
                    동그라미, 세모, 네모, 하트 등 다양한 도형 친구들의 특징을 알아보아요!
                  </p>
                </div>
                <div className="flex items-center justify-between font-bold bg-pastel-blue/30 text-[#5C3A21] p-3.5 rounded-2xl border border-[#5C3A21]/30 group-hover:bg-[#5C3A21] group-hover:text-white transition-colors duration-200">
                  <span>도형 탐험하기</span>
                  <ArrowRight size={18} />
                </div>
              </div>

              {/* Card 4: Water Graph Activity */}
              <div
                onClick={() => setActiveActivity("water-graph")}
                className="bg-white p-7 rounded-3xl border-2 border-[#5C3A21] shadow-lg flex flex-col justify-between gap-6 cursor-pointer hover:scale-105 transition-transform duration-200 group"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-pastel-lemon text-[#5C3A21] border border-[#5C3A21]/30 px-3.5 py-1 rounded-full text-xs font-bold">
                      활동 4 (중1 2022개정)
                    </span>
                    <TrendingUp size={24} className="text-[#5C3A21]" />
                  </div>
                  <h4 className="text-2xl font-bold tracking-wide text-black">
                    물병과 그래프 📈
                  </h4>
                  <p className="text-gray-700 text-sm font-medium leading-relaxed">
                    다양한 모양의 물병에 물을 채울 때 높이 변화를 직접 그래프로 그려보아요!
                  </p>
                </div>
                <div className="flex items-center justify-between font-bold bg-pastel-lemon/60 text-[#5C3A21] p-3.5 rounded-2xl border border-[#5C3A21]/30 group-hover:bg-[#5C3A21] group-hover:text-white transition-colors duration-200">
                  <span>그래프 그리러 가기</span>
                  <ArrowRight size={18} />
                </div>
              </div>

              {/* Card 5: Integer Arithmetic Quiz */}
              <div
                onClick={() => setActiveActivity("integer-quiz")}
                className="bg-white p-7 rounded-3xl border-2 border-[#5C3A21] shadow-lg flex flex-col justify-between gap-6 cursor-pointer hover:scale-105 transition-transform duration-200 group"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-pastel-pink/40 text-[#5C3A21] border border-[#5C3A21]/30 px-3.5 py-1 rounded-full text-xs font-bold">
                      활동 5 (Supabase DB)
                    </span>
                    <Database size={24} className="text-pastel-pink" />
                  </div>
                  <h4 className="text-2xl font-bold tracking-wide text-black">
                    정수의 사칙연산 왕 🧮
                  </h4>
                  <p className="text-gray-700 text-sm font-medium leading-relaxed">
                    양수와 음수의 사칙연산 문제를 풀고 10점씩 받아서 Supabase DB에 점수를 저장하세요!
                  </p>
                </div>
                <div className="flex items-center justify-between font-bold bg-pastel-pink/20 text-[#5C3A21] p-3.5 rounded-2xl border border-[#5C3A21]/30 group-hover:bg-[#5C3A21] group-hover:text-white transition-colors duration-200">
                  <span>퀴즈 풀고 점수 저장하기</span>
                  <ArrowRight size={18} />
                </div>
              </div>

              {/* Card 6: Flash Jump Game */}
              <div
                onClick={() => setActiveActivity("jump-game")}
                className="bg-white p-7 rounded-3xl border-2 border-[#5C3A21] shadow-lg flex flex-col justify-between gap-6 cursor-pointer hover:scale-105 transition-transform duration-200 group"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-pastel-mint text-[#5C3A21] border border-[#5C3A21]/30 px-3.5 py-1 rounded-full text-xs font-bold">
                      활동 6 (신규 플래시 게임)
                    </span>
                    <Zap size={24} className="text-pastel-mint fill-pastel-mint" />
                  </div>
                  <h4 className="text-2xl font-bold tracking-wide text-black">
                    달리기 트랙 점프 왕 🏃‍♂️🪨
                  </h4>
                  <p className="text-gray-700 text-sm font-medium leading-relaxed">
                    달리기 트랙을 달리며 스페이스바나 터치로 돌맹이를 뛰어넘고 상위 3등 랭킹에 도전하세요!
                  </p>
                </div>
                <div className="flex items-center justify-between font-bold bg-pastel-mint/30 text-[#5C3A21] p-3.5 rounded-2xl border border-[#5C3A21]/30 group-hover:bg-[#5C3A21] group-hover:text-white transition-colors duration-200">
                  <span>점프 게임 시작하기</span>
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
                className="flex items-center gap-2 bg-[#5C3A21] text-white px-5 py-2.5 rounded-full font-bold shadow-md hover:scale-105 transition-transform duration-200"
              >
                <ArrowLeft size={18} />
                <span>메인 카드뉴스 목록으로</span>
              </button>
            </div>

            {activeActivity === "sieve" && <SieveOfEratosthenes />}
            {activeActivity === "quiz" && <MathQuiz onBack={() => setActiveActivity(null)} />}
            {activeActivity === "shape" && <ShapeExplorer onBack={() => setActiveActivity(null)} />}
            {activeActivity === "water-graph" && <WaterGraphActivity onBack={() => setActiveActivity(null)} />}
            {activeActivity === "integer-quiz" && <IntegerQuizActivity onBack={() => setActiveActivity(null)} />}
            {activeActivity === "jump-game" && <JumpGameActivity onBack={() => setActiveActivity(null)} />}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl text-center p-4 text-[#5C3A21] font-bold">
        <p>© {new Date().getFullYear()} 현아의 수학교실. All rights reserved.</p>
      </footer>
    </div>
  );
}
