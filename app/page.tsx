import { Calculator } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4">
      {/* Header */}
      <header className="w-full max-w-4xl flex items-center justify-between p-4 bg-pastel-pink rounded-full shadow-md mb-8">
        <div className="flex items-center gap-2">
          <div className="bg-white p-2 rounded-full shadow-sm text-pastel-pink">
            <Calculator size={24} />
          </div>
          <h1 className="text-2xl font-bold text-white">현아의 수학교실</h1>
        </div>
        <nav>
          <ul className="flex gap-4 pr-4">
            <li className="text-white hover:scale-105 transition-transform duration-200 cursor-pointer">소개</li>
            <li className="text-white hover:scale-105 transition-transform duration-200 cursor-pointer">학습</li>
          </ul>
        </nav>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center gap-8 w-full max-w-4xl bg-pastel-mint p-12 rounded-3xl shadow-lg border-none">
        <h2 className="text-5xl text-white font-bold tracking-wide">
          안녕! 👋
        </h2>
        <p className="text-xl text-white/90 font-medium">
          현아의 수학교실에 온 걸 환영해!<br />
          우리 같이 재미있게 수학을 배워볼까?
        </p>
        <button className="bg-pastel-blue text-white px-8 py-4 rounded-full text-xl shadow-md hover:scale-105 transition-transform duration-200 border-none font-bold">
          시작하기
        </button>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl text-center p-4 mt-8 text-pastel-blue font-bold">
        <p>© {new Date().getFullYear()} 현아의 수학교실. All rights reserved.</p>
      </footer>
    </div>
  );
}
