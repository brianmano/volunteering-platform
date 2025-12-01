"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileText,
  Edit,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { mockPositions, type VolunteerProfile, type Application } from "@/lib/mock-data"

function ProfileContent() {
  const router = useRouter()
  const [profile, setProfile] = useState<VolunteerProfile | null>(null)
  const [applications, setApplications] = useState<Application[]>([])

  useEffect(() => {
    const profileStr = localStorage.getItem("volunteerProfile")
    const userStr = localStorage.getItem("user")

    let loadedProfile: VolunteerProfile | null = null

    if (profileStr) {
      loadedProfile = JSON.parse(profileStr)
    } else if (userStr) {
      const user = JSON.parse(userStr)
      loadedProfile = {
        id: "1",
        name: user.name,
        email: user.email,
        skills: [],
        interests: [],
        volunteerHours: "",
        volunteerHoursGoal: "",
      }
    }

    if (!loadedProfile) return

    setProfile(loadedProfile)

    // load and filter applications for this user
    const appsStr = localStorage.getItem("applications")
    if (appsStr) {
      const allApps: Application[] = JSON.parse(appsStr)
      const filtered = allApps.filter(
        (app) =>
          (loadedProfile.id && app.volunteerId === loadedProfile.id) ||
          app.volunteerEmail === loadedProfile.email,
      )
      setApplications(filtered)
    }
  }, [])

  if (!profile) {
    return null
  }

  const hoursNumber = profile.volunteerHours ? Number(profile.volunteerHours) : 0
  const isValidHours = !Number.isNaN(hoursNumber) && hoursNumber > 0

  const goalNumberRaw = profile.volunteerHoursGoal
    ? Number(profile.volunteerHoursGoal)
    : 200
  const goalNumber =
    !Number.isNaN(goalNumberRaw) && goalNumberRaw > 0 ? goalNumberRaw : 200

  const progress = isValidHours
    ? Math.max(0, Math.min(hoursNumber / goalNumber, 1))
    : 0

  const handleSignOut = () => {
    localStorage.clear()
    router.push("/") // go back to main page
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" fill="currentColor" />
            <span className="text-xl font-semibold">VolunteerHub</span>
          </Link>
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-4">
              <Link href="/explore">
                <Button variant="ghost">Explore</Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost">Profile</Button>
              </Link>
            </nav>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            {profile.name && (
              <p className="text-muted-foreground mt-1">{profile.name}</p>
            )}
          </div>
          <Button onClick={() => router.push("/profile/edit")}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        <div className="space-y-6">
          {/* Volunteer Summary */}
          {isValidHours && (
            <Card className="border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-background">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Volunteer Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-wide text-muted-foreground">
                      Total Volunteer Hours
                    </p>
                    <p className="text-4xl font-bold text-foreground mt-1">
                      {hoursNumber}
                      <span className="text-base font-medium text-muted-foreground ml-1">
                        hrs
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Keep going! Every hour makes an impact.
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-xs text-muted-foreground mb-1">
                      Progress toward {goalNumber} hours goal
                    </p>
                    <div className="w-full sm:w-64 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${progress * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round(progress * 100)}% of {goalNumber} hrs
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-foreground">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{profile.email}</span>
              </div>
              {profile.phone && (
                <div className="flex items-center gap-2 text-foreground">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.phone}</span>
                </div>
              )}
              {profile.location && (
                <div className="flex items-center gap-2 text-foreground">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.availability && (
                <div className="flex items-center gap-2 text-foreground">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.availability}</span>
                </div>
              )}
              {profile.volunteerHours && !isValidHours && (
                <div className="flex items-center gap-2 text-foreground">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.volunteerHours} total volunteer hours</span>
                </div>
              )}
              {profile.bio && (
                <div className="pt-4 border-t border-border">
                  <h3 className="font-semibold mb-2 text-foreground">About</h3>
                  <p className="text-muted-foreground">{profile.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Interests */}
          {profile.interests && profile.interests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <Badge key={interest} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Resume */}
          {profile.resumeUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Resume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
                  <FileText className="h-8 w-8 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Resume.pdf</p>
                    <p className="text-sm text-muted-foreground">Uploaded</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* My Applications */}
          {applications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>My Applications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {applications.map((app) => {
                  const pos = mockPositions.find(
                    (p) => p.id === app.positionId,
                  )
                  return (
                    <div
                      key={app.id}
                      className="flex flex-col gap-2 border-b border-border pb-4 last:border-b-0 last:pb-0"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="font-semibold text-foreground">
                            {pos?.title ?? "Position removed"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {pos?.organization ?? "Organization unknown"}
                          </p>
                        </div>
                        <Badge
                          variant={
                            app.status === "accepted"
                              ? "default"
                              : app.status === "rejected"
                              ? "destructive"
                              : "secondary"
                          }
                          className="capitalize"
                        >
                          {app.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Applied on{" "}
                        {new Date(app.appliedDate).toLocaleDateString()}
                      </p>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <AuthGuard requiredType="volunteer">
      <ProfileContent />
    </AuthGuard>
  )
}
