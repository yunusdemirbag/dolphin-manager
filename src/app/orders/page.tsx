'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .limit(20);
      if (error) {
        setError('Siparişler yüklenemedi.');
        setOrders([]);
      } else {
        setOrders(data || []);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Siparişler</h2>
      {loading ? (
        <div className="text-gray-500">Yükleniyor...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : orders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Sipariş No</th>
                <th className="py-2 px-4 border-b">Müşteri</th>
                <th className="py-2 px-4 border-b">Tarih</th>
                <th className="py-2 px-4 border-b">Toplam</th>
                <th className="py-2 px-4 border-b">Durum</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b font-mono">{order.id}</td>
                  <td className="py-2 px-4 border-b">{order.customer}</td>
                  <td className="py-2 px-4 border-b">{order.date}</td>
                  <td className="py-2 px-4 border-b">{order.total}₺</td>
                  <td className="py-2 px-4 border-b">
                    <span className="inline-block px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-gray-500">Sipariş bulunamadı.</div>
      )}
    </div>
  );
} 