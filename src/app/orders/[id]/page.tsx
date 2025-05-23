'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Printer, Mail, Package, Truck, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function OrderDetail({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDate, setOrderDate] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', params.id)
        .single();
      if (error) {
        setError('Sipariş bulunamadı.');
        setOrder(null);
      } else {
        setOrder(data);
        if (data?.date) {
          setOrderDate(new Date(data.date).toLocaleString('tr-TR', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
          }));
        }
      }
      setLoading(false);
    };
    fetchOrder();
  }, [params.id]);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!order) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/orders" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Sipariş #{order.id}</h1>
          <p className="text-sm text-gray-500">{orderDate}</p>
        </div>
      </div>
      {/* Sipariş detayları ve zaman çizelgesi burada olacak */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Sipariş Detayları</h2>
        <pre>{JSON.stringify(order, null, 2)}</pre>
      </div>
    </div>
  );
} 