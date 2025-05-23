'use client';

import { useState } from 'react';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('6m');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Analitik ve Raporlar</h1>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="form-select"
          >
            <option value="1m">Son 1 Ay</option>
            <option value="3m">Son 3 Ay</option>
            <option value="6m">Son 6 Ay</option>
            <option value="1y">Son 1 Yıl</option>
          </select>
          <button className="btn btn-outline">
            Rapor İndir
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-2">Veri bulunamadı.</h3>
        <p>Gerçek analiz verileri burada görünecek.</p>
      </div>
    </div>
  );
} 