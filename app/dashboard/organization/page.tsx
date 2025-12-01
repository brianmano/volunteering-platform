"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Heart,
  Plus,
  Users,
  Briefcase,
  Mail,
  MapPin,
  Calendar,
  FileText,
  Trash2,
  Edit3,
} from "lucide-react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { mockPositions, type Application, type Position } from "@/lib/mock-data"

type PositionFormState = {
  id: string
  title: string
  organization: string
  category: string
  location: string
  timeCommitment: string
  type: string
  description: string
}

const emptyForm = (orgName?: string): PositionFormState => ({
  id: "",
  title: "",
  organization: orgName || "",
  category: "",
  location: "",
  timeCommitment: "",
  type: "",
  description: "",
})

function OrganizationDashboardContent() {
  const [applications, setApplications] = useState<Application[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [user, setUser] = useState<any>(null)

  // create / edit state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPositionId, setEditingPositionId] = useState<string | null>(null)
  const [formData, setFormData] = useState<PositionFormState>(emptyForm())

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      const parsed = JSON.parse(userStr)
      setUser(parsed)
      setFormData((prev) => ({
        ...prev,
        organization: prev.organization || parsed.name || "",
      }))
    }

    // load applications
    const applicationsStr = localStorage.getItem("applications")
    if (applicationsStr) {
      setApplications(JSON.parse(applicationsStr))
    }

    // load positions (or seed from mockPositions)
    const storedPositionsStr = localStorage.getItem("orgPositions")
    if (storedPositionsStr) {
      setPositions(JSON.parse(storedPositionsStr))
    } else {
      setPositions(mockPositions)
      localStorage.setItem("orgPositions", JSON.stringify(mockPositions))
    }
  }, [])

  const savePositions = (updated: Position[]) => {
    setPositions(updated)
    localStorage.setItem("orgPositions", JSON.stringify(updated))
  }

  const handleStatusChange = (applicationId: string, newStatus: Application["status"]) => {
    const updatedApplications = applications.map((app) =>
      app.id === applicationId ? { ...app, status: newStatus } : app,
    )
    setApplications(updatedApplications)
    localStorage.setItem("applications", JSON.stringify(updatedApplications))
  }

  const getStatusColor = (status: Application["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      case "reviewed":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      case "accepted":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "rejected":
        return "bg-red-500/10 text-red-700 dark:text-red-400"
      default:
        return ""
    }
  }

  const pendingApplications = applications.filter((app) => app.status === "pending")

  // ---------- POSITION FORM HANDLERS ----------

  const openCreateForm = () => {
    setEditingPositionId(null)
    setFormData(emptyForm(user?.name))
    setIsFormOpen(true)
  }

  const openEditForm = (position: Position) => {
    setEditingPositionId(position.id)
    setFormData({
      id: position.id,
      title: position.title,
      organization: position.organization,
      category: position.category,
      location: position.location,
      timeCommitment: position.timeCommitment,
      type: position.type,
      description: position.description,
    })
    setIsFormOpen(true)
  }

  const handleDeletePosition = () => {
    if (!editingPositionId) return
    const filtered = positions.filter((p) => p.id !== editingPositionId)
    savePositions(filtered)
    setEditingPositionId(null)
    setIsFormOpen(false)
  }

const handleFormSubmit = (e: React.FormEvent) => {
  e.preventDefault()

  // If editing, grab the existing position so we can preserve fields
  const existing = editingPositionId
    ? positions.find((p) => p.id === editingPositionId)
    : undefined

  const base: Position = {
    id: editingPositionId ?? Date.now().toString(),
    title: formData.title.trim(),
    organization: formData.organization.trim() || user?.name || "Organization",
    category: formData.category.trim() || "General",
    location: formData.location.trim(),
    timeCommitment: formData.timeCommitment.trim(),
    type: (formData.type.trim() || "onsite") as Position["type"],
    description: formData.description.trim(),

    // ✅ keep existing requirements if editing, otherwise empty
    requirements: existing?.requirements ?? [],

    // ✅ NEW: required fields from Position type
    organizationId: existing?.organizationId ?? (user?.id ?? "org-1"),
    postedDate: existing?.postedDate ?? new Date().toISOString(),

    applyOnSite: true,
    applicationUrl: "",
  }

  if (editingPositionId) {
    const updated = positions.map((p) => (p.id === editingPositionId ? base : p))
    savePositions(updated)
  } else {
    const updated = [base, ...positions]
    savePositions(updated)
  }

  setIsFormOpen(false)
  setEditingPositionId(null)
}


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" fill="currentColor" />
            <span className="text-xl font-semibold">VolunteerIn</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.name}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                localStorage.clear()
                window.location.href = "/login"
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Organization Dashboard</h1>
          <p className="text-muted-foreground">Manage your volunteer positions and review applications</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Positions</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{positions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{applications.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{pendingApplications.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
          </TabsList>

          {/* APPLICATIONS TAB */}
          <TabsContent value="applications" className="space-y-6">
            {applications.length === 0 ? (
              <Card className="p-12 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2 text-foreground">No Applications Yet</h3>
                <p className="text-muted-foreground">Applications from volunteers will appear here</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => {
                  const position = positions.find((p) => p.id === application.positionId)
                  return (
                    <Card key={application.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{application.volunteerName}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <Mail className="h-3 w-3" />
                              {application.volunteerEmail}
                            </CardDescription>
                          </div>
                          <Badge className={getStatusColor(application.status)} variant="secondary">
                            {application.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm font-semibold text-foreground mb-1">Applied for:</p>
                          <p className="text-sm text-muted-foreground">{position?.title ?? "Position removed"}</p>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Applied on {new Date(application.appliedDate).toLocaleDateString()}</span>
                        </div>

                        {application.coverLetter && (
                          <div>
                            <p className="text-sm font-semibold mb-2 text-foreground">Cover Letter:</p>
                            <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
                              {application.coverLetter}
                            </p>
                          </div>
                        )}

                        {application.resumeUrl && (
                          <div className="flex items-center gap-2 p-3 border border-border rounded-lg">
                            <FileText className="h-5 w-5 text-primary" />
                            <span className="text-sm text-foreground">Resume attached</span>
                            <Button variant="outline" size="sm" className="ml-auto bg-transparent">
                              View
                            </Button>
                          </div>
                        )}

                        {application.status === "pending" && (
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(application.id, "reviewed")}
                              variant="outline"
                            >
                              Mark as Reviewed
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(application.id, "accepted")}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(application.id, "rejected")}
                              variant="destructive"
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* POSITIONS TAB */}
          <TabsContent value="positions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Your Positions</h2>
              <Button onClick={openCreateForm}>
                <Plus className="h-4 w-4 mr-2" />
                Post New Position
              </Button>
            </div>

            {/* CREATE / EDIT FORM */}
            {isFormOpen && (
              <Card>
                <CardHeader>
                  <CardTitle>{editingPositionId ? "Edit Position" : "Create New Position"}</CardTitle>
                  <CardDescription>
                    {editingPositionId
                      ? "Update the details for this volunteer position or delete it."
                      : "Fill out the details for your new volunteer opportunity."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Organization</label>
                        <Input
                          value={formData.organization}
                          onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <Input
                          placeholder="e.g., Education"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Location</label>
                        <Input
                          placeholder="e.g., Toronto, ON"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Type</label>
                        <Input
                          placeholder="e.g., onsite, remote"
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Time Commitment</label>
                      <Input
                        placeholder="e.g., 5–10 hrs/week"
                        value={formData.timeCommitment}
                        onChange={(e) =>
                          setFormData({ ...formData, timeCommitment: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-border mt-4">
                      <div className="flex gap-2">
                        <Button type="submit">
                          <Edit3 className="h-4 w-4 mr-2" />
                          {editingPositionId ? "Save Changes" : "Create Position"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsFormOpen(false)
                            setEditingPositionId(null)
                          }}
                        >
                          Cancel
                        </Button>
                      </div>

                      {editingPositionId && (
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={handleDeletePosition}
                          className="flex items-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete Position
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* POSITIONS LIST */}
            <div className="grid gap-6">
              {positions.map((position) => {
                const positionApplications = applications.filter((app) => app.positionId === position.id)
                return (
                  <Card key={position.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl">{position.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <MapPin className="h-3 w-3" />
                            {position.location}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">{position.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground line-clamp-2">{position.description}</p>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{positionApplications.length} applications</span>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {position.type}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEditForm(position)}>
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function OrganizationDashboardPage() {
  return (
    <AuthGuard requiredType="organization">
      <OrganizationDashboardContent />
    </AuthGuard>
  )
}
