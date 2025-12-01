export interface User {
  email: string
  type: "volunteer" | "organization"
  name: string
}

export interface VolunteerProfile {
  id: string
  name: string
  email: string
  phone?: string
  location?: string
  bio?: string
  skills: string[]
  interests: string[]
  availability?: string
  resumeUrl?: string
  volunteerHours?: string 
  volunteerHoursGoal?: string 
}

export interface Position {
  id: string
  title: string
  organization: string
  organizationId: string
  location: string
  type: "remote" | "in-person" | "hybrid"
  category: string
  description: string
  requirements: string[]
  timeCommitment: string
  postedDate: string
  applicationUrl?: string
  applyOnSite: boolean
}

export interface Application {
  id: string
  positionId: string
  volunteerId: string
  volunteerName: string
  volunteerEmail: string
  status: "pending" | "reviewed" | "accepted" | "rejected"
  appliedDate: string
  coverLetter?: string
  resumeUrl?: string
}

// Mock positions data
export const mockPositions: Position[] = [
  {
    id: "1",
    title: "Community Garden Coordinator",
    organization: "Green Earth Initiative",
    organizationId: "org1",
    location: "San Francisco, CA",
    type: "in-person",
    category: "Environment",
    description:
      "Help coordinate our community garden program, working with local residents to create sustainable urban gardens.",
    requirements: ["Passion for sustainability", "Good communication skills", "Weekend availability"],
    timeCommitment: "10 hours/week",
    postedDate: "2025-01-05",
    applyOnSite: true,
  },
  {
    id: "2",
    title: "Youth Mentor",
    organization: "Future Leaders Foundation",
    organizationId: "org2",
    location: "Remote",
    type: "remote",
    category: "Education",
    description: "Mentor high school students in career development and academic success through virtual meetings.",
    requirements: [
      "College degree or equivalent experience",
      "Patient and encouraging",
      "Reliable internet connection",
    ],
    timeCommitment: "5 hours/week",
    postedDate: "2025-01-10",
    applyOnSite: true,
  },
  {
    id: "3",
    title: "Animal Shelter Assistant",
    organization: "Paws & Claws Rescue",
    organizationId: "org3",
    location: "Austin, TX",
    type: "in-person",
    category: "Animal Welfare",
    description: "Assist with daily care of shelter animals, including feeding, cleaning, and socialization.",
    requirements: ["Love for animals", "Physical ability to handle animals", "Flexible schedule"],
    timeCommitment: "8 hours/week",
    postedDate: "2025-01-12",
    applyOnSite: true,
  },
  {
    id: "4",
    title: "Food Bank Organizer",
    organization: "Community Food Network",
    organizationId: "org4",
    location: "New York, NY",
    type: "in-person",
    category: "Hunger Relief",
    description: "Help organize and distribute food to families in need. Sort donations and assist with food drives.",
    requirements: ["Team player", "Able to lift 25 lbs", "Morning availability"],
    timeCommitment: "6 hours/week",
    postedDate: "2025-01-08",
    applyOnSite: true,
  },
  {
    id: "5",
    title: "Web Developer for Nonprofits",
    organization: "Tech for Good",
    organizationId: "org5",
    location: "Remote",
    type: "remote",
    category: "Technology",
    description: "Build and maintain websites for small nonprofit organizations using modern web technologies.",
    requirements: ["HTML/CSS/JavaScript experience", "React knowledge preferred", "Self-motivated"],
    timeCommitment: "10 hours/week",
    postedDate: "2025-01-15",
    applicationUrl: "https://techforgood.org/apply",
    applyOnSite: false,
  },
  {
    id: "6",
    title: "Senior Companion",
    organization: "ElderCare Connect",
    organizationId: "org6",
    location: "Seattle, WA",
    type: "in-person",
    category: "Healthcare",
    description: "Provide companionship to seniors through visits, conversation, and light activities.",
    requirements: ["Patient and empathetic", "Background check required", "Afternoon availability"],
    timeCommitment: "4 hours/week",
    postedDate: "2025-01-11",
    applyOnSite: true,
  },
]

export const categories = [
  "All Categories",
  "Environment",
  "Education",
  "Animal Welfare",
  "Hunger Relief",
  "Technology",
  "Healthcare",
  "Arts & Culture",
  "Community Development",
]

export const locationTypes = ["All Types", "remote", "in-person", "hybrid"]
