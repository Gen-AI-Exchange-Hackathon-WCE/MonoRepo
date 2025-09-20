import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Mic, Camera, Palette, Users, Star, BookOpen, ShoppingCart, User } from "lucide-react"
import Link from "next/link"
import { AuthNav } from "@/components/AuthNav"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-primary">
              Artisan Marketplace
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/explore">
                  <Search className="w-4 h-4 mr-2" />
                  Explore
                </Link>
              </Button>
              {/* <Button variant="ghost" size="sm" asChild>
                <Link href="/courses/explore">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Courses
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/cart">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/customer-dashboard">
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </Button> */}
              <AuthNav />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-bold text-balance mb-6">
              Bring your craft online —<span className="text-primary"> speak, snap, and share</span>
            </h1>
            <p className="text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto">
              AI-powered marketplace where artisans showcase authentic crafts and customers discover unique handmade
              treasures through natural language search.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/auth/signup?type=artist">Sign up as Artist</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
                <Link href="/auth/signup?type=customer">Sign up as Customer</Link>
              </Button>
            </div>
            {/* <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
              <Button size="sm" variant="ghost" asChild>
                <Link href="/explore">Browse Products</Link>
              </Button>
              <Button size="sm" variant="ghost" asChild>
                <Link href="/courses/explore">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Explore Courses
                </Link>
              </Button>
            </div> */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Crafted for creators, designed for discovery</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Modern tools that make it easy to share your story and connect with customers who value authentic
              craftsmanship.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Mic className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Voice-Powered Stories</CardTitle>
                <CardDescription>
                  Record your craft story in your own voice. AI transforms it into compelling product listings.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Camera className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Smart Photo Upload</CardTitle>
                <CardDescription>
                  Upload 2-3 photos and let AI generate professional product descriptions and social media content.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Natural Language Search</CardTitle>
                <CardDescription>
                  Customers find your products using natural queries like "paintings for my home" or "handmade Diwali
                  gifts".
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Palette className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Authenticity Certificates</CardTitle>
                <CardDescription>
                  Every product comes with a digital authenticity certificate featuring maker details and origin.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Course Creation</CardTitle>
                <CardDescription>
                  Share your skills through pre-recorded courses and build an additional revenue stream.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Social Media Kit</CardTitle>
                <CardDescription>
                  Get ready-to-use captions, hashtags, and shareable content for every product you create.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to showcase your craft?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of artisans already sharing their stories and growing their businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/auth/signup?type=artist">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
                <Link href="/explore">Explore Marketplace</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Artisan Marketplace</h3>
              <p className="text-sm text-muted-foreground">
                Connecting authentic crafts with conscious customers through AI-powered discovery.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Artists</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/auth/signup?type=artist" className="hover:text-foreground">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-foreground">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/create-course" className="hover:text-foreground">
                    Create Courses
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Customers</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/auth/signup?type=customer" className="hover:text-foreground">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/explore" className="hover:text-foreground">
                    Browse Products
                  </Link>
                </li>
                <li>
                  <Link href="/courses/explore" className="hover:text-foreground">
                    Explore Courses
                  </Link>
                </li>
                <li>
                  <Link href="/customer-dashboard" className="hover:text-foreground">
                    My Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-foreground">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-foreground">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Artisan Marketplace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
