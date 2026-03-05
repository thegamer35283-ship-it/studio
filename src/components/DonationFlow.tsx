
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { CreditCard, Heart, Apple, Smartphone, Gift } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const PRESETS = [
  { amount: 10, description: "Provides 5 hot meals for a family in need." },
  { amount: 50, description: "Covers school supplies for one child for a month." },
  { amount: 100, description: "Digs a shared clean water well for a small community." }
]

export function DonationFlow() {
  const { toast } = useToast()
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50)
  const [customAmount, setCustomAmount] = useState<string>("")
  const [isMonthly, setIsMonthly] = useState(false)
  const [isGift, setIsGift] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDonate = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Contribution Received!",
        description: `Thank you for your generous gift of $${customAmount || selectedAmount}. May it be a source of blessing.`,
      })
    }, 1500)
  }

  return (
    <section id="donate" className="py-24 bg-primary/[0.03]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-headline font-bold mb-4">Direct Impact, One Step Away</h2>
            <p className="text-muted-foreground">Every dollar you contribute directly supports ground-level initiatives.</p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            <Card className="lg:col-span-3 border-none shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-primary text-primary-foreground p-8">
                <CardTitle className="text-2xl font-headline">Select Donation Amount</CardTitle>
                <CardDescription className="text-primary-foreground/80">Choose how you want to make a difference today.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-3 gap-4">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.amount}
                      onClick={() => { setSelectedAmount(preset.amount); setCustomAmount("") }}
                      className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${selectedAmount === preset.amount ? 'border-accent bg-accent/5 ring-4 ring-accent/10' : 'border-border hover:border-primary/50'}`}
                    >
                      <span className="text-2xl font-headline font-bold">${preset.amount}</span>
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-muted-foreground font-bold">$</span>
                  </div>
                  <Input
                    type="number"
                    placeholder="Custom Amount"
                    className="pl-8 h-14 rounded-xl text-lg font-bold border-2 focus-visible:ring-accent"
                    value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null) }}
                  />
                </div>

                {selectedAmount && (
                  <div className="bg-accent/10 p-4 rounded-xl flex items-start gap-3 border border-accent/20 animate-in fade-in slide-in-from-top-2">
                    <Heart className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-accent-foreground leading-relaxed">
                      {PRESETS.find(p => p.amount === selectedAmount)?.description}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border">
                  <div className="space-y-0.5">
                    <Label className="text-base font-bold">Make it a monthly gift</Label>
                    <p className="text-xs text-muted-foreground italic">Sustain our long-term efforts with recurring support.</p>
                  </div>
                  <Switch checked={isMonthly} onCheckedChange={setIsMonthly} className="data-[state=checked]:bg-accent" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="gift" checked={isGift} onCheckedChange={(checked) => setIsGift(checked as boolean)} />
                    <label htmlFor="gift" className="text-sm font-medium leading-none cursor-pointer flex items-center gap-1">
                      Give in honor of someone <Gift className="w-3 h-3" />
                    </label>
                  </div>

                  {isGift && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                      <Input placeholder="Honoree Full Name" className="rounded-xl h-12" />
                      <Input placeholder="Recipient Email (Optional)" className="rounded-xl h-12" />
                    </div>
                  )}
                </div>

                <div className="space-y-4 pt-4">
                  <Button
                    onClick={handleDonate}
                    disabled={isLoading}
                    className="w-full h-16 rounded-full bg-accent hover:bg-accent/90 text-white font-headline font-bold text-xl shadow-lg transition-all active:scale-95"
                  >
                    {isLoading ? "Processing..." : `Complete Donation $${customAmount || selectedAmount || '0'}`}
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-14 rounded-full border-2 font-bold flex items-center gap-2">
                      <Apple className="w-5 h-5" /> Pay
                    </Button>
                    <Button variant="outline" className="h-14 rounded-full border-2 font-bold flex items-center gap-2">
                      <Smartphone className="w-5 h-5" /> Google Pay
                    </Button>
                  </div>
                  <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                    Secure 256-bit Encrypted Transaction
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
              <div className="p-8 bg-white rounded-3xl shadow-sm border border-border/50">
                <h4 className="font-headline font-bold text-lg mb-4 flex items-center gap-2 text-primary">
                  <Heart className="w-5 h-5 fill-accent text-accent" /> Your Impact
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Admin & Operations</span>
                    <span className="font-bold">2.5%</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-[2.5%]"></div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Direct Program Impact</span>
                    <span className="font-bold text-accent">97.5%</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-accent h-full w-[97.5%]"></div>
                  </div>
                </div>
                <p className="mt-6 text-xs text-muted-foreground leading-relaxed italic">
                  "Benevolent Bonds follows strict Shariah guidelines for Zakat and Sadaqah distribution. 100% of Zakat reaches eligible recipients."
                </p>
              </div>

              <div className="p-8 bg-white rounded-3xl shadow-sm border border-border/50">
                <h4 className="font-headline font-bold text-lg mb-4 text-primary">Trust & Safety</h4>
                <ul className="space-y-4">
                  <li className="flex gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <CreditCard className="w-3 h-3 text-primary" />
                    </div>
                    <span>PCI DSS Compliant Infrastructure</span>
                  </li>
                  <li className="flex gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Heart className="w-3 h-3 text-primary" />
                    </div>
                    <span>Registered 501(c)(3) Non-Profit</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
