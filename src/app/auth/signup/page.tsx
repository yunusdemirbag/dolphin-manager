'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { signUp, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password) as { error: any };
    setLoading(false);
    if (!error) {
      alert('Kayıt başarılı! Lütfen e-postanızı kontrol ederek hesabınızı onaylayın.');
      router.push('/auth/login');
    } else {
      setError(error.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Yeni Hesap Oluştur</h2>
        <form className="space-y-4" onSubmit={handleSignUp}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-posta Adresi"
            className="w-full p-2 border rounded"
          />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Şifre"
            className="w-full p-2 border rounded"
          />
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Şifreyi Onayla"
            className="w-full p-2 border rounded"
          />
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm text-center">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading || authLoading}
            className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition font-semibold"
          >
            {(loading || authLoading) ? 'Kaydediliyor...' : 'Kayıt Ol'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-gray-500">Zaten bir hesabınız var mı? </span>
          <Link href="/auth/login" className="text-blue-700 hover:underline">
            Giriş Yap
          </Link>
        </div>
      </div>
    </div>
  );
} 