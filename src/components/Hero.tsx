
"use client"

import { Button } from "@/components/ui/button"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import Image from "next/image"
import { ArrowRight, Users, Moon, Globe } from "lucide-react"
import Link from "next/link"

export function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-main')
  const imageUrl = heroImage?.imageUrl || "https://picsum.photos/seed/islamic-group-313/1024/1024"

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="z-10 relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Empowering the Ummah Worldwide
            </div>
            <h1 className="text-5xl lg:text-7xl font-headline font-bold leading-[1.1] mb-6 text-foreground">
              Invest in <span className="text-primary italic">Islamic Work</span> & Change Lives Forever.
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
              Islamic Group 313 is dedicated to supporting communities through faith-driven initiatives. Join us in strengthening the bonds of humanity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-white px-8 h-14 rounded-full text-lg font-headline font-bold shadow-xl transition-all hover:translate-y-[-2px]">
                <Link href="/donate">Donate for Islamic Work <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="px-8 h-14 rounded-full text-lg font-headline font-bold border-primary text-primary hover:bg-primary/5">
                <Link href="/impact">See the Impact</Link>
              </Button>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8 border-t pt-12">
              <div className="flex flex-col">
                <span className="text-3xl font-headline font-bold text-primary">313+</span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Users className="w-3 h-3" /> Core Projects
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-headline font-bold text-primary">45</span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Globe className="w-3 h-3" /> Countries Served
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-headline font-bold text-primary">100%</span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Moon className="w-3 h-3" /> Zakat Policy
                </span>
              </div>
            </div>
          </div>

          <div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl bg-black">
            <Image
              src={imageUrl}
              alt={heroImage?.description || "Islamic Group 313 Branding"}
              fill
              className="object-contain p-4"
              data-ai-hint={heroImage?.imageHint || "kaaba mosque"}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white shrink-0">
                  <Moon className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h4 className="font-headline font-bold text-lg text-primary">Islamic Group 313</h4>
                  <p className="text-sm text-muted-foreground italic">"Strengthening bonds through Islamic work and charity."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
