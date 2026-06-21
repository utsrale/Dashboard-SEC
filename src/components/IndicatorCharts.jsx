"use client";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { clusterColors } from '@/data/mfa-data';
import { clusterBlockScores } from '@/data/cluster-blocks';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function IndicatorCharts() {
  const getScores = (clusterName) => {
    const entry = clusterBlockScores.find(c => c.cluster === clusterName);
    if (!entry) return [0, 0, 0, 0, 0];
    return [
      entry.scores.Infrastruktur,
      entry.scores.Ekonomi,
      entry.scores.SosDem,
      entry.scores.Prodkons,
      entry.scores.FLW
    ];
  };

  const data = {
    labels: ['Infrastruktur', 'Ekonomi', 'Sosial Demografi', 'Produksi Konsumsi', 'Food Loss & Waste'],
    datasets: [
      {
        label: 'Kluster 1',
        data: getScores('Kluster 1'),
        backgroundColor: 'rgba(139, 92, 246, 0.2)', // Purple with opacity
        borderColor: clusterColors['Kluster 1'],
        borderWidth: 2,
      },
      {
        label: 'Kluster 2',
        data: getScores('Kluster 2'),
        backgroundColor: 'rgba(16, 185, 129, 0.2)', // Green with opacity
        borderColor: clusterColors['Kluster 2'],
        borderWidth: 2,
      },
      {
        label: 'Kluster 3',
        data: getScores('Kluster 3'),
        backgroundColor: 'rgba(245, 158, 11, 0.2)', // Orange with opacity
        borderColor: clusterColors['Kluster 3'],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${Math.round(context.raw)}`;
          }
        }
      }
    }
  };

  return (
    <div className="w-full h-[400px] bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100">
      <h3 className="text-xl font-bold text-indigo-700 mb-4">Profil Kluster per Blok Indikator</h3>
      <div className="w-full h-[300px]">
        <Radar data={data} options={options} />
      </div>
    </div>
  );
}
