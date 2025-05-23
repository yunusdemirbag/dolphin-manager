import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // .env.local dosyanızda bu değerler olmalı
  const clientId = process.env.ETSY_CLIENT_ID;
  const redirectUri = process.env.ETSY_REDIRECT_URI;
  const scopes = 'listings_r shops_r transactions_r'; // Gerekli izinler

  if (!clientId || !redirectUri) {
    return new NextResponse('Etsy OAuth yapılandırması eksik', { status: 500 });
  }

  const state = Math.random().toString(36).substring(2); // CSRF koruması için
  const etsyAuthUrl =
    `https://www.etsy.com/oauth/connect?response_type=code` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&client_id=${clientId}` +
    `&state=${state}`;

  return NextResponse.redirect(etsyAuthUrl);
} 