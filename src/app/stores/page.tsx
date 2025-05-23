'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  Store,
  Plus,
  Settings,
  BarChart,
  Package,
  Users,
  Globe,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';

// Mock platform seçenekleri
const platformOptions = [
  { id: 'etsy', name: 'Etsy', icon: Store },
  { id: 'amazon', name: 'Amazon', icon: Store },
  { id: 'shopify', name: 'Shopify', icon: Store },
  { id: 'woocommerce', name: 'WooCommerce', icon: Store },
];

export default function Stores() {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddStore, setShowAddStore] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('etsy_stores')
        .select('*');
      setStores(data || []);
      setLoading(false);
    };
    fetchStores();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Mağazalarım</h1>
          <p className="text-gray-500">
            Tüm mağazalarınızı tek bir yerden yönetin
          </p>
        </div>
        <button
          onClick={() => {
            // Etsy OAuth başlat
            window.location.href = '/api/etsy/auth/initiate';
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Yeni Mağaza Ekle
        </button>
      </div>

      {loading ? (
        <div>Yükleniyor...</div>
      ) : stores.length === 0 ? (
        <div>Mağaza bulunamadı.</div>
      ) : (
        <ul>
          {stores.map((store) => (
            <li key={store.id} className="mb-4 bg-white rounded shadow p-4">
              <div className="font-semibold">{store.shop_name}</div>
              <div className="text-gray-600 text-sm">{store.shop_id}</div>
              <div className="text-xs text-gray-400 mt-1">{store.created_at ? new Date(store.created_at).toLocaleString('tr-TR') : ''}</div>
            </li>
          ))}
        </ul>
      )}

      {/* Yeni Mağaza Ekleme Modal */}
      {showAddStore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Yeni Mağaza Ekle</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform Seçin
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {platformOptions.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => setSelectedPlatform(platform.id)}
                      className={`p-4 border rounded-lg text-center ${
                        selectedPlatform === platform.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <platform.icon className="w-6 h-6 mx-auto mb-2" />
                      <span className="block text-sm font-medium">
                        {platform.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {selectedPlatform && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mağaza Adı
                    </label>
                    <input
                      type="text"
                      className="form-input w-full"
                      placeholder="Mağazanızın adını girin"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mağaza URL'si
                    </label>
                    <input
                      type="url"
                      className="form-input w-full"
                      placeholder="https://"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Anahtarı
                    </label>
                    <input
                      type="password"
                      className="form-input w-full"
                      placeholder="API anahtarınızı girin"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowAddStore(false)}
                  className="btn-secondary"
                >
                  İptal
                </button>
                <button className="btn-primary">Mağaza Ekle</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 