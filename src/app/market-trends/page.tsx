'use client';

import { useState } from 'react';

export default function MarketTrends() {
  const [timeRange, setTimeRange] = useState('6m');
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Pazar Trendleri</h1>
            <p className="text-gray-500 mt-1">
              Pazar analizi ve trend takibi
            </p>
          </div>
          <div className="flex items-center gap-4">
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
          </div>
        </div>
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex gap-8">
            {[
              { id: 'overview', label: 'Genel Bakış' },
              { id: 'keywords', label: 'Anahtar Kelimeler' },
              { id: 'competitors', label: 'Rakipler' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-4 px-1 ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Veri bulunamadı.</h3>
            <p>Gerçek pazar trendleri burada görünecek.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 