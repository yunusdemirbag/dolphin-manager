import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
    const { searchParams } = new URL(request.url);

    // --- Uygulamanın Temel URL'sini Belirle ---
    // Bu, yönlendirmelerde tam URL kullanmak için GEREKLİDİR.
    const nodeEnv = process.env.NODE_ENV;
    const vercelUrl = process.env.VERCEL_URL; // Vercel bunu otomatik ayarlar
    const protocol = (nodeEnv === 'production' && vercelUrl) || process.env.NEXT_PUBLIC_FORCE_HTTPS === 'true' ? 'https' : 'http';
    
    // Yerel geliştirme için port numarasını .env.local'den alabilir veya sabit bırakabilirsiniz.
    // Vercel'deyse NEXT_PUBLIC_CLIENT_URL'i veya VERCEL_URL'i kullanın.
    // ÖNEMLİ: Kullanıcı kendi yerel portunu farklı kullanıyorsa burası ayarlanabilir olmalı.
    // Senin terminal çıktılarına göre yerelde 3001 kullanıyorsun.
    const defaultHost = process.env.HOST || 'localhost:3001';
    
    const appBaseUrl = vercelUrl ? `${protocol}://${vercelUrl}` : `${protocol}://${defaultHost}`;
    console.log(`[ETSY CALLBACK] Determined appBaseUrl: ${appBaseUrl}`);

    // --- Etsy'den Gelen Parametreleri Al ---
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    const storedState = cookieStore.get('etsy_oauth_state_dolphin')?.value;
    const storedCodeVerifier = cookieStore.get('etsy_pkce_verifier_dolphin')?.value;

    // Kullanılmış cookieleri hemen temizle
    cookieStore.delete('etsy_oauth_state_dolphin');
    cookieStore.delete('etsy_pkce_verifier_dolphin');

    console.log("[ETSY CALLBACK] Received code:", code ? "****** (length " + code.length + ")" : null);
    console.log("[ETSY CALLBACK] Received state:", state);
    console.log("[ETSY CALLBACK] Stored state in cookie:", storedState);

    // --- Güvenlik Kontrolleri ve Hata Durumunda Yönlendirme ---
    const dashboardErrorPath = `${appBaseUrl}/dashboard`; // Hata durumunda yönlendirilecek ana sayfa

    if (!code) {
        console.error("[ETSY CALLBACK] HATA: Etsy'den 'code' parametresi gelmedi.");
        return redirect(`${dashboardErrorPath}?status=error&message=Etsy_Auth_Code_Missing`);
    }
    if (!state || !storedState) {
         console.error("[ETSY CALLBACK] HATA: 'state' parametresi eksik veya cookie'de bulunamadı.");
         return redirect(`${dashboardErrorPath}?status=error&message=Etsy_State_Missing`);
    }
    if (state !== storedState) {
        console.error("[ETSY CALLBACK] HATA: 'state' eşleşmiyor! CSRF saldırısı olabilir.");
        console.error("Alınan State:", state, "Beklenen State:", storedState);
        return redirect(`${dashboardErrorPath}?status=error&message=Etsy_State_Mismatch`);
    }
    if (!storedCodeVerifier) {
         console.error("[ETSY CALLBACK] HATA: 'code_verifier' cookie'de bulunamadı.");
         return redirect(`${dashboardErrorPath}?status=error&message=Etsy_Verifier_Missing`);
    }
    // --- Güvenlik Kontrolleri Sonu ---


    // --- Ortam Değişkenlerini Al ---
    const etsyApiKey = process.env.ETSY_API_KEY;
    if (!etsyApiKey) {
         console.error('[ETSY CALLBACK] HATA: ETSY_API_KEY ortam değişkeni ayarlanmamış (token alımı için).');
         return redirect(`${dashboardErrorPath}?status=error&message=Server_Config_Error_API_KEY`);
    }

    // Callback URI (Etsy App ayarlarındaki ve 'initiate' rotasındakiyle AYNI olmalı)
    // ETSY_CALLBACK_URI ortam değişkenini kullanmak en sağlıklısı.
    const etsyAppCallbackUri = process.env.ETSY_CALLBACK_URI;
     if (!etsyAppCallbackUri) {
         console.error('[ETSY CALLBACK] HATA: ETSY_CALLBACK_URI ortam değişkeni ayarlanmamış.');
         return redirect(`${dashboardErrorPath}?status=error&message=Server_Config_Error_CALLBACK_URI`);
    }

    // --- Etsy Token Endpoint'ine İstek ---
    const tokenUrl = 'https://api.etsy.com/v3/public/oauth/token';
    const requestBody = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: etsyApiKey,
        redirect_uri: etsyAppCallbackUri, // initiate'dekiyle aynı olmalı!
        code: code,
        code_verifier: storedCodeVerifier
    });

    console.log("[ETSY CALLBACK] Etsy token endpoint'ine POST isteği yapılıyor:", tokenUrl);
    // Hassas bilgileri loglarken dikkatli ol:
    // console.log("[ETSY CALLBACK] Request Body (kısmi):", { grant_type: 'authorization_code', client_id: etsyApiKey.substring(0,5)+'...', redirect_uri: etsyAppCallbackUri, code_present: !!code, verifier_present: !!storedCodeVerifier });

    try {
        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: requestBody.toString(),
        });

        const tokenData = await response.json();

        console.log("[ETSY CALLBACK] Etsy Token Yanıt Durumu:", response.status);
        // console.log("[ETSY CALLBACK] Etsy Token Yanıt Body (maskeli):", tokenData ? JSON.stringify(tokenData).substring(0,100)+'...' : null); // Tokenları tam loglama!

        if (!response.ok) {
            console.error('[ETSY CALLBACK] HATA: Etsy token alınamadı:', tokenData);
            const errorMessage = encodeURIComponent(tokenData?.error_description || tokenData?.error || 'Token_Exchange_Failed');
            // Senin hata mesajında /settings/stores vardı, ama ben dashboard'a yönlendiriyorum.
            // Eğer /settings/stores'a gitmesi gerekiyorsa, dashboardErrorPath'i ona göre ayarla.
            return redirect(`${dashboardErrorPath}?status=error&message=${errorMessage}`);
        }

        // --- BAŞARILI TOKEN ALINDI ---
        const accessToken = tokenData.access_token;
        const refreshToken = tokenData.refresh_token; // refresh_token genellikle istenir ama her zaman gelmeyebilir
        const expiresIn = tokenData.expires_in; // saniye
        const etsyUserId = tokenData.access_token.split('.')[0]; // Bu user ID olmayabilir, Etsy'den user_id geliyorsa onu kullan

        console.log("[ETSY CALLBACK] Etsy tokenları başarıyla alındı. User segment (approx):", etsyUserId);
        console.log("[ETSY CALLBACK] Access Token Geçerlilik Süresi:", expiresIn, "saniye");

        // !!! ÇOK ÖNEMLİ: Token'ları Güvenli Bir Yere Kaydet !!!
        // Şu an için tokenlar hiçbir yere kaydedilmiyor. Bu, her seferinde bağlanman gerekeceği anlamına gelir.
        // Sonraki adımlarda buraya session/cookie veya veritabanı kaydı eklenecek.
        // ÖRNEK: session cookie'ye access_token kaydetmek (çok basit ve tam güvenli değil uzun vadede)
        /*
        const sessionCookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: expiresIn, // Token geçerlilik süresi kadar
            sameSite: 'lax' as const
        };
        cookieStore.set('etsy_access_token', accessToken, sessionCookieOptions);
        if (refreshToken) {
            cookieStore.set('etsy_refresh_token', refreshToken, {...sessionCookieOptions, maxAge: 60 * 60 * 24 * 30 }); // Refresh token daha uzun ömürlü
        }
        */

        // Başarılı yönlendirme. Logdaki hata /settings/stores idi, ancak bizim önceki kodumuz /dashboard idi.
        // Eğer /settings/stores ise, aşağıdaki path'i güncellemelisin.
        const successPath = `${appBaseUrl}/dashboard`; // VEYA `${appBaseUrl}/settings/stores`
        return redirect(`${successPath}?status=success&message=Etsy_Connected`);

    } catch (error) {
        console.error('[ETSY CALLBACK] Etsy token alımı sırasında kritik hata:', error);
        const errorMessage = encodeURIComponent((error instanceof Error) ? error.message : 'Callback_Fetch_Critical_Error');
        return redirect(`${dashboardErrorPath}?status=error&message=${errorMessage}`);
    }
} 