'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/atoms/Button';
import { Copy, Check, QrCode } from 'lucide-react';
import QRCode from 'qrcode';
import Image from 'next/image';

export function DonatePageClient({ unifiedAddress }: { unifiedAddress: string }) {
  const [copied, setCopied] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  const handleCopy = () => {
    navigator.clipboard.writeText(unifiedAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const qrCodeUrl = await QRCode.toDataURL(unifiedAddress, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        });
        setQrCodeDataUrl(qrCodeUrl);
      } catch (error) {
        console.error('QRコード生成エラー:', error);
      }
    };

    generateQRCode();
  }, [unifiedAddress]);

  return (
    <>
      <div className="relative overflow-hidden rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 p-1">
        <div className="flex items-center gap-3 bg-card rounded-lg p-4">
          <code className="flex-1 text-sm md:text-base font-mono break-all font-semibold">
            {unifiedAddress}
          </code>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="hover:bg-primary/10 transition-all"
          >
            {copied ? (
              <Check className="w-5 h-5 text-accent" />
            ) : (
              <Copy className="w-5 h-5 text-primary" />
            )}
          </Button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 via-background to-accent/5 p-8">
        <div className="text-center space-y-4">
          <div className="w-56 h-56 mx-auto bg-white rounded-2xl flex items-center justify-center border-4 border-primary/20 shadow-xl relative overflow-hidden">
            {qrCodeDataUrl ? (
              <Image
                src={qrCodeDataUrl}
                alt="寄付アドレスQRコード"
                width={192}
                height={192}
                className="object-contain"
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
                <QrCode className="w-40 h-40 text-primary/40 relative z-10" />
              </>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">QRコードで簡単送金</p>
            <p className="text-xs text-muted-foreground">モバイルウォレットでスキャンして送金</p>
          </div>
        </div>
      </div>
    </>
  );
}
