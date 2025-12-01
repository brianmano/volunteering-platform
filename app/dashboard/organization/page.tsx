"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Plus, Users, Briefcase, Mail, MapPin, Calendar, FileText } from "lucide-react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { mockPositions, type Application } from "@/lib/mock-data"

function OrganizationDashboardContent() {
  const [applications, setApplications] = useState<Application[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      setUser(JSON.parse(userStr))
    }

    const applicationsStr = localStorage.getItem("applications")
    if (applicationsStr) {
      setApplications(JSON.parse(applicationsStr))
    }
  }, [])

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
  const reviewedApplications = applications.filter((app) => app.status !== "pending")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" fill="currentColor" />
            <span className="text-xl font-semibold">VolunteerHub</span>
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
              <div className="text-2xl font-bold text-foreground">{mockPositions.length}</div>
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
                  const position = mockPositions.find((p) => p.id === application.positionId)
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
                          <p className="text-sm text-muted-foreground">{position?.title}</p>
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

          <TabsContent value="positions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Your Positions</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Post New Position
              </Button>
            </div>

            <div className="grid gap-6">
              {mockPositions.map((position) => {
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
                      <p className="text-muted-foreground">{position.description}</p>

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
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            View
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
