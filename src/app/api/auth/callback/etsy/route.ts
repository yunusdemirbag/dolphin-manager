import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getIronSession } from 'iron-session';
import { sessionOptions, AppSession } from '@/lib/session';

export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
    const { searchParams } = new URL(request.url);

    // --- Uygulamanın Temel URL'sini Belirle ---
    const nodeEnv = process.env.NODE_ENV;
    const vercelUrl = process.env.VERCEL_URL;
    const protocol = (nodeEnv === 'production' && vercelUrl) || process.env.NEXT_PUBLIC_FORCE_HTTPS === 'true' ? 'https' : 'http';
    const defaultHost = process.env.HOST || (nodeEnv === 'development' ? 'localhost:3000' : 'localhost');
    
    const hostHeader = request.headers.get('x-forwarded-host') || request.headers.get('host') || defaultHost;
    const appBaseUrl = vercelUrl ? `${protocol}://${vercelUrl}` : `${protocol}://${hostHeader}`;

    console.log(`[ETSY CALLBACK] Belirlenen appBaseUrl: ${appBaseUrl}`);

    const mainRedirectPath = "/dashboard";

    // --- Etsy'den Gelen Parametreleri Al ---
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    const storedState = cookieStore.get('etsy_oauth_state_dolphin')?.value;
    const storedCodeVerifier = cookieStore.get('etsy_pkce_verifier_dolphin')?.value;

    // Cookieleri hemen temizle
    cookieStore.delete('etsy_oauth_state_dolphin');
    cookieStore.delete('etsy_pkce_verifier_dolphin');

    console.log("[ETSY CALLBACK] Alınan kod:", code ? `**** (uzunluk ${code.length})` : null);
    console.log("[ETSY CALLBACK] Alınan state:", state);
    console.log("[ETSY CALLBACK] Cookie'deki state:", storedState);

    // --- Güvenlik Kontrolleri ---
    if (!code) {
        console.error("[ETSY CALLBACK] HATA: Etsy'den 'code' parametresi gelmedi.");
        return redirect(`${appBaseUrl}${mainRedirectPath}?status=error&message=Etsy_Auth_Code_Missing`);
    }
    if (!state || !storedState) {
         console.error("[ETSY CALLBACK] HATA: 'state' parametresi eksik veya cookie'de yok.");
         return redirect(`${appBaseUrl}${mainRedirectPath}?status=error&message=Etsy_State_Missing`);
    }
    if (state !== storedState) {
        console.error("[ETSY CALLBACK] HATA: 'state' eşleşmiyor! CSRF riski.");
        return redirect(`${appBaseUrl}${mainRedirectPath}?status=error&message=Etsy_State_Mismatch`);
    }
    if (!storedCodeVerifier) {
         console.error("[ETSY CALLBACK] HATA: 'code_verifier' cookie'de yok.");
         return redirect(`${appBaseUrl}${mainRedirectPath}?status=error&message=Etsy_Verifier_Missing`);
    }

    // --- Ortam Değişkenlerini Al ---
    const etsyApiKey = process.env.ETSY_API_KEY;
    if (!etsyApiKey) {
         console.error('[ETSY CALLBACK] HATA: ETSY_API_KEY eksik.');
         return redirect(`${appBaseUrl}${mainRedirectPath}?status=error&message=Server_Config_Error_API_KEY`);
    }
    const etsyAppCallbackUri = process.env.ETSY_CALLBACK_URI;
     if (!etsyAppCallbackUri) {
         console.error('[ETSY CALLBACK] HATA: ETSY_CALLBACK_URI eksik.');
         return redirect(`${appBaseUrl}${mainRedirectPath}?status=error&message=Server_Config_Error_CALLBACK_URI`);
    }

    // Token alımı ve sonraki işlemler için `try...catch`
    try {
        const tokenUrl = 'https://api.etsy.com/v3/public/oauth/token';
        const requestBody = new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: etsyApiKey,
            redirect_uri: etsyAppCallbackUri,
            code: code,
            code_verifier: storedCodeVerifier
        });

        console.log("[ETSY CALLBACK] Etsy token endpoint'ine POST yapılıyor:", tokenUrl);

        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: requestBody.toString(),
        });

        const tokenData = await response.json();
        console.log("[ETSY CALLBACK] Etsy Token Yanıt Durumu:", response.status);

        if (!response.ok) {
            console.error('[ETSY CALLBACK] HATA: Etsy token alınamadı:', tokenData);
            const errorMessage = encodeURIComponent(tokenData?.error_description || tokenData?.error || 'Token_Exchange_Failed');
            return redirect(`${appBaseUrl}${mainRedirectPath}?status=error&message=${errorMessage}`);
        }

        // --- iron-session ile session başlat (App Router uyumlu) ---
        const nextRes = NextResponse.redirect(`${appBaseUrl}${mainRedirectPath}?status=success&message=Etsy_Connected_And_Session_Created`);
        const session = await getIronSession<AppSession>(request, nextRes, sessionOptions);
        session.isLoggedIn = true;
        session.etsyAccessToken = tokenData.access_token;
        session.etsyRefreshToken = tokenData.refresh_token;
        session.etsyTokenExpiresAt = Date.now() + (tokenData.expires_in * 1000);
        session.etsyUserId = tokenData.access_token.split('.')[0];
        await session.save();
        return nextRes;

    } catch (error: any) {
        if (error.digest && typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
            throw error;
        }

        console.error('[ETSY CALLBACK] Token alımı/işlenmesi sırasında BEKLENMEDİK genel hata:', error);
        const errorMessage = encodeURIComponent(error.message || 'Callback_General_Critical_Error');
        return redirect(`${appBaseUrl}${mainRedirectPath}?status=error&message=${errorMessage}`);
    }
} 