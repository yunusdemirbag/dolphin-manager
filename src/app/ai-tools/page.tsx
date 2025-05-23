'use client';

import { useState } from 'react';
import { Image, Search, BarChart2, MessageSquare, Sparkles, Upload } from 'lucide-react';

// Mock AI analiz verisi
const mockAnalysis = {
  imageAnalysis: {
    quality: 85,
    suggestions: [
      'Görsel kalitesi iyi, ancak daha yüksek çözünürlük kullanabilirsiniz',
      'Arka plan daha sade olabilir',
      'Ürün daha iyi aydınlatılabilir',
    ],
    tags: ['modern', 'dekoratif', 'ev', 'sanat', 'duvar'],
  },
  seoAnalysis: {
    score: 78,
    suggestions: [
      'Başlıkta anahtar kelime kullanımı artırılabilir',
      'Meta açıklama daha detaylı olabilir',
      'Alt etiketler eklenebilir',
    ],
    keywords: ['kanvas', 'duvar sanatı', 'ev dekorasyonu', 'modern sanat'],
  },
  marketAnalysis: {
    trends: [
      { keyword: 'minimalist kanvas', volume: 'yüksek', trend: 'artıyor' },
      { keyword: 'soyut sanat', volume: 'orta', trend: 'stabil' },
      { keyword: 'geometrik desenler', volume: 'yüksek', trend: 'artıyor' },
    ],
    competitors: [
      { name: 'SanatEvi', rating: 4.8, price: 'orta', products: 150 },
      { name: 'DekorArt', rating: 4.6, price: 'yüksek', products: 200 },
      { name: 'ModernCanvas', rating: 4.7, price: 'orta', products: 180 },
    ],
  },
};

export default function AITools() {
  const [activeTab, setActiveTab] = useState('image');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">AI Destekli Analiz Araçları</h1>
            <p className="text-gray-500 mt-1">
              Ürünlerinizi AI ile analiz edin ve optimize edin
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">AI Kredisi:</span>
            <span className="font-semibold">150/200</span>
          </div>
        </div>

        {/* Tab Menü */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex gap-8">
            {[
              { id: 'image', label: 'Görsel Analizi', icon: Image },
              { id: 'seo', label: 'SEO Analizi', icon: Search },
              { id: 'market', label: 'Pazar Analizi', icon: BarChart2 },
              { id: 'chat', label: 'AI Asistan', icon: MessageSquare },
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
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab İçerikleri */}
        <div className="space-y-8">
          {/* Görsel Analizi */}
          {activeTab === 'image' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Görsel Yükle</h2>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-4">
                      Görselinizi sürükleyin veya seçin
                    </p>
                    <label className="btn btn-primary cursor-pointer">
                      Görsel Seç
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageSelect}
                      />
                    </label>
                  </div>
                </div>

                {selectedImage && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Görsel Önizleme</h2>
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Görsel Analizi</h2>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">Görsel Kalitesi</h3>
                        <span className="text-lg font-semibold">
                          %{mockAnalysis.imageAnalysis.quality}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${mockAnalysis.imageAnalysis.quality}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3">Öneriler</h3>
                      <ul className="space-y-2">
                        {mockAnalysis.imageAnalysis.suggestions.map(
                          (suggestion, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-sm text-gray-600"
                            >
                              <Sparkles className="w-4 h-4 text-blue-500 mt-1" />
                              {suggestion}
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3">Önerilen Etiketler</h3>
                      <div className="flex flex-wrap gap-2">
                        {mockAnalysis.imageAnalysis.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEO Analizi */}
          {activeTab === 'seo' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">SEO Analizi</h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">SEO Skoru</h3>
                      <span className="text-lg font-semibold">
                        %{mockAnalysis.seoAnalysis.score}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${mockAnalysis.seoAnalysis.score}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">İyileştirme Önerileri</h3>
                    <ul className="space-y-2">
                      {mockAnalysis.seoAnalysis.suggestions.map(
                        (suggestion, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-gray-600"
                          >
                            <Sparkles className="w-4 h-4 text-green-500 mt-1" />
                            {suggestion}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Anahtar Kelimeler</h3>
                    <div className="flex flex-wrap gap-2">
                      {mockAnalysis.seoAnalysis.keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">SEO Önizleme</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Başlık</h3>
                    <p className="mt-1 text-gray-900">
                      Modern Dünya Haritası Kanvas - Ev Dekorasyonu
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Meta Açıklama
                    </h3>
                    <p className="mt-1 text-gray-900">
                      Yüksek kaliteli kanvas baskı dünya haritası. Modern ev
                      dekorasyonu için ideal.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">URL</h3>
                    <p className="mt-1 text-gray-900">
                      /urunler/modern-dunya-haritasi-kanvas
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pazar Analizi */}
          {activeTab === 'market' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Pazar Trendleri</h2>
                <div className="space-y-4">
                  {mockAnalysis.marketAnalysis.trends.map((trend, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{trend.keyword}</h3>
                        <p className="text-sm text-gray-500">
                          Arama Hacmi: {trend.volume}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold ${
                            trend.trend === 'artıyor'
                              ? 'text-green-600'
                              : 'text-gray-600'
                          }`}
                        >
                          {trend.trend === 'artıyor' ? '↑' : '→'} {trend.trend}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Rakip Analizi</h2>
                <div className="space-y-4">
                  {mockAnalysis.marketAnalysis.competitors.map(
                    (competitor, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium">{competitor.name}</h3>
                          <p className="text-sm text-gray-500">
                            {competitor.products} ürün
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {competitor.rating} ⭐
                          </p>
                          <p className="text-sm text-gray-500">
                            Fiyat: {competitor.price}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* AI Asistan */}
          {activeTab === 'chat' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">AI Asistan</h2>
              <div className="h-[600px] flex flex-col">
                <div className="flex-1 bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">
                          Merhaba! Size nasıl yardımcı olabilirim? Ürünleriniz,
                          pazarlama stratejileriniz veya SEO konularında sorularınızı
                          yanıtlayabilirim.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Mesajınızı yazın..."
                    className="flex-1 form-input"
                  />
                  <button className="btn btn-primary">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Gönder
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 