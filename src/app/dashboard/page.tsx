'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
    const searchParams = useSearchParams();
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

    useEffect(() => {
        const status = searchParams.get('status');
        const messageParam = searchParams.get('message');

        if (status && messageParam) {
            setMessage({
                type: status as 'success' | 'error',
                text: messageParam.replace(/_/g, ' ')
            });

            // 5 saniye sonra mesajı temizle
            const timer = setTimeout(() => setMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-2">Dolphin Manager - E-ticaret Yönetim Paneli</p>
                </header>

                {/* Status Messages */}
                {message && (
                    <div className={`mb-6 p-4 rounded-lg border ${
                        message.type === 'success' 
                            ? 'bg-green-50 border-green-200 text-green-800' 
                            : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                        <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full mr-3 ${
                                message.type === 'success' ? 'bg-green-400' : 'bg-red-400'
                            }`}></div>
                            <span className="font-medium">
                                {message.type === 'success' ? '✅ Başarılı!' : '❌ Hata!'}
                            </span>
                        </div>
                        <p className="mt-1 ml-7">{message.text}</p>
                    </div>
                )}

                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Etsy Card */}
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <span className="text-orange-600 text-xl font-bold">E</span>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">Etsy</h3>
                                <p className="text-sm text-gray-500">E-ticaret Platformu</p>
                            </div>
                        </div>
                        <p className="text-gray-600 mb-4">Etsy mağazanızı bağlayın ve ürünlerinizi yönetin.</p>
                        <a 
                            href="/api/etsy/auth/initiate"
                            className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors inline-block text-center"
                        >
                            Etsy Hesabını Bağla
                        </a>
                    </div>

                    {/* Analytics Card */}
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 text-xl">📊</span>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">Analitik</h3>
                                <p className="text-sm text-gray-500">Satış ve Performans</p>
                            </div>
                        </div>
                        <p className="text-gray-600 mb-4">Satış verilerinizi ve performansınızı analiz edin.</p>
                        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                            Analitikleri Görüntüle
                        </button>
                    </div>

                    {/* Products Card */}
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-green-600 text-xl">📦</span>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">Ürünler</h3>
                                <p className="text-sm text-gray-500">Ürün Yönetimi</p>
                            </div>
                        </div>
                        <p className="text-gray-600 mb-4">Ürünlerinizi yönetin ve düzenleyin.</p>
                        <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                            Ürünleri Yönet
                        </button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow border text-center">
                        <h4 className="text-2xl font-bold text-gray-900">0</h4>
                        <p className="text-gray-500">Bağlı Mağaza</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border text-center">
                        <h4 className="text-2xl font-bold text-gray-900">0</h4>
                        <p className="text-gray-500">Toplam Ürün</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border text-center">
                        <h4 className="text-2xl font-bold text-gray-900">0</h4>
                        <p className="text-gray-500">Bekleyen Sipariş</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border text-center">
                        <h4 className="text-2xl font-bold text-gray-900">₺0</h4>
                        <p className="text-gray-500">Aylık Gelir</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 