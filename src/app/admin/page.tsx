
"use client"

import { useState } from "react"
import { useFirebase, useUser, useDoc, useCollection, useMemoFirebase, initiateAnonymousSignIn } from "@/firebase"
import { collection, doc, query, orderBy, limit } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { 
  LayoutDashboard, 
  Users, 
  Heart, 
  ShieldAlert, 
  Plus, 
  Loader2, 
  FileText, 
  Globe, 
  Trash2,
  Calendar,
  LogIn
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AdminDashboard() {
  const { user, isUserLoading } = useUser()
  const { firestore, auth } = useFirebase()
  
  // DBAC: Check if user is admin via the existence of a document in /app_roles/admin/{uid}
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

  // Handle "Not Logged In" state
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-headline font-bold mb-4 text-primary">Admin Sign In</h1>
        <p className="text-muted-foreground text-center max-w-md mb-8">
          Authorized personnel only. Please sign in to access the Command Center.
        </p>
        <Button onClick={() => initiateAnonymousSignIn(auth)} className="rounded-full px-10 h-14 font-bold text-lg gap-2">
          <LogIn className="w-5 h-5" /> Access Dashboard
        </Button>
      </div>
    )
  }

  // Access check
  if (!adminRole) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-headline font-bold mb-2 text-primary">Access Denied</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Your account ({user.uid}) does not have administrative privileges. Please contact your system coordinator to be added to the `/app_roles/admin` collection.
        </p>
        <Button className="mt-6 rounded-full" asChild variant="outline">
          <a href="/">Return Home</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-headline font-bold text-primary">Admin Command Center</h1>
            <p className="text-muted-foreground italic">"Verily, Allah loves that when any of you does a job, he does it perfectly."</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border">
            <div className="text-right">
              <p className="text-sm font-bold">{user.displayName || user.uid.substring(0, 8)}</p>
              <p className="text-[10px] text-accent font-bold uppercase tracking-widest">Verified Admin</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-white p-1 rounded-2xl h-14 border shadow-sm flex overflow-x-auto whitespace-nowrap">
            <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white px-6 h-full">
              <LayoutDashboard className="w-4 h-4 mr-2" /> Overview
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white px-6 h-full">
              <Heart className="w-4 h-4 mr-2" /> Campaigns
            </TabsTrigger>
            <TabsTrigger value="communities" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white px-6 h-full">
              <Globe className="w-4 h-4 mr-2" /> Communities
            </TabsTrigger>
            <TabsTrigger value="reports" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white px-6 h-full">
              <FileText className="w-4 h-4 mr-2" /> Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Total Funds (INR)", value: "₹52,10,000", color: "text-primary" },
                { label: "Active Projects", value: "24", color: "text-accent" },
                { label: "Staff Members", value: "12", color: "text-primary" },
                { label: "Regions Active", value: "8", color: "text-accent" }
              ].map((stat, i) => (
                <Card key={i} className="border-none shadow-sm rounded-3xl hover-lift">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-[10px] uppercase font-bold tracking-widest">{stat.label}</CardDescription>
                    <CardTitle className={`text-3xl font-headline ${stat.color}`}>{stat.value}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="campaigns">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <CampaignList />
              </div>
              <div className="lg:col-span-1">
                <CampaignForm />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="communities">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <CommunityList />
              </div>
              <div className="lg:col-span-1">
                <CommunityForm />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ReportList />
              </div>
              <div className="lg:col-span-1">
                <ReportForm />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function CampaignList() {
  const { firestore } = useFirebase()
  const q = useMemoFirebase(() => {
    if (!firestore) return null
    return query(collection(firestore, "campaigns"), orderBy("createdAt", "desc"), limit(10))
  }, [firestore])
  
  const { data: campaigns, isLoading } = useCollection(q)

  return (
    <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
      <CardHeader className="p-8 pb-4">
        <CardTitle className="text-2xl font-headline">Active Campaigns</CardTitle>
        <CardDescription>Track and manage your primary fundraising initiatives.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 border-none">
                <TableHead className="font-bold pl-8">Name</TableHead>
                <TableHead className="font-bold">Goal</TableHead>
                <TableHead className="font-bold">Raised</TableHead>
                <TableHead className="font-bold text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns?.map((c) => (
                <TableRow key={c.id} className="border-muted/20">
                  <TableCell className="font-medium pl-8">{c.name}</TableCell>
                  <TableCell>₹{Number(c.goalAmount).toLocaleString()}</TableCell>
                  <TableCell className="text-accent font-bold">₹{Number(c.currentRaisedAmount).toLocaleString()}</TableCell>
                  <TableCell className="text-right pr-8">
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
                       const ref = doc(firestore!, "campaigns", c.id)
                       deleteDocumentNonBlocking(ref)
                    }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {campaigns?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-muted-foreground italic">No campaigns registered yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

function CampaignForm() {
  const { firestore } = useFirebase()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    goalAmount: "",
    description: "",
    category: "General",
    isActive: true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!firestore) return
    setLoading(true)
    
    const colRef = collection(firestore, "campaigns")
    const id = crypto.randomUUID()
    
    addDocumentNonBlocking(colRef, {
      ...formData,
      id,
      goalAmount: Number(formData.goalAmount),
      currentRaisedAmount: 0,
      currency: "INR",
      startDate: new Date().toISOString().split('T')[0],
      primaryImpactStatement: `Every ₹${formData.goalAmount} changes a life.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }).then(() => {
      setLoading(false)
      toast({ title: "Campaign Launched", description: `${formData.name} is now live.` })
      setFormData({ name: "", goalAmount: "", description: "", category: "General", isActive: true })
    })
  }

  return (
    <Card className="border-none shadow-xl rounded-3xl">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Create Campaign</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Campaign Title</Label>
            <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Goal Amount (INR)</Label>
            <Input type="number" value={formData.goalAmount} onChange={e => setFormData({...formData, goalAmount: e.target.value})} required className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required className="rounded-xl" />
          </div>
          <Button type="submit" disabled={loading} className="w-full rounded-full h-12 font-bold bg-primary">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <><Plus className="w-4 h-4 mr-2" /> Launch Campaign</>}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function CommunityList() {
  const { firestore } = useFirebase()
  const q = useMemoFirebase(() => {
    if (!firestore) return null
    return query(collection(firestore, "beneficiary_communities"), orderBy("createdAt", "desc"))
  }, [firestore])
  
  const { data: communities, isLoading } = useCollection(q)

  return (
    <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
      <CardHeader className="p-8 pb-4">
        <CardTitle className="text-2xl font-headline">Managed Communities</CardTitle>
        <CardDescription>View and manage the regions receiving your organization's support.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 border-none">
                <TableHead className="font-bold pl-8">Community Name</TableHead>
                <TableHead className="font-bold">Region</TableHead>
                <TableHead className="font-bold">Type</TableHead>
                <TableHead className="font-bold text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {communities?.map((c) => (
                <TableRow key={c.id} className="border-muted/20">
                  <TableCell className="font-medium pl-8">{c.name}</TableCell>
                  <TableCell>{c.geographicRegion}</TableCell>
                  <TableCell className="text-xs uppercase font-bold text-muted-foreground">{c.type}</TableCell>
                  <TableCell className="text-right pr-8">
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
                       const ref = doc(firestore!, "beneficiary_communities", c.id)
                       deleteDocumentNonBlocking(ref)
                    }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

function CommunityForm() {
  const { firestore } = useFirebase()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    geographicRegion: "",
    type: "Village",
    description: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!firestore) return
    setLoading(true)
    
    const colRef = collection(firestore, "beneficiary_communities")
    const id = crypto.randomUUID()
    
    addDocumentNonBlocking(colRef, {
      ...formData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }).then(() => {
      setLoading(false)
      toast({ title: "Community Added", description: `${formData.name} has been registered.` })
      setFormData({ name: "", geographicRegion: "", type: "Village", description: "" })
    })
  }

  return (
    <Card className="border-none shadow-xl rounded-3xl">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Register Community</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Geographic Region</Label>
            <Input value={formData.geographicRegion} onChange={e => setFormData({...formData, geographicRegion: e.target.value})} required className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Community Type</Label>
            <Input value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} required className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required className="rounded-xl" />
          </div>
          <Button type="submit" disabled={loading} className="w-full rounded-full h-12 font-bold bg-accent hover:bg-accent/90">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Save Region Details"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function ReportList() {
  const { firestore } = useFirebase()
  const q = useMemoFirebase(() => {
    if (!firestore) return null
    return query(collection(firestore, "transparency_reports"), orderBy("publishDate", "desc"))
  }, [firestore])
  
  const { data: reports, isLoading } = useCollection(q)

  return (
    <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
      <CardHeader className="p-8 pb-4">
        <CardTitle className="text-2xl font-headline">Transparency Hub</CardTitle>
        <CardDescription>Manage public documents and audit statements.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 border-none">
                <TableHead className="font-bold pl-8">Title</TableHead>
                <TableHead className="font-bold">Date</TableHead>
                <TableHead className="font-bold">Type</TableHead>
                <TableHead className="font-bold text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports?.map((r) => (
                <TableRow key={r.id} className="border-muted/20">
                  <TableCell className="font-medium pl-8">{r.title}</TableCell>
                  <TableCell>{r.publishDate}</TableCell>
                  <TableCell className="text-xs font-bold text-primary">{r.reportType}</TableCell>
                  <TableCell className="text-right pr-8">
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
                       const ref = doc(firestore!, "transparency_reports", r.id)
                       deleteDocumentNonBlocking(ref)
                    }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

function ReportForm() {
  const { firestore } = useFirebase()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    reportUrl: "",
    reportType: "Annual Report",
    description: "",
    publishDate: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!firestore) return
    setLoading(true)
    
    const colRef = collection(firestore, "transparency_reports")
    const id = crypto.randomUUID()
    
    addDocumentNonBlocking(colRef, {
      ...formData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }).then(() => {
      setLoading(false)
      toast({ title: "Report Published", description: `${formData.title} is now public.` })
      setFormData({ title: "", reportUrl: "", reportType: "Annual Report", description: "", publishDate: new Date().toISOString().split('T')[0] })
    })
  }

  return (
    <Card className="border-none shadow-xl rounded-3xl">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Publish Report</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Report Title</Label>
            <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Document URL</Label>
            <Input type="url" value={formData.reportUrl} onChange={e => setFormData({...formData, reportUrl: e.target.value})} placeholder="https://..." required className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Report Type</Label>
            <Input value={formData.reportType} onChange={e => setFormData({...formData, reportType: e.target.value})} placeholder="e.g. Audit Report" required className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Publish Date</Label>
            <Input type="date" value={formData.publishDate} onChange={e => setFormData({...formData, publishDate: e.target.value})} required className="rounded-xl" />
          </div>
          <Button type="submit" disabled={loading} className="w-full rounded-full h-12 font-bold bg-primary">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Verify & Publish"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
