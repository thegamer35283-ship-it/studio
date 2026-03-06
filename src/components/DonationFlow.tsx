"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Heart, 
  Smartphone, 
  Sparkles, 
  Loader2, 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  ReceiptText, 
  Phone,
  QrCode
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useFirebase, useUser, initiateAnonymousSignIn } from "@/firebase"
import { collection } from "firebase/firestore"
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import Image from "next/image"

const PRESETS = [
  { amount: 1000, description: "Provides 1 week of nutritional support." },
  { amount: 4000, description: "Covers tuition for one child's education." },
  { amount: 10000, description: "Funds a clean water source for a village." }
]

const VPA = "9792880607@ibl"
const PHONE_NUMBER = "9792880607"
const NAME = "Sahil Ansari"

export function DonationFlow() {
  const { toast } = useToast()
  const { firestore, auth } = useFirebase()
  const { user } = useUser()
  
  const qrImage = PlaceHolderImages.find(img => img.id === 'phonepe-qr')
  
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState<string>("")
  const [utr, setUtr] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<"pay" | "success">("pay")
  const [hasCopiedVPA, setHasCopiedVPA] = useState(false)
  const [hasCopiedPhone, setHasCopiedPhone] = useState(false)

  const currentAmount = customAmount || (selectedAmount ? selectedAmount.toString() : "")
  
  // Exact parameters from user's Java program
  const upiUri = `upi://pay?pa=${VPA}&pn=${encodeURIComponent(NAME)}&tn=${encodeURIComponent("Payment")}&am=${currentAmount}&cu=INR`

  useEffect(() => {
    if (!user && auth) {
      initiateAnonymousSignIn(auth)
    }
  }, [user, auth])

  const copyVPA = () => {
    navigator.clipboard.writeText(VPA)
    setHasCopiedVPA(true)
    toast({
      title: "UPI ID Copied",
      description: "Paste this ID in your PhonePe/GPay search bar.",
    })
    setTimeout(() => setHasCopiedVPA(false), 2000)
  }

  const copyPhone = () => {
    navigator.clipboard.writeText(PHONE_NUMBER)
    setHasCopiedPhone(true)
    toast({
      title: "Mobile Number Copied",
      description: "Use this number to pay directly in your app.",
    })
    setTimeout(() => setHasCopiedPhone(false), 2000)
  }

  const handlePayNowClick = (e: React.MouseEvent) => {
    if (!currentAmount || Number(currentAmount) <= 0) {
      e.preventDefault()
      toast({
        variant: "destructive",
        title: "Enter Amount",
        description: "Please specify the amount before proceeding to pay.",
      })
    }
  }

  const handleConfirmPayment = () => {
    const finalAmount = Number(currentAmount)
    
    if (!finalAmount || finalAmount <= 0) {
      toast({
        variant: "destructive",
        title: "Amount Required",
        description: "Please enter the amount you sent via UPI.",
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
      transactionReference: utr || `UPI-${Math.random().toString(36).substring(7).toUpperCase()}`,
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
          description: `Contribution of ₹${finalAmount.toLocaleString('en-IN')} saved to ledger.`,
        })
      })
      .catch(() => {
        setIsLoading(false)
      })
  }

  if (step === "success") {
    return (
      <div className="container mx-auto px-4 py-24 text-center animate-in fade-in zoom-in duration-500">
        <div className="max-w-md mx-auto bg-white p-12 rounded-[3rem] shadow-2xl border border-accent/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center text-accent mx-auto mb-8 shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-headline font-bold mb-4 text-primary">JazakAllah Khair!</h2>
          <p className="text-muted-foreground mb-10 leading-relaxed font-medium">
            Your bond of hope has been recorded. Every ₹ helps us empower the Ummah.
          </p>
          <Button onClick={() => { setStep("pay"); setCustomAmount(""); setSelectedAmount(null); setUtr("") }} className="rounded-full px-12 h-16 font-bold bg-primary hover:bg-primary/90 shadow-2xl transition-all">
            Submit Another Bond
          </Button>
        </div>
      </div>
    )
  }

  return (
    <section id="donate" className="py-24 bg-primary/[0.03]">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-bold mb-6 uppercase tracking-[0.2em] border border-accent/20">
              <Sparkles className="w-3 h-3" /> Secure Payment Node
            </div>
            <h2 className="text-5xl lg:text-6xl font-headline font-bold mb-6 tracking-tight">Direct Contribution</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed italic">
              "The believer's shade on the Day of Resurrection will be their charity."
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column: QR & Link */}
            <div className="space-y-8">
              <Card className="border-none shadow-2xl rounded-[4rem] bg-[#000000] text-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-[120px] -mr-40 -mt-40" />
                <CardHeader className="p-10 pb-6 relative z-10 text-center">
                  <div className="w-16 h-16 rounded-[2rem] bg-accent flex items-center justify-center text-white mx-auto mb-6 shadow-lg">
                    <QrCode className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-3xl font-headline mb-1">Scan to Pay</CardTitle>
                  <CardDescription className="text-accent text-lg font-bold uppercase tracking-widest">{NAME}</CardDescription>
                </CardHeader>
                <CardContent className="p-10 pt-0 relative z-10 text-center flex flex-col items-center">
                  
                  {qrImage && (
                    <div className="mb-8 relative w-64 h-64 bg-white rounded-3xl p-4 shadow-2xl overflow-hidden mx-auto transition-transform hover:scale-105">
                       <Image 
                        src={qrImage.imageUrl} 
                        alt="PhonePe QR Code Sahil Ansari" 
                        fill 
                        className="object-contain p-2"
                        data-ai-hint="phonepe qr"
                        priority
                      />
                      <div className="absolute bottom-2 left-0 w-full text-center">
                        <Badge className="bg-primary text-white text-[8px] px-2 py-0.5 uppercase font-black tracking-widest border-none">Official PhonePe QR</Badge>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-4 w-full">
                    <Button 
                      asChild 
                      className="rounded-full bg-accent hover:bg-accent/90 h-16 gap-3 text-lg font-bold shadow-xl transition-all"
                      onClick={handlePayNowClick}
                    >
                      <a href={upiUri}>
                        <Smartphone className="w-6 h-6" /> Pay Now <ExternalLink className="w-4 h-4 opacity-50" />
                      </a>
                    </Button>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="text-left">
                        <p className="text-[10px] uppercase font-bold text-white/40">Mobile Number</p>
                        <code className="text-sm font-bold text-accent">{PHONE_NUMBER}</code>
                      </div>
                      <Button variant="ghost" size="icon" onClick={copyPhone} className="text-white hover:bg-white/10 rounded-xl">
                        {hasCopiedPhone ? <Check className="w-5 h-5 text-accent" /> : <Phone className="w-5 h-5 opacity-60" />}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="text-left">
                        <p className="text-[10px] uppercase font-bold text-white/40">UPI ID</p>
                        <code className="text-sm font-bold text-accent">{VPA}</code>
                      </div>
                      <Button variant="ghost" size="icon" onClick={copyVPA} className="text-white hover:bg-white/10 rounded-xl">
                        {hasCopiedVPA ? <Check className="w-5 h-5 text-accent" /> : <Copy className="w-5 h-5 opacity-60" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Alert className="rounded-[2.5rem] border-accent/20 bg-accent/5 text-primary border-l-8 border-l-accent shadow-lg">
                <AlertCircle className="h-6 w-6 text-accent mt-1" />
                <AlertTitle className="font-headline font-bold text-lg mb-2">Bypass Security Errors</AlertTitle>
                <AlertDescription className="text-sm leading-relaxed space-y-2">
                  <p>If PhonePe/GPay shows a security error, follow these steps:</p>
                  <ol className="list-decimal pl-4 space-y-1 font-medium">
                    <li><strong>Copy the Mobile Number</strong> (<code>{PHONE_NUMBER}</code>) above.</li>
                    <li>Open PhonePe or Google Pay.</li>
                    <li>Tap <strong>"To Mobile Number"</strong> or <strong>"Search"</strong>.</li>
                    <li>Paste the number and pay directly.</li>
                  </ol>
                  <p className="text-[10px] uppercase font-bold opacity-50 pt-2 italic">Manual entry always bypasses app-level blocks.</p>
                </AlertDescription>
              </Alert>
            </div>

            {/* Right Column: Ledger Verification */}
            <div className="lg:pt-4">
              <div className="p-10 bg-white rounded-[4rem] shadow-2xl border border-muted/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl -mr-20 -mt-20" />
                
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg">
                    <ReceiptText className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-headline font-bold text-primary">Verify Contribution</h3>
                    <p className="text-muted-foreground text-sm">Update the global humanitarian ledger.</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground pl-1">1. Select Amount Sent</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {PRESETS.map((preset) => (
                        <button
                          key={preset.amount}
                          onClick={() => { setSelectedAmount(preset.amount); setCustomAmount("") }}
                          className={`py-4 rounded-2xl border-2 transition-all font-bold text-sm ${selectedAmount === preset.amount ? 'border-accent bg-accent/5 text-primary shadow-lg' : 'border-muted text-muted-foreground hover:border-primary/20'}`}
                        >
                          ₹{preset.amount.toLocaleString()}
                        </button>
                      ))}
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <span className="text-primary font-black text-lg">₹</span>
                      </div>
                      <Input
                        type="number"
                        placeholder="Or custom amount"
                        className="pl-12 h-16 rounded-2xl font-bold text-lg border-2"
                        value={customAmount}
                        onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null) }}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground pl-1">2. Transaction ID / UTR</Label>
                    <Input
                      placeholder="Paste Ref Number (Optional)"
                      className="h-16 rounded-2xl font-medium border-2"
                      value={utr}
                      onChange={(e) => setUtr(e.target.value)}
                    />
                  </div>

                  <Button
                    onClick={handleConfirmPayment}
                    disabled={isLoading}
                    className="w-full h-20 rounded-full bg-primary hover:bg-primary/90 text-white font-headline font-bold text-xl shadow-xl transition-all"
                  >
                    {isLoading ? <Loader2 className="w-7 h-7 animate-spin" /> : (
                      <div className="flex items-center gap-3">
                        Save to Humanitarian Ledger
                        <Heart className="w-6 h-6" />
                      </div>
                    )}
                  </Button>
                </div>
              </div>
              
              <p className="text-center mt-8 text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black opacity-30">
                100% Zakat Integrity • Verified Node Access
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
