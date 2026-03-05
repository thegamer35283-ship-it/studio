
"use client"

import { ShieldCheck, FileText, Landmark, Lock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function TrustSignals() {
  const transparencyItems = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-accent" />,
      title: "NGO Registration",
      details: "Official Registration: #12345-NGO (Registered 2012)"
    },
    {
      icon: <FileText className="w-8 h-8 text-accent" />,
      title: "Financial Transparency",
      details: "Audit Report 2025 available for public review."
    },
    {
      icon: <Landmark className="w-8 h-8 text-accent" />,
      title: "Ethical Sourcing",
      details: "Adhering to strict Shariah compliance standards."
    },
    {
      icon: <Lock className="w-8 h-8 text-accent" />,
      title: "Verified Security",
      details: "SSL Protected and GDPR Compliant operations."
    }
  ]

  return (
    <section id="transparency" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-headline font-bold mb-4">Radical Transparency</h2>
          <p className="text-muted-foreground">Your trust is our most valuable asset. We maintain the highest standards of accountability in everything we do.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {transparencyItems.map((item, idx) => (
            <Card key={idx} className="border-none shadow-none bg-primary/[0.02] rounded-3xl group hover:bg-primary/[0.05] transition-colors">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="mb-6 p-4 bg-white rounded-2xl shadow-sm transition-transform group-hover:scale-110">
                  {item.icon}
                </div>
                <h3 className="font-headline font-bold text-xl mb-2 text-primary">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.details}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-8 opacity-40 grayscale">
          {/* Simulated logos/badges */}
          <div className="h-12 w-32 bg-gray-300 rounded-md"></div>
          <div className="h-12 w-32 bg-gray-300 rounded-md"></div>
          <div className="h-12 w-32 bg-gray-300 rounded-md"></div>
          <div className="h-12 w-32 bg-gray-300 rounded-md"></div>
        </div>
      </div>
    </section>
  )
}
