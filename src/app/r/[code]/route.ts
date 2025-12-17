import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { scanCounter } from '@/lib/metrics';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const code = (await params).code;

  try {
    const qrCode = await prisma.qRCode.findUnique({
      where: { shortCode: code },
    });

    if (!qrCode) {
      return new NextResponse('QR Code introuvable', { status: 404 });
    }

    // Increment Prometheus counter
    scanCounter.inc({ short_code: qrCode.shortCode, target_url: qrCode.targetUrl });

    // Record scan event and increment count
    await prisma.$transaction([
      prisma.scan.create({
        data: {
          qrCodeId: qrCode.id,
        },
      }),
      prisma.qRCode.update({
        where: { id: qrCode.id },
        data: { scans: { increment: 1 } },
      }),
    ]);

    return NextResponse.redirect(qrCode.targetUrl);
  } catch (error) {
    console.error('Error redirecting:', error);
    return new NextResponse('Erreur serveur', { status: 500 });
  }
}
