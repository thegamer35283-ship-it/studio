"use client"

import { ImpactNarratives } from "@/components/ImpactNarratives"
import { Globe, Heart, Users } from "lucide-react"

export default function ImpactPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-accent/5 py-24 border-b">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold mb-6 uppercase tracking-widest">
            <Heart className="w-3 h-3 fill-current" /> Real Change, Real Stories
          </div>
          <h1 className="text-5xl font-headline font-bold mb-6">The Collective Impact</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Witness the transformation powered by your compassion. In 2026, we've strengthened more bonds than ever before.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {[
              { label: "Lives Impacted", value: "124,000+", icon: <Users className="w-5 h-5" /> },
              { label: "Villages Served", value: "450", icon: <Globe className="w-5 h-5" /> },
              { label: "Education Funds", value: "₹2.4 Cr", icon: <Heart className="w-5 h-5" /> },
              { label: "Global Reach", value: "18 Countries", icon: <Globe className="w-5 h-5" /> }
            ].map((stat, i) => (
              <div key={i} className="p-6 bg-white rounded-3xl shadow-sm border border-accent/10">
                <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4">
                  {stat.icon}
                </div>
                <div className="text-2xl font-headline font-bold text-primary">{stat.value}</div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ImpactNarratives />
    </div>
  )
}
