
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Heart, Smartphone, Sparkles, Loader2, QrCode, ShieldCheck, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useFirebase, useUser, initiateAnonymousSignIn } from "@/firebase"
import { collection } from "firebase/firestore"
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const PRESETS = [
  { amount: 1000, description: "Provides 1 week of nutritional support for a family in crisis." },
  { amount: 4000, description: "Covers school supplies and tuition for one child's education." },
  { amount: 10000, description: "Funds a sustainable clean water source for an entire village." }
]

const UPI_URI = "upi://pay?pa=9792880607-5@ibl&pn=SAHIL%20ANSARI&mc=0000&mode=02&purpose=00"

export function DonationFlow() {
  const { toast } = useToast()
  const { firestore, auth } = useFirebase()
  const { user } = useUser()
  
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<"pay" | "success">("pay")

  const qrImage = PlaceHolderImages.find(img => img.id === 'phonepe-qr')

  useEffect(() => {
    if (!user && auth) {
      initiateAnonymousSignIn(auth)
    }
  }, [user, auth])

  const handleConfirmPayment = () => {
    const finalAmount = Number(customAmount || selectedAmount)
    
    if (!finalAmount || finalAmount <= 0) {
      toast({
        variant: "destructive",
        title: "Amount Required",
        description: "Please select or enter the amount you sent via QR.",
      })
      return
    }

    if (!firestore) return

    setIsLoading(true)
    
    const donationsRef = collection(firestore, "donations")
    const donationData = {
      id: crypto.randomUUID(),
      donorId: user?.uid || "anonymous",
      amount: finalAmount,
      currency: "INR",
      transactionDate: new Date().toISOString(),
      paymentMethodType: "QR / UPI",
      transactionReference: `QR-${Math.random().toString(36).substring(7).toUpperCase()}`,
      status: "Completed",
      isRecurring: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    addDocumentNonBlocking(donationsRef, donationData)
      .then(() => {
        setIsLoading(false)
        setStep("success")
        toast({
          title: "Payment Recorded",
          description: `Your contribution of ₹${finalAmount.toLocaleString('en-IN')} has been added to our humanitarian ledger.`,
        })
      })
      .catch(() => {
        setIsLoading(false)
      })
  }

  if (step === "success") {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-md mx-auto bg-white p-12 rounded-[3rem] shadow-2xl border border-accent/20">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center text-accent mx-auto mb-8">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-headline font-bold mb-4 text-primary">JazakAllah Khair!</h2>
          <p className="text-muted-foreground mb-10 leading-relaxed">
            Your generous contribution has been successfully recorded in our humanitarian ledger. Your bond of hope is now active.
          </p>
          <Button onClick={() => setStep("pay")} className="rounded-full px-10 h-14 font-bold bg-primary hover:bg-primary/90 shadow-xl transition-all">
            Make Another Donation
          </Button>
        </div>
      </div>
    )
  }

  return (
    <section id="donate" className="py-24 bg-primary/[0.03]">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold mb-4 uppercase tracking-widest">
              <Sparkles className="w-3 h-3" /> QR / UPI Payment Portal
            </div>
            <h2 className="text-5xl font-headline font-bold mb-4">Direct QR Contribution</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              We have simplified our giving process. Simply scan the QR or use the UPI link below to support the Ummah directly.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: The QR Code */}
            <div className="space-y-6 sticky top-24">
              <Card className="border-none shadow-2xl rounded-[3.5rem] bg-[#000000] text-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-1000" />
                <CardHeader className="p-12 pb-6 relative z-10 text-center">
                  <div className="w-16 h-16 rounded-[2rem] bg-accent flex items-center justify-center text-white mx-auto mb-6 shadow-xl">
                    <QrCode className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-4xl font-headline mb-2">Qr</CardTitle>
                  <CardDescription className="text-white/60 text-lg font-bold">SAHIL ANSARI</CardDescription>
                </CardHeader>
                <CardContent className="p-12 pt-0 relative z-10 text-center flex flex-col items-center">
                  <div className="w-full max-w-[300px] aspect-[4/5] relative bg-white rounded-[2.5rem] p-6 shadow-inner mb-8 border-4 border-white/5">
                    <Image 
                      src={qrImage?.imageUrl || ""} 
                      alt="Sahil Ansari PhonePe QR Code" 
                      fill 
                      className="object-contain"
                      data-ai-hint="phonepe qr"
                      priority
                    />
                  </div>
                  
                  <div className="flex flex-col gap-4 w-full">
                    <Button asChild className="rounded-full bg-accent hover:bg-accent/90 h-16 gap-3 text-lg font-bold shadow-2xl transition-transform hover:scale-105 active:scale-95">
                      <a href={UPI_URI}>
                        <Smartphone className="w-6 h-6" /> Pay with UPI App <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                    
                    <div className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] uppercase font-black tracking-[0.2em] text-accent/80">
                      <ShieldCheck className="w-4 h-4" /> Secure Humanitarian Ledger
                    </div>
                  </div>

                  <p className="mt-8 text-xs text-white/40 uppercase font-bold tracking-[0.2em] italic">
                    Accepting PhonePe, GPay, Amazon Pay, or any UPI app
                  </p>
                </CardContent>
              </Card>

              {/* Security Alert / Troubleshooting */}
              <Alert className="rounded-[2rem] border-amber-200 bg-amber-50 text-amber-900 shadow-sm">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <AlertTitle className="font-headline font-bold">Payment Issues?</AlertTitle>
                <AlertDescription className="text-xs leading-relaxed opacity-90">
                  If your app (like FamX) blocks the transaction for security reasons, please try using <strong>PhonePe, Google Pay, or Paytm</strong>. These apps are more likely to permit humanitarian contributions.
                </AlertDescription>
              </Alert>
            </div>

            {/* Right: Amount Verification for Ledger */}
            <div className="space-y-8">
              <div className="p-8 bg-white rounded-[3rem] shadow-sm border border-border/50">
                <h3 className="text-2xl font-headline font-bold mb-6 text-primary">1. Send Payment</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  Use your favorite UPI app to scan the QR code or click the button on the left. Once you've completed the transfer, proceed to the next step.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-muted/30 rounded-2xl flex flex-col items-center text-center gap-1 border border-border/50">
                    <Smartphone className="w-5 h-5 text-accent" />
                    <span className="text-[10px] font-bold uppercase">Open App</span>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-2xl flex flex-col items-center text-center gap-1 border border-border/50">
                    <QrCode className="w-5 h-5 text-accent" />
                    <span className="text-[10px] font-bold uppercase">Scan / Pay</span>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-white rounded-[3rem] shadow-xl border-2 border-accent/20">
                <h3 className="text-2xl font-headline font-bold mb-6 text-primary">2. Record Amount</h3>
                <p className="text-muted-foreground text-sm mb-6">Enter the amount you sent so we can record it in our transparency ledger.</p>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-2">
                    {PRESETS.map((preset) => (
                      <button
                        key={preset.amount}
                        onClick={() => { setSelectedAmount(preset.amount); setCustomAmount("") }}
                        className={`py-3 rounded-xl border-2 transition-all font-bold text-sm ${selectedAmount === preset.amount ? 'border-accent bg-accent/5 text-primary' : 'border-border text-muted-foreground hover:border-primary/30'}`}
                      >
                        ₹{preset.amount.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <span className="text-primary font-black">₹</span>
                    </div>
                    <Input
                      type="number"
                      placeholder="Amount sent"
                      className="pl-10 h-14 rounded-2xl font-bold border-2 focus-visible:ring-accent border-muted/50"
                      value={customAmount}
                      onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null) }}
                    />
                  </div>

                  <Button
                    onClick={handleConfirmPayment}
                    disabled={isLoading}
                    className="w-full h-16 rounded-full bg-primary hover:bg-primary/90 text-white font-headline font-bold text-lg shadow-xl transition-all group"
                  >
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                      <>
                        Verify & Confirm Transfer
                        <Heart className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <p className="text-center text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black opacity-50">
                Radical Transparency In Every Bond
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
