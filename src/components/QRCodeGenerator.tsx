'use client';

import { QRCodePreset } from '@/types/preset';
import { useEffect, useRef, useState, useCallback } from 'react';
import QRCodeLib from 'qrcode';

interface QRCodeGeneratorProps {
  value: string;
  preset: QRCodePreset;
  size?: number;
  customColor?: string;
  customLogo?: string;
}

export default function QRCodeGenerator({
  value,
  preset,
  size = 256,
  customColor,
  customLogo,
}: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);
  const [copied, setCopied] = useState(false);

  const color = customColor || preset.color;
  const logoUrl = customLogo || preset.logoUrl;

  // Charger le logo
  useEffect(() => {
    if (logoUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => setLogoImage(img);
      img.onerror = () => setLogoImage(null);
      img.src = logoUrl;
    } else {
      setLogoImage(null);
    }
  }, [logoUrl]);

  // Vérifier si un module fait partie d'un finder pattern (coins de positionnement)
  const isFinderPattern = (row: number, col: number, moduleCount: number): boolean => {
    // Finder patterns sont aux positions:
    // - Haut gauche: (0-6, 0-6)
    // - Haut droite: (0-6, moduleCount-7 à moduleCount-1)
    // - Bas gauche: (moduleCount-7 à moduleCount-1, 0-6)
    
    const inTopLeft = row < 7 && col < 7;
    const inTopRight = row < 7 && col >= moduleCount - 7;
    const inBottomLeft = row >= moduleCount - 7 && col < 7;
    
    return inTopLeft || inTopRight || inBottomLeft;
  };

  // Dessiner le QR code avec styles différenciés
  const drawRoundedQR = useCallback(async () => {
    if (!value || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      // Générer les données du QR code
      const qrData = QRCodeLib.create(value, { errorCorrectionLevel: 'H' });
      const modules = qrData.modules;
      const moduleCount = modules.size;
      
      const margin = 4;
      const moduleSize = (size - margin * 2) / moduleCount;
      const cornerRadius = moduleSize * 0.45; // Rayon d'arrondi pour les modules du corps

      // Configurer le canvas
      canvas.width = size;
      canvas.height = size;

      // Fond blanc
      ctx.fillStyle = preset.backgroundColor;
      ctx.fillRect(0, 0, size, size);

      ctx.fillStyle = color;

      // D'abord, dessiner les modules du corps (arrondis) en excluant les finder patterns
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (modules.get(row, col) && !isFinderPattern(row, col, moduleCount)) {
            const x = margin + col * moduleSize;
            const y = margin + row * moduleSize;
            
            // Dessiner un rectangle arrondi pour le corps
            drawRoundedRect(ctx, x, y, moduleSize, moduleSize, cornerRadius);
          }
        }
      }

      // Dessiner les finder patterns (carrés) avec style personnalisé
      const finderPositions = [
        { row: 0, col: 0 },                          // Haut gauche
        { row: 0, col: moduleCount - 7 },            // Haut droite
        { row: moduleCount - 7, col: 0 },            // Bas gauche
      ];

      for (const pos of finderPositions) {
        drawFinderPattern(ctx, margin, pos.row, pos.col, moduleSize, color, preset.backgroundColor);
      }

      // Dessiner le logo au centre si disponible
      if (logoImage) {
        const logoSize = size * 0.22;
        const logoX = (size - logoSize) / 2;
        const logoY = (size - logoSize) / 2;
        
        // Fond blanc derrière le logo (cercle)
        ctx.fillStyle = preset.backgroundColor;
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, logoSize * 0.65, 0, Math.PI * 2);
        ctx.fill();
        
        // Dessiner le logo
        ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
      }
    } catch (error) {
      console.error('Erreur lors de la génération du QR code:', error);
    }
  }, [value, size, color, preset.backgroundColor, logoImage]);

  // Fonction pour dessiner un finder pattern carré avec point carré au centre
  const drawFinderPattern = (
    ctx: CanvasRenderingContext2D,
    margin: number,
    startRow: number,
    startCol: number,
    moduleSize: number,
    fgColor: string,
    bgColor: string
  ) => {
    const x = margin + startCol * moduleSize;
    const y = margin + startRow * moduleSize;
    const outerSize = 7 * moduleSize;
    const middleSize = 5 * moduleSize;
    const innerSize = 3 * moduleSize;

    // Carré extérieur (couleur principale)
    ctx.fillStyle = fgColor;
    ctx.fillRect(x, y, outerSize, outerSize);

    // Carré du milieu (fond - crée le "trou")
    ctx.fillStyle = bgColor;
    ctx.fillRect(x + moduleSize, y + moduleSize, middleSize, middleSize);

    // Point carré central (couleur principale)
    ctx.fillStyle = fgColor;
    ctx.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, innerSize, innerSize);
  };

  // Fonction pour dessiner un rectangle arrondi
  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  };

  // Redessiner quand les paramètres changent
  useEffect(() => {
    drawRoundedQR();
  }, [drawRoundedQR]);

  const downloadQRCode = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `qrcode-${preset.id}.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  };

  const copyToClipboard = async () => {
    if (canvasRef.current) {
      try {
        const blob = await new Promise<Blob | null>((resolve) =>
          canvasRef.current?.toBlob(resolve, 'image/png')
        );
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      } catch (error) {
        console.error('Erreur lors de la copie:', error);
      }
    }
  };

  if (!value) {
    return (
      <div className="flex items-center justify-center w-64 h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500 text-center px-4">
          Entrez une URL ou du texte pour générer un QR Code
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="p-4 bg-white rounded-lg shadow-lg"
        style={{ backgroundColor: preset.backgroundColor }}
      >
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          style={{ width: size, height: size }}
        />
      </div>
      <div className="flex gap-3">
        <button
          onClick={downloadQRCode}
          className="flex items-center gap-2 px-5 py-2 text-white rounded-lg transition-all shadow-md hover:shadow-lg font-medium"
          style={{
            background: `linear-gradient(to right, ${color}, ${color}dd)`,
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Télécharger
        </button>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-5 py-2 bg-white border-2 rounded-lg transition-all shadow-md hover:shadow-lg font-medium"
          style={{
            borderColor: color,
            color: color,
          }}
        >
          {copied ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copié !
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copier
            </>
          )}
        </button>
      </div>
    </div>
  );
}
