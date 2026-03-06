
"use client"

import { useState } from "react"
import { useFirebase, useUser, useDoc, useCollection, useMemoFirebase } from "@/firebase"
import { collection, doc, query, orderBy } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { 
  LayoutDashboard, 
  Users, 
  ShieldAlert, 
  Plus, 
  Loader2, 
  FileText, 
  Globe, 
  Trash2,
  LogIn,
  ShieldCheck,
  Briefcase,
  Fingerprint,
  Contact,
  Shield,
  KeyRound,
  Mail
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { signInWithEmailAndPassword } from "firebase/auth"

export default function AdminDashboard() {
  const { user, isUserLoading } = useUser()
  const { firestore, auth } = useFirebase()
  const { toast } = useToast()
  
  const adminRoleRef = useMemoFirebase(() => {
    if (!firestore || !user) return null
    return doc(firestore, "admins", user.uid)
  }, [firestore, user])
  
  const { data: adminRole, isLoading: isAdminLoading } = useDoc(adminRoleRef)

  // Fetch campaigns for count
  const campaignsQuery = useMemoFirebase(() => {
    if (!firestore || !adminRole) return null
    return query(collection(firestore, "campaigns"))
  }, [firestore, adminRole])
  const { data: campaigns } = useCollection(campaignsQuery)

  // Fetch communities for count
  const communitiesQuery = useMemoFirebase(() => {
    if (!firestore || !adminRole) return null
    return query(collection(firestore, "beneficiary_communities"))
  }, [firestore, adminRole])
  const { data: communities } = useCollection(communitiesQuery)

  // Fetch staff for count
  const staffQuery = useMemoFirebase(() => {
    if (!firestore || !adminRole) return null
    return query(collection(firestore, "staff"))
  }, [firestore, adminRole])
  const { data: staff } = useCollection(staffQuery)

  // Fetch all admins
  const adminsQuery = useMemoFirebase(() => {
    if (!firestore || !adminRole) return null
    return query(collection(firestore, "admins"))
  }, [firestore, adminRole])
  const { data: admins } = useCollection(adminsQuery)

  const [activeTab, setActiveTab] = useState("overview")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)
    try {
      await signInWithEmailAndPassword(auth!, email, password)
      toast({
        title: "Session Verified",
        description: "Welcome back to the Command Center.",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: "Invalid credentials.",
      })
    } finally {
      setIsLoggingIn(false)
    }
  }

  if (isUserLoading || isAdminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <div className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-2xl border border-primary/10 text-center">
          <div className="w-20 h-20 rounded-[2rem] bg-primary flex items-center justify-center text-white mx-auto mb-8 shadow-xl">
            <KeyRound className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-headline font-bold mb-2 text-primary">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" disabled={isLoggingIn} className="w-full h-14 rounded-full font-bold">
              {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
              Access Command Center
            </Button>
          </form>
        </div>
      </div>
    )
  }

  if (!adminRole) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-center">
        <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <Button variant="outline" className="mt-4 rounded-full" asChild><a href="/">Return Home</a></Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto py-12 px-4 max-w-7xl">
        <div className="flex justify-between items-end mb-12">
          <h1 className="text-4xl font-headline font-bold text-primary">Admin Dashboard</h1>
          <Badge variant="outline" className="rounded-full px-4 h-8 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> {user.email}</Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-white p-1 rounded-full h-14 shadow-sm border">
            <TabsTrigger value="overview" className="rounded-full px-6">Overview</TabsTrigger>
            <TabsTrigger value="campaigns" className="rounded-full px-6">Campaigns</TabsTrigger>
            <TabsTrigger value="staff" className="rounded-full px-6">Staff</TabsTrigger>
            <TabsTrigger value="communities" className="rounded-full px-6">Communities</TabsTrigger>
            <TabsTrigger value="admins" className="rounded-full px-6">Admins</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="rounded-[2rem] border-none shadow-xl">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-primary">{campaigns?.length || 0}</CardTitle>
                  <CardDescription>Active Initiatives</CardDescription>
                </CardHeader>
              </Card>
              <Card className="rounded-[2rem] border-none shadow-xl">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-primary">{staff?.length || 0}</CardTitle>
                  <CardDescription>Team Members</CardDescription>
                </CardHeader>
              </Card>
              <Card className="rounded-[2rem] border-none shadow-xl">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-primary">{communities?.length || 0}</CardTitle>
                  <CardDescription>Regions Served</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="campaigns">
             <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2"><CampaignList campaigns={campaigns} /></div>
                <div className="lg:col-span-1"><CampaignForm /></div>
             </div>
          </TabsContent>

          <TabsContent value="staff">
             <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2"><StaffList staff={staff} /></div>
                <div className="lg:col-span-1"><StaffForm /></div>
             </div>
          </TabsContent>

          <TabsContent value="communities">
             <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2"><CommunityList communities={communities} /></div>
                <div className="lg:col-span-1"><CommunityForm /></div>
             </div>
          </TabsContent>

          <TabsContent value="admins">
            <AdminList admins={admins} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function AdminList({ admins }: { admins: any[] | null }) {
  const { firestore } = useFirebase()
  return (
    <Card className="border-none shadow-xl rounded-[3rem] overflow-hidden">
      <CardHeader>
        <CardTitle>Administrators</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead className="pl-8">UID</TableHead><TableHead className="text-right pr-8">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {admins?.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell className="pl-8 font-mono text-xs">{admin.uid}</TableCell>
                <TableCell className="text-right pr-8">
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteDocumentNonBlocking(doc(firestore!, "admins", admin.uid))}><Trash2 className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function StaffList({ staff }: { staff: any[] | null }) {
  const { firestore } = useFirebase()
  return (
    <Card className="border-none shadow-xl rounded-[3rem] overflow-hidden">
      <CardHeader><CardTitle>Staff Directory</CardTitle></CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead className="pl-8">Name</TableHead><TableHead>Role</TableHead><TableHead className="text-right pr-8">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {staff?.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="pl-8 font-bold">{s.name}</TableCell>
                <TableCell>{s.role}</TableCell>
                <TableCell className="text-right pr-8">
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteDocumentNonBlocking(doc(firestore!, "staff", s.id))}><Trash2 className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function StaffForm() {
  const { firestore } = useFirebase()
  const { toast } = useToast()
  const [formData, setFormData] = useState({ name: "", role: "", email: "", status: "Active" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!firestore) return
    const id = crypto.randomUUID()
    addDocumentNonBlocking(collection(firestore, "staff"), { ...formData, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    toast({ title: "Staff Member Added" })
    setFormData({ name: "", role: "", email: "", status: "Active" })
  }

  return (
    <Card className="rounded-[2rem] border-none shadow-xl">
      <CardHeader><CardTitle>Add Staff</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <Input placeholder="Role" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required />
          <Button type="submit" className="w-full">Add Member</Button>
        </form>
      </CardContent>
    </Card>
  )
}

function CampaignList({ campaigns }: { campaigns: any[] | null }) {
  const { firestore } = useFirebase()
  return (
    <Card className="border-none shadow-xl rounded-[3rem] overflow-hidden">
      <CardHeader><CardTitle>Initiatives</CardTitle></CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead className="pl-8">Campaign</TableHead><TableHead>Category</TableHead><TableHead className="text-right pr-8">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {campaigns?.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="pl-8 font-bold">{c.name}</TableCell>
                <TableCell>{c.category}</TableCell>
                <TableCell className="text-right pr-8">
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteDocumentNonBlocking(doc(firestore!, "campaigns", c.id))}><Trash2 className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function CampaignForm() {
  const { firestore } = useFirebase()
  const { toast } = useToast()
  const [formData, setFormData] = useState({ name: "", description: "", category: "General Relief" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!firestore) return
    const id = crypto.randomUUID()
    addDocumentNonBlocking(collection(firestore, "campaigns"), { ...formData, id, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    toast({ title: "Campaign Launched" })
    setFormData({ name: "", description: "", category: "General Relief" })
  }

  return (
    <Card className="rounded-[2rem] border-none shadow-xl">
      <CardHeader><CardTitle>Launch Project</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Title" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <Textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
          <Button type="submit" className="w-full">Deploy Campaign</Button>
        </form>
      </CardContent>
    </Card>
  )
}

function CommunityList({ communities }: { communities: any[] | null }) {
  const { firestore } = useFirebase()
  return (
    <Card className="border-none shadow-xl rounded-[3rem] overflow-hidden">
      <CardHeader><CardTitle>Beneficiary Communities</CardTitle></CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead className="pl-8">Community</TableHead><TableHead>Region</TableHead><TableHead className="text-right pr-8">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {communities?.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="pl-8 font-bold">{c.name}</TableCell>
                <TableCell>{c.geographicRegion}</TableCell>
                <TableCell className="text-right pr-8">
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteDocumentNonBlocking(doc(firestore!, "beneficiary_communities", c.id))}><Trash2 className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function CommunityForm() {
  const { firestore } = useFirebase()
  const { toast } = useToast()
  const [formData, setFormData] = useState({ name: "", geographicRegion: "", type: "", description: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!firestore) return
    const id = crypto.randomUUID()
    addDocumentNonBlocking(collection(firestore, "beneficiary_communities"), { ...formData, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    toast({ title: "Community Registered" })
    setFormData({ name: "", geographicRegion: "", type: "", description: "" })
  }

  return (
    <Card className="rounded-[2rem] border-none shadow-xl">
      <CardHeader><CardTitle>Register Region</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <Input placeholder="Region" value={formData.geographicRegion} onChange={e => setFormData({...formData, geographicRegion: e.target.value})} required />
          <Button type="submit" className="w-full">Save Node</Button>
        </form>
      </CardContent>
    </Card>
  )
}
