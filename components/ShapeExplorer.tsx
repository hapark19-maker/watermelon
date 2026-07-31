"use client";

import React, { useState } from "react";
import { ArrowLeft, Sparkles, Circle, Square, Triangle, Heart, Star, CheckCircle2 } from "lucide-react";

export default function ShapeExplorer({ onBack }: { onBack: () => void }) {
  const [selectedShape, setSelectedShape] = useState<string | null>(null);

  const shapes = [
    { id: "circle", name: "동그라미 (원)", icon: Circle, desc: "모서리가 없고 둥글둥글 완벽한 곡선 모양이에요!", color: "bg-pastel-pink" },
    { id: "triangle", name: "세모 (삼각형)", icon: Triangle, desc: "3개의 변과 3개의 뾰족한 꼭짓점을 가진 모양이에요!", color: "bg-pastel-mint" },
    { id: "square", name: "네모 (사각형)", icon: Square, desc: "4개의 길이고 같은 곧은 변과 꼭짓점을 가져요!", color: "bg-pastel-blue" },
    { id: "star", name: "별 모양 (별)", icon: Star, desc: "하늘에서 반짝이는 반짝반짝 별 모양이에요!", color: "bg-pastel-lemon" },
    { id: "heart", name: "하트 모양 (하트)", icon: Heart, desc: "사랑스럽고 따뜻한 하트 모양이에요!", color: "bg-pastel-pink" },
  ];

  return (
    <div className="w-full max-w-4xl bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col items-center gap-6 border-none">
      <div className="w-full flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-bold text-sm transition-all duration-200"
        >
          <ArrowLeft size={18} />
          <span>목록으로 돌아가기</span>
        </button>
      </div>

      <div className="text-center flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 bg-pastel-blue/30 px-4 py-1.5 rounded-full text-pastel-blue font-bold text-sm">
          <Sparkles size={18} />
          <span>동글동글 도형 탐험</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          도형 친구들을 만나보아요! 📐
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          도형을 터치하여 이름과 특징을 알아보아요!
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
        {shapes.map((s) => {
          const IconComp = s.icon;
          const isSelected = selectedShape === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSelectedShape(s.id)}
              className={`p-6 rounded-3xl flex flex-col items-center gap-3 transition-all duration-200 shadow-md ${s.color} text-white hover:scale-105 ${
                isSelected ? "ring-4 ring-gray-700 scale-105" : ""
              }`}
            >
              <IconComp size={48} className="drop-shadow-sm" />
              <span className="font-bold text-lg">{s.name}</span>
            </button>
          );
        })}
      </div>

      {selectedShape && (
        <div className="w-full bg-pastel-blue/15 p-6 rounded-3xl text-center border-none shadow-sm flex flex-col items-center gap-2 animate-fade-in">
          <div className="flex items-center gap-2 text-pastel-blue font-bold text-lg">
            <CheckCircle2 size={22} />
            <span>{shapes.find((s) => s.id === selectedShape)?.name}</span>
          </div>
          <p className="text-gray-700 font-medium text-base sm:text-lg">
            {shapes.find((s) => s.id === selectedShape)?.desc}
          </p>
        </div>
      )}
    </div>
  );
}
