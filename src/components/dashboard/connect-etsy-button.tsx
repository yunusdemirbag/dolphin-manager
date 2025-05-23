'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function ConnectEtsyButton() {
  const router = useRouter();

  const handleConnect = async () => {
    try {
      const response = await fetch('/api/auth/etsy/redirect');
      if (response.ok) {
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        }
      } else {
        console.error('Failed to start Etsy connection');
      }
    } catch (error) {
      console.error('Error connecting to Etsy:', error);
    }
  };

  return (
    <Button
      onClick={handleConnect}
      className="bg-orange-500 hover:bg-orange-600"
    >
      Etsy ile Bağlantı Kur
    </Button>
  );
} 