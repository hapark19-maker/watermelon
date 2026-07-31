"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Sparkles, Play, RotateCcw, CheckCircle2, HelpCircle, Award, ChevronRight } from "lucide-react";

interface Point {
  x: number;
  y: number;
}

interface StageInfo {
  id: number;
  title: string;
  difficulty: string;
  description: string;
  containerShape: "cylinder" | "two-stage" | "cone" | "hourglass";
  correctPoints: Point[]; // Points in normalized coordinates (0 to 1)
  mathExplanation: string;
}

const STAGES: StageInfo[] = [
  {
    id: 1,
    title: "1단계: 원기둥 모양 그릇",
    difficulty: "★☆☆☆ (쉬움)",
    description: "폭이 일정한 원기둥 모양 그릇에 일정한 속도로 물을 채웁니다.",
    containerShape: "cylinder",
    correctPoints: [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ],
    mathExplanation: "그릇의 폭이 일정하므로 물의 높이는 시간에 비례하여 일정하게 올라갑니다. 따라서 그래프는 직선 모양이 됩니다.",
  },
  {
    id: 2,
    title: "2단계: 2단 원기둥 그릇",
    difficulty: "★★☆☆ (보통)",
    description: "아래쪽은 넓고, 위쪽은 좁은 2단계 원기둥 모양 그릇에 물을 채웁니다.",
    containerShape: "two-stage",
    correctPoints: [
      { x: 0, y: 0 },
      { x: 0.6, y: 0.4 },
      { x: 1, y: 1 },
    ],
    mathExplanation: "아래쪽 넓은 그릇에서는 높이가 천천히 올라가고(완만한 기울기), 위쪽 좁은 그릇에서는 높이가 빠르게 올라갑니다(가파른 기울기). 꺾인 직선 모양이 됩니다.",
  },
  {
    id: 3,
    title: "3단계: 위가 좁아지는 원뿔 모양",
    difficulty: "★★★☆ (어려움)",
    description: "위로 갈수록 폭이 점점 좁아지는 모양의 그릇에 물을 채웁니다.",
    containerShape: "cone",
    correctPoints: [
      { x: 0, y: 0 },
      { x: 0.3, y: 0.15 },
      { x: 0.6, y: 0.45 },
      { x: 0.85, y: 0.75 },
      { x: 1, y: 1 },
    ],
    mathExplanation: "위로 갈수록 폭이 좁아지므로 높이가 올라가는 속도가 점점 빨라집니다. 따라서 그래프는 위를 향해 가파르게 올라가는 곡선 모양이 됩니다.",
  },
  {
    id: 4,
    title: "4단계: 호아(모래시계) 모양",
    difficulty: "★★★★ (최고 난이도)",
    description: "중간이 오목하게 좁고 위아래가 넓은 모래시계 모양 그릇에 물을 채웁니다.",
    containerShape: "hourglass",
    correctPoints: [
      { x: 0, y: 0 },
      { x: 0.25, y: 0.15 },
      { x: 0.5, y: 0.5 },
      { x: 0.75, y: 0.85 },
      { x: 1, y: 1 },
    ],
    mathExplanation: "중간 지점의 폭이 가장 좁으므로 중간에서 높이가 가장 빠르게 상승합니다. 시작과 끝은 완만하고 중간은 가파른 S자 곡선 형태가 됩니다.",
  },
];

export default function WaterGraphActivity({ onBack }: { onBack: () => void }) {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [userPoints, setUserPoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [waterLevel, setWaterLevel] = useState(0); // 0 to 1
  const [isFilling, setIsFilling] = useState(false);

  const stage = STAGES[currentStageIdx];
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Water filling animation effect
  useEffect(() => {
    let animationFrame: number;
    if (isFilling) {
      const startTime = Date.now();
      const duration = 4000; // 4 seconds

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setWaterLevel(progress);

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        } else {
          setIsFilling(false);
        }
      };

      animationFrame = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [isFilling]);

  const startWaterAnimation = () => {
    setWaterLevel(0);
    setIsFilling(true);
  };

  // Convert SVG coordinates to normalized (0..1)
  const getCanvasCoords = (e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>): Point | null => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const rawX = (clientX - rect.left) / rect.width;
    const rawY = (clientY - rect.top) / rect.height;

    // Convert SVG Y (top=0, bottom=1) to Math Graph Y (bottom=0, top=1)
    const normX = Math.max(0, Math.min(1, rawX));
    const normY = Math.max(0, Math.min(1, 1 - rawY));

    return { x: normX, y: normY };
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
    if (showAnswer) return;
    const pt = getCanvasCoords(e);
    if (pt) {
      setIsDrawing(true);
      setUserPoints([pt]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
    if (!isDrawing || showAnswer) return;
    const pt = getCanvasCoords(e);
    if (pt) {
      setUserPoints((prev) => [...prev, pt]);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    setUserPoints([]);
    setShowAnswer(false);
  };

  const handleCheckAnswer = () => {
    if (userPoints.length < 2) {
      alert("그래프 영역에 선을 그려주세요!");
      return;
    }
    setShowAnswer(true);
  };

  // Render SVG Container Shape
  const renderContainerSvg = () => {
    const h = waterLevel; // 0 to 1

    return (
      <svg className="w-48 h-64 border-4 border-[#5C3A21] rounded-2xl bg-white shadow-md" viewBox="0 0 200 260">
        {/* Stage 1: Cylinder */}
        {stage.containerShape === "cylinder" && (
          <g>
            {/* Outline */}
            <rect x="50" y="30" width="100" height="200" fill="#f8fafc" stroke="#5C3A21" strokeWidth="4" rx="4" />
            {/* Water */}
            <rect
              x="52"
              y={230 - h * 196}
              width="96"
              height={h * 196}
              fill="#94C1D7"
              opacity="0.85"
            />
          </g>
        )}

        {/* Stage 2: Two-stage Cylinder (Wide bottom, Narrow top) */}
        {stage.containerShape === "two-stage" && (
          <g>
            {/* Outer Container Path */}
            <path
              d="M 30 230 L 30 130 L 70 130 L 70 30 L 130 30 L 130 130 L 170 130 L 170 230 Z"
              fill="#f8fafc"
              stroke="#5C3A21"
              strokeWidth="4"
            />
            {/* Water Level Fill Logic */}
            {h <= 0.4 ? (
              // Filling lower section (height 100px)
              <rect
                x="32"
                y={230 - (h / 0.4) * 98}
                width="136"
                height={(h / 0.4) * 98}
                fill="#94C1D7"
                opacity="0.85"
              />
            ) : (
              // Lower full + upper section filling
              <g>
                <rect x="32" y="132" width="136" height="96" fill="#94C1D7" opacity="0.85" />
                <rect
                  x="72"
                  y={130 - ((h - 0.4) / 0.6) * 98}
                  width="56"
                  height={((h - 0.4) / 0.6) * 98}
                  fill="#94C1D7"
                  opacity="0.85"
                />
              </g>
            )}
          </g>
        )}

        {/* Stage 3: Cone (Wide bottom, narrow top) */}
        {stage.containerShape === "cone" && (
          <g>
            <path
              d="M 30 230 L 75 30 L 125 30 L 170 230 Z"
              fill="#f8fafc"
              stroke="#5C3A21"
              strokeWidth="4"
            />
            {/* Water polygon calculation */}
            {h > 0 && (
              <polygon
                points={`
                  ${30 + h * 45},${230 - h * 200}
                  ${170 - h * 45},${230 - h * 200}
                  170,230
                  30,230
                `}
                fill="#94C1D7"
                opacity="0.85"
              />
            )}
          </g>
        )}

        {/* Stage 4: Hourglass / Vase */}
        {stage.containerShape === "hourglass" && (
          <g>
            <path
              d="M 30 30 Q 100 130 30 230 L 170 230 Q 100 130 170 30 Z"
              fill="#f8fafc"
              stroke="#5C3A21"
              strokeWidth="4"
            />
            {h > 0 && (
              <path
                d={`M 30 230 Q 100 130 170 230 Z`} // Simplified visual fill clip
                fill="#94C1D7"
                opacity="0.85"
              />
            )}
          </g>
        )}

        {/* Water Spout at Top */}
        <path d="M 90 5 L 110 5 L 105 25 L 95 25 Z" fill="#94C1D7" />
        {isFilling && <rect x="97" y="25" width="6" height="205" fill="#94C1D7" opacity="0.6" className="animate-pulse" />}
      </svg>
    );
  };

  // Convert points array to SVG path 'd' string
  const pointsToSvgPath = (pts: Point[], width = 300, height = 300) => {
    if (pts.length === 0) return "";
    return pts
      .map((p, idx) => {
        const svgX = p.x * width;
        const svgY = (1 - p.y) * height;
        return `${idx === 0 ? "M" : "L"} ${svgX} ${svgY}`;
      })
      .join(" ");
  };

  return (
    <div className="w-full max-w-5xl bg-white p-6 sm:p-8 rounded-3xl border-4 border-[#5C3A21] shadow-xl flex flex-col items-center gap-6">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-[#5C3A21] text-white px-4 py-2 rounded-full font-bold text-sm hover:scale-105 transition-all duration-200"
        >
          <ArrowLeft size={18} />
          <span>카드뉴스 메인으로</span>
        </button>

        <div className="flex items-center gap-2 bg-pastel-pink border-2 border-[#5C3A21] text-white px-4 py-1.5 rounded-full font-bold text-sm shadow-sm">
          <Award size={18} />
          <span>중1-2022개정 교육과정 [변수와 그래프]</span>
        </div>
      </div>

      {/* Stage Selector */}
      <div className="w-full flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 text-[#5C3A21] font-bold text-xl sm:text-2xl">
          <Sparkles size={24} className="text-pastel-pink" />
          <span>{stage.title}</span>
          <span className="text-xs sm:text-sm bg-pastel-lemon px-3 py-1 rounded-full border border-[#5C3A21]/30">
            {stage.difficulty}
          </span>
        </div>
        <p className="text-gray-700 font-medium text-sm sm:text-base text-center">
          {stage.description}
        </p>

        {/* Stage Tabs */}
        <div className="flex gap-2 mt-2">
          {STAGES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setCurrentStageIdx(idx);
                handleClear();
                setWaterLevel(0);
              }}
              className={`px-3.5 py-1.5 rounded-full font-bold text-xs sm:text-sm border-2 border-[#5C3A21] transition-all duration-200 ${
                currentStageIdx === idx
                  ? "bg-[#5C3A21] text-white scale-105 shadow-md"
                  : "bg-white text-[#5C3A21] hover:bg-pastel-pink/20"
              }`}
            >
              {s.id}단계
            </button>
          ))}
        </div>
      </div>

      {/* Activity Main Section (Left Container / Right Graph) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gray-50/80 p-6 rounded-3xl border-2 border-[#5C3A21]/20">
        {/* Left Side: Water Container Simulation */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-[#5C3A21] font-bold text-base">
            <HelpCircle size={18} />
            <span>상황: 물병 단면 모양</span>
          </div>

          {renderContainerSvg()}

          <button
            onClick={startWaterAnimation}
            disabled={isFilling}
            className="flex items-center gap-2 bg-pastel-blue text-[#5C3A21] border-2 border-[#5C3A21] px-5 py-2.5 rounded-full font-bold shadow-md hover:scale-105 transition-transform duration-200 disabled:opacity-50"
          >
            <Play size={18} />
            <span>{isFilling ? "물 채우는 중..." : "물 채우기 시뮬레이션 💧"}</span>
          </button>
        </div>

        {/* Right Side: Graph Drawing Canvas */}
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex items-center justify-between w-full">
            <span className="text-sm font-bold text-[#5C3A21]">
              그래프 위에 드래그하여 예측한 선을 그려보세요! ✏️
            </span>
            <button
              onClick={handleClear}
              className="text-xs bg-gray-200 border border-gray-400 text-gray-700 px-3 py-1 rounded-full font-bold hover:bg-gray-300"
            >
              다시 그리기
            </button>
          </div>

          {/* SVG Graph Drawing Container */}
          <div className="relative w-full aspect-square max-w-[320px] bg-white border-3 border-[#5C3A21] rounded-2xl shadow-inner select-none">
            {/* Axis Labels */}
            <div className="absolute left-2 top-2 text-xs font-bold text-[#5C3A21]">
              높이 (cm)
            </div>
            <div className="absolute right-2 bottom-2 text-xs font-bold text-[#5C3A21]">
              시간 (초)
            </div>
            <div className="absolute left-2 bottom-2 text-xs font-bold text-gray-400">
              O (원점)
            </div>

            {/* Grid background lines */}
            <svg
              ref={svgRef}
              className="w-full h-full cursor-crosshair touch-none"
              viewBox="0 0 300 300"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              onTouchEnd={handleMouseUp}
            >
              {/* Grid Lines */}
              <line x1="0" y1="75" x2="300" y2="75" stroke="#e2e8f0" strokeDasharray="4 4" />
              <line x1="0" y1="150" x2="300" y2="150" stroke="#e2e8f0" strokeDasharray="4 4" />
              <line x1="0" y1="225" x2="300" y2="225" stroke="#e2e8f0" strokeDasharray="4 4" />
              <line x1="75" y1="0" x2="75" y2="300" stroke="#e2e8f0" strokeDasharray="4 4" />
              <line x1="150" y1="0" x2="150" y2="300" stroke="#e2e8f0" strokeDasharray="4 4" />
              <line x1="225" y1="0" x2="225" y2="300" stroke="#e2e8f0" strokeDasharray="4 4" />

              {/* Axes */}
              <line x1="0" y1="300" x2="300" y2="300" stroke="#5C3A21" strokeWidth="4" />
              <line x1="0" y1="0" x2="0" y2="300" stroke="#5C3A21" strokeWidth="4" />

              {/* User Drawn Line (Blue/Dark) */}
              {userPoints.length > 1 && (
                <path
                  d={pointsToSvgPath(userPoints)}
                  fill="none"
                  stroke="#5C3A21"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Correct Answer Graph Overlay (Pastel Pink Dashed Line) */}
              {showAnswer && (
                <path
                  d={pointsToSvgPath(stage.correctPoints)}
                  fill="none"
                  stroke="#FF8DA1"
                  strokeWidth="6"
                  strokeDasharray="6 6"
                  className="animate-pulse"
                />
              )}
            </svg>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full max-w-[320px]">
            <button
              onClick={handleCheckAnswer}
              className="flex-1 bg-pastel-pink border-2 border-[#5C3A21] text-white py-2.5 rounded-full font-bold text-sm shadow-md hover:scale-105 transition-transform duration-200"
            >
              정답 확인하기! 🎯
            </button>
            {currentStageIdx < STAGES.length - 1 && (
              <button
                onClick={() => {
                  setCurrentStageIdx((prev) => prev + 1);
                  handleClear();
                  setWaterLevel(0);
                }}
                className="bg-pastel-mint border-2 border-[#5C3A21] text-[#5C3A21] px-4 py-2.5 rounded-full font-bold text-sm shadow-md hover:scale-105 transition-transform duration-200 flex items-center gap-1"
              >
                <span>다음 단계</span>
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Math Explanation Banner (Shown when 정답 확인하기 is clicked) */}
      {showAnswer && (
        <div className="w-full bg-pastel-pink/20 border-3 border-[#5C3A21] p-6 rounded-3xl flex flex-col gap-3 animate-fade-in">
          <div className="flex items-center gap-2 text-[#5C3A21] font-bold text-lg">
            <CheckCircle2 size={24} className="text-pastel-pink" />
            <span>정답 그래프 확인 & 수학 개념 해설 💡</span>
          </div>
          <p className="text-gray-800 font-medium text-base leading-relaxed">
            <span className="font-bold text-pastel-pink">분홍색 점선</span>이 정답 그래프예요!<br />
            {stage.mathExplanation}
          </p>
        </div>
      )}
    </div>
  );
}
