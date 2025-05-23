"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(email, password) as { error: any };
    setLoading(false);
    if (!error) {
      router.push("/");
    } else {
      setError(error.message || "Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  const handleEtsyConnect = () => {
    window.location.href = "/api/etsy/auth/initiate";
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Giriş Yap</h2>
        <form onSubmit={handleSignIn}>
          <input
            type="email"
            placeholder="E-posta"
            className="w-full mb-4 p-2 border rounded"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Şifre"
            className="w-full mb-4 p-2 border rounded"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm text-center mb-2">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition mb-4"
            disabled={loading || authLoading}
          >
            {(loading || authLoading) ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
        <div className="mt-2 text-center">
          <button
            onClick={handleEtsyConnect}
            className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition font-semibold"
          >
            Etsy Bağlantısı Kur
          </button>
        </div>
      </div>
    </div>
  );
} 