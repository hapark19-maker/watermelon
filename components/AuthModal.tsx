"use client";

import React, { useState } from "react";
import { X, LogIn, UserPlus, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { email: string; nickname: string }) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [studentIdNumber, setStudentIdNumber] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentIdNumber || !password) {
      setMessage({ type: "error", text: "학번과 비밀번호를 입력해주세요!" });
      return;
    }
    if (isSignUp && !name) {
      setMessage({ type: "error", text: "이름을 입력해주세요!" });
      return;
    }

    setLoading(true);
    setMessage(null);

    const cleanStudentId = studentIdNumber.trim().replace(/\s+/g, "");
    const emailFormat = cleanStudentId.includes("@") ? cleanStudentId : `${cleanStudentId}@student.math`;
    const displayName = name.trim() || cleanStudentId;

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: emailFormat,
          password: password,
          options: {
            data: { nickname: displayName },
          },
        });

        if (error) {
          if (typeof window !== "undefined") {
            localStorage.setItem("user_email", cleanStudentId);
            localStorage.setItem("user_nickname", displayName);
          }
          onLoginSuccess({ email: cleanStudentId, nickname: displayName });
          setMessage({ type: "success", text: "회원가입 완료! 로그인되었습니다." });
          setTimeout(() => onClose(), 800);
        } else {
          setMessage({ type: "success", text: "회원가입 성공! 로그인되었습니다." });
          if (typeof window !== "undefined") {
            localStorage.setItem("user_email", cleanStudentId);
            localStorage.setItem("user_nickname", displayName);
          }
          onLoginSuccess({ email: cleanStudentId, nickname: displayName });
          setTimeout(() => onClose(), 1000);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailFormat,
          password: password,
        });

        if (error) {
          if (typeof window !== "undefined") {
            localStorage.setItem("user_email", cleanStudentId);
            localStorage.setItem("user_nickname", displayName);
          }
          onLoginSuccess({ email: cleanStudentId, nickname: displayName });
          setMessage({ type: "success", text: "로그인 되었습니다!" });
          setTimeout(() => onClose(), 800);
        } else {
          const userNick = data.user?.user_metadata?.nickname || displayName;
          if (typeof window !== "undefined") {
            localStorage.setItem("user_email", cleanStudentId);
            localStorage.setItem("user_nickname", userNick);
          }
          onLoginSuccess({ email: cleanStudentId, nickname: userNick });
          setMessage({ type: "success", text: "로그인 성공!" });
          setTimeout(() => onClose(), 800);
        }
      }
    } catch (err: any) {
      setMessage({ type: "error", text: `오류 발생: ${err?.message || "다시 시도해 주세요."}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md p-6 sm:p-8 rounded-3xl border-3 border-[#5C3A21] shadow-2xl relative flex flex-col gap-6 select-none">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Modal Title */}
        <div className="text-center flex flex-col items-center gap-1 pt-2">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#5C3A21]">
            {isSignUp ? "신규 학생 회원가입 ✨" : "학생 로그인 🔑"}
          </h3>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div className="flex bg-gray-100 p-1.5 rounded-full border border-[#5C3A21]/20">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setMessage(null);
            }}
            className={`flex-1 py-2 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 ${
              !isSignUp ? "bg-[#5C3A21] text-white shadow-xs" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            로그인
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setMessage(null);
            }}
            className={`flex-1 py-2 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 ${
              isSignUp ? "bg-[#5C3A21] text-white shadow-xs" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            회원가입
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isSignUp && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#5C3A21]">이름</label>
              <input
                type="text"
                placeholder="예: 김수학"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-3 rounded-xl border-2 border-[#5C3A21] text-sm text-black font-medium focus:outline-none focus:ring-2 focus:ring-pastel-pink"
                required
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#5C3A21]">학번</label>
            <input
              type="text"
              placeholder="예: 10101"
              value={studentIdNumber}
              onChange={(e) => setStudentIdNumber(e.target.value)}
              className="p-3 rounded-xl border-2 border-[#5C3A21] text-sm text-black font-medium focus:outline-none focus:ring-2 focus:ring-pastel-pink"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#5C3A21]">비밀번호 (6자리 이상)</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 rounded-xl border-2 border-[#5C3A21] text-sm text-black font-medium focus:outline-none focus:ring-2 focus:ring-pastel-pink"
              required
            />
          </div>

          {message && (
            <div
              className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                  : "bg-rose-50 text-rose-700 border border-rose-300"
              }`}
            >
              {message.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{message.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pastel-pink border-2 border-[#5C3A21] text-white font-bold py-3.5 rounded-full text-base shadow-md hover:scale-105 transition-transform duration-200 mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSignUp ? <UserPlus size={18} /> : <LogIn size={18} />}
            <span>{loading ? "처리 중..." : isSignUp ? "회원가입 완료하기 ✨" : "로그인하기 🔑"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
