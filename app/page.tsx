import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Users, Building2, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" fill="currentColor" />
            <span className="text-xl font-semibold">VolunteerIn</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Connect Your Passion with Purpose</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty">
            The professional platform for discovering meaningful volunteer opportunities and connecting organizations
            with dedicated volunteers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup?type=volunteer">
              <Button size="lg" className="w-full sm:w-auto">
                Find Opportunities
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/signup?type=organization">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Post Positions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16 border-t border-border">
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">For Volunteers</h3>
              <p className="text-muted-foreground">
                Create your profile once, apply to multiple positions, and track your volunteer journey all in one
                place.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">For Organizations</h3>
              <p className="text-muted-foreground">
                Post volunteer positions, review applications, and find passionate individuals ready to make a
                difference.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
