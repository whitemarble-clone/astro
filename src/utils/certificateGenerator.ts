import { CertificateSettings } from '../types/astronomy';

/**
 * Generates and downloads a high-resolution PNG certificate using HTML5 Canvas.
 * Supports custom background template images and administrator-configured signatories & faculty names.
 */
export async function generateCertificatePNG(
  memberName: string,
  memberId: string,
  courseTitle: string,
  completionDate: string,
  verificationCode: string,
  customTemplateUrl?: string,
  settings?: Partial<CertificateSettings>
) {
  const canvas = document.createElement('canvas');
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const societyName = settings?.societyName || 'ROYAL ASTRONOMICAL OBSERVATORY SOCIETY';
  const facultyName = settings?.facultyName || 'FACULTY OF CELESTIAL MECHANICS & DEEP SKY OBSERVATION';
  const certificateTitle = settings?.certificateTitle || 'CERTIFICATE OF SCIENTIFIC MERIT';
  const citationBody = settings?.citationBody || 'Demonstrating calibrated telescope alignment, sensor signal reduction, star chart interpretation, and peer-reviewed logbook entry.';
  const signatory1Name = settings?.signatory1Name || 'Dr. Aris Thorne';
  const signatory1Title = settings?.signatory1Title || 'DIRECTOR OF OBSERVATORIES';
  const signatory2Name = settings?.signatory2Name || 'Prof. Valerie Vance';
  const signatory2Title = settings?.signatory2Title || 'EXECUTIVE EXAMINATION BOARD';
  const sealText = settings?.sealText || 'VERIFIED';
  const sealYear = settings?.sealYear || '2026';

  // If user uploaded a custom template, draw it as background!
  if (customTemplateUrl) {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = customTemplateUrl;
      });
      ctx.drawImage(img, 0, 0, 1920, 1080);
      // Optional subtle darkening overlay to ensure text contrast
      ctx.fillStyle = 'rgba(5, 8, 18, 0.45)';
      ctx.fillRect(0, 0, 1920, 1080);
    } catch (e) {
      console.warn('Could not load custom template, falling back to default:', e);
      drawDefaultBackground(ctx);
    }
  } else {
    drawDefaultBackground(ctx);
  }

  // Double decorative border
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.strokeRect(60, 60, 1800, 960);

  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth = 1;
  ctx.strokeRect(74, 74, 1772, 932);

  // Corner celestial accents
  const corners = [[80, 80], [1840, 80], [80, 1000], [1840, 1000]];
  ctx.strokeStyle = '#38bdf8';
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fill();
  });

  // Top Society Header
  ctx.fillStyle = '#38bdf8';
  ctx.font = '600 20px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '6px';
  ctx.fillText(societyName.toUpperCase(), 960, 160);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '400 15px -apple-system, sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText(facultyName.toUpperCase(), 960, 195);

  // Main Award Title
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 48px Georgia, serif';
  ctx.letterSpacing = '2px';
  ctx.fillText(certificateTitle.toUpperCase(), 960, 290);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '400 18px -apple-system, sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('This official credential certifies that registered fellow', 960, 360);

  // Member Name
  ctx.fillStyle = '#a5b4fc';
  ctx.font = '700 56px Georgia, serif';
  ctx.letterSpacing = '1px';
  ctx.fillText(memberName, 960, 445);

  // Underline
  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(600, 470);
  ctx.lineTo(1320, 470);
  ctx.stroke();

  // Membership ID
  ctx.fillStyle = '#38bdf8';
  ctx.font = '500 16px monospace';
  ctx.letterSpacing = '4px';
  ctx.fillText(`MEMBERSHIP ID: ${memberId.toUpperCase()}`, 960, 505);

  // Course Text
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '400 20px -apple-system, sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('has successfully completed the theoretical curriculum & observation track in', 960, 560);

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 32px -apple-system, sans-serif';
  ctx.letterSpacing = '1.5px';
  ctx.fillText(`"${courseTitle}"`, 960, 610);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '400 15px -apple-system, sans-serif';
  ctx.letterSpacing = '0.5px';
  ctx.fillText(citationBody, 960, 650);

  // Gold Seal in Center-Bottom
  const sealX = 960;
  const sealY = 770;
  const sealRadius = 55;

  // Gold Outer Glow
  const sealGrad = ctx.createRadialGradient(sealX, sealY, 10, sealX, sealY, sealRadius);
  sealGrad.addColorStop(0, '#fef08a');
  sealGrad.addColorStop(0.5, '#f59e0b');
  sealGrad.addColorStop(1, '#b45309');
  ctx.fillStyle = sealGrad;
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealRadius, 0, Math.PI * 2);
  ctx.fill();

  // Inner Dark Center of Seal
  ctx.fillStyle = '#0a0f1d';
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealRadius - 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealRadius - 10, 0, Math.PI * 2);
  ctx.stroke();

  // Seal Text
  ctx.fillStyle = '#fef08a';
  ctx.font = '700 11px monospace';
  ctx.letterSpacing = '2px';
  ctx.fillText(sealText.toUpperCase(), sealX, sealY + 4);
  ctx.font = '500 9px monospace';
  ctx.fillText(sealYear, sealX, sealY + 18);

  // Signatures Section
  ctx.textAlign = 'center';
  ctx.letterSpacing = '1px';

  // Left Signature - Director / Professor 1
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'italic 24px Georgia, serif';
  ctx.fillText(signatory1Name, 420, 880);
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(300, 895);
  ctx.lineTo(540, 895);
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 13px -apple-system, sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText(signatory1Title.toUpperCase(), 420, 915);
  ctx.fillStyle = '#64748b';
  ctx.font = '400 12px monospace';
  ctx.fillText(`ISSUED: ${completionDate}`, 420, 935);

  // Right Signature - Professor 2 / Academic Chair
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'italic 24px Georgia, serif';
  ctx.fillText(signatory2Name, 1500, 880);
  ctx.strokeStyle = '#475569';
  ctx.beginPath();
  ctx.moveTo(1380, 895);
  ctx.lineTo(1620, 895);
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 13px -apple-system, sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText(signatory2Title.toUpperCase(), 1500, 915);
  ctx.fillStyle = '#64748b';
  ctx.font = '400 12px monospace';
  ctx.fillText('VERIFIED FELLOWSHIP', 1500, 935);

  // Verification Hash Code (Center below seal)
  ctx.fillStyle = '#38bdf8';
  ctx.font = '500 12px monospace';
  ctx.letterSpacing = '3px';
  ctx.fillText(`OFFICIAL TOKEN: ${verificationCode}`, 960, 935);

  // Convert to download
  const imageURL = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `Astronomy-Society-Certificate-${memberName.replace(/\s+/g, '-')}.png`;
  link.href = imageURL;
  link.click();
}

function drawDefaultBackground(ctx: CanvasRenderingContext2D) {
  const gradient = ctx.createRadialGradient(960, 540, 100, 960, 540, 1100);
  gradient.addColorStop(0, '#0c1222');
  gradient.addColorStop(0.6, '#060913');
  gradient.addColorStop(1, '#020408');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1920, 1080);

  // Subtle star field in background
  ctx.fillStyle = '#ffffff';
  const starPositions = [
    [120, 180, 1.5], [340, 120, 1.0], [500, 240, 2.0], [800, 100, 1.2],
    [1100, 140, 1.5], [1400, 90, 2.2], [1700, 210, 1.0], [1820, 130, 1.8],
    [150, 850, 1.5], [420, 920, 2.0], [750, 980, 1.2], [1150, 910, 1.8],
    [1520, 860, 1.3], [1780, 940, 2.0], [240, 480, 1.0], [1680, 550, 1.5]
  ];
  starPositions.forEach(([x, y, r]) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.globalAlpha = 0.6;
    ctx.fill();
  });
  ctx.globalAlpha = 1.0;
}
