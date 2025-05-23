import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

function base64URLEncode(buffer: Buffer): string {
    return buffer.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}
async function sha256(buffer: Buffer): Promise<Buffer> {
    const digest = await crypto.subtle.digest('SHA-256', buffer);
    return Buffer.from(digest);
}

export async function GET(req: NextRequest) {
    const clientId = process.env.ETSY_API_KEY;
    const callbackUri = process.env.ETSY_CALLBACK_URI;
    const scopes = 'listings_r shops_r transactions_r profile_r email_r';

    if (!clientId || !callbackUri) {
        return NextResponse.json({ error: 'Sunucu yapılandırma hatası' }, { status: 500 });
    }

    const state = base64URLEncode(crypto.getRandomValues(Buffer.alloc(32)));
    const codeVerifier = base64URLEncode(crypto.getRandomValues(Buffer.alloc(32)));
    const codeChallengeBuffer = await sha256(Buffer.from(codeVerifier));
    const codeChallenge = base64URLEncode(codeChallengeBuffer);

    // Cookie'ye kaydet
    const cookieStore = await cookies();
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 15,
        sameSite: 'lax' as const
    };
    cookieStore.set('etsy_oauth_state_dolphin', state, cookieOptions);
    cookieStore.set('etsy_pkce_verifier_dolphin', codeVerifier, cookieOptions);

    // Etsy OAuth URL
    const etsyAuthUrl = new URL('https://www.etsy.com/oauth/connect');
    etsyAuthUrl.searchParams.append('response_type', 'code');
    etsyAuthUrl.searchParams.append('redirect_uri', callbackUri);
    etsyAuthUrl.searchParams.append('scope', scopes);
    etsyAuthUrl.searchParams.append('client_id', clientId);
    etsyAuthUrl.searchParams.append('state', state);
    etsyAuthUrl.searchParams.append('code_challenge', codeChallenge);
    etsyAuthUrl.searchParams.append('code_challenge_method', 'S256');

    return redirect(etsyAuthUrl.toString());
} 