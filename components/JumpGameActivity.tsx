"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Sparkles, Play, RotateCcw, Trophy, Database, Award, RefreshCw, Zap, LogIn } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface JumpScore {
  id?: string;
  player_name: string;
  score: number;
  cleared_obstacles: number;
  created_at?: string;
}

interface JumpGameProps {
  onBack: () => void;
  currentUser: { email: string; nickname: string } | null;
  onRequireLogin: () => void;
}

export default function JumpGameActivity({ onBack, currentUser, onRequireLogin }: JumpGameProps) {
  const [gameState, setGameState] = useState<"IDLE" | "PLAYING" | "GAMEOVER">("IDLE");
  const [score, setScore] = useState(0);
  const [clearedCount, setClearedCount] = useState(0);
  const [currentSpeedMultiplier, setCurrentSpeedMultiplier] = useState(1);
  const [playerName, setPlayerName] = useState(currentUser?.nickname || "");
  const [topScores, setTopScores] = useState<JumpScore[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    if (currentUser?.nickname) {
      setPlayerName(currentUser.nickname);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchTopScores();
  }, []);

  const fetchTopScores = async () => {
    try {
      const { data, error } = await supabase
        .from("jump_game_scores")
        .select("*")
        .order("score", { ascending: false })
        .limit(3);

      if (!error && data) {
        setTopScores(data);
      }
    } catch (err) {
      console.log("Fetch top scores notice:", err);
    }
  };

  const gameRef = useRef({
    runnerY: 190,
    runnerVy: 0,
    isJumping: false,
    groundY: 190,
    gravity: 0.65,
    jumpForce: -12.5,
    speed: 5.5,
    baseSpeed: 5.5,
    score: 0,
    clearedCount: 0,
    obstacles: [] as { x: number; width: number; height: number; passed: boolean }[],
    trackOffset: 0,
    lastObstacleTime: 0,
    gameTime: 0,
  });

  const startGame = () => {
    gameRef.current = {
      runnerY: 190,
      runnerVy: 0,
      isJumping: false,
      groundY: 190,
      gravity: 0.65,
      jumpForce: -12.5,
      speed: 5.5,
      baseSpeed: 5.5,
      score: 0,
      clearedCount: 0,
      obstacles: [{ x: 600, width: 35, height: 35, passed: false }],
      trackOffset: 0,
      lastObstacleTime: Date.now(),
      gameTime: 0,
    };
    setScore(0);
    setClearedCount(0);
    setCurrentSpeedMultiplier(1);
    setSaveSuccess(false);
    setGameState("PLAYING");
  };

  const jump = () => {
    const g = gameRef.current;
    if (!g.isJumping && g.runnerY >= g.groundY) {
      g.runnerVy = g.jumpForce;
      g.isJumping = true;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        if (gameState === "PLAYING") {
          jump();
        } else if (gameState === "IDLE" || gameState === "GAMEOVER") {
          startGame();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "PLAYING") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = () => {
      const g = gameRef.current;
      g.gameTime += 1;

      g.runnerVy += g.gravity;
      g.runnerY += g.runnerVy;

      if (g.runnerY >= g.groundY) {
        g.runnerY = g.groundY;
        g.runnerVy = 0;
        g.isJumping = false;
      }

      g.speed = g.baseSpeed + Math.min(g.gameTime / 300, 6.5);
      const speedMult = parseFloat((g.speed / g.baseSpeed).toFixed(1));

      g.trackOffset = (g.trackOffset + g.speed) % 40;

      const now = Date.now();
      const minInterval = Math.max(1200, 2200 - g.speed * 120);
      if (now - g.lastObstacleTime > minInterval + Math.random() * 800) {
        g.obstacles.push({
          x: canvas.width + 20,
          width: 30 + Math.random() * 15,
          height: 32 + Math.random() * 15,
          passed: false,
        });
        g.lastObstacleTime = now;
      }

      for (let i = 0; i < g.obstacles.length; i++) {
        const obs = g.obstacles[i];
        obs.x -= g.speed;

        if (!obs.passed && obs.x + obs.width < 80) {
          obs.passed = true;
          g.clearedCount += 1;
          const pointsAwarded = Math.round(10 * speedMult);
          g.score += pointsAwarded;

          setScore(g.score);
          setClearedCount(g.clearedCount);
          setCurrentSpeedMultiplier(speedMult);
        }
      }

      g.obstacles = g.obstacles.filter((obs) => obs.x + obs.width > -50);

      const runnerBox = {
        x: 80 + 8,
        y: g.runnerY + 5,
        width: 34,
        height: 42,
      };

      for (let i = 0; i < g.obstacles.length; i++) {
        const obs = g.obstacles[i];
        const obsBox = {
          x: obs.x + 4,
          y: canvas.height - 70 - obs.height + 4,
          width: obs.width - 8,
          height: obs.height - 8,
        };

        if (
          runnerBox.x < obsBox.x + obsBox.width &&
          runnerBox.x + runnerBox.width > obsBox.x &&
          runnerBox.y < obsBox.y + obsBox.height &&
          runnerBox.y + runnerBox.height > obsBox.y
        ) {
          setGameState("GAMEOVER");
          return;
        }
      }

      ctx.fillStyle = "#E0F2FE";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc((g.gameTime * 0.5) % 700 - 50, 40, 25, 0, Math.PI * 2);
      ctx.arc((g.gameTime * 0.5) % 700 - 30, 35, 30, 0, Math.PI * 2);
      ctx.arc((g.gameTime * 0.5) % 700, 40, 25, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc((g.gameTime * 0.3 + 300) % 700 - 50, 60, 20, 0, Math.PI * 2);
      ctx.arc((g.gameTime * 0.3 + 300) % 700 - 35, 55, 25, 0, Math.PI * 2);
      ctx.arc((g.gameTime * 0.3 + 300) % 700, 60, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#94C1D7";
      ctx.fillRect(0, canvas.height - 120, canvas.width, 50);
      ctx.fillStyle = "#FFAFBE";
      ctx.fillRect(0, canvas.height - 120, canvas.width, 8);

      ctx.fillStyle = "#C85A32";
      ctx.fillRect(0, canvas.height - 70, canvas.width, 70);

      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 3;
      ctx.setLineDash([25, 15]);
      ctx.lineDashOffset = -g.trackOffset;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 45);
      ctx.lineTo(canvas.width, canvas.height - 45);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 20);
      ctx.lineTo(canvas.width, canvas.height - 20);
      ctx.stroke();
      ctx.setLineDash([]);

      for (const obs of g.obstacles) {
        const obsY = canvas.height - 70 - obs.height;

        ctx.fillStyle = "#64748B";
        ctx.beginPath();
        ctx.moveTo(obs.x + obs.width * 0.2, obsY + obs.height);
        ctx.lineTo(obs.x, obsY + obs.height * 0.6);
        ctx.lineTo(obs.x + obs.width * 0.3, obsY);
        ctx.lineTo(obs.x + obs.width * 0.8, obsY + obs.height * 0.1);
        ctx.lineTo(obs.x + obs.width, obsY + obs.height * 0.7);
        ctx.lineTo(obs.x + obs.width * 0.7, obsY + obs.height);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = "#334155";
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = "#94A3B8";
        ctx.beginPath();
        ctx.arc(obs.x + obs.width * 0.4, obsY + obs.height * 0.3, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      const charX = 80;
      const charY = g.runnerY;

      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.beginPath();
      ctx.ellipse(charX + 22, canvas.height - 68, 18, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#FF8DA1";
      ctx.beginPath();
      ctx.arc(charX + 22, charY + 14, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#5C3A21";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = "#5C3A21";
      ctx.beginPath();
      ctx.arc(charX + 26, charY + 12, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#75CE9F";
      ctx.fillRect(charX + 12, charY + 28, 20, 20);
      ctx.strokeRect(charX + 12, charY + 28, 20, 20);

      const legPhase = Math.sin(g.gameTime * 0.4);
      ctx.strokeStyle = "#5C3A21";
      ctx.lineWidth = 4;

      if (g.isJumping) {
        ctx.beginPath();
        ctx.moveTo(charX + 16, charY + 48);
        ctx.lineTo(charX + 8, charY + 58);
        ctx.moveTo(charX + 28, charY + 48);
        ctx.lineTo(charX + 36, charY + 56);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(charX + 16, charY + 48);
        ctx.lineTo(charX + 16 + legPhase * 10, charY + 62);
        ctx.moveTo(charX + 28, charY + 48);
        ctx.lineTo(charX + 28 - legPhase * 10, charY + 62);
        ctx.stroke();
      }

      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState]);

  const handleSaveScore = async () => {
    if (!currentUser) {
      alert("로그인 후 점수를 저장할 수 있습니다. 로그인 창으로 이동합니다!");
      onRequireLogin();
      return;
    }

    const nameToSave = currentUser.nickname || playerName.trim();
    if (!nameToSave) {
      alert("이름/닉네임을 입력해주세요!");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.from("jump_game_scores").insert([
        {
          player_name: nameToSave,
          score: score,
          cleared_obstacles: clearedCount,
        },
      ]);

      if (!error) {
        setSaveSuccess(true);
        fetchTopScores();
      } else {
        alert("저장 실패: " + error.message);
      }
    } catch (err: any) {
      alert("DB 연동 오류: " + err?.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#5C3A21] shadow-xl flex flex-col items-center gap-6 select-none">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-[#5C3A21] text-white px-4 py-2 rounded-full font-bold text-sm hover:scale-105 transition-all duration-200"
        >
          <ArrowLeft size={18} />
          <span>카드뉴스 메인으로</span>
        </button>

        <div className="flex items-center gap-2 bg-pastel-pink border border-[#5C3A21]/30 text-white px-4 py-1.5 rounded-full font-bold text-sm shadow-sm">
          <Database size={18} />
          <span>Supabase DB 연동 완료</span>
        </div>
      </div>

      {/* Activity Title */}
      <div className="text-center flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 bg-pastel-mint/30 px-4 py-1.5 rounded-full text-[#5C3A21] font-bold text-sm border border-[#5C3A21]/30">
          <Sparkles size={18} />
          <span>신나는 런닝 트랙 장애물 점프 게임</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-black">
          달리기 트랙 점프 왕 🏃‍♂️🪨
        </h2>
        <p className="text-gray-600 text-sm sm:text-base font-medium">
          스페이스바나 화면을 클릭하여 돌맹이 장애물을 피해 뛰어넘어 보세요!
        </p>
      </div>

      {/* Live Game Score Dashboard */}
      <div className="w-full max-w-2xl flex items-center justify-between bg-pastel-lemon/60 p-4 rounded-2xl border border-[#5C3A21]/30">
        <div className="flex items-center gap-2 font-bold text-[#5C3A21] text-base sm:text-lg">
          <Award size={22} className="text-pastel-pink" />
          <span>점수: <span className="text-pastel-pink text-xl font-extrabold">{score}</span>점</span>
        </div>

        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#5C3A21]">
          <span>통과한 돌맹이: <span className="text-pastel-mint text-base font-extrabold">{clearedCount}</span>개</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-700 bg-white px-3 py-1 rounded-full border border-amber-400 shadow-xs">
          <Zap size={16} className="text-amber-500 fill-amber-400" />
          <span>속도 배율: {currentSpeedMultiplier}x</span>
        </div>
      </div>

      {/* Canvas Game Stage Container */}
      <div
        onClick={gameState === "PLAYING" ? jump : undefined}
        className="relative w-full max-w-2xl aspect-[16/9] max-h-[360px] bg-sky-100 rounded-3xl border-3 border-[#5C3A21] shadow-lg overflow-hidden cursor-pointer"
      >
        <canvas ref={canvasRef} width={640} height={320} className="w-full h-full block" />

        {/* Start Game Overlay */}
        {gameState === "IDLE" && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex flex-col items-center justify-center gap-4 p-4 text-white text-center">
            <h3 className="text-3xl font-extrabold drop-shadow-md">준비하시고... 🏃‍♂️</h3>
            <p className="text-base font-medium opacity-90">
              스페이스바를 누르거나 화면을 클릭하여 장애물을 점프하세요!
            </p>
            <button
              onClick={startGame}
              className="flex items-center gap-2 bg-pastel-pink border-2 border-[#5C3A21] text-white font-bold text-xl px-8 py-3.5 rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
            >
              <Play size={24} />
              <span>게임 시작하기 🚀</span>
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === "GAMEOVER" && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center gap-4 p-6 text-white text-center animate-fade-in">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-rose-300 drop-shadow-md">
              게임 오버! 💥
            </h3>
            <p className="text-lg font-bold">
              최종 점수: <span className="text-pastel-lemon text-2xl font-extrabold">{score}점</span> ({clearedCount}개 통과)
            </p>

            {/* Score Save Input inside Overlay */}
            <div className="w-full max-w-sm bg-white text-gray-800 p-4 rounded-2xl flex flex-col items-center gap-3 shadow-md border-2 border-[#5C3A21]">
              {currentUser ? (
                <div className="flex items-center justify-between w-full font-bold text-sm text-[#5C3A21]">
                  <span>로그인 계정: <span className="text-black font-extrabold">{currentUser.nickname}</span></span>
                  <button
                    onClick={handleSaveScore}
                    disabled={isSaving || saveSuccess}
                    className="bg-[#5C3A21] text-white px-4 py-2 rounded-xl font-bold text-xs hover:scale-105 transition-transform duration-200 disabled:opacity-50"
                  >
                    {saveSuccess ? "저장 완료! ✅" : "점수 저장 💾"}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 w-full">
                  <span className="text-xs font-bold text-rose-600">🔒 로그인 후 명예의 전당에 점수를 저장할 수 있습니다.</span>
                  <button
                    onClick={onRequireLogin}
                    className="w-full bg-[#5C3A21] text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 hover:scale-105 transition-transform"
                  >
                    <LogIn size={14} />
                    <span>로그인하고 점수 저장하기</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={startGame}
              className="flex items-center gap-2 bg-pastel-mint border-2 border-[#5C3A21] text-[#5C3A21] font-bold text-lg px-6 py-2.5 rounded-full shadow-md hover:scale-105 transition-transform duration-200 mt-1"
            >
              <RotateCcw size={20} />
              <span>다시 도전하기 🔄</span>
            </button>
          </div>
        )}
      </div>

      {/* Hall of Fame Leaderboard */}
      <div className="w-full max-w-2xl bg-amber-50/80 border-2 border-[#5C3A21]/30 p-5 rounded-3xl flex flex-col items-center gap-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-[#5C3A21] font-bold text-base sm:text-lg">
            <Trophy size={22} className="text-yellow-600 fill-yellow-400" />
            <span>🏆 명예의 전당 (상위 3명 랭킹)</span>
          </div>
          <button onClick={fetchTopScores} className="text-xs font-bold text-gray-600 flex items-center gap-1 hover:rotate-180 transition-transform">
            <RefreshCw size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
          {/* 1st Place */}
          <div className="bg-white p-4 rounded-2xl border-2 border-yellow-400 shadow-sm flex flex-col items-center gap-1 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-yellow-400 text-white font-bold text-[10px] px-2 py-0.5 rounded-bl-lg">
              1위 🥇
            </div>
            <span className="font-bold text-[#5C3A21] text-base mt-1">
              {topScores[0]?.player_name || "도전 대기중"}
            </span>
            <span className="font-extrabold text-pastel-pink text-lg">
              {topScores[0]?.score ? `${topScores[0].score}점` : "0점"}
            </span>
          </div>

          {/* 2nd Place */}
          <div className="bg-white p-4 rounded-2xl border-2 border-slate-300 shadow-sm flex flex-col items-center gap-1 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-slate-300 text-gray-700 font-bold text-[10px] px-2 py-0.5 rounded-bl-lg">
              2위 🥈
            </div>
            <span className="font-bold text-[#5C3A21] text-base mt-1">
              {topScores[1]?.player_name || "도전 대기중"}
            </span>
            <span className="font-extrabold text-pastel-pink text-lg">
              {topScores[1]?.score ? `${topScores[1].score}점` : "0점"}
            </span>
          </div>

          {/* 3rd Place */}
          <div className="bg-white p-4 rounded-2xl border-2 border-amber-600/40 shadow-sm flex flex-col items-center gap-1 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-amber-600/40 text-white font-bold text-[10px] px-2 py-0.5 rounded-bl-lg">
              3위 🥉
            </div>
            <span className="font-bold text-[#5C3A21] text-base mt-1">
              {topScores[2]?.player_name || "도전 대기중"}
            </span>
            <span className="font-extrabold text-pastel-pink text-lg">
              {topScores[2]?.score ? `${topScores[2].score}점` : "0점"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
