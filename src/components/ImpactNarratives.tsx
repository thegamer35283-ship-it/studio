
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Sparkles, RefreshCcw } from "lucide-react"
import { generateImpactStatements, type GenerateImpactStatementsOutput } from "@/ai/flows/generate-impact-statements-flow"

export function ImpactNarratives() {
  const [campaign, setCampaign] = useState("")
  const [tier, setTier] = useState("")
  const [goal, setGoal] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<GenerateImpactStatementsOutput | null>(null)

  const handleGenerate = async () => {
    if (!campaign || !tier || !goal) return
    setLoading(true)
    try {
      const output = await generateImpactStatements({
        campaignName: campaign,
        donationTier: tier,
        impactGoalDescription: goal
      })
      setResults(output)
    } catch (error) {
      console.error("Generation failed", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-24 bg-white border-t">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold mb-4">
                <Sparkles className="w-3 h-3" /> AI-Powered Narration
              </div>
              <h2 className="text-4xl font-headline font-bold mb-6">Create Compelling Impact Statements</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Our AI tool helps donors and campaign managers visualize the tangible benefits of every contribution. Understand exactly how your bonds create change.
              </p>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Campaign Name</Label>
                  <Input 
                    value={campaign} 
                    placeholder="e.g. Winter Relief"
                    onChange={(e) => setCampaign(e.target.value)} 
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Donation Amount/Tier</Label>
                  <Input 
                    value={tier} 
                    placeholder="e.g. ₹1000"
                    onChange={(e) => setTier(e.target.value)} 
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>What does this achieve?</Label>
                  <Textarea 
                    value={goal} 
                    placeholder="e.g. provides warm blankets for a family of four"
                    onChange={(e) => setGoal(e.target.value)} 
                    className="rounded-xl min-h-[100px]"
                  />
                </div>
                <Button 
                  onClick={handleGenerate} 
                  disabled={loading || !campaign || !tier || !goal}
                  className="w-full h-12 rounded-full bg-primary text-white font-headline font-bold"
                >
                  {loading ? (
                    <><RefreshCcw className="mr-2 w-4 h-4 animate-spin" /> Generating...</>
                  ) : (
                    <><Sparkles className="mr-2 w-4 h-4" /> Suggest Statements</>
                  )}
                </Button>
              </div>
            </div>

            <div className="lg:w-1/2 w-full">
              <Card className="border-2 border-dashed border-primary/20 bg-primary/[0.02] rounded-3xl overflow-hidden min-h-[400px] flex flex-col">
                <CardHeader>
                  <CardTitle className="font-headline">AI Suggestions</CardTitle>
                  <CardDescription>Tailored narratives for your campaign goals.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center gap-4 p-8">
                  {results ? (
                    results.statements.map((s, i) => (
                      <div key={i} className="p-4 bg-white rounded-xl shadow-sm border border-primary/10 animate-in fade-in slide-in-from-right-2" style={{ animationDelay: `${i * 100}ms` }}>
                        <p className="text-sm font-medium leading-relaxed italic">"{s}"</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center space-y-4 py-12">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                        <Sparkles className="w-8 h-8 text-muted-foreground/30" />
                      </div>
                      <p className="text-sm text-muted-foreground">Adjust the parameters on the left to generate new narratives.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
