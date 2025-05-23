'use client';

import { useState } from 'react';
import {
  HelpCircle,
  Search,
  Book,
  MessageSquare,
  Mail,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

// Mock SSS verisi
const mockFAQs = [
  {
    category: 'Genel',
    questions: [
      {
        question: 'Dolphin Manager nedir?',
        answer:
          'Dolphin Manager, Etsy mağazanızı yönetmek için tasarlanmış kapsamlı bir yönetim platformudur. Ürün yönetimi, sipariş takibi, analitik ve AI destekli özellikler sunar.',
      },
      {
        question: 'Nasıl başlayabilirim?',
        answer:
          'Kayıt olduktan sonra Etsy hesabınızı bağlayarak hemen kullanmaya başlayabilirsiniz. Demo modunda tüm özellikleri ücretsiz olarak test edebilirsiniz.',
      },
      {
        question: 'Hangi özellikleri sunuyorsunuz?',
        answer:
          'Ürün yönetimi, sipariş takibi, stok kontrolü, analitik, AI destekli içerik üretimi, pazar analizi ve daha fazlası.',
      },
    ],
  },
  {
    category: 'Ürün Yönetimi',
    questions: [
      {
        question: 'Toplu ürün yükleme nasıl yapılır?',
        answer:
          'Excel şablonunu indirip ürün bilgilerinizi doldurduktan sonra, toplu yükleme sayfasından dosyayı yükleyebilirsiniz. Sistem otomatik olarak ürünleri kontrol edip yükleyecektir.',
      },
      {
        question: 'Ürün varyasyonları nasıl eklenir?',
        answer:
          'Ürün düzenleme sayfasında "Varyasyonlar" sekmesini kullanarak boyut, renk gibi varyasyonları ekleyebilirsiniz.',
      },
      {
        question: 'AI ile ürün açıklaması nasıl oluşturulur?',
        answer:
          'Ürün düzenleme sayfasında "AI Asistan" butonuna tıklayarak, ürününüz için optimize edilmiş açıklama ve etiketler oluşturabilirsiniz.',
      },
    ],
  },
  {
    category: 'Sipariş Yönetimi',
    questions: [
      {
        question: 'Siparişleri nasıl takip edebilirim?',
        answer:
          'Siparişler sayfasından tüm siparişlerinizi görebilir, filtreleyebilir ve detaylı bilgilere ulaşabilirsiniz.',
      },
      {
        question: 'Kargo takibi nasıl yapılır?',
        answer:
          'Sipariş detay sayfasında kargo takip numarasını görebilir ve güncel durumu takip edebilirsiniz.',
      },
      {
        question: 'İade süreçleri nasıl yönetilir?',
        answer:
          'Sipariş detay sayfasından iade taleplerini görüntüleyebilir ve süreçleri yönetebilirsiniz.',
      },
    ],
  },
  {
    category: 'Ödeme ve Faturalandırma',
    questions: [
      {
        question: 'Ödeme yöntemleri nelerdir?',
        answer:
          'Kredi kartı, banka havalesi ve PayPal ile ödeme yapabilirsiniz.',
      },
      {
        question: 'Fatura nasıl alabilirim?',
        answer:
          'Profil sayfanızdan fatura bilgilerinizi düzenleyebilir ve geçmiş faturalarınıza ulaşabilirsiniz.',
      },
      {
        question: 'Abonelik planları nelerdir?',
        answer:
          'Ücretsiz, Pro ve Enterprise olmak üzere üç farklı plan sunuyoruz. Detaylı bilgi için fiyatlandırma sayfasını ziyaret edin.',
      },
    ],
  },
];

// Mock yardım makaleleri
const mockArticles = [
  {
    title: 'Başlangıç Rehberi',
    description: 'Dolphin Manager ile başlarken bilmeniz gerekenler',
    icon: Book,
  },
  {
    title: 'Ürün Yönetimi',
    description: 'Ürünlerinizi nasıl etkili bir şekilde yönetebilirsiniz',
    icon: Book,
  },
  {
    title: 'Sipariş Takibi',
    description: 'Siparişlerinizi nasıl takip edebilirsiniz',
    icon: Book,
  },
  {
    title: 'AI Özellikleri',
    description: 'AI destekli özellikleri nasıl kullanabilirsiniz',
    icon: Book,
  },
];

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredFAQs = mockFAQs.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (q) =>
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Yardım Merkezi</h1>
          <p className="text-gray-500">
            Sorularınızı yanıtlamak ve size yardımcı olmak için buradayız
          </p>
        </div>

        {/* Arama */}
        <div className="relative mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Sorularınızı arayın..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input pl-12 w-full"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>

        {/* Yardım Makaleleri */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {mockArticles.map((article, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <article.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{article.title}</h3>
                  <p className="text-sm text-gray-500">
                    {article.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SSS */}
        <div className="space-y-6">
          {filteredFAQs.map((category) => (
            <div key={category.category} className="bg-white rounded-lg shadow">
              <button
                onClick={() => toggleCategory(category.category)}
                className="w-full flex items-center justify-between p-6"
              >
                <h2 className="text-lg font-semibold">{category.category}</h2>
                {expandedCategories.includes(category.category) ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {expandedCategories.includes(category.category) && (
                <div className="border-t border-gray-200">
                  {category.questions.map((faq, index) => (
                    <div
                      key={index}
                      className="p-6 border-b border-gray-200 last:border-b-0"
                    >
                      <h3 className="font-medium mb-2">{faq.question}</h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* İletişim */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Hala yardıma mı ihtiyacınız var?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Canlı Destek</h3>
                <p className="text-sm text-gray-500">
                  Hemen bir destek temsilcisiyle görüşün
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">E-posta</h3>
                <p className="text-sm text-gray-500">
                  destek@dolphinmanager.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 