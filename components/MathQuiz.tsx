"use client";

import React, { useState } from "react";
import { ArrowLeft, Sparkles, CheckCircle2, XCircle, Award } from "lucide-react";

export default function MathQuiz({ onBack }: { onBack: () => void }) {
  const [num1, setNum1] = useState(5);
  const [num2, setNum2] = useState(3);
  const [isAddition, setIsAddition] = useState(true);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const generateNewQuestion = () => {
    const isAdd = Math.random() > 0.4;
    setIsAddition(isAdd);
    if (isAdd) {
      setNum1(Math.floor(Math.random() * 20) + 1);
      setNum2(Math.floor(Math.random() * 20) + 1);
    } else {
      const a = Math.floor(Math.random() * 20) + 5;
      const b = Math.floor(Math.random() * a) + 1;
      setNum1(a);
      setNum2(b);
    }
    setUserAnswer("");
    setFeedback(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer) return;

    const correctAnswer = isAddition ? num1 + num2 : num1 - num2;
    if (parseInt(userAnswer, 10) === correctAnswer) {
      setScore((prev) => prev + 10);
      setFeedback("correct");
      setTimeout(() => {
        generateNewQuestion();
      }, 1200);
    } else {
      setFeedback("incorrect");
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white p-6 sm:p-8 rounded-3xl border-4 border-[#5C3A21] shadow-xl flex flex-col items-center gap-6">
      <div className="w-full flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-[#5C3A21] text-white px-4 py-2 rounded-full font-bold text-sm hover:scale-105 transition-all duration-200"
        >
          <ArrowLeft size={18} />
          <span>목록으로 돌아가기</span>
        </button>

        <div className="flex items-center gap-2 bg-pastel-pink border-2 border-[#5C3A21] text-white px-4 py-1.5 rounded-full font-bold text-sm shadow-sm">
          <Award size={18} />
          <span>점수: {score}점</span>
        </div>
      </div>

      <div className="text-center flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 bg-pastel-mint/40 border border-[#5C3A21]/30 px-4 py-1.5 rounded-full text-[#5C3A21] font-bold text-sm">
          <Sparkles size={18} />
          <span>톡톡 덧셈 뺄셈 왕</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-black">
          재미있는 연산 퀴즈 🎯
        </h2>
      </div>

      <div className="w-full max-w-md bg-pastel-mint/20 border-2 border-[#5C3A21]/30 p-8 rounded-3xl flex flex-col items-center gap-6 shadow-inner">
        <div className="text-4xl sm:text-5xl font-bold text-[#5C3A21] tracking-wider">
          {num1} {isAddition ? "+" : "-"} {num2} = ?
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full">
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="정답 입력"
            className="w-full text-center text-2xl font-bold p-3 rounded-full bg-white shadow-md border-3 border-[#5C3A21] focus:outline-none focus:ring-4 focus:ring-pastel-mint/60 text-black"
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-pastel-mint border-2 border-[#5C3A21] text-[#5C3A21] font-bold text-lg py-3 rounded-full shadow-md hover:scale-105 transition-transform duration-200"
          >
            정답 제출하기! 🚀
          </button>
        </form>

        {feedback === "correct" && (
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-lg animate-bounce">
            <CheckCircle2 size={24} />
            <span>딩동댕! 정답이에요! +10점 🌟</span>
          </div>
        )}

        {feedback === "incorrect" && (
          <div className="flex items-center gap-2 text-rose-600 font-bold text-lg">
            <XCircle size={24} />
            <span>아쉬워요! 다시 계산해보세요 떵!</span>
          </div>
        )}
      </div>
    </div>
  );
}
