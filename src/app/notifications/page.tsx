'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });
      setNotifications(data || []);
      setLoading(false);
    };
    fetchNotifications();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Bildirimler</h1>
      {loading ? (
        <div>Yükleniyor...</div>
      ) : notifications.length === 0 ? (
        <div>Bildirim bulunamadı.</div>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id} className="mb-4 bg-white rounded shadow p-4">
              <div className="font-semibold">{notification.title}</div>
              <div className="text-gray-600 text-sm">{notification.message}</div>
              <div className="text-xs text-gray-400 mt-1">{notification.created_at ? new Date(notification.created_at).toLocaleString('tr-TR') : ''}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 