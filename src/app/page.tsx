import { Hero } from "@/components/Hero"
import { TrustSignals } from "@/components/TrustSignals"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Heart, Globe, ShieldCheck } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      
      {/* Quick Access Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-headline font-bold mb-12">How You Can Help</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm hover-lift">
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mx-auto mb-6">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-headline font-bold mb-4">Direct Donation</h3>
              <p className="text-muted-foreground text-sm mb-6">Make a one-time or monthly contribution to our most urgent campaigns.</p>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/donate">Give Now <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm hover-lift">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-headline font-bold mb-4">Support Communities</h3>
              <p className="text-muted-foreground text-sm mb-6">See the specific villages and regions your bonds are strengthening.</p>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/communities">View Regions <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm hover-lift">
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mx-auto mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-headline font-bold mb-4">Track Your Impact</h3>
              <p className="text-muted-foreground text-sm mb-6">Use our AI tools to understand the tangible results of your support.</p>
              <Button asChild variant="outline" className="rounded-full">
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
