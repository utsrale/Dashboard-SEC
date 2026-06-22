"use client";

import dynamic from 'next/dynamic';

const MapChoropleth = dynamic(() => import('@/components/MapChoropleth'), {
  ssr: false,
  loading: () => <div className="w-full h-[600px] bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-400 font-medium animate-pulse">Loading Map Data...</div>
});

export default function DashboardPage() {
  return (
    <div className="w-full px-4 pb-16 pt-6">
      {/* Map Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <MapChoropleth />
      </div>
    </div>
  );
}
