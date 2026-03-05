
"use client"

import { useCollection, useMemoFirebase, useFirebase } from "@/firebase"
import { collection, query, orderBy, limit } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Globe, Users, MapPin, Loader2 } from "lucide-react"

export function CommunitySection() {
  const { firestore } = useFirebase()
  
  const q = useMemoFirebase(() => {
    if (!firestore) return null
    return query(collection(firestore, "beneficiary_communities"), orderBy("createdAt", "desc"), limit(6))
  }, [firestore])
  
  const { data: communities, isLoading } = useCollection(q)

  return (
    <section id="communities" className="py-24 bg-primary/[0.01]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold mb-4 uppercase tracking-widest">
            <Globe className="w-3 h-3" /> Our Global Reach
          </div>
          <h2 className="text-4xl font-headline font-bold mb-6">Communities We Serve</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            We don't just deliver aid; we build bonds. Our work focuses on empowering local leaders and creating sustainable change in the most underserved regions.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
          </div>
        ) : communities && communities.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {communities.map((community) => (
              <Card key={community.id} className="border-none shadow-xl rounded-3xl overflow-hidden hover-lift group">
                <CardHeader className="p-8 pb-0">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-6 transition-colors group-hover:bg-primary group-hover:text-white">
                    <Users className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-2xl font-headline mb-2">{community.name}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-accent font-bold uppercase tracking-wider">
                    <MapPin className="w-3 h-3" /> {community.geographicRegion}
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-4">
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {community.description}
                  </p>
                  <div className="pt-6 border-t border-border flex items-center justify-between">
                    <span className="text-xs font-bold bg-muted px-3 py-1 rounded-full">{community.type}</span>
                    <span className="text-xs text-primary font-bold">Learn More →</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-muted-foreground/20">
            <p className="text-muted-foreground italic">No beneficiary communities registered in the ledger yet. Our journey begins with you.</p>
          </div>
        )}
      </div>
    </section>
  )
}
