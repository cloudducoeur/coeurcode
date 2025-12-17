import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function generateShortCode(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { targetUrl } = body;

    if (!targetUrl) {
      return NextResponse.json({ error: 'URL cible requise' }, { status: 400 });
    }

    let shortCode = generateShortCode();
    // Ensure uniqueness (simple retry logic)
    let exists = await prisma.qRCode.findUnique({ where: { shortCode } });
    while (exists) {
      shortCode = generateShortCode();
      exists = await prisma.qRCode.findUnique({ where: { shortCode } });
    }

    const qrCode = await prisma.qRCode.create({
      data: {
        targetUrl,
        shortCode,
      },
    });

    // Construct the full tracking URL
    // Assuming the host is available in headers or env, but for now we return the relative path or try to guess
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const fullUrl = `${protocol}://${host}/r/${shortCode}`;

    return NextResponse.json({
      shortCode: qrCode.shortCode,
      fullUrl,
      id: qrCode.id
    });
  } catch (error) {
    console.error('Error creating QR code:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
