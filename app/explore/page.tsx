"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, MapPin, Clock, Building2, Search, ExternalLink } from "lucide-react"
import Link from "next/link"
import { mockPositions, categories, locationTypes, type Position } from "@/lib/mock-data"

// ------------ helpers for sorting ------------
const SORT_DEFAULT = "Sort By Default"
const SORT_ALPHA = "Alphabetical (A–Z)"
const SORT_HOURS_ASC = "Hours (Low → High)"
const SORT_HOURS_DESC = "Hours (High → Low)"

// crude parser: extracts a representative number of hours from the timeCommitment string
function extractHours(timeCommitment: string): number {
  // e.g. "2-4 hours/week"
  const rangeMatch = timeCommitment.match(/(\d+)\s*-\s*(\d+)/)
  if (rangeMatch) {
    const low = Number(rangeMatch[1])
    const high = Number(rangeMatch[2])
    return (low + high) / 2
  }

  // e.g. "3 hours/week"
  const singleMatch = timeCommitment.match(/(\d+)\s*(hour|hr)/i)
  if (singleMatch) {
    return Number(singleMatch[1])
  }

  // fallback if can't parse
  return Number.MAX_SAFE_INTEGER
}

// Reusable card component for a single position
type PositionCardProps = {
  position: Position
  isSaved: boolean
  onToggleSave: () => void
}

function PositionCard({ position, isSaved, onToggleSave }: PositionCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{position.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4" />
              {position.organization}
            </CardDescription>
          </div>
          <Badge variant="secondary">{position.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{position.description}</p>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{position.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{position.timeCommitment}</span>
          </div>
          <Badge variant="outline" className="capitalize">
            {position.type}
          </Badge>
        </div>

        {position.requirements.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2 text-foreground">Requirements:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              {position.requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {position.applyOnSite ? (
            <Link href={`/apply/${position.id}`} className="flex-1">
              <Button className="w-full">Apply Now</Button>
            </Link>
          ) : (
            <a
              href={position.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button className="w-full">
                Apply on Organization Site
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          )}
          <Button
            variant={isSaved ? "secondary" : "outline"}
            onClick={onToggleSave}
          >
            {isSaved ? "Unsave" : "Save"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedType, setSelectedType] = useState("All Types")
  const [sortOption, setSortOption] = useState<string>(SORT_DEFAULT)

  const [filteredPositions, setFilteredPositions] = useState<Position[]>(mockPositions)
  const [savedIds, setSavedIds] = useState<Position["id"][]>([])

  // apply current sort to a list
  const sortPositions = (positions: Position[]): Position[] => {
    const arr = [...positions]

    switch (sortOption) {
      case SORT_ALPHA:
        arr.sort((a, b) => a.title.localeCompare(b.title))
        break
      case SORT_HOURS_ASC:
        arr.sort(
          (a, b) => extractHours(a.timeCommitment) - extractHours(b.timeCommitment),
        )
        break
      case SORT_HOURS_DESC:
        arr.sort(
          (a, b) => extractHours(b.timeCommitment) - extractHours(a.timeCommitment),
        )
        break
      case SORT_DEFAULT:
      default:
        // no sorting; preserve original order
        break
    }

    return arr
  }

  const handleFilter = () => {
    let filtered = mockPositions

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (pos) =>
          pos.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pos.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pos.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter((pos) => pos.category === selectedCategory)
    }

    if (selectedType !== "All Types") {
      filtered = filtered.filter((pos) => pos.type === selectedType)
    }

    setFilteredPositions(sortPositions(filtered))
  }

  const handleReset = () => {
    setSearchQuery("")
    setSelectedCategory("All Categories")
    setSelectedType("All Types")
    setSortOption(SORT_DEFAULT)
    setFilteredPositions(mockPositions)
  }

  const toggleSave = (id: Position["id"]) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((savedId) => savedId !== id) : [...prev, id],
    )
  }

  const savedPositions = mockPositions.filter((pos) => savedIds.includes(pos.id))

  // when sort option changes, re-sort the currently filtered list
  useEffect(() => {
    setFilteredPositions((prev) => sortPositions(prev))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOption])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" fill="currentColor" />
            <span className="text-xl font-semibold">VolunteerIn</span>
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

      {/* Hero + Filters */}
      <section className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4 text-balance">
            Discover Volunteer Opportunities
          </h1>
          <p className="text-lg text-muted-foreground mb-8 text-pretty max-w-2xl">
            Find meaningful volunteer positions that match your skills and interests
          </p>

          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-5">
                {/* Search (2 columns on md+) */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search positions or organizations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Type */}
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type === "All Types"
                          ? type
                          : type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SORT_DEFAULT}>{SORT_DEFAULT}</SelectItem>
                    <SelectItem value={SORT_ALPHA}>{SORT_ALPHA}</SelectItem>
                    <SelectItem value={SORT_HOURS_ASC}>{SORT_HOURS_ASC}</SelectItem>
                    <SelectItem value={SORT_HOURS_DESC}>{SORT_HOURS_DESC}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Buttons under the grid */}
              <div className="flex gap-2 mt-4">
                <Button onClick={handleFilter} className="flex-1 md:flex-initial">
                  Apply Filters
                </Button>
                <Button onClick={handleReset} variant="outline">
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </section>

      {/* Saved Positions */}
      {savedPositions.length > 0 && (
        <section className="container mx-auto px-4 pt-8">
          <h2 className="text-2xl font-semibold mb-4">Saved Positions</h2>
          <div className="grid gap-6 mb-8">
            {savedPositions.map((position) => (
              <PositionCard
                key={`saved-${position.id}`}
                position={position}
                isSaved={true}
                onToggleSave={() => toggleSave(position.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Positions List */}
      <section className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <p className="text-muted-foreground">
            {filteredPositions.length}{" "}
            {filteredPositions.length === 1 ? "position" : "positions"} found
          </p>
        </div>

        <div className="grid gap-6">
          {filteredPositions.map((position) => {
            const isSaved = savedIds.includes(position.id)
            return (
              <PositionCard
                key={position.id}
                position={position}
                isSaved={isSaved}
                onToggleSave={() => toggleSave(position.id)}
              />
            )
          })}
        </div>

        {filteredPositions.length === 0 && (
          <Card className="p-12 text-center mt-6">
            <p className="text-muted-foreground mb-4">
              No positions found matching your criteria
            </p>
            <Button onClick={handleReset} variant="outline">
              Clear Filters
            </Button>
          </Card>
        )}
      </section>
    </div>
  )
}
