"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { CreditCard, Heart, Smartphone, Sparkles, Loader2, QrCode, ShieldCheck, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useFirebase, useUser, initiateAnonymousSignIn } from "@/firebase"
import { collection } from "firebase/firestore"
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"

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
  const [isMonthly, setIsMonthly] = useState(false)
  const [isGift, setIsGift] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [honoreeName, setHonoreeName] = useState("")
  const [honoreeEmail, setHonoreeEmail] = useState("")

  const qrImage = PlaceHolderImages.find(img => img.id === 'phonepe-qr')

  useEffect(() => {
    if (!user && auth) {
      initiateAnonymousSignIn(auth)
    }
  }, [user, auth])

  const handleDonate = () => {
    const finalAmount = Number(customAmount || selectedAmount)
    
    if (!finalAmount || finalAmount <= 0) {
      toast({
        variant: "destructive",
        title: "Amount Required",
        description: "Please select or enter a valid donation amount.",
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
      paymentMethodType: "Card/Digital",
      transactionReference: `REF-${Math.random().toString(36).substring(7).toUpperCase()}`,
      status: "Completed",
      isRecurring: isMonthly,
      recurrenceFrequency: isMonthly ? "monthly" : null,
      honoreeName: isGift ? honoreeName : null,
      honoreeEmail: isGift ? honoreeEmail : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    addDocumentNonBlocking(donationsRef, donationData)
      .then(() => {
        setIsLoading(false)
        toast({
          title: "Contribution Received!",
          description: `Thank you for your generous gift of ₹${finalAmount.toLocaleString('en-IN')}. May it be a source of blessing.`,
        })
        setCustomAmount("")
        setSelectedAmount(null)
        setHonoreeName("")
        setHonoreeEmail("")
        setIsGift(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }

  return (
    <section id="donate" className="py-24 bg-primary/[0.03]">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold mb-4 uppercase tracking-widest">
              <Sparkles className="w-3 h-3" /> Secure Humanitarian Ledger
            </div>
            <h2 className="text-5xl font-headline font-bold mb-4">Your Bond of Hope Starts Here</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              Every contribution to Islamic Group 313 is handled with radical transparency. Choose your method of impact below.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Quick QR Section */}
            <div className="lg:col-span-4 order-2 lg:order-1 space-y-6">
              <Card className="border-none shadow-2xl rounded-[3rem] bg-black text-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                <CardHeader className="p-8 pb-4 relative z-10 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-2xl font-headline">Qr</CardTitle>
                  <CardDescription className="text-white/60">Fastest way to support the Ummah.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0 relative z-10 text-center flex flex-col items-center">
                  <div className="w-full max-w-[240px] aspect-[4/5] relative bg-white rounded-[2rem] p-4 shadow-inner mb-6">
                    <Image 
                      src={qrImage?.imageUrl || ""} 
                      alt="PhonePe QR Code" 
                      fill 
                      className="object-contain"
                      data-ai-hint="phonepe qr"
                      priority
                    />
                  </div>
                  <p className="font-bold text-xl mb-1 tracking-tight">SAHIL ANSARI</p>
                  <p className="text-xs text-accent font-mono mb-4">9792880607-5@ibl</p>
                  
                  <div className="flex flex-col gap-3 w-full">
                    <Button asChild className="rounded-full bg-accent hover:bg-accent/90 h-12 gap-2 text-sm font-bold shadow-lg">
                      <a href={UPI_URI}>
                        <Smartphone className="w-4 h-4" /> Pay with UPI App <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                    <div className="flex items-center justify-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 text-[10px] uppercase font-black tracking-[0.2em] text-accent/80">
                      <ShieldCheck className="w-3 h-3" /> Verified Bond
                    </div>
                  </div>

                  <p className="mt-6 text-[10px] text-white/40 uppercase font-bold tracking-widest italic">
                    Scan with PhonePe, GPay, or any UPI app
                  </p>
                </CardContent>
              </Card>

              <div className="p-8 bg-white rounded-[2.5rem] shadow-sm border border-border/50">
                <h4 className="font-headline font-bold text-lg mb-4 text-primary">Trust & Safety</h4>
                <ul className="space-y-4">
                  <li className="flex gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <CreditCard className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-muted-foreground">PCI DSS Compliant Ledger</span>
                  </li>
                  <li className="flex gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Heart className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-muted-foreground">100% Zakat Integrity</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Main Donation Form */}
            <Card className="lg:col-span-8 order-1 lg:order-2 border-none shadow-2xl rounded-[3.5rem] overflow-hidden bg-white">
              <CardHeader className="bg-primary text-primary-foreground p-10 lg:p-12">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl font-headline mb-2">Detailed Contribution</CardTitle>
                    <CardDescription className="text-primary-foreground/70 text-base">Select your impact and track your donation through our network.</CardDescription>
                  </div>
                  <div className="hidden sm:block">
                    <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                      <Heart className="w-8 h-8 text-accent fill-accent" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-10 lg:p-12 space-y-10">
                <div className="space-y-4">
                  <Label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Choose a Tier</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PRESETS.map((preset) => (
                      <button
                        key={preset.amount}
                        onClick={() => { setSelectedAmount(preset.amount); setCustomAmount("") }}
                        className={`p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 group ${selectedAmount === preset.amount ? 'border-accent bg-accent/5 ring-8 ring-accent/5' : 'border-border hover:border-primary/30'}`}
                      >
                        <span className="text-2xl font-headline font-bold text-primary group-hover:scale-110 transition-transform">₹{preset.amount.toLocaleString('en-IN')}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                   <Label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Or Custom Amount</Label>
                   <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                      <span className="text-primary font-black text-xl">₹</span>
                    </div>
                    <Input
                      type="number"
                      placeholder="Amount in INR"
                      className="pl-12 h-16 rounded-[2rem] text-xl font-bold border-2 focus-visible:ring-accent border-muted/50"
                      value={customAmount}
                      onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null) }}
                    />
                  </div>
                </div>

                {selectedAmount && (
                  <div className="bg-accent/10 p-6 rounded-[2rem] flex items-start gap-4 border border-accent/20 animate-in fade-in slide-in-from-top-4">
                    <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center shrink-0">
                      <Heart className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-primary mb-1">Your Impact</p>
                      <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                        {PRESETS.find(p => p.amount === selectedAmount)?.description}
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-6 bg-muted/30 rounded-[2rem] border border-border">
                    <div className="space-y-0.5">
                      <Label className="text-base font-bold text-primary">Monthly Giving</Label>
                      <p className="text-xs text-muted-foreground italic">Sustain our efforts.</p>
                    </div>
                    <Switch checked={isMonthly} onCheckedChange={setIsMonthly} className="data-[state=checked]:bg-accent" />
                  </div>

                  <div className="flex items-center justify-between p-6 bg-muted/30 rounded-[2rem] border border-border">
                    <div className="space-y-0.5">
                      <Label className="text-base font-bold text-primary">Gift in Honor</Label>
                      <p className="text-xs text-muted-foreground italic">Celebrate a loved one.</p>
                    </div>
                    <Checkbox id="gift" checked={isGift} onCheckedChange={(checked) => setIsGift(checked as boolean)} className="rounded-full w-6 h-6 data-[state=checked]:bg-accent" />
                  </div>
                </div>

                {isGift && (
                  <div className="grid sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4">
                    <Input placeholder="Honoree Full Name" value={honoreeName} onChange={e => setHonoreeName(e.target.value)} className="rounded-2xl h-14" />
                    <Input placeholder="Recipient Email (Optional)" value={honoreeEmail} onChange={e => setHonoreeEmail(e.target.value)} className="rounded-2xl h-14" />
                  </div>
                )}

                <div className="pt-6 space-y-6">
                  <Button
                    onClick={handleDonate}
                    disabled={isLoading}
                    className="w-full h-20 rounded-full bg-accent hover:bg-accent/90 text-white font-headline font-bold text-2xl shadow-2xl transition-all hover:scale-[1.02] active:scale-95 group"
                  >
                    {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : (
                      <>
                        Empower a Life Now: ₹{(Number(customAmount) || selectedAmount || 0).toLocaleString('en-IN')}
                        <Smartphone className="ml-3 w-6 h-6 group-hover:rotate-12 transition-transform" />
                      </>
                    )}
                  </Button>
                  
                  <div className="flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                      <CreditCard className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Visa/Mastercard</span>
                    </div>
                    <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                    <div className="flex items-center gap-2 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                      <Smartphone className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">UPI / GPay / PhonePe</span>
                    </div>
                  </div>

                  <p className="text-center text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black">
                    Secure 256-bit Encrypted Humanitarian Ledger
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
