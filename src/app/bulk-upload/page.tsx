'use client';

import { useState, useEffect } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function BulkUpload() {
  const [uploads, setUploads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUploads = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('bulk_uploads')
        .select('*')
        .order('date', { ascending: false });
      setUploads(data || []);
      setLoading(false);
    };
    fetchUploads();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Toplu Yüklemeler</h1>
      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th>Dosya Adı</th>
              <th>Durum</th>
              <th>Tarih</th>
              <th>Ürün Sayısı</th>
            </tr>
          </thead>
          <tbody>
            {uploads.map((upload) => (
              <tr key={upload.id}>
                <td>{upload.filename}</td>
                <td>{upload.status}</td>
                <td>{upload.date ? new Date(upload.date).toLocaleString('tr-TR') : ''}</td>
                <td>{upload.items}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 