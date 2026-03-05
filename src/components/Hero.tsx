
"use client"

import { Button } from "@/components/ui/button"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import Image from "next/image"
import { ArrowRight, Users, Moon, Globe } from "lucide-react"
import Link from "next/link"

export function Hero() {
  const mainImage = PlaceHolderImages.find(img => img.id === 'hero-main')
  const bgImage = PlaceHolderImages.find(img => img.id === 'hero-bg')
  
  const mainImageUrl = mainImage?.imageUrl || "https://picsum.photos/seed/islamic-group-313/1024/1024"
  const bgImageUrl = bgImage?.imageUrl || "https://picsum.photos/seed/islamic-night-bg/1920/1080"

  return (
    <section className="relative py-24 lg:py-36 overflow-hidden min-h-[80vh] flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImageUrl}
          alt="Islamic background"
          fill
          className="object-cover"
          data-ai-hint={bgImage?.imageHint || "mosque night"}
          priority
        />
        <div className="absolute inset-0 bg-primary/80 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/60 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent-foreground text-sm font-bold mb-8 border border-accent/30 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              Empowering the Ummah Worldwide
            </div>
            <h1 className="text-5xl lg:text-7xl font-headline font-bold leading-[1.1] mb-8">
              Invest in <span className="text-accent italic">Islamic Work</span> & Change Lives Forever.
            </h1>
            <p className="text-xl text-primary-foreground/80 mb-12 max-w-lg leading-relaxed">
              Islamic Group 313 is dedicated to supporting communities through faith-driven initiatives. Join us in strengthening the bonds of humanity.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-white px-10 h-16 rounded-full text-xl font-headline font-bold shadow-2xl transition-all hover:translate-y-[-4px]">
                <Link href="/donate">Donate Now <ArrowRight className="ml-2 w-6 h-6" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="px-10 h-16 rounded-full text-xl font-headline font-bold border-white/40 text-white hover:bg-white/10 backdrop-blur-sm">
                <Link href="/impact">See the Impact</Link>
              </Button>
            </div>

            <div className="mt-20 grid grid-cols-3 gap-10 border-t border-white/10 pt-12">
              <div className="flex flex-col">
                <span className="text-4xl font-headline font-bold text-accent">313+</span>
                <span className="text-sm text-primary-foreground/60 flex items-center gap-2 mt-1">
                  <Users className="w-4 h-4" /> Core Projects
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-4xl font-headline font-bold text-accent">45</span>
                <span className="text-sm text-primary-foreground/60 flex items-center gap-2 mt-1">
                  <Globe className="w-4 h-4" /> Countries
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-4xl font-headline font-bold text-accent">100%</span>
                <span className="text-sm text-primary-foreground/60 flex items-center gap-2 mt-1">
                  <Moon className="w-4 h-4" /> Zakat Policy
                </span>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative h-[600px] w-full rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)] bg-black/20 backdrop-blur-sm border border-white/10">
              <Image
                src={mainImageUrl}
                alt={mainImage?.description || "Islamic Group 313 Branding"}
                fill
                className="object-contain p-8"
                data-ai-hint={mainImage?.imageHint || "kaaba mosque"}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-10 left-10 right-10 bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] border border-white/20 shadow-2xl">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center text-white shrink-0 shadow-lg">
                    <Moon className="w-8 h-8 fill-current" />
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-2xl text-white">Islamic Group 313</h4>
                    <p className="text-primary-foreground/70 italic text-sm">"Strengthening bonds through Islamic work and charity."</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/40 rounded-full blur-3xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
