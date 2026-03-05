"use client"

import { Button } from "@/components/ui/button"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import Image from "next/image"
import { ArrowRight, Users, Heart, Globe } from "lucide-react"
import Link from "next/link"

export function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-bg')
  const imageUrl = heroImage?.imageUrl || "https://picsum.photos/seed/hero-fallback/1200/600"

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
              Empowering 100,000+ Lives in 2026
            </div>
            <h1 className="text-5xl lg:text-7xl font-headline font-bold leading-[1.1] mb-6 text-foreground">
              Be the Reason a <span className="text-primary italic">Child Goes to School</span> Today.
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
              In the face of crisis, your compassion is the bridge to a better tomorrow. Join a global community dedicated to restoring dignity, health, and hope.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-white px-8 h-14 rounded-full text-lg font-headline font-bold shadow-xl transition-all hover:translate-y-[-2px]">
                <Link href="/donate">Give Hope Now <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="px-8 h-14 rounded-full text-lg font-headline font-bold border-primary text-primary hover:bg-primary/5">
                <Link href="/impact">Explore Our Impact</Link>
              </Button>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8 border-t pt-12">
              <div className="flex flex-col">
                <span className="text-3xl font-headline font-bold text-primary">120K+</span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Users className="w-3 h-3" /> Lives Impacted
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-headline font-bold text-primary">45</span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Globe className="w-3 h-3" /> Countries Reached
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-headline font-bold text-primary">98%</span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Heart className="w-3 h-3" /> Fund Efficiency
                </span>
              </div>
            </div>
          </div>

          <div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={imageUrl}
              alt={heroImage?.description || "Charity impact"}
              fill
              className="object-cover"
              data-ai-hint={heroImage?.imageHint || "children charity"}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white shrink-0">
                  <Heart className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h4 className="font-headline font-bold text-lg text-primary">Recent Impact</h4>
                  <p className="text-sm text-muted-foreground">Successfully funded clean water for 2 villages in Sub-Saharan Africa.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
