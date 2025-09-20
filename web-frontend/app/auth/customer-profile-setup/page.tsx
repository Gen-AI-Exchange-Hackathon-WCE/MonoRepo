"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Heart } from "lucide-react"
import Link from "next/link"

const interests = [
  "Pottery & Ceramics",
  "Textiles & Weaving",
  "Jewelry Making",
  "Woodworking",
  "Metalwork",
  "Glassblowing",
  "Leather Crafts",
  "Paper Arts",
  "Painting",
  "Sculpture",
  "Embroidery",
  "Knitting & Crochet",
  "Candle Making",
  "Soap Making",
]

export default function CustomerProfileSetup() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    bio: "",
    interests: [] as string[],
    budget: "",
    experience: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    window.location.href = "/customer-dashboard"
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" className="mb-4" asChild>
          <Link href="/auth/signup">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </Button>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Complete Your Customer Profile</CardTitle>
            <CardDescription>
              Help us personalize your shopping experience and connect you with the right artisans
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="City, State"
                    value={formData.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">About You (Optional)</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your interests in handmade crafts, what you're looking for, or what draws you to artisan products..."
                value={formData.bio}
                onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-primary" />
                What crafts interest you most?
              </Label>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <Badge
                    key={interest}
                    variant={formData.interests.includes(interest) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/20"
                    onClick={() => handleInterestToggle(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Select all that apply. This helps us show you relevant products and courses.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Typical Budget Range</Label>
                <select
                  id="budget"
                  value={formData.budget}
                  onChange={(e) => setFormData((prev) => ({ ...prev, budget: e.target.value }))}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="">Select budget range</option>
                  <option value="under-2000">Under ₹2,000</option>
                  <option value="2000-5000">₹2,000 - ₹5,000</option>
                  <option value="5000-10000">₹5,000 - ₹10,000</option>
                  <option value="over-10000">Over ₹10,000</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level</Label>
                <select
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => setFormData((prev) => ({ ...prev, experience: e.target.value }))}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="">Select experience</option>
                  <option value="beginner">Beginner - New to handmade crafts</option>
                  <option value="intermediate">Intermediate - Some experience</option>
                  <option value="advanced">Advanced - Very knowledgeable</option>
                  <option value="collector">Collector - Serious collector/investor</option>
                </select>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!formData.name || !formData.location || isLoading}
              className="w-full"
            >
              {isLoading ? "Setting up your profile..." : "Complete Setup"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
