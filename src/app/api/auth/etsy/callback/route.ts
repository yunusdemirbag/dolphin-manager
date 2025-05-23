import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
    const storedState = cookieStore.get('etsy_oauth_state_dolphin')?.value;
    const storedCodeVerifier = cookieStore.get('etsy_pkce_verifier_dolphin')?.value;

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
        return NextResponse.redirect(`/settings/stores?error=${error}`);
    }
    if (!code || !state || !storedState || !storedCodeVerifier || state !== storedState) {
        return NextResponse.redirect(`/settings/stores?error=invalid_state`);
    }

    // Cookieleri temizle
    cookieStore.delete('etsy_oauth_state_dolphin');
    cookieStore.delete('etsy_pkce_verifier_dolphin');

    // Token alma
    const tokenResponse = await fetch('https://api.etsy.com/v3/public/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: process.env.ETSY_API_KEY!,
            redirect_uri: process.env.ETSY_CALLBACK_URI!,
            code: code,
            code_verifier: storedCodeVerifier,
        }),
    });

    if (!tokenResponse.ok) {
        return NextResponse.redirect(`/settings/stores?error=token_exchange_failed`);
    }

    // Burada tokenData'yı kaydedebilirsin
    // const tokenData = await tokenResponse.json();

    return NextResponse.redirect(`/settings/stores?success=etsy_connected`);
} 