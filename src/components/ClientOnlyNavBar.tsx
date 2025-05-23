// ClientOnlyNavBar demo modda devre dışı

'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function ClientOnlyNavBar() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/'); // Ana sayfaya yönlendir
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Dolphin Manager
        </Link>
        <div className="space-x-4">
          {loading ? (
            <span>Yükleniyor...</span>
          ) : user ? (
            <>
              {/* <Link href="/dashboard" className="hover:text-blue-200">Panel</Link> */}
              {/* <Link href="/account" className="hover:text-blue-200">Hesabım</Link> */}
              <button onClick={handleSignOut} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded text-sm">
                Çıkış Yap ({user.email})
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="hover:text-blue-200">
                Giriş Yap
              </Link>
              <Link href="/auth/signup" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded text-sm">
                Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 