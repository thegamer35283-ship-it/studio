
import { Navigation } from "@/components/Navigation"
import { Hero } from "@/components/Hero"
import { TrustSignals } from "@/components/TrustSignals"
import { DonationFlow } from "@/components/DonationFlow"
import { ImpactNarratives } from "@/components/ImpactNarratives"
import { Footer } from "@/components/Footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow">
        <Hero />
        <TrustSignals />
        <DonationFlow />
        <ImpactNarratives />
      </main>
      <Footer />
    </div>
  )
}
