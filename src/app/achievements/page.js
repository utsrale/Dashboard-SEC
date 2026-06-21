"use client";
import { useState, useEffect } from "react";
import { Trophy, Lock, Clock, Medal, User } from "lucide-react";
import Image from "next/image";
import { getProgress } from "@/utils/storage";

const ACHIEVEMENTS_DATA = [
  {
    id: "first_step",
    title: "First Step",
    description: "Memulai permainan Ular Tangga untuk pertama kalinya.",
    image: "/achievements/first_step.png",
    colorText: "text-indigo-600",
    colorBar: "bg-indigo-500",
    maxProgress: 1,
  },
  {
    id: "data_explorer",
    title: "Data Explorer",
    description: "Menjawab 10 pertanyaan kuis dengan benar.",
    image: "/achievements/data_explorer.png",
    colorText: "text-amber-700",
    colorBar: "bg-amber-600",
    maxProgress: 10,
  },
  {
    id: "snake_charmer",
    title: "Snake Charmer",
    description: "Berhasil selamat dari 5 gigitan ular (menjawab kuis benar di petak ular).",
    image: "/achievements/snake_charmer.png",
    colorText: "text-emerald-700",
    colorBar: "bg-emerald-600",
    maxProgress: 5,
  },
  {
    id: "lucky_roller",
    title: "Lucky Roller",
    description: "Mendapatkan angka dadu 6 sebanyak 3 kali.",
    image: "/achievements/lucky_roller.png",
    colorText: "text-purple-600",
    colorBar: "bg-purple-500",
    maxProgress: 3,
  }
];

export default function AchievementsPage() {
  const [progressData, setProgressData] = useState({});
  const [bestTimeStr, setBestTimeStr] = useState("--:--");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const data = getProgress();
    setProgressData(data.achievements || {});
    
    if (data.bestTime !== null) {
      const m = Math.floor(data.bestTime / 60).toString().padStart(2, '0');
      const s = (data.bestTime % 60).toString().padStart(2, '0');
      setBestTimeStr(`${m}:${s}`);
    }
    
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalCompleted = ACHIEVEMENTS_DATA.filter(
    (ach) => (progressData[ach.id] || 0) >= ach.maxProgress
  ).length;

  return (
    <div className="w-full px-4 lg:px-8 pb-16 pt-6 max-w-6xl mx-auto space-y-8">
      
      {/* ACHIEVEMENTS (MOCKUP STYLE) */}
      <div>
        {/* Header bergaya gelap dengan pola titik (sesuai mockup) */}
        <div className="relative overflow-hidden bg-[#2A2D34] rounded-[2rem] p-8 md:p-10 text-white shadow-lg flex flex-col lg:flex-row justify-between items-center lg:items-start gap-6 mb-8">
          {/* Pola Titik Latar Belakang */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          
          <div className="relative z-10 flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#C19B4C] flex items-center justify-center shadow-inner shrink-0">
              <Trophy size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">Hall of Fame</h1>
              <p className="text-slate-400 font-medium text-sm md:text-base max-w-md leading-relaxed">
                Tantangan eksklusif bagi sang penjelajah data! Kumpulkan semua medali dan buktikan ketangkasanmu.
              </p>
            </div>
          </div>
          
          {/* Stats Boxes */}
          <div className="relative z-10 flex gap-4 w-full lg:w-auto flex-wrap lg:flex-nowrap justify-center">
            {/* Rekor Pribadi */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 min-w-[140px] text-center border border-white/10 flex-1 lg:flex-initial">
              <div className="text-slate-300 font-bold text-xs uppercase tracking-widest mb-1 flex items-center justify-center gap-1.5">
                <Clock size={12} className="text-indigo-400" />
                Rekor Terbaik
              </div>
              <div className="text-3xl font-black text-indigo-300 mt-1">
                {bestTimeStr}<span className="text-sm font-medium text-slate-400 ml-1">mnt</span>
              </div>
            </div>

            {/* Medali Diraih */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 min-w-[140px] text-center border border-white/10 flex-1 lg:flex-initial">
              <div className="text-slate-300 font-bold text-xs uppercase tracking-widest mb-1">Medali Diraih</div>
              <div className="text-4xl font-black text-[#50E3C2]">
                {totalCompleted}<span className="text-2xl text-slate-400">/{ACHIEVEMENTS_DATA.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Kartu Lencana (Minimalist White sesuai mockup) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ACHIEVEMENTS_DATA.map((achievement) => {
            const currentProgress = progressData[achievement.id] || 0;
            const isCompleted = currentProgress >= achievement.maxProgress;
            const percentage = Math.min(100, (currentProgress / achievement.maxProgress) * 100);

            return (
              <div
                key={achievement.id}
                className={`bg-white rounded-3xl p-6 relative flex flex-col items-center text-center transition-all duration-300
                  ${isCompleted 
                    ? `shadow-sm border-2 border-indigo-50/50 hover:shadow-md hover:-translate-y-1` 
                    : `border border-slate-100 shadow-sm bg-slate-50/50`
                  }`}
              >
                {/* Ikon Gembok jika terkunci */}
                {!isCompleted && (
                  <div className="absolute top-5 right-5 text-slate-400">
                    <Lock size={20} />
                  </div>
                )}

                {/* Gambar 3D */}
                <div className={`w-32 h-32 mb-4 relative flex items-center justify-center ${!isCompleted ? "grayscale opacity-60" : ""}`}>
                  <Image 
                    src={achievement.image} 
                    alt={achievement.title}
                    width={128}
                    height={128}
                    className="object-contain drop-shadow-md"
                  />
                </div>

                {/* Judul & Deskripsi */}
                <h3 className={`text-2xl font-black mb-2 ${isCompleted ? achievement.colorText : "text-slate-500"}`}>
                  {achievement.title}
                </h3>
                <p className="text-slate-600 font-medium text-sm mb-6 leading-relaxed flex-1">
                  {achievement.description}
                </p>

                {/* Progress Bar Sesuai Mockup */}
                <div className="w-full mt-auto">
                  <div className={`text-left text-xs font-black uppercase tracking-wider mb-2 ${isCompleted ? achievement.colorText : "text-slate-400"}`}>
                    {currentProgress}/{achievement.maxProgress} Selesai
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? achievement.colorBar : "bg-slate-400"}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
