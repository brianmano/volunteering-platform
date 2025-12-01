"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MapPin, Clock, Building2, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { mockPositions, type Position, type Application } from "@/lib/mock-data"

function ApplyContent() {
  const router = useRouter()
  const params = useParams()
  const [position, setPosition] = useState<Position | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [coverLetter, setCoverLetter] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const pos = mockPositions.find((p) => p.id === params.id)
    setPosition(pos || null)

    const profileStr = localStorage.getItem("volunteerProfile")
    if (profileStr) {
      setProfile(JSON.parse(profileStr))
    }
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate application submission
    setTimeout(() => {
      const application: Application = {
        id: Date.now().toString(),
        positionId: position!.id,
        volunteerId: profile.id || "1",
        volunteerName: profile.name,
        volunteerEmail: profile.email,
        status: "pending",
        appliedDate: new Date().toISOString(),
        coverLetter,
        resumeUrl: profile.resumeUrl,
      }

      // Store application
      const applicationsStr = localStorage.getItem("applications")
      const applications = applicationsStr ? JSON.parse(applicationsStr) : []
      applications.push(application)
      localStorage.setItem("applications", JSON.stringify(applications))

      setIsLoading(false)
      setIsSubmitted(true)
    }, 1000)
  }

  if (!position) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Position not found</p>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <Heart className="h-6 w-6 text-primary" fill="currentColor" />
              <span className="text-xl font-semibold">VolunteerHub</span>
            </Link>
          </div>
        </header>

        {/* Success Message */}
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <Card className="text-center p-8">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4">Application Submitted!</h1>
            <p className="text-muted-foreground mb-8">
              Your application for {position.title} at {position.organization} has been successfully submitted. The
              organization will review your application and contact you soon.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/explore">
                <Button>Explore More Positions</Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline">View Profile</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <Heart className="h-6 w-6 text-primary" fill="currentColor" />
            <span className="text-xl font-semibold">VolunteerHub</span>
          </Link>
        </div>
      </header>

      {/* Application Form */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link href="/explore" className="text-primary hover:underline text-sm">
            ← Back to Explore
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Position Details */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <Badge variant="secondary" className="w-fit mb-2">
                  {position.category}
                </Badge>
                <CardTitle className="text-xl">{position.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {position.organization}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{position.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{position.timeCommitment}</span>
                </div>
                <Badge variant="outline" className="capitalize">
                  {position.type}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Apply for this Position</CardTitle>
                  <CardDescription>Your profile information will be shared with the organization</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile ? (
                    <div className="p-4 bg-muted rounded-lg space-y-2">
                      <p className="font-semibold text-foreground">{profile.name}</p>
                      <p className="text-sm text-muted-foreground">{profile.email}</p>
                      {profile.location && <p className="text-sm text-muted-foreground">{profile.location}</p>}
                      {profile.resumeUrl && <p className="text-sm text-primary">Resume attached from your profile</p>}
                    </div>
                  ) : (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">
                        Complete your profile to make applying easier
                      </p>
                      <Link href="/profile/setup">
                        <Button variant="outline" size="sm">
                          Complete Profile
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cover Letter</CardTitle>
                  <CardDescription>Tell the organization why you're interested in this position</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="I am interested in this position because..."
                    rows={8}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    required
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Position Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">Description</h4>
                    <p className="text-muted-foreground">{position.description}</p>
                  </div>
                  {position.requirements.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 text-foreground">Requirements</h4>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        {position.requirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button type="submit" size="lg" disabled={isLoading} className="flex-1">
                  {isLoading ? "Submitting..." : "Submit Application"}
                </Button>
                <Button type="button" size="lg" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ApplyPage() {
  return (
    <AuthGuard requiredType="volunteer">
      <ApplyContent />
    </AuthGuard>
  )
}
