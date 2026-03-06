
"use client"

import { TrustSignals } from "@/components/TrustSignals"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, ShieldCheck, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TransparencyPage() {
  const reports = [
    { title: "Annual Impact Report 2025", type: "PDF - 4.2MB", date: "Dec 2025" },
    { title: "Financial Audit Statement", type: "PDF - 1.8MB", date: "Jan 2026" },
    { title: "Zakat Compliance Certificate", type: "PDF - 1.1MB", date: "Ongoing" },
    { title: "NGO Registration Documents", type: "PDF - 2.5MB", date: "Updated" }
  ]

  return (
    <div className="min-h-screen">
      <div className="bg-primary text-primary-foreground py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-headline font-bold mb-6 text-white">Trust & Transparency Hub</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            We believe that every donor has the right to know exactly where their contribution goes. Explore our reports and certifications.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reports.map((report, i) => (
            <Card key={i} className="border-none shadow-xl rounded-3xl bg-white hover-lift">
              <CardHeader>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <FileText className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg font-headline">{report.title}</CardTitle>
                <CardDescription>{report.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-4">{report.type}</p>
                <div className="mb-4">
                  <Badge variant="secondary" className="rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-widest">Verified Document</Badge>
                </div>
                <Button variant="outline" className="w-full rounded-full gap-2">
                  <Download className="w-4 h-4" /> Download
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <TrustSignals />

      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-headline font-bold mb-6">Our Commitment to Accountability</h2>
              <ul className="space-y-4">
                {[
                  "100% Zakat Policy: All Zakat funds go directly to eligible recipients.",
                  "Zero Admin Fees on Emergency Relief: We cover admin costs through specific grants.",
                  "Real-time Tracking: GPS-tagged project updates for infrastructure projects.",
                  "Independent Audits: Quarterly reviews by top-tier financial firms."
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-primary/10 p-12 rounded-[3rem] flex flex-col items-center text-center">
              <ShieldCheck className="w-20 h-20 text-primary mb-6" />
              <h3 className="text-2xl font-headline font-bold mb-2">Verified Bond</h3>
              <p className="text-sm text-muted-foreground">Every donation is encrypted and tracked using our secure humanitarian ledger.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
