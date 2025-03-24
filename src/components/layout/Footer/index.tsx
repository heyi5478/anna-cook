import type React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronRight, Globe } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

// 定義 footer 的基本樣式和變體
const footerVariants = cva("w-full bg-gray-200 py-4 px-4", {
  variants: {
    variant: {
      default: "border-t border-gray-300",
      transparent: "bg-transparent",
    },
    size: {
      sm: "py-2",
      md: "py-4",
      lg: "py-6",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
})

// 定義 footer 的 props 類型
export type FooterProps =
  & React.HTMLAttributes<HTMLDivElement>
  & VariantProps<typeof footerVariants>
  & {
    companyName?: string
    year?: number
    studioName?: string
  };

// 定義導航項目類型
type NavItem = {
  label: string
  href: string
}

/**
 * 應用程式頁腳元件，包含導航連結和版權信息
 */
export const Footer: React.FC<FooterProps> = ({
  className,
  variant,
  size,
  companyName = "商標",
  year = new Date().getFullYear(),
  studioName = "Creative studio",
  ...props
}) => {
  // 導航項目數據
  const navItems: NavItem[] = [
    { label: "人氣食譜", href: "/popular" },
    { label: "最新食譜", href: "/latest" },
    { label: "關於我們", href: "/about" },
  ]

  return (
    <footer className={cn(footerVariants({ variant, size, className }))} {...props}>
      <div className="mb-4">
        <div className="bg-gray-400 text-white py-1 px-3 inline-block rounded mb-4">{companyName}</div>

        <nav className="space-y-2">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center justify-between py-2 border-b border-gray-300"
            >
              <span className="text-gray-700">{item.label}</span>
              <ChevronRight className="h-4 w-4 text-gray-500" />
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-6 text-center text-sm text-gray-600">
        <p className="mb-2">
          商業協助?{" "}
          <Link href="/contact" className="underline">
            聯絡我們
          </Link>
        </p>
        <div className="flex items-center justify-center gap-1 text-xs">
          <Globe className="h-3 w-3" />
          <span>
            © {year}年所有權 {studioName}
          </span>
        </div>
      </div>
    </footer>
  )
}
