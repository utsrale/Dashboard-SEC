import { Bell, Settings } from "lucide-react";
import Link from "next/link";

export default function Topbar() {
  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
      {/* Branding / Title */}
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-black text-indigo-600 tracking-tight">BEKAL</h1>
      </div>



      {/* Right Actions */}
      <div className="flex items-center gap-6">
        <button className="text-gray-400 hover:text-indigo-500 transition-colors relative">
          <Bell size={22} />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
        <button className="text-gray-400 hover:text-indigo-500 transition-colors">
          <Settings size={22} />
        </button>
        
        {/* User Avatar Mini */}
        <div className="w-10 h-10 rounded-full border-2 border-indigo-100 overflow-hidden cursor-pointer hover:border-indigo-300 transition-colors">
           <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Felix" alt="User" className="w-full h-full object-cover bg-indigo-50" />
        </div>
      </div>
    </header>
  );
}
