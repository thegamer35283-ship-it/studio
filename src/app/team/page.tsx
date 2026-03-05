
"use client"

import { StaffSection } from "@/components/StaffSection"
import { ShieldCheck, Heart, Moon } from "lucide-react"

export default function TeamPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-primary text-primary-foreground py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[120px] -mr-48 -mt-48" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold mb-6 uppercase tracking-[0.3em] backdrop-blur-md border border-white/20">
            <Moon className="w-3 h-3 fill-current" /> Islamic Group 313
          </div>
          <h1 className="text-6xl font-headline font-bold mb-8 text-white tracking-tighter">Our Human Assets</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
            The dedicated individuals working on the ground to empower the Ummah. Every team member is committed to radical transparency and divine service.
          </p>
          
          <div className="flex justify-center gap-12 mt-16 opacity-60">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-accent" />
              <span className="text-xs font-bold uppercase tracking-widest">Verified Identity</span>
            </div>
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-accent" />
              <span className="text-xs font-bold uppercase tracking-widest">Mission Focused</span>
            </div>
          </div>
        </div>
      </div>

      <StaffSection />

      <section className="py-24 bg-accent/5 border-t border-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-headline font-bold mb-6 text-primary">Join the Mission</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-10 italic">
            "Whosoever saves a life, it is as if he had saved mankind entirely."
          </p>
          <div className="inline-block p-8 bg-white rounded-[3rem] shadow-xl border border-accent/20">
            <p className="text-sm font-bold text-primary mb-2">Want to volunteer or join our team?</p>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Contact our field office at: <span className="text-accent">9792880607</span></p>
          </div>
        </div>
      </section>
    </div>
  )
}
