"use client";

import dynamic from 'next/dynamic';

const MapChoropleth = dynamic(() => import('@/components/MapChoropleth'), {
  ssr: false,
  loading: () => <div className="w-full h-[600px] bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-400 font-medium animate-pulse">Loading Map Data...</div>
});

export default function DashboardPage() {
  return (
    <div className="w-full px-4 pb-16 pt-6 space-y-6">
      {/* Map Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <MapChoropleth />
      </div>

      {/* Cluster Interpretation Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-black text-indigo-700 tracking-tight">Interpretasi Karakteristik Kluster Final (MFA)</h2>
          <p className="text-gray-400 text-sm font-medium mt-1">Penjelasan profil dan karakteristik spesifik setiap kluster berdasarkan hasil analisis data terpadu.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kluster 1 */}
          <div className="p-6 rounded-2xl bg-violet-50/30 border border-violet-100/50 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-[#8b5cf6] shadow-sm shrink-0" />
              <h3 className="font-extrabold text-lg text-slate-800">Kluster 1 (Kondisi Menengah)</h3>
            </div>
            <div className="text-xs font-bold text-violet-600 tracking-wide uppercase">
              Tersebar di 26 Provinsi
            </div>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              Merepresentasikan wilayah dengan nilai indikator yang berada pada level rata-rata atau "menengah" secara nasional. Karakteristik ini ditunjukkan oleh rata-rata Indeks Pembangunan Manusia (IPM) sebesar 75,4 dan total panjang jalan rata-rata sebesar 13.792 km. Pengelolaan ketahanan pangan di kluster ini cukup stabil namun memerlukan peningkatan pengawasan logistik yang berkelanjutan.
            </p>
          </div>

          {/* Kluster 2 */}
          <div className="p-6 rounded-2xl bg-emerald-50/30 border border-emerald-100/50 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-[#10b981] shadow-sm shrink-0" />
              <h3 className="font-extrabold text-lg text-slate-800">Kluster 2 (Lumbung Pangan)</h3>
            </div>
            <div className="text-xs font-bold text-emerald-600 tracking-wide uppercase">
              Jawa Barat, Jawa Tengah, Jawa Timur
            </div>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              Merupakan pusat populasi dan produksi pertanian nasional dengan kapasitas produksi beras rata-rata mencapai 8.929.537 ton serta infrastruktur jalan berkondisi baik tertinggi (48,2%). Namun, tingginya konsumsi dan aktivitas ekonomi berimplikasi pada volume timbulan sampah tahunan (FLW) yang juga tertinggi (rata-rata 225.620 ton) sehingga memerlukan prioritas manajemen sisa makanan yang terintegrasi.
            </p>
          </div>

          {/* Kluster 3 */}
          <div className="p-6 rounded-2xl bg-amber-50/30 border border-amber-100/50 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-[#f59e0b] shadow-sm shrink-0" />
              <h3 className="font-extrabold text-lg text-slate-800">Kluster 3 (Kondisi Khusus)</h3>
            </div>
            <div className="text-xs font-bold text-amber-600 tracking-wide uppercase">
              Tersebar di 9 Provinsi (Timur & NTT)
            </div>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              Menunjukkan karakteristik khusus dengan tingkat kesejahteraan terendah (IPM rata-rata 67,7), jalan rusak berat tertinggi (5,51%), serta harga pangan hewani termahal (ayam Rp48.630 dan telur Rp41.781), namun konsumsi protein hewani justru berada pada level terendah. Kondisi ini mengindikasikan keterkaitan erat antara buruknya infrastruktur jalan, tingginya biaya logistik, dan minimnya akses pangan bergizi di Indonesia Timur.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
