"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Upload, X } from "lucide-react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"

function ProfileSetupContent() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [skills, setSkills] = useState<string[]>([])
  const [currentSkill, setCurrentSkill] = useState("")
  const [interests, setInterests] = useState<string[]>([])
  const [currentInterest, setCurrentInterest] = useState("")

  const [formData, setFormData] = useState({
    phone: "",
    location: "",
    bio: "",
    availability: "",
    volunteerHours: "",
    volunteerHoursGoal: "", // NEW FIELD
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0])
    }
  }

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()])
      setCurrentSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill))
  }

  const addInterest = () => {
    if (currentInterest.trim() && !interests.includes(currentInterest.trim())) {
      setInterests([...interests, currentInterest.trim()])
      setCurrentInterest("")
    }
  }

  const removeInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate saving profile
    setTimeout(() => {
      const userStr = localStorage.getItem("user")
      if (userStr) {
        const user = JSON.parse(userStr)
        const profile = {
          ...user,
          ...formData,
          skills,
          interests,
          resumeUrl: resumeFile ? URL.createObjectURL(resumeFile) : undefined,
        }
        localStorage.setItem("volunteerProfile", JSON.stringify(profile))
      }
      router.push("/explore")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <Heart className="h-6 w-6 text-primary" fill="currentColor" />
            <span className="text-xl font-semibold">VolunteerIn</span>
          </Link>
        </div>
      </header>

      {/* Profile Setup Form */}
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground">
            Fill out your profile once and use it to apply to multiple volunteer positions
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Tell organizations about yourself</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="San Francisco, CA"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself, your experience, and why you want to volunteer..."
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <Input
                  id="availability"
                  placeholder="e.g., Weekends, 10 hours/week"
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                />
              </div>
              {/* Total Volunteer Hours */}
              <div className="space-y-2">
                <Label htmlFor="volunteerHours">Total Volunteer Hours</Label>
                <Input
                  id="volunteerHours"
                  type="number"
                  min={0}
                  placeholder="e.g., 120"
                  value={formData.volunteerHours}
                  onChange={(e) =>
                    setFormData({ ...formData, volunteerHours: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Approximate number of hours you&apos;ve volunteered so far.
                </p>
              </div>
              {/* NEW: Volunteer Hours Goal */}
              <div className="space-y-2">
                <Label htmlFor="volunteerHoursGoal">Volunteer Hours Goal</Label>
                <Input
                  id="volunteerHoursGoal"
                  type="number"
                  min={1}
                  placeholder="e.g., 200"
                  value={formData.volunteerHoursGoal}
                  onChange={(e) =>
                    setFormData({ ...formData, volunteerHoursGoal: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Set a target you&apos;d like to reach (e.g., 100, 200 hours).
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Add your relevant skills</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Project Management, Teaching, Graphic Design"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addSkill()
                    }
                  }}
                />
                <Button type="button" onClick={addSkill} variant="secondary">
                  Add
                </Button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="gap-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Interests */}
          <Card>
            <CardHeader>
              <CardTitle>Interests</CardTitle>
              <CardDescription>What causes are you passionate about?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Environment, Education, Animal Welfare"
                  value={currentInterest}
                  onChange={(e) => setCurrentInterest(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addInterest()
                    }
                  }}
                />
                <Button type="button" onClick={addInterest} variant="secondary">
                  Add
                </Button>
              </div>
              {interests.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="gap-1">
                      {interest}
                      <button
                        type="button"
                        onClick={() => removeInterest(interest)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resume Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Resume</CardTitle>
              <CardDescription>Upload your resume to share with organizations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  id="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="resume" className="cursor-pointer">
                  <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                  {resumeFile ? (
                    <div>
                      <p className="font-medium text-foreground">{resumeFile.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">Click to change file</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium text-foreground">Click to upload resume</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        PDF, DOC, or DOCX (max 10MB)
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button type="submit" size="lg" disabled={isLoading} className="flex-1">
              {isLoading ? "Saving..." : "Complete Profile"}
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={() => router.push("/explore")}
            >
              Skip for Now
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ProfileSetupPage() {
  return (
    <AuthGuard requiredType="volunteer">
      <ProfileSetupContent />
    </AuthGuard>
  )
}
