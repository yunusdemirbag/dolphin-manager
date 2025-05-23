// Auth fonksiyonları demo modda devre dışı

import { supabase } from './supabaseClient';
import type { SignUpWithPasswordCredentials, SignInWithPasswordCredentials } from '@supabase/supabase-js';

// Kullanıcı Kayıt Fonksiyonu
export async function signUpNewUser(credentials: SignUpWithPasswordCredentials) {
  const { data, error } = await supabase.auth.signUp(credentials);
  if (error) {
    console.error('Error signing up:', error.message);
    // Kullanıcıya gösterilecek daha iyi bir hata yönetimi eklenebilir
    throw error;
  }
  // İsteğe bağlı: Kayıt sonrası kullanıcıya bir onay e-postası gönderilir (Supabase ayarlarından aktif edildiyse).
  // data.user objesi kullanıcı bilgilerini içerir, data.session ise null olabilir (e-posta onayı bekleniyorsa).
  return { user: data.user, session: data.session };
}

// Kullanıcı Giriş Fonksiyonu
export async function signInWithPassword(credentials: SignInWithPasswordCredentials) {
  const { data, error } = await supabase.auth.signInWithPassword(credentials);
  if (error) {
    console.error('Error signing in:', error.message);
    throw error;
  }
  // data.user ve data.session dolu gelir.
  return { user: data.user, session: data.session };
}

// Kullanıcı Çıkış Fonksiyonu
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error.message);
    throw error;
  }
  // Çıkış başarılı, genellikle kullanıcıyı ana sayfaya veya giriş sayfasına yönlendirirsiniz.
  return true;
}

// Aktif Oturumu Getirme Fonksiyonu
export async function getActiveSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error.message);
    throw error;
  }
  return session;
}

// Kullanıcı Bilgisini Getirme Fonksiyonu (Mevcut oturumdan)
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
   if (error) {
    console.error('Error getting user:', error.message);
    // Bu hata genellikle oturum yoksa veya token geçersizse oluşur.
    // throw error; // Hata fırlatmak yerine null döndürmek daha yönetilebilir olabilir.
    return null;
  }
  return user;
}

// Oturum Durumu Değişikliklerini Dinleme
// Bu, layout veya ana uygulama bileşeninizde kullanılabilir.
export function onAuthStateChange(callback: (event: string, session: import('@supabase/supabase-js').Session | null) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return subscription;
} 