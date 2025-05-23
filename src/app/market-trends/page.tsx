"use client";

import { useState } from "react";

// Mock takvim ve öneri verisi
const specialDays = [
  { date: "2024-05-12", name: "Anneler Günü", suggestions: [
    "Kişiselleştirilmiş Aile Ağacı Kanvası",
    "Çiçek Temalı Soyut Kanvas Tablolar",
    "Açıklamalarda 'Anneler Günü Hediyesi', 'Anneye Özel Tablo' anahtar kelimelerini kullanın."
  ] },
  { date: "2024-06-16", name: "Babalar Günü", suggestions: [
    "Minimalist Baba & Çocuk Temalı Kanvaslar",
    "Kişiye özel mesajlı tablolar",
    "'Babalar Günü Hediyesi' anahtar kelimesiyle öne çıkarın."
  ] },
  { date: "2024-02-14", name: "Sevgililer Günü", suggestions: [
    "Çiftlere özel isimli kanvaslar",
    "Kalp ve aşk temalı soyut tablolar",
    "'Sevgililer Günü Hediyesi' anahtar kelimesini kullanın."
  ] },
];

const seasonalTrends = [
  { season: "İlkbahar", color: "bg-green-100", suggestions: [
    "Pastel tonlarda doğa ve çiçek temalı kanvaslar",
    "Minimalist yaprak desenleri",
    "'İlkbahar Dekoru' anahtar kelimesi"
  ] },
  { season: "Yaz", color: "bg-yellow-100", suggestions: [
    "Canlı renkli deniz ve plaj temalı tablolar",
    "Tropikal bitki ve meyve desenleri",
    "'Yazlık Ev Dekoru' anahtar kelimesi"
  ] },
  { season: "Sonbahar", color: "bg-orange-100", suggestions: [
    "Turuncu, kahverengi, bordo tonlarında doğa manzaraları",
    "Minimalist yaprak ve ağaç desenleri",
    "'Sonbahar Dekoru' anahtar kelimesi"
  ] },
  { season: "Kış", color: "bg-blue-100", suggestions: [
    "Karlı manzara ve sıcak iç mekan temalı tablolar",
    "Noel ve yeni yıl konseptli kanvaslar",
    "'Kış Dekoru', 'Yılbaşı Hediyesi' anahtar kelimesi"
  ] },
];

const nicheTrends = [
  { title: "Japandi Tarzı Soyut Kanvaslar", desc: "Sade, doğal ve huzurlu ortamlar için Japandi tarzı soyut tablolar yükselişte." },
  { title: "Vintage Botanik İllüstrasyonlar", desc: "Bitki ve çiçek illüstrasyonları, retro tarzda popülerleşiyor." },
  { title: "Pop Art Kanvaslar", desc: "Canlı renkli, eğlenceli pop art tablolar genç kitlede öne çıkıyor." },
];

function getDayLabel(date: string) {
  const d = new Date(date);
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "short" });
}

export default function MarketTrends() {
  const [selectedDay, setSelectedDay] = useState<null | typeof specialDays[0]>(null);
  const [activeTab, setActiveTab] = useState("takvim");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Pazar Trendleri & AI Takvimi</h1>
            <p className="text-gray-500 mt-1">Özel günler, sezonlar ve AI destekli önerilerle mağazanızı büyütün.</p>
          </div>
          <nav className="flex gap-4">
            <button onClick={() => setActiveTab("takvim")} className={`px-4 py-2 rounded ${activeTab === "takvim" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>Takvim</button>
            <button onClick={() => setActiveTab("sezon")} className={`px-4 py-2 rounded ${activeTab === "sezon" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>Sezon Trendleri</button>
            <button onClick={() => setActiveTab("nis") } className={`px-4 py-2 rounded ${activeTab === "nis" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>Niş Trendler</button>
          </nav>
        </div>

        {/* Takvim Tabı */}
        {activeTab === "takvim" && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Özel Günler ve AI Önerileri</h2>
            <div className="flex gap-4 flex-wrap">
              {specialDays.map((day) => (
                <button
                  key={day.date}
                  onClick={() => setSelectedDay(day)}
                  className="flex flex-col items-center p-4 border rounded-lg hover:bg-blue-50 transition min-w-[120px]"
                >
                  <span className="font-bold text-blue-700 text-lg">{getDayLabel(day.date)}</span>
                  <span className="text-sm text-gray-700 mt-1">{day.name}</span>
                </button>
              ))}
            </div>
            {selectedDay && (
              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-blue-800">{selectedDay.name} için AI Önerileri</h3>
                  <button onClick={() => setSelectedDay(null)} className="text-blue-500 hover:underline">Kapat</button>
                </div>
                <ul className="list-disc pl-6 space-y-2">
                  {selectedDay.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Yapılacaklara Ekle</button>
              </div>
            )}
          </div>
        )}

        {/* Sezon Trendleri Tabı */}
        {activeTab === "sezon" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {seasonalTrends.map((season) => (
              <div key={season.season} className={`rounded-lg shadow p-6 ${season.color}`}>
                <h3 className="text-lg font-bold mb-2">{season.season} Trendleri</h3>
                <ul className="list-disc pl-6 space-y-1">
                  {season.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Niş Trendler Tabı */}
        {activeTab === "nis" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nicheTrends.map((trend, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold mb-2">{trend.title}</h3>
                <p className="text-gray-700">{trend.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 