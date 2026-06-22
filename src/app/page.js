"use client";

import Link from "next/link";
import { Dices, BarChart3, GraduationCap, Leaf, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white flex flex-col justify-between relative overflow-hidden">
      {/* Background patterns */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', 
          backgroundSize: '32px 32px' 
        }} 
      />

      {/* Decorative colored blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-200/40 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-md shadow-indigo-200">
            B
          </div>
          <span className="text-2xl font-black text-indigo-900 tracking-wider">BEKAL</span>
        </div>
        <div className="text-xs font-bold text-slate-400 bg-slate-100 rounded-full px-4 py-1.5 border border-slate-200/60 uppercase tracking-widest">
          Satria Data 2026
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl w-full mx-auto px-6 py-12 flex flex-col items-center text-center relative z-10 my-auto">
        {/* Leaf Tag */}
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-100 px-4 py-2 rounded-full text-sm font-bold mb-8 shadow-sm">
          <Leaf size={16} className="animate-pulse" />
          <span>Solusi Kreatif Pengelolaan Sisa Pangan</span>
        </div>

        {/* Hero Title & Subtitle */}
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-none">
          Selamat Datang di <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">BEKAL</span>
        </h1>
        
        <p className="text-lg md:text-2xl font-bold text-slate-500 max-w-3xl leading-relaxed mb-4">
          Board game, Edukasi, dan Klustering sisa pAngan Lokal
        </p>

        <p className="text-slate-500 text-sm md:text-base max-w-2xl leading-relaxed mb-12 font-medium">
          Platform interaktif yang menggabungkan visualisasi data klustering sisa pangan tingkat provinsi di Indonesia menggunakan metode Multidimensional Factor Analysis (MFA) dengan board game edukatif Ular Tangga.
        </p>

        {/* Action Button */}
        <div className="mb-16">
          <Link 
            href="/dashboard"
            className="group relative inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-lg px-8 py-5 rounded-2xl shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
          >
            <span>Mulai Bermain</span>
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl text-left">
          {/* Card 1 */}
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-200/80 group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
              <Dices size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-2">Board Game</h3>
            <p className="text-slate-500 font-medium text-sm leading-relaxed">
              Jelajahi petak ular tangga interaktif, jawab kuis edukasi pangan, dan kumpulkan skor terbaik.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-200/80 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-2">Klustering Data</h3>
            <p className="text-slate-500 font-medium text-sm leading-relaxed">
              Analisis mendalam kluster provinsi berdasarkan ketahanan pangan, FLW, ekonomi, dan infrastruktur.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-200/80 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
              <GraduationCap size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-2">Edukasi Interaktif</h3>
            <p className="text-slate-500 font-medium text-sm leading-relaxed">
              Tingkatkan kepedulian masyarakat terhadap food loss and waste melalui metode pembelajaran menyenangkan.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-xs text-slate-400 font-bold tracking-wider relative z-10 border-t border-slate-50">
        &copy; {new Date().getFullYear()} Tim BEKAL - Satria Data 2026. All rights reserved.
      </footer>
    </div>
  );
}
