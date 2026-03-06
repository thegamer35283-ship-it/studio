"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Heart, Copy, Check, ArrowLeft, Phone } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function DonatePage() {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  const mobileNumber = "9792880607"

  const handleCopy = () => {
    navigator.clipboard.writeText(mobileNumber)
    setCopied(true)
    toast({
      title: "Number Copied",
      description: "You can now paste this into PhonePe or GPay.",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-muted/20 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="mb-8 text-center">
          <Button asChild variant="ghost" className="rounded-full gap-2 text-muted-foreground hover:text-primary">
            <Link href="/"><ArrowLeft className="w-4 h-4" /> Back to Home</Link>
          </Button>
        </div>

        <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
          <CardHeader className="bg-primary text-primary-foreground p-10 text-center">
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
              <Heart className="w-10 h-10 text-accent fill-current" />
            </div>
            <CardTitle className="text-3xl font-headline font-bold mb-2 text-white">Support the Mission</CardTitle>
            <CardDescription className="text-primary-foreground/70">
              Your contribution directly empowers the Ummah.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-10 space-y-8">
            <div className="text-center">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Direct Payment via PhonePe / GPay</p>
              <div className="flex items-center justify-center gap-4 p-6 bg-muted/30 rounded-3xl border border-dashed border-primary/20 group">
                <Phone className="w-6 h-6 text-primary" />
                <span className="text-3xl font-headline font-bold tracking-tighter text-primary">
                  {mobileNumber}
                </span>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="rounded-full hover:bg-primary/10"
                  onClick={handleCopy}
                >
                  {copied ? <Check className="w-5 h-5 text-accent" /> : <Copy className="w-5 h-5 text-muted-foreground" />}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-sm text-primary uppercase tracking-wider">How to pay:</h4>
              <ul className="space-y-3">
                {[
                  "Copy the mobile number above.",
                  "Open your payment app (PhonePe, GPay, FamX).",
                  "Select 'To Mobile Number' or 'Search'.",
                  "Paste the number and complete your transfer."
                ].map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-muted text-center">
              <p className="text-xs text-muted-foreground italic">
                For verification or questions, please call the number directly.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
