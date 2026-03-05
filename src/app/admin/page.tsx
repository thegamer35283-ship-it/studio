
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
  LogIn,
  ShieldCheck,
  TrendingUp,
  HandHelping,
  Briefcase,
  Coins,
  History
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { addDocumentNonBlocking, deleteDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function AdminDashboard() {
  const { user, isUserLoading } = useUser()
  const { firestore, auth } = useFirebase()
  const { toast } = useToast()
  
  const adminRoleRef = useMemoFirebase(() => {
    if (!firestore || !user) return null
    return doc(firestore, "admins", user.uid)
  }, [firestore, user])
  
  const { data: adminRole, isLoading: isAdminLoading } = useDoc(adminRoleRef)

  // Fetch all donations to calculate total revenue - Guarded by adminRole
  const donationsQuery = useMemoFirebase(() => {
    if (!firestore || !adminRole) return null
    return query(collection(firestore, "donations"), orderBy("createdAt", "desc"))
  }, [firestore, adminRole])
  const { data: donations } = useCollection(donationsQuery)

  // Fetch campaigns for count - Guarded by adminRole
  const campaignsQuery = useMemoFirebase(() => {
    if (!firestore || !adminRole) return null
    return query(collection(firestore, "campaigns"))
  }, [firestore, adminRole])
  const { data: campaigns } = useCollection(campaignsQuery)

  // Fetch communities for count - Guarded by adminRole
  const communitiesQuery = useMemoFirebase(() => {
    if (!firestore || !adminRole) return null
    return query(collection(firestore, "beneficiary_communities"))
  }, [firestore, adminRole])
  const { data: communities } = useCollection(communitiesQuery)

  const totalRevenue = donations?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0

  const [activeTab, setActiveTab] = useState("overview")
  const [isInitializing, setIsInitializing] = useState(false)

  const handleClaimAdmin = () => {
    if (!firestore || !user) return
    setIsInitializing(true)
    const ref = doc(firestore, "admins", user.uid)
    setDocumentNonBlocking(ref, { uid: user.uid }, { merge: true })
    
    setTimeout(() => {
      setIsInitializing(false)
      toast({
        title: "Admin Role Initialized",
        description: "You now have full access to the Command Center.",
      })
    }, 1500)
  }

  if (isUserLoading || isAdminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Authenticating Session...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-primary/5 -z-10 opacity-50" />
        <div className="w-24 h-24 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary mb-8 shadow-2xl border border-primary/20">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-headline font-bold mb-4 text-primary">Admin Command Center</h1>
        <p className="text-muted-foreground text-center max-w-md mb-10 leading-relaxed">
          Authorized personnel only. Access to the humanitarian ledger requires a verified session.
        </p>
        <Button onClick={() => initiateAnonymousSignIn(auth)} className="rounded-full px-12 h-16 font-bold text-xl gap-3 shadow-xl hover:scale-105 transition-transform">
          <LogIn className="w-6 h-6" /> Access Dashboard
        </Button>
      </div>
    )
  }

  if (!adminRole) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <div className="max-w-md w-full p-10 bg-white rounded-[3rem] shadow-2xl border flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-3xl bg-destructive/10 flex items-center justify-center text-destructive mb-8">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-headline font-bold mb-4 text-primary">Unauthorized Access</h1>
          <p className="text-muted-foreground mb-8 text-sm">
            Your account (<span className="font-mono text-[10px]">{user.uid}</span>) is not registered as an administrator in our humanitarian ledger.
          </p>
          <div className="flex flex-col gap-4 w-full">
            <Button onClick={handleClaimAdmin} disabled={isInitializing} className="rounded-full h-14 font-bold gap-3 text-lg">
              {isInitializing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />} 
              Initialize Admin Role
            </Button>
            <Button variant="outline" className="rounded-full h-14 border-2" asChild>
              <a href="/">Exit to Home</a>
            </Button>
          </div>
          <p className="mt-10 text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-50">
            Prototype Environment: Authorization override available
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto py-12 px-4 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="rounded-full px-3 py-1 bg-accent/10 text-accent font-bold uppercase tracking-tighter text-[10px]">Command Center v2.0</Badge>
              <div className="h-1 w-1 rounded-full bg-accent" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Live Ledger Access</span>
            </div>
            <h1 className="text-5xl font-headline font-bold text-primary tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2 italic font-medium">"Excellence is to do a job so well that it becomes a source of continuous blessing."</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-4 rounded-[2rem] shadow-xl border border-border/50 group hover:border-primary/30 transition-colors">
            <div className="text-right">
              <p className="text-sm font-bold text-primary">{user.displayName || "Head Administrator"}</p>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                <p className="text-[10px] text-accent font-black uppercase tracking-[0.2em]">Verified Secure</p>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-10">
          <TabsList className="bg-white/50 backdrop-blur-md p-1.5 rounded-[2rem] h-16 border shadow-inner flex w-full md:w-fit overflow-x-auto whitespace-nowrap scrollbar-hide">
            <TabsTrigger value="overview" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white px-8 h-full font-bold transition-all gap-2">
              <LayoutDashboard className="w-4 h-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="donations" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white px-8 h-full font-bold transition-all gap-2">
              <Coins className="w-4 h-4" /> Donations
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white px-8 h-full font-bold transition-all gap-2">
              <Heart className="w-4 h-4" /> Campaigns
            </TabsTrigger>
            <TabsTrigger value="communities" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white px-8 h-full font-bold transition-all gap-2">
              <Globe className="w-4 h-4" /> Communities
            </TabsTrigger>
            <TabsTrigger value="reports" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white px-8 h-full font-bold transition-all gap-2">
              <FileText className="w-4 h-4" /> Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: <TrendingUp className="w-5 h-5" />, color: "text-primary", bg: "bg-primary/5" },
                { label: "Active Nodes", value: `${campaigns?.length || 0} Projects`, icon: <Briefcase className="w-5 h-5" />, color: "text-accent", bg: "bg-accent/5" },
                { label: "Staff Reach", icon: <Users className="w-5 h-5" />, value: `${donations?.length || 0} Contribs`, color: "text-primary", bg: "bg-primary/5" },
                { label: "Impact Areas", icon: <Globe className="w-5 h-5" />, value: `${communities?.length || 0} Regions`, color: "text-accent", bg: "bg-accent/5" }
              ].map((stat, i) => (
                <Card key={i} className="border-none shadow-xl rounded-[2.5rem] hover-lift transition-all overflow-hidden relative group">
                  <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} -mr-8 -mt-8 rounded-full blur-2xl group-hover:scale-150 transition-transform`} />
                  <CardHeader className="relative z-10 pb-2">
                    <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                      {stat.icon}
                    </div>
                    <CardDescription className="text-[10px] uppercase font-black tracking-[0.2em] opacity-60">{stat.label}</CardDescription>
                    <CardTitle className={`text-4xl font-headline font-bold ${stat.color}`}>{stat.value}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 border-none shadow-xl rounded-[3rem] p-4">
                <CardHeader>
                  <CardTitle className="text-2xl font-headline">Recent System Activity</CardTitle>
                  <CardDescription>Real-time updates from across the Islamic Group 313 network.</CardDescription>
                </CardHeader>
                <CardContent>
                  {donations && donations.length > 0 ? (
                    <div className="space-y-6">
                      {donations.slice(0, 5).map((donation) => (
                        <div key={donation.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-muted/50 hover:border-accent/30 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                              <History className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-primary">New Contribution: ₹{donation.amount.toLocaleString()}</p>
                              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{new Date(donation.transactionDate).toLocaleString()}</p>
                            </div>
                          </div>
                          <Badge className="bg-accent/10 text-accent border-none font-bold uppercase tracking-tighter text-[10px]">Completed</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-muted-foreground italic flex flex-col items-center gap-3">
                      <HandHelping className="w-12 h-12 opacity-20" />
                      <p>No recent activity detected in the humanitarian ledger.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-xl rounded-[3rem] bg-primary text-primary-foreground overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -mr-32 -mt-32" />
                <CardHeader className="relative z-10">
                  <CardTitle className="text-2xl font-headline text-white">Target Matrix</CardTitle>
                  <CardDescription className="text-white/60">Current financial performance.</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10 space-y-8">
                  <div>
                    <div className="flex justify-between text-xs mb-2 font-bold uppercase tracking-widest text-white/80">
                      <span>Fundraising Progress</span>
                      <span>₹{totalRevenue.toLocaleString()} / ₹10M</span>
                    </div>
                    <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full transition-all duration-1000" style={{ width: `${Math.min((totalRevenue / 10000000) * 100, 100)}%` }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                      <p className="text-2xl font-headline font-bold text-accent">{Math.min((totalRevenue / 10000000) * 100, 100).toFixed(1)}%</p>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Efficiency</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                      <p className="text-2xl font-headline font-bold text-accent">{donations?.length || 0}</p>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Transactions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="donations" className="animate-in fade-in slide-in-from-bottom-4">
            <DonationList donations={donations} />
          </TabsContent>

          <TabsContent value="campaigns" className="animate-in fade-in slide-in-from-bottom-4">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <CampaignList campaigns={campaigns} />
              </div>
              <div className="lg:col-span-1">
                <CampaignForm />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="communities" className="animate-in fade-in slide-in-from-bottom-4">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <CommunityList communities={communities} />
              </div>
              <div className="lg:col-span-1">
                <CommunityForm />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="animate-in fade-in slide-in-from-bottom-4">
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

function DonationList({ donations }: { donations: any[] | null }) {
  return (
    <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
      <CardHeader className="p-10 pb-6 border-b border-muted/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-3xl font-headline">Donation Ledger</CardTitle>
            <CardDescription className="text-lg">Complete record of every contribution received.</CardDescription>
          </div>
          <Badge className="bg-primary/10 text-primary border-none py-1.5 px-4 font-bold">{donations?.length || 0} Total Records</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/20 border-none hover:bg-muted/20">
              <TableHead className="font-black text-[10px] uppercase tracking-widest pl-10 py-6">Reference ID</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest">Amount (INR)</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest">Donor Identity</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest">Date & Time</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-10">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {donations?.map((d) => (
              <TableRow key={d.id} className="border-muted/10 group hover:bg-muted/5">
                <TableCell className="pl-10 py-6 font-mono text-xs text-primary/60">{d.transactionReference}</TableCell>
                <TableCell className="font-headline font-bold text-primary">₹{d.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-primary">{d.donorId === 'anonymous' ? 'Guest Donor' : d.donorId.substring(0, 10)}</span>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">{d.isRecurring ? 'Recurring' : 'One-time'}</span>
                  </div>
                </TableCell>
                <TableCell className="text-xs font-medium text-muted-foreground">{new Date(d.transactionDate).toLocaleString()}</TableCell>
                <TableCell className="text-right pr-10">
                  <Badge className="bg-accent text-white border-none font-bold uppercase tracking-widest text-[9px] px-2 py-0.5">Verified</Badge>
                </TableCell>
              </TableRow>
            ))}
            {donations?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-24 text-muted-foreground italic">No donation records found in the ledger.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function CampaignList({ campaigns }: { campaigns: any[] | null }) {
  const { firestore } = useFirebase()
  return (
    <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
      <CardHeader className="p-10 pb-6 border-b border-muted/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-3xl font-headline">Active Campaigns</CardTitle>
            <CardDescription className="text-lg">Track progress of global humanitarian initiatives.</CardDescription>
          </div>
          <Badge className="bg-primary/10 text-primary border-none py-1.5 px-4 font-bold">{campaigns?.length || 0} Registered</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/20 border-none hover:bg-muted/20">
              <TableHead className="font-black text-[10px] uppercase tracking-widest pl-10 py-6">Identity</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest">Financial Goal</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest">Progress</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-10">Command</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns?.map((c) => (
              <TableRow key={c.id} className="border-muted/10 group">
                <TableCell className="pl-10 py-6">
                  <div>
                    <p className="font-bold text-primary group-hover:text-accent transition-colors">{c.name}</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">{c.category}</p>
                  </div>
                </TableCell>
                <TableCell className="font-mono font-medium">₹{Number(c.goalAmount).toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1.5 min-w-[120px]">
                     <p className="text-xs font-black text-accent">₹{Number(c.currentRaisedAmount || 0).toLocaleString()}</p>
                     <div className="h-1.5 w-full bg-muted rounded-full">
                       <div className="h-full bg-accent rounded-full" style={{ width: `${Math.min(((c.currentRaisedAmount || 0) / c.goalAmount) * 100, 100)}%` }} />
                     </div>
                  </div>
                </TableCell>
                <TableCell className="text-right pr-10">
                  <Button variant="ghost" size="icon" className="text-destructive rounded-xl hover:bg-destructive/10" onClick={() => {
                     if (confirm(`Confirm decommissioning of campaign: ${c.name}?`)) {
                       const ref = doc(firestore!, "campaigns", c.id)
                       deleteDocumentNonBlocking(ref)
                     }
                  }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {campaigns?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-20 text-muted-foreground italic">No humanitarian campaigns registered in the current ledger.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
    category: "General Relief",
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
      primaryImpactStatement: `Every ₹${formData.goalAmount} contributes to radical change.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }).then(() => {
      setLoading(false)
      toast({ title: "Campaign Launched", description: "Ledger entry created successfully." })
      setFormData({ name: "", goalAmount: "", description: "", category: "General Relief", isActive: true })
    })
  }

  return (
    <Card className="border-none shadow-2xl rounded-[3rem] bg-white">
      <CardHeader className="p-8">
        <CardTitle className="font-headline text-2xl">Launch Initiative</CardTitle>
        <CardDescription>Deploy a new humanitarian project.</CardDescription>
      </CardHeader>
      <CardContent className="p-8 pt-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Title</Label>
            <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="rounded-2xl border-muted/50 h-12 focus-visible:ring-accent" placeholder="e.g. Winter Survival Kits" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Goal (INR)</Label>
              <Input type="number" value={formData.goalAmount} onChange={e => setFormData({...formData, goalAmount: e.target.value})} required className="rounded-2xl border-muted/50 h-12" placeholder="50000" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</Label>
              <Input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required className="rounded-2xl border-muted/50 h-12" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Objective</Label>
            <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required className="rounded-2xl border-muted/50 min-h-[120px]" placeholder="Outline the impact of this campaign..." />
          </div>
          <Button type="submit" disabled={loading} className="w-full rounded-full h-14 font-bold bg-primary shadow-xl hover:shadow-primary/20 transition-all text-lg gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-5 h-5" /> Deploy Campaign</>}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function CommunityList({ communities }: { communities: any[] | null }) {
  const { firestore } = useFirebase()
  return (
    <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
      <CardHeader className="p-10 pb-6 border-b border-muted/50">
        <CardTitle className="text-3xl font-headline">Managed Communities</CardTitle>
        <CardDescription className="text-lg">View registered beneficiary regions.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/20 border-none hover:bg-muted/20">
              <TableHead className="font-black text-[10px] uppercase tracking-widest pl-10 py-6">Community Identity</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest">Geographic Region</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest">Demographic</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-10">Command</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {communities?.map((c) => (
              <TableRow key={c.id} className="border-muted/10">
                <TableCell className="font-bold pl-10 py-6 text-primary">{c.name}</TableCell>
                <TableCell className="font-medium text-muted-foreground">{c.geographicRegion}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-widest text-accent border-accent/20 bg-accent/5">{c.type}</Badge>
                </TableCell>
                <TableCell className="text-right pr-10">
                  <Button variant="ghost" size="icon" className="text-destructive rounded-xl" onClick={() => {
                     const ref = doc(firestore!, "beneficiary_communities", c.id)
                     deleteDocumentNonBlocking(ref)
                  }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {communities?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-20 text-muted-foreground italic">No communities registered.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
    type: "Rural Village",
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
      toast({ title: "Community Registered", description: "Node added to the network." })
      setFormData({ name: "", geographicRegion: "", type: "Rural Village", description: "" })
    })
  }

  return (
    <Card className="border-none shadow-2xl rounded-[3rem] bg-white">
      <CardHeader className="p-8">
        <CardTitle className="font-headline text-2xl">Register Community</CardTitle>
        <CardDescription>Expand the humanitarian footprint.</CardDescription>
      </CardHeader>
      <CardContent className="p-8 pt-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Community Name</Label>
            <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="rounded-2xl border-muted/50 h-12" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Geographic Region</Label>
            <Input value={formData.geographicRegion} onChange={e => setFormData({...formData, geographicRegion: e.target.value})} required className="rounded-2xl border-muted/50 h-12" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Community Type</Label>
            <Input value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} required className="rounded-2xl border-muted/50 h-12" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Brief Description</Label>
            <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required className="rounded-2xl border-muted/50 min-h-[100px]" />
          </div>
          <Button type="submit" disabled={loading} className="w-full rounded-full h-14 font-bold bg-accent hover:bg-accent/90 shadow-xl transition-all text-lg">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Region Node"}
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
    <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
      <CardHeader className="p-10 pb-6 border-b border-muted/50">
        <CardTitle className="text-3xl font-headline">Transparency Hub</CardTitle>
        <CardDescription className="text-lg">Audit statements and annual performance records.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-20 text-center flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Decrypting Files...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/20 border-none hover:bg-muted/20">
                <TableHead className="font-black text-[10px] uppercase tracking-widest pl-10 py-6">Document Title</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Publish Date</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Audit Type</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-10">Command</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports?.map((r) => (
                <TableRow key={r.id} className="border-muted/10">
                  <TableCell className="font-bold pl-10 py-6 text-primary">{r.title}</TableCell>
                  <TableCell className="font-medium text-muted-foreground">{r.publishDate}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-widest">{r.reportType}</Badge>
                  </TableCell>
                  <TableCell className="text-right pr-10">
                    <Button variant="ghost" size="icon" className="text-destructive rounded-xl" onClick={() => {
                       const ref = doc(firestore!, "transparency_reports", r.id)
                       deleteDocumentNonBlocking(ref)
                    }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {reports?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-20 text-muted-foreground italic">No reports published.</TableCell>
                </TableRow>
              )}
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
    reportType: "Annual Impact Audit",
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
      toast({ title: "Report Published", description: "Verification ledger updated." })
      setFormData({ title: "", reportUrl: "", reportType: "Annual Impact Audit", description: "", publishDate: new Date().toISOString().split('T')[0] })
    })
  }

  return (
    <Card className="border-none shadow-2xl rounded-[3rem] bg-white">
      <CardHeader className="p-8">
        <CardTitle className="font-headline text-2xl">Publish Record</CardTitle>
        <CardDescription>Maintain organizational transparency.</CardDescription>
      </CardHeader>
      <CardContent className="p-8 pt-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Title</Label>
            <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="rounded-2xl border-muted/50 h-12" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Secured URL</Label>
            <Input type="url" value={formData.reportUrl} onChange={e => setFormData({...formData, reportUrl: e.target.value})} placeholder="https://cloud.storage/..." required className="rounded-2xl border-muted/50 h-12" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Record Type</Label>
              <Input value={formData.reportType} onChange={e => setFormData({...formData, reportType: e.target.value})} required className="rounded-2xl border-muted/50 h-12" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Release Date</Label>
              <Input type="date" value={formData.publishDate} onChange={e => setFormData({...formData, publishDate: e.target.value})} required className="rounded-2xl border-muted/50 h-12" />
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full rounded-full h-14 font-bold bg-primary shadow-xl transition-all text-lg">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Publish Record"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
