'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Product {
  id: string;
  title: string;
  image_url?: string;
  price: number;
  tags?: string[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(12);
      if (error) {
        setError('Ürünler yüklenemedi.');
        setProducts([]);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Ürünler</h2>
      {loading ? (
        <div className="text-gray-500">Yükleniyor...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg shadow-lg overflow-hidden bg-white">
              <div className="relative w-full h-48">
                <img 
                  src={product.image_url || 'https://via.placeholder.com/300x200.png?text=Kanvas+Tablo'} 
                  alt={product.title} 
                  className="object-cover w-full h-full" 
                />
              </div>
              <div className="p-4">
                <h4 className="text-lg font-semibold mb-2 truncate" title={product.title}>{product.title}</h4>
                <p className="text-gray-700 mb-2 text-xl font-bold">{product.price}₺</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(product.tags || []).map((tag, index) => (
                    <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500">Ürün bulunamadı.</div>
      )}
    </div>
  );
} 