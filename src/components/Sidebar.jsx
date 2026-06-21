"use client";

import { Home, LayoutGrid, BarChart2, Trophy, BookOpen, Dices } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Game Board", href: "/game", icon: LayoutGrid },
    { name: "Achievements", href: "/achievements", icon: Trophy },
  ];

  return (
    <aside className="w-64 bg-white h-screen flex flex-col border-r border-gray-100 shrink-0 sticky top-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
      {/* Profile Section */}
      <div className="p-8 flex flex-col items-center border-b border-gray-50">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-400 p-1 shadow-lg mb-4">
          <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-white">
            <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Datavention" alt="Bot Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-indigo-700">Datavention</h2>
        <p className="text-xs text-gray-400 font-medium mt-1 tracking-wide">Data Science Explorer</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname === '/' && item.href === '/game'); // Default to game active for this prototype if needed, but let's stick to strict matching
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                pathname === item.href
                  ? "bg-indigo-500 text-white shadow-md shadow-indigo-200 translate-x-1"
                  : "text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 hover:translate-x-1"
              }`}
            >
              <Icon size={20} strokeWidth={pathname === item.href ? 2.5 : 2} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Action */}
      <div className="p-6 mt-auto">
        <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl py-3.5 px-4 flex items-center justify-center gap-2 font-bold shadow-lg shadow-indigo-200 transition-all hover:-translate-y-1 active:translate-y-0">
          <Dices size={20} strokeWidth={2.5} />
          <span>Roll Dice</span>
        </button>
      </div>
    </aside>
  );
}
