"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Sparkles, CheckCircle2, XCircle, Award, Database, RefreshCw, Trophy } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ScoreRecord {
  id?: string;
  student_name: string;
  score: number;
  correct_count: number;
  created_at?: string;
}

export default function IntegerQuizActivity({ onBack }: { onBack: () => void }) {
  const [studentName, setStudentName] = useState("");
  const [isNameSet, setIsNameSet] = useState(false);

  const [num1, setNum1] = useState(-5);
  const [num2, setNum2] = useState(3);
  const [op, setOp] = useState<"+" | "-" | "*" | "/">("+");
  const [userAnswer, setUserAnswer] = useState("");
  
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);

  const [leaderboard, setLeaderboard] = useState<ScoreRecord[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Generate integer arithmetic problem with positive/negative numbers
  const generateNewQuestion = () => {
    const ops: ("+" | "-" | "*" | "/")[] = ["+", "-", "*", "/"];
    const chosenOp = ops[Math.floor(Math.random() * ops.length)];
    setOp(chosenOp);

    let a = Math.floor(Math.random() * 19) - 9; // -9 to 9
    if (a === 0) a = -3;
    let b = Math.floor(Math.random() * 19) - 9;
    if (b === 0) b = 2;

    if (chosenOp === "/") {
      // Ensure divisible integer result
      const quotient = Math.floor(Math.random() * 9) - 4; // -4 to 4, not 0
      const validQuotient = quotient === 0 ? 2 : quotient;
      a = validQuotient * b;
    }

    setNum1(a);
    setNum2(b);
    setUserAnswer("");
    setFeedback(null);
  };

  useEffect(() => {
    generateNewQuestion();
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from("student_scores")
        .select("*")
        .order("score", { ascending: false })
        .limit(5);

      if (!error && data) {
        setLeaderboard(data);
      }
    } catch (err) {
      console.log("Supabase fetch notice:", err);
    }
  };

  const calculateCorrectResult = (): number => {
    switch (op) {
      case "+":
        return num1 + num2;
      case "-":
        return num1 - num2;
      case "*":
        return num1 * num2;
      case "/":
        return Math.floor(num1 / num2);
      default:
        return 0;
    }
  };

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    const parsedAns = parseInt(userAnswer.trim(), 10);
    const expected = calculateCorrectResult();

    if (parsedAns === expected) {
      setScore((prev) => prev + 10); // 10 points for correct answer!
      setCorrectCount((prev) => prev + 1);
      setFeedback("correct");
      setTimeout(() => {
        generateNewQuestion();
      }, 1200);
    } else {
      setFeedback("incorrect");
    }
  };

  const handleSaveScoreToSupabase = async () => {
    if (!studentName.trim()) {
      alert("학생 이름을 입력해주세요!");
      return;
    }
    if (score === 0) {
      alert("최소 1문제 이상 맞혀서 점수를 취득해야 저장할 수 있어요!");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.from("student_scores").insert([
        {
          student_name: studentName.trim(),
          score: score,
          correct_count: correctCount,
        },
      ]);

      if (error) {
        alert("Supabase 저장 실패: DB 테이블이 생성되었는지 확인해주세요.");
      } else {
        setSaveSuccess(true);
        fetchLeaderboard();
      }
    } catch (err) {
      alert("Supabase 연동을 확인해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  const formatExpression = () => {
    const formattedA = num1 < 0 ? `(${num1})` : `${num1}`;
    const formattedB = num2 < 0 ? `(${num2})` : `${num2}`;
    const displayOp = op === "*" ? "×" : op === "/" ? "÷" : op;
    return `${formattedA} ${displayOp} ${formattedB} = ?`;
  };

  return (
    <div className="w-full max-w-4xl bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#5C3A21] shadow-xl flex flex-col items-center gap-6">
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
        <div className="flex items-center gap-2 bg-pastel-lemon px-4 py-1.5 rounded-full text-[#5C3A21] font-bold text-sm border border-[#5C3A21]/30">
          <Sparkles size={18} />
          <span>중1 정수의 사칙연산 단답형 퀴즈</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-black">
          정수의 사칙연산 왕 🧮
        </h2>
        <p className="text-gray-600 text-sm sm:text-base font-medium">
          양의 정수와 음의 정수 문제를 풀고 정답 시 <span className="text-pastel-pink font-bold">+10점</span>을 획득하세요!
        </p>
      </div>

      {/* Student Name Input Bar */}
      {!isNameSet ? (
        <div className="w-full max-w-md bg-pastel-pink/15 p-6 rounded-2xl border border-[#5C3A21]/30 flex flex-col items-center gap-4">
          <label className="font-bold text-[#5C3A21] text-base">
            학생 이름(닉네임)을 입력하세요:
          </label>
          <div className="flex gap-2 w-full">
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="예: 홍길동"
              className="flex-1 text-center font-bold p-3 rounded-full border-2 border-[#5C3A21] focus:outline-none focus:ring-2 focus:ring-pastel-pink"
            />
            <button
              onClick={() => {
                if (studentName.trim()) setIsNameSet(true);
              }}
              className="bg-[#5C3A21] text-white px-5 py-3 rounded-full font-bold hover:scale-105 transition-transform duration-200"
            >
              시작하기
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between w-full max-w-md bg-gray-100 p-3.5 rounded-2xl border border-[#5C3A21]/20">
          <span className="font-bold text-[#5C3A21]">
            학생: <span className="text-black">{studentName}</span> 님
          </span>
          <div className="flex items-center gap-2">
            <span className="bg-pastel-pink text-white font-bold px-3 py-1 rounded-full text-sm">
              현재 점수: {score}점 ({correctCount}개 맞힘)
            </span>
          </div>
        </div>
      )}

      {/* Main Quiz Area */}
      <div className="w-full max-w-md bg-pastel-lemon/40 border-2 border-[#5C3A21]/30 p-8 rounded-3xl flex flex-col items-center gap-6 shadow-inner">
        <div className="text-3xl sm:text-4xl font-bold text-[#5C3A21] tracking-wider text-center">
          {formatExpression()}
        </div>

        <form onSubmit={handleSubmitAnswer} className="flex flex-col items-center gap-4 w-full">
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="단답형 정답 입력 (예: -3 또는 12)"
            className="w-full text-center text-2xl font-bold p-3 rounded-full bg-white shadow-md border-2 border-[#5C3A21] focus:outline-none focus:ring-4 focus:ring-pastel-pink/40 text-black"
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-pastel-pink border border-[#5C3A21] text-white font-bold text-lg py-3 rounded-full shadow-md hover:scale-105 transition-transform duration-200"
          >
            정답 제출하고 10점 받기! 🚀
          </button>
        </form>

        {feedback === "correct" && (
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-lg animate-bounce">
            <CheckCircle2 size={24} />
            <span>딩동댕! 정답입니다! +10점 획득! 🌟</span>
          </div>
        )}

        {feedback === "incorrect" && (
          <div className="flex items-center gap-2 text-rose-600 font-bold text-lg">
            <XCircle size={24} />
            <span>아쉬워요! 부호(+/-)와 계산 결과를 확인해 보세요!</span>
          </div>
        )}
      </div>

      {/* Supabase Save Button & Leaderboard */}
      <div className="w-full max-w-md flex flex-col items-center gap-4 bg-gray-50 p-5 rounded-2xl border border-[#5C3A21]/20">
        <button
          onClick={handleSaveScoreToSupabase}
          disabled={isSaving || saveSuccess}
          className="w-full bg-[#5C3A21] text-white font-bold py-3 rounded-full shadow-md hover:scale-105 transition-transform duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <Database size={18} />
          <span>{saveSuccess ? "Supabase DB 저장 완료! ✅" : isSaving ? "저장 중..." : "Supabase DB에 내 점수 저장하기 💾"}</span>
        </button>

        {/* Real-time Leaderboard */}
        <div className="w-full flex flex-col gap-2 mt-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#5C3A21]">
            <span className="flex items-center gap-1">
              <Trophy size={14} className="text-yellow-600" />
              <span>Supabase 실시간 명예의 전당 (Top 5)</span>
            </span>
            <button onClick={fetchLeaderboard} className="hover:rotate-180 transition-transform">
              <RefreshCw size={14} />
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            {leaderboard.length > 0 ? (
              leaderboard.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-white px-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold"
                >
                  <span className="text-[#5C3A21]">
                    {idx + 1}위. {item.student_name}
                  </span>
                  <span className="font-bold text-pastel-pink">{item.score}점 ({item.correct_count}문제)</span>
                </div>
              ))
            ) : (
              <span className="text-xs text-gray-500 text-center py-2">
                아직 저장된 점수가 없거나 DB 연결 준비 중입니다. SQL Query를 실행해 주세요.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
