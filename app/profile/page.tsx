"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MapPin, Phone, Mail, Calendar, FileText, Edit } from "lucide-react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import type { VolunteerProfile } from "@/lib/mock-data"

function ProfileContent() {
  const router = useRouter()
  const [profile, setProfile] = useState<VolunteerProfile | null>(null)

  useEffect(() => {
    const profileStr = localStorage.getItem("volunteerProfile")
    const userStr = localStorage.getItem("user")

    if (profileStr) {
      setProfile(JSON.parse(profileStr))
    } else if (userStr) {
      const user = JSON.parse(userStr)
      setProfile({
        id: "1",
        name: user.name,
        email: user.email,
        skills: [],
        interests: [],
      })
    }
  }, [])

  if (!profile) {
    return null
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
          <nav className="flex items-center gap-4">
            <Link href="/explore">
              <Button variant="ghost">Explore</Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost">Profile</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Profile Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <Button onClick={() => router.push("/profile/edit")}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        <div className="space-y-6">
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
