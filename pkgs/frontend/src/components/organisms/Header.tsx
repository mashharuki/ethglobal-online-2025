'use client';

import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import WalletConnectButton from '@/components/molecules/WalletConnectButton';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export default function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const { isMobile } = useMediaQuery();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleWalletConnectionChange = (connected: boolean) => {
    setIsWalletConnected(connected);
  };

  return (
    <>
      <header className="sticky top-0 z-50 glass-effect border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3">
              <div className="h-8 sm:h-12 flex items-center justify-center">
                <Image
                  src="/assets/crossdonate_logo_black_type.png"
                  alt="CrossDonate Logo"
                  width={isMobile ? (isWalletConnected ? 121.75 : 195) : 243.5}
                  height={isMobile ? (isWalletConnected ? 13.25 : 16) : 26.5}
                />
              </div>
              {/* 268,29 */}
            </div>
          </Link>
          {/* ウォレットボタン（常時表示） */}
          <div className="flex items-center gap-2">
            <WalletConnectButton onConnectionChange={handleWalletConnectionChange} />

            {/* モバイルハンバーガーメニュー */}
            {isMobile && (
              <button
                type="button"
                onClick={toggleDrawer}
                className="p-2 rounded-lg hover:bg-accent/10 transition-colors"
                aria-label="メニューを開く"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* モバイルドロワー */}
      {isMobile && (
        <>
          {/* オーバーレイ */}
          {isDrawerOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={closeDrawer}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  closeDrawer();
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="メニューを閉じる"
            />
          )}

          {/* ドロワー */}
          <div
            className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-background border-l border-border z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
              isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex flex-col h-full">
              {/* ドロワーヘッダー */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold">メニュー</h2>
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="p-2 rounded-lg hover:bg-accent/10 transition-colors"
                  aria-label="メニューを閉じる"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* ドロワーコンテンツ */}
              <div className="flex-1 p-4">
                {/* ナビゲーションリンク */}
                <nav className="space-y-4">
                  <Link
                    href="/create"
                    onClick={closeDrawer}
                    className="block text-base font-semibold hover:text-primary transition-colors py-2"
                  >
                    プロジェクト作成
                  </Link>
                  <Link
                    href="#"
                    onClick={closeDrawer}
                    className="block text-base font-semibold hover:text-primary transition-colors py-2"
                  >
                    ドキュメント
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
