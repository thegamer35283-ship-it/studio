
"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Heart, ArrowLeft } from "lucide-react"

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-muted/20 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl border border-primary/10 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-8">
          <Heart className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-headline font-bold mb-4">Payments Disabled</h1>
        <p className="text-muted-foreground mb-10 leading-relaxed">
          Direct online contributions are currently disabled. Please contact our field office at <strong>9792880607</strong> for other ways to support our mission.
        </p>
        <Button asChild className="rounded-full px-8 h-12 gap-2">
          <Link href="/"><ArrowLeft className="w-4 h-4" /> Return Home</Link>
        </Button>
      </div>
    </div>
  )
}
