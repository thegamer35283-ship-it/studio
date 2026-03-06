
"use client"

import { useCollection, useMemoFirebase, useFirebase } from "@/firebase"
import { collection, query, where } from "firebase/firestore"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Loader2, Contact } from "lucide-react"

export function StaffSection() {
  const { firestore } = useFirebase()
  
  const q = useMemoFirebase(() => {
    if (!firestore) return null
    // Fetch only active staff members for public viewing
    return query(collection(firestore, "staff"), where("status", "==", "Active"))
  }, [firestore])
  
  const { data: staff, isLoading } = useCollection(q)

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4 uppercase tracking-[0.2em] shadow-sm">
            <Users className="w-3 h-3" /> Dedicated Personnel
          </div>
          <h2 className="text-5xl font-headline font-bold mb-6 text-primary tracking-tight">Meet Our Team</h2>
          <p className="text-muted-foreground text-lg leading-relaxed italic">
            "The heart of Islamic Group 313. Our team works tirelessly to ensure your bonds reach the right hands with complete transparency."
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-accent" />
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Accessing Directory...</p>
          </div>
        ) : staff && staff.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {staff.map((member) => (
              <Card key={member.id} className="border-none shadow-2xl rounded-[3rem] overflow-hidden hover-lift group bg-background/50 border border-muted/50">
                <CardContent className="p-10 flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-[2.5rem] bg-primary flex items-center justify-center text-white mb-8 shadow-xl group-hover:rotate-6 group-hover:scale-105 transition-all duration-500">
                    <Contact className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-headline font-bold text-primary mb-2">{member.name}</h3>
                  <div className="px-4 py-1.5 rounded-full bg-accent/10 text-accent font-black uppercase tracking-[0.1em] text-[10px] mb-6 border border-accent/20">
                    {member.role}
                  </div>
                  <div className="pt-6 border-t border-muted w-full opacity-60">
                     <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">Verified Staff Node</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-muted/10 rounded-[4rem] border-4 border-dashed border-muted-foreground/10 flex flex-col items-center">
            <Users className="w-16 h-16 text-muted-foreground/20 mb-6" />
            <p className="text-muted-foreground italic font-medium max-w-xs">No public staff records found in the directory. Our global mission is currently scaling.</p>
          </div>
        )}
      </div>
    </section>
  )
}
