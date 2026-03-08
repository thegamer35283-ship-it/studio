import { Hero } from "@/components/Hero"
import { TrustSignals } from "@/components/TrustSignals"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Globe, ShieldCheck, Heart, Sparkles } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      
      {/* Quick Access Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6 uppercase tracking-widest">
            <Sparkles className="w-3 h-3" /> Participation Channels
          </div>
          <h2 className="text-4xl font-headline font-bold mb-12">How You Can Participate</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm hover-lift border border-primary/5">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-headline font-bold mb-4">Support Communities</h3>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">Explore the specific villages and regions we are strengthening through our infrastructure projects.</p>
              <Button asChild variant="outline" className="rounded-full h-12 px-6">
                <Link href="/communities">View Regions <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-xl hover-lift border-2 border-accent/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mx-auto mb-6 relative z-10">
                <Heart className="w-7 h-7 fill-current" />
              </div>
              <h3 className="text-2xl font-headline font-bold mb-4 relative z-10">Direct Support</h3>
              <p className="text-muted-foreground text-sm mb-8 leading-relaxed relative z-10">Contribute directly via Mobile Number to empower the mission instantly with radical transparency.</p>
              <Button asChild className="rounded-full bg-accent hover:bg-accent/90 h-14 px-10 text-lg font-bold shadow-lg shadow-accent/20 relative z-10">
                <Link href="/donate">Donate Now <Heart className="ml-2 w-5 h-5 fill-current" /></Link>
              </Button>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm hover-lift border border-primary/5">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-headline font-bold mb-4">Our Impact</h3>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">Understand the tangible results and verified success stories of our global initiatives.</p>
              <Button asChild variant="outline" className="rounded-full h-12 px-6">
                <Link href="/impact">See Impact <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <TrustSignals />
    </div>
  )
}
