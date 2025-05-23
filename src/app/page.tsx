'use client';

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleEtsyConnect = () => {
    window.location.href = "/api/etsy/auth/initiate";
  };

  return (
    <div>
      <div className="mb-6 text-center bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Dolphin Manager'a Hoş Geldiniz</h2>
        <p className="mb-6 text-gray-600">
          Etsy mağazanızı verimli bir şekilde yönetin ve AI destekli araçlarla satışlarınızı artırın.
        </p>
        <div className="mt-6 space-x-4">
          {!user ? (
            <>
              <button
                onClick={() => router.push('/auth/login')}
                className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-indigo-700"
              >
                Giriş Yap
              </button>
              <button
                onClick={() => router.push('/auth/signup')}
                className="bg-green-500 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-green-600"
              >
                Kayıt Ol
              </button>
            </>
          ) : (
            <button
              onClick={handleEtsyConnect}
              className="bg-orange-500 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-orange-600"
            >
              Etsy ile Bağlantı Kur
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
