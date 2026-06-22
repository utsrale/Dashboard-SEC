"use client";

import { Home, LayoutGrid, Trophy, Dices } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Game Board", href: "/game", icon: LayoutGrid },
    { name: "Achievements", href: "/achievements", icon: Trophy },
  ];

  return (
    <aside className="w-64 bg-white h-screen flex flex-col border-r border-gray-100 shrink-0 sticky top-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
      {/* Profile Section */}
      <div className="p-8 flex flex-col items-center border-b border-gray-50">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-400 p-1 shadow-lg mb-4">
          <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-white">
            <img src="https://api.dicebear.com/7.x/bottts/svg?seed=BEKAL" alt="Bot Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
        <h2 className="text-2xl font-black text-indigo-700 tracking-wider">BEKAL</h2>
        <p className="text-[10px] leading-relaxed text-gray-400 font-bold mt-2 text-center max-w-[200px]">
          Board game, Edukasi, dan Klustering sisa pAngan Lokal
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                isActive
                  ? "bg-indigo-500 text-white shadow-md shadow-indigo-200 translate-x-1"
                  : "text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 hover:translate-x-1"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Action */}
      <div className="p-6 mt-auto">
        <Link href="/game" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl py-3.5 px-4 flex items-center justify-center gap-2 font-bold shadow-lg shadow-indigo-200 transition-all hover:-translate-y-1 active:translate-y-0 text-center block">
          <Dices size={20} className="inline-block mr-2" strokeWidth={2.5} />
          <span>Mulai Main</span>
        </Link>
      </div>
    </aside>
  );
}
