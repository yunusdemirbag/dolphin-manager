import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { topic } = await req.json();
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'OpenAI API anahtarı bulunamadı.' }, { status: 500 });
  }

  const prompt = topic || 'Etsy canvas wall art satıcıları için bu hafta güncel pazar ve içerik önerileri ver.';

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Sen bir Etsy ve e-ticaret uzmanı AI asistanısın.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 300,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'OpenAI API hatası' }, { status: 500 });
  }

  const data = await response.json();
  const suggestion = data.choices?.[0]?.message?.content || 'Öneri alınamadı.';
  return NextResponse.json({ suggestion });
} 