"use client";

import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { mfaData, clusterColors } from '@/data/mfa-data';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function MfaScatter() {
  const data = {
    datasets: [
      {
        label: 'Kluster 1',
        data: mfaData.filter(d => d.cluster === 'Kluster 1').map(d => ({ x: d.dim1, y: d.dim2, province: d.province })),
        backgroundColor: clusterColors['Kluster 1'],
      },
      {
        label: 'Kluster 2',
        data: mfaData.filter(d => d.cluster === 'Kluster 2').map(d => ({ x: d.dim1, y: d.dim2, province: d.province })),
        backgroundColor: clusterColors['Kluster 2'],
      },
      {
        label: 'Kluster 3',
        data: mfaData.filter(d => d.cluster === 'Kluster 3').map(d => ({ x: d.dim1, y: d.dim2, province: d.province })),
        backgroundColor: clusterColors['Kluster 3'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Dimensi 1 (Ekonomi & Infrastruktur)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Dimensi 2 (Sosial Demografi)',
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const raw = context.raw;
            return `${raw.province}: (${raw.x.toFixed(2)}, ${raw.y.toFixed(2)})`;
          },
        },
      },
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="w-full h-[400px] bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100">
      <h3 className="text-xl font-bold text-indigo-700 mb-4">MFA Scatter Plot</h3>
      <div className="w-full h-[300px]">
        <Scatter options={options} data={data} />
      </div>
    </div>
  );
}
