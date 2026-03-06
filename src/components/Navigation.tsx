
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Moon, User, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"
import { useUser, useAuth, initiateAnonymousSignIn } from "@/firebase"
import { signOut } from "firebase/auth"

export function Navigation() {
  const pathname = usePathname()
  const { user, isUserLoading } = useUser()
  const auth = useAuth()

  const links = [
    { name: "Our Impact", href: "/impact" },
    { name: "Transparency", href: "/transparency" },
    { name: "Communities", href: "/communities" },
    { name: "Our Team", href: "/team" },
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
        
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className={`text-sm font-semibold transition-colors hover:text-primary ${pathname === link.href ? 'text-primary' : 'text-primary/70'}`}
            >
              {link.name}
            </Link>
          ))}

          <div className="flex items-center gap-4 border-l pl-8 border-border">
            {isUserLoading ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => signOut(auth)} className="rounded-full text-destructive">
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => initiateAnonymousSignIn(auth)} className="rounded-full gap-2">
                <User className="w-4 h-4" /> Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
