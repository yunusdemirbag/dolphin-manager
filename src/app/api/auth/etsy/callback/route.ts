import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const supabase = createClient(cookies());
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code || !state) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  // State doğrulaması
  const { data: stateData, error: stateError } = await supabase
    .from('oauth_states')
    .select('user_id')
    .eq('state', state)
    .single();

  if (stateError || !stateData) {
    return NextResponse.json(
      { error: 'Invalid state' },
      { status: 400 }
    );
  }

  const ETSY_CLIENT_ID = process.env.ETSY_CLIENT_ID;
  const ETSY_CLIENT_SECRET = process.env.ETSY_CLIENT_SECRET;
  const CALLBACK_URL = process.env.ETSY_CALLBACK_URL;

  try {
    // Token exchange
    const tokenResponse = await fetch('https://api.etsy.com/v3/public/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: ETSY_CLIENT_ID!,
        client_secret: ETSY_CLIENT_SECRET!,
        redirect_uri: CALLBACK_URL!,
        code: code,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Etsy token exchange error:', errorData);
      return NextResponse.json(
        { error: 'Failed to exchange token' },
        { status: tokenResponse.status }
      );
    }

    const tokens = await tokenResponse.json();
    const { access_token, refresh_token, expires_in, etsy_user_id } = tokens;

    // Etsy store bilgilerini kaydet
    const { error: storeError } = await supabase
      .from('etsy_stores')
      .upsert({
        user_id: stateData.user_id,
        etsy_user_id: etsy_user_id,
        access_token: access_token,
        refresh_token: refresh_token,
        expires_at: new Date(Date.now() + expires_in * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (storeError) {
      console.error('Error saving Etsy store:', storeError);
      return NextResponse.json(
        { error: 'Failed to save store data' },
        { status: 500 }
      );
    }

    // Kullanılan state'i temizle
    await supabase
      .from('oauth_states')
      .delete()
      .eq('state', state);

    // Başarılı bağlantıdan sonra dashboard'a yönlendir
    return NextResponse.redirect(new URL('/dashboard', request.url));

  } catch (error) {
    console.error('Error in Etsy callback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 