import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const code = (await params).code;

  try {
    const qrCode = await prisma.qRCode.findUnique({
      where: { shortCode: code },
      include: {
        scanEvents: {
          orderBy: { scannedAt: 'asc' },
        },
      },
    });

    if (!qrCode) {
      return NextResponse.json({ error: 'QR Code introuvable' }, { status: 404 });
    }

    // Process scan events for the chart (e.g., group by date)
    const scansByDate = qrCode.scanEvents.reduce((acc, scan) => {
      const date = scan.scannedAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(scansByDate).map(([date, count]) => ({
      date,
      count,
    }));

    return NextResponse.json({
      scans: qrCode.scans,
      targetUrl: qrCode.targetUrl,
      createdAt: qrCode.createdAt,
      chartData,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
