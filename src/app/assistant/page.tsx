"use client";
import { useState, useEffect } from 'react';

export default function AssistantPage() {
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sayfa açıldığında localStorage'dan öneriyi yükle
  useEffect(() => {
    const stored = localStorage.getItem('dolphin-ai-suggestion');
    if (stored) setAiSuggestion(stored);
  }, []);

  const fetchSuggestion = async () => {
    setLoading(true);
    setError(null);
    setAiSuggestion(null);
    try {
      const res = await fetch('/api/ai/assistant-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.suggestion) {
        setAiSuggestion(data.suggestion);
        localStorage.setItem('dolphin-ai-suggestion', data.suggestion);
      } else {
        setError('AI önerisi alınamadı.');
      }
    } catch (e) {
      setError('Bir hata oluştu.');
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dolphin Asistan</h2>
      <div className="mb-8 p-6 bg-white rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Mağaza Performans Özeti</h3>
        <p>Burada mağaza performans özetiniz ve AI destekli analizleriniz görünecek.</p>
      </div>
      <div className="mb-8 p-6 bg-white rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Pazar Trendi Fikirleri</h3>
        <p>Burada pazar trendleri ve öneriler yer alacak.</p>
        <button
          onClick={fetchSuggestion}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Yükleniyor...' : 'AI ile Güncel Öneri Al'}
        </button>
        {aiSuggestion && (
          <div className="mt-4 p-4 bg-blue-50 rounded text-blue-900 whitespace-pre-line">
            {aiSuggestion}
          </div>
        )}
        {error && (
          <div className="mt-4 text-red-600">{error}</div>
        )}
      </div>
      <div className="p-6 bg-white rounded shadow">
        <h3 className="text-lg font-semibold mb-2">SEO & İçerik Analizi</h3>
        <p>Burada ürünlerinizin SEO ve içerik analizleri yer alacak.</p>
      </div>
    </div>
  );
} 