
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Moon, Star } from "lucide-react"
import { usePathname } from "next/navigation"

export function Navigation() {
  const pathname = usePathname()

  const links = [
    { name: "Our Impact", href: "/impact" },
    { name: "Transparency", href: "/transparency" },
    { name: "Communities", href: "/communities" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-xl transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
            <Moon className="w-6 h-6 fill-current" />
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="font-headline text-2xl font-bold text-primary tracking-tight">Islamic Group 313</span>
            <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] ml-0.5">Donation in Islamic Work</span>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className={`text-sm font-semibold transition-colors hover:text-primary ${pathname === link.href ? 'text-primary' : 'text-primary/70'}`}
            >
              {link.name}
            </Link>
          ))}
          <Button asChild className="bg-primary text-white hover:bg-primary/90 rounded-full font-headline font-bold px-8 h-12 shadow-lg transition-all hover:translate-y-[-2px] hover:shadow-primary/20">
            <Link href="/donate">Donate Now</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
