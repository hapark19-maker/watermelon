"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Sparkles, Send, Bot, User, RefreshCw, MessageSquare, AlertCircle } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function MathChatbotActivity({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "안녕! 나는 '현아의 수학교실' AI 수학 선생님이야! 🤖✨\n궁금한 수학 개념이나 잘 풀리지 않는 문제가 있으면 무엇이든 물어봐!",
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const presetQuestions = [
    "소수가 무슨 뜻인가요? 🔍",
    "음수와 음수를 곱하면 왜 양수가 되나요? ➕",
    "원기둥의 겉넓이는 어떻게 구하나요? 📐",
    "그래프에서 세모/네모 물병의 차이가 궁금해요! 📈",
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setInputQuery("");
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "OpenAI API 호출에 실패했습니다.");
      } else {
        const botMsg: Message = { role: "assistant", content: data.reply };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (err: any) {
      setErrorMessage("서버와 통신하는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "안녕! 나는 '현아의 수학교실' AI 수학 선생님이야! 🤖✨\n궁금한 수학 개념이나 잘 풀리지 않는 문제가 있으면 무엇이든 물어봐!",
      },
    ]);
    setErrorMessage(null);
  };

  return (
    <div className="w-full max-w-4xl bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#5C3A21] shadow-xl flex flex-col items-center gap-6">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-[#5C3A21] text-white px-4 py-2 rounded-full font-bold text-sm hover:scale-105 transition-all duration-200"
        >
          <ArrowLeft size={18} />
          <span>카드뉴스 메인으로</span>
        </button>

        <div className="flex items-center gap-2 bg-pastel-pink border border-[#5C3A21]/30 text-white px-4 py-1.5 rounded-full font-bold text-sm shadow-sm">
          <Bot size={18} />
          <span>OpenAI API 자동연동 완료</span>
        </div>
      </div>

      {/* Activity Title */}
      <div className="text-center flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 bg-pastel-lemon px-4 py-1.5 rounded-full text-[#5C3A21] font-bold text-sm border border-[#5C3A21]/30">
          <Sparkles size={18} />
          <span>24시간 실시간 수학 질문 서비스</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-black flex items-center gap-2">
          <span>AI 수학 선생님 챗봇 🤖</span>
        </h2>
        <p className="text-gray-600 text-sm sm:text-base font-medium">
          수학 질문을 입력하면 친절하고 상냥하게 답변해 주실 거예요!
        </p>
      </div>

      {/* Preset Suggested Questions */}
      <div className="w-full flex flex-col gap-2">
        <span className="text-xs font-bold text-[#5C3A21] flex items-center gap-1">
          <MessageSquare size={14} />
          <span>추천 수학 질문 선택하기:</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-xs sm:text-sm bg-pastel-lemon/60 border border-[#5C3A21]/30 text-[#5C3A21] px-3.5 py-1.5 rounded-full font-semibold hover:bg-[#5C3A21] hover:text-white transition-all duration-200"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Conversation Container */}
      <div className="w-full max-w-3xl bg-gray-50 border-2 border-[#5C3A21]/30 rounded-3xl p-4 sm:p-6 flex flex-col gap-4 min-h-[360px] max-h-[480px] overflow-y-auto shadow-inner">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white shrink-0 border border-[#5C3A21]/30 shadow-xs ${
                msg.role === "user" ? "bg-pastel-pink" : "bg-pastel-mint text-[#5C3A21]"
              }`}
            >
              {msg.role === "user" ? <User size={20} /> : <Bot size={20} />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[80%] p-4 rounded-2xl text-sm sm:text-base leading-relaxed whitespace-pre-wrap shadow-xs border ${
                msg.role === "user"
                  ? "bg-[#5C3A21] text-white rounded-tr-none border-[#5C3A21]"
                  : "bg-white text-gray-800 rounded-tl-none border-gray-200"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-pastel-mint text-[#5C3A21] flex items-center justify-center font-bold border border-[#5C3A21]/30 shadow-xs">
              <Bot size={20} />
            </div>
            <div className="bg-white border border-gray-200 text-gray-600 px-4 py-3 rounded-2xl rounded-tl-none text-sm font-medium animate-pulse flex items-center gap-2">
              <RefreshCw size={16} className="animate-spin text-pastel-pink" />
              <span>AI 수학 선생님이 답변을 열심히 작성하고 있어요... 💭</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="w-full max-w-3xl bg-rose-50 border-2 border-rose-400 p-3.5 rounded-xl text-rose-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Input Area Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="w-full max-w-3xl flex items-center gap-2"
      >
        <button
          type="button"
          onClick={handleResetChat}
          className="p-3 rounded-full bg-gray-100 border border-gray-300 text-gray-600 hover:bg-gray-200 transition-colors shrink-0"
          title="대화 초기화"
        >
          <RefreshCw size={18} />
        </button>

        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="수학 질문을 자유롭게 입력해 보세요 (예: 정수의 덧셈 방법)..."
          className="flex-1 text-sm sm:text-base font-medium p-3.5 px-5 rounded-full border-2 border-[#5C3A21] focus:outline-none focus:ring-4 focus:ring-pastel-pink/40 text-black shadow-xs"
        />

        <button
          type="submit"
          disabled={isLoading || !inputQuery.trim()}
          className="bg-pastel-pink border-2 border-[#5C3A21] text-white p-3.5 px-6 rounded-full font-bold shadow-md hover:scale-105 transition-all duration-200 disabled:opacity-50 flex items-center gap-2 shrink-0"
        >
          <span>질문하기</span>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
