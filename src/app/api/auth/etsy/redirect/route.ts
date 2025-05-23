import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function GET() {
  const supabase = createClient(cookies());
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ETSY_CLIENT_ID = process.env.ETSY_CLIENT_ID;
  const CALLBACK_URL = process.env.ETSY_CALLBACK_URL;

  if (!ETSY_CLIENT_ID || !CALLBACK_URL) {
    return NextResponse.json(
      { error: 'Etsy configuration missing' },
      { status: 500 }
    );
  }

  // CSRF koruması için state oluştur
  const state = crypto.randomUUID();
  
  // State'i Supabase'de sakla
  await supabase
    .from('oauth_states')
    .insert({
      user_id: user.id,
      state: state,
      provider: 'etsy',
      created_at: new Date().toISOString()
    });

  const etsyAuthUrl = new URL('https://www.etsy.com/oauth/connect');
  etsyAuthUrl.searchParams.append('response_type', 'code');
  etsyAuthUrl.searchParams.append('client_id', ETSY_CLIENT_ID);
  etsyAuthUrl.searchParams.append('redirect_uri', CALLBACK_URL);
  etsyAuthUrl.searchParams.append('scope', 'listings_r transactions_r email_r profile_r');
  etsyAuthUrl.searchParams.append('state', state);

  return NextResponse.redirect(etsyAuthUrl.toString());
} 