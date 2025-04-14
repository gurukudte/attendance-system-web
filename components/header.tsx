import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeCustomizer } from "./theme-customizer";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4 w-full flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              TalentSync
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="#features"
              className="transition-colors hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="#solutions"
              className="transition-colors hover:text-primary"
            >
              Solutions
            </Link>
            <Link
              href="#pricing"
              className="transition-colors hover:text-primary"
            >
              Pricing
            </Link>
            <Link
              href="#resources"
              className="transition-colors hover:text-primary"
            >
              Resources
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeCustomizer />
          <Button variant="ghost" asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/">Request Demo</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
