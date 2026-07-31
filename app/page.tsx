import { Calculator } from "lucide-react";
import SieveOfEratosthenes from "@/components/SieveOfEratosthenes";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 gap-8">
      {/* Header */}
      <header className="w-full max-w-4xl flex items-center justify-between p-4 bg-pastel-pink rounded-full shadow-md">
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

      {/* Hero Welcome Section */}
      <section className="w-full max-w-4xl bg-pastel-mint p-8 sm:p-10 rounded-3xl shadow-lg text-center flex flex-col items-center gap-4">
        <h2 className="text-4xl sm:text-5xl text-white font-bold tracking-wide">
          안녕! 👋
        </h2>
        <p className="text-lg sm:text-xl text-white/90 font-medium">
          현아의 수학교실에 온 걸 환영해!<br />
          아래 탐험대에서 100 이하의 소수(에라토스테네스의 체)를 같이 찾아보자!
        </p>
      </section>

      {/* Sieve of Eratosthenes Main Interactive Component */}
      <main className="w-full flex justify-center">
        <SieveOfEratosthenes />
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl text-center p-4 text-pastel-blue font-bold">
        <p>© {new Date().getFullYear()} 현아의 수학교실. All rights reserved.</p>
      </footer>
    </div>
  );
}
