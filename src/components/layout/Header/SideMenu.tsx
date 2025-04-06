import React from 'react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, CircleUser } from 'lucide-react';

interface SideMenuProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onMenuClick?: () => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({
  isOpen,
  onOpenChange,
  onMenuClick,
}) => {
  const handleMenuClick = () => {
    if (onMenuClick) {
      onMenuClick();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMenuClick}
          aria-label="選單"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[200px] p-0 bg-white">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex items-center">
              <CircleUser className="m-2" />
              <Link href="/login" className="text-lg">
                登入/註冊
              </Link>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <nav className="flex flex-col">
              <Link href="/login" className="px-4 py-3 border-b hover:bg-gray-100">
                未登入
              </Link>
              <Link href="/" className="px-4 py-3 border-b hover:bg-gray-100">
                建立食譜
              </Link>
              <Link href="/" className="px-4 py-3 border-b hover:bg-gray-100">
                常見問題
              </Link>
              <Link href="/" className="px-4 py-3 border-b hover:bg-gray-100">
                連繫我們
              </Link>
            </nav>
          </div>
          <div className="p-4 border-t">
            <p className="text-xs text-gray-500">© 2025 安那煮Anna Cook. 保留所有權利.</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};