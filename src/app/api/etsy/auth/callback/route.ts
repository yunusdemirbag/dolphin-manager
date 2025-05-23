import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings/stores?error=${error}`
    )
  }

  if (!code) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings/stores?error=no_code`
    )
  }

  try {
    // Etsy token exchange
    const tokenResponse = await fetch('https://api.etsy.com/v3/public/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.ETSY_CLIENT_ID!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/etsy/auth/callback`,
        code: code,
        code_verifier: state!, // state parametresi olarak code_verifier'ı gönderdik
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error('Token exchange failed')
    }

    const tokenData = await tokenResponse.json()

    // Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Get current user from session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session?.user) {
      throw new Error('No authenticated user')
    }

    // Get Etsy shop info
    const shopResponse = await fetch('https://api.etsy.com/v3/application/shops/me', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    })

    if (!shopResponse.ok) {
      throw new Error('Failed to fetch shop info')
    }

    const shopData = await shopResponse.json()

    // Store in Supabase
    const { error: storeError } = await supabase
      .from('etsy_stores')
      .upsert({
        user_id: session.user.id,
        shop_id: shopData.shop_id,
        shop_name: shopData.shop_name,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        token_expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
        is_demo_data: false,
      })

    if (storeError) {
      throw storeError
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings/stores?success=true`
    )
  } catch (error) {
    console.error('Etsy callback error:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings/stores?error=callback_failed`
    )
  }
} 