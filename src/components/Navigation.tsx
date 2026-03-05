
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg transition-transform group-hover:scale-105">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <span className="font-headline text-2xl font-bold text-primary">Benevolent Bonds</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="#impact" className="text-sm font-medium hover:text-primary transition-colors">Our Impact</Link>
          <Link href="#transparency" className="text-sm font-medium hover:text-primary transition-colors">Transparency</Link>
          <Link href="#campaigns" className="text-sm font-medium hover:text-primary transition-colors">Campaigns</Link>
          <Button asChild className="bg-accent text-white hover:bg-accent/90 rounded-full font-headline font-semibold px-6 shadow-md transition-all hover:translate-y-[-2px]">
            <Link href="#donate">Donate Now</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
