
"use client"

import { useState, useEffect } from "react"
import { useFirebase, useUser, useDoc, useCollection, useMemoFirebase } from "@/firebase"
import { collection, doc, setDoc, query, orderBy } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutDashboard, Users, Heart, ShieldAlert, Plus, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates"

export default function AdminDashboard() {
  const { user, isUserLoading } = useUser()
  const { firestore } = useFirebase()
  const { toast } = useToast()
  
  // DBAC: Check if user is admin
  const adminRoleRef = useMemoFirebase(() => {
    if (!firestore || !user) return null
    return doc(firestore, "app_roles", "admin", user.uid)
  }, [firestore, user])
  
  const { data: adminRole, isLoading: isAdminLoading } = useDoc(adminRoleRef)

  const [activeTab, setActiveTab] = useState("overview")

  if (isUserLoading || isAdminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || !adminRole) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-headline font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground text-center max-w-md">
          This panel is reserved for administrators. Please sign in with an authorized account or contact support.
        </p>
        <Button className="mt-6" asChild variant="outline">
          <a href="/">Return Home</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-headline font-bold text-primary">Admin Command Center</h1>
            <p className="text-muted-foreground italic">Managing bonds of humanity since 2026.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold">{user.displayName || "Administrator"}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-white p-1 rounded-2xl h-14 border shadow-sm">
            <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white px-6 h-full">
              <LayoutDashboard className="w-4 h-4 mr-2" /> Overview
            </TabsTrigger>
            <TabsTrigger value="communities" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white px-6 h-full">
              <Users className="w-4 h-4 mr-2" /> Communities
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white px-6 h-full">
              <Heart className="w-4 h-4 mr-2" /> Campaigns
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Total Raised (INR)", value: "₹45,20,000", change: "+12%" },
                { label: "Active Campaigns", value: "18", change: "+2" },
                { label: "Global Communities", value: "45", change: "0" },
                { label: "Impacted Lives", value: "124K", change: "+4.5%" }
              ].map((stat, i) => (
                <Card key={i} className="border-none shadow-sm rounded-3xl">
                  <CardHeader className="pb-2">
                    <CardDescription>{stat.label}</CardDescription>
                    <CardTitle className="text-3xl font-headline">{stat.value}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs font-bold text-accent">{stat.change} vs last month</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="communities">
            <Card className="border-none shadow-xl rounded-3xl">
              <CardHeader className="flex flex-row items-center justify-between p-8">
                <div>
                  <CardTitle className="text-2xl font-headline">Manage Communities</CardTitle>
                  <CardDescription>Add and edit beneficiary communities supported by your campaigns.</CardDescription>
                </div>
                <Button className="rounded-full bg-accent hover:bg-accent/90">
                  <Plus className="w-4 h-4 mr-2" /> Add Community
                </Button>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <CommunityForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns">
             <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-muted">
               <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
               <p className="text-muted-foreground">Campaign management module is under maintenance.</p>
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function CommunityForm() {
  const { firestore } = useFirebase()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    region: "",
    type: "Rural Village",
    description: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!firestore) return
    
    setLoading(true)
    const communityRef = collection(firestore, "beneficiary_communities")
    
    addDocumentNonBlocking(communityRef, {
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id: crypto.randomUUID()
    }).then(() => {
      setLoading(false)
      toast({
        title: "Community Added",
        description: `${formData.name} has been successfully registered.`
      })
      setFormData({ name: "", region: "", type: "Rural Village", description: "" })
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Community Name</Label>
          <Input 
            id="name" 
            placeholder="e.g. Rural Sindh Village A" 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            required
            className="rounded-xl h-12"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="region">Geographic Region</Label>
          <Input 
            id="region" 
            placeholder="e.g. Sindh, Pakistan" 
            value={formData.region}
            onChange={e => setFormData({...formData, region: e.target.value})}
            required
            className="rounded-xl h-12"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="type">Community Type</Label>
        <Input 
          id="type" 
          placeholder="e.g. Rural Village, Orphanage, Refugee Camp" 
          value={formData.type}
          onChange={e => setFormData({...formData, type: e.target.value})}
          className="rounded-xl h-12"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="desc">Description & Needs</Label>
        <textarea 
          id="desc"
          className="w-full min-h-[120px] rounded-2xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="Detail the community's primary needs and impact goals..."
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
          required
        />
      </div>
      <Button 
        type="submit" 
        disabled={loading}
        className="h-12 rounded-full px-8 bg-primary hover:bg-primary/90 font-bold"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Save Community Record"}
      </Button>
    </form>
  )
}
