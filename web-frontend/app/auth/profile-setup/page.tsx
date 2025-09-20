"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Mic, MicOff, User, MapPin, Palette } from "lucide-react"

const craftCategories = [
  "Pottery",
  "Textiles",
  "Jewelry",
  "Woodworking",
  "Painting",
  "Sculpture",
  "Metalwork",
  "Glasswork",
  "Leather",
  "Paper Crafts",
]

const languages = [
  "English",
  "Hindi",
  "Marathi",
  "Bengali",
  "Tamil",
  "Telugu",
  "Gujarati",
  "Kannada",
  "Malayalam",
  "Punjabi",
]

export default function ProfileSetupPage() {
  const [formData, setFormData] = useState({
    displayName: "",
    location: "",
    bio: "",
    profilePhoto: null as File | null,
    selectedCrafts: [] as string[],
    selectedLanguages: [] as string[],
  })
  const [isRecording, setIsRecording] = useState(false)
  const [hasVoiceIntro, setHasVoiceIntro] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleCraftToggle = (craft: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedCrafts: prev.selectedCrafts.includes(craft)
        ? prev.selectedCrafts.filter((c) => c !== craft)
        : [...prev.selectedCrafts, craft],
    }))
  }

  const handleLanguageToggle = (language: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedLanguages: prev.selectedLanguages.includes(language)
        ? prev.selectedLanguages.filter((l) => l !== language)
        : [...prev.selectedLanguages, language],
    }))
  }

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      // Start recording
      setTimeout(() => {
        setIsRecording(false)
        setHasVoiceIntro(true)
      }, 3000) // Simulate 3 second recording
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    window.location.href = "/dashboard"
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Your Artist Profile</h1>
          <p className="text-muted-foreground">Tell customers about your craft and let your personality shine through</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              This information will be visible to customers on your profile and product pages
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Profile Photo */}
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={formData.profilePhoto ? URL.createObjectURL(formData.profilePhoto) : undefined} />
                <AvatarFallback>
                  <User className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="photo" className="cursor-pointer">
                  <div className="flex items-center space-x-2 text-sm text-primary hover:underline">
                    <Camera className="w-4 h-4" />
                    <span>Upload Photo</span>
                  </div>
                </Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setFormData((prev) => ({ ...prev, profilePhoto: file }))
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use natural light & plain background for best photos
                </p>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name *</Label>
                <Input
                  id="name"
                  placeholder="Your name or brand"
                  value={formData.displayName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, displayName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
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

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Short Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell customers about your craft journey in a few sentences..."
                value={formData.bio}
                onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                maxLength={200}
                rows={3}
              />
              <p className="text-xs text-muted-foreground text-right">{formData.bio.length}/200 characters</p>
            </div>

            {/* Voice Intro */}
            <div className="space-y-3">
              <Label>Voice Introduction (Optional)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                {!hasVoiceIntro ? (
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Mic className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Record a 30s intro — customers love to hear the maker's voice</p>
                      <p className="text-sm text-muted-foreground">
                        Share your passion, process, or what makes your craft special
                      </p>
                    </div>
                    <Button
                      variant={isRecording ? "destructive" : "outline"}
                      onClick={handleVoiceRecord}
                      className="mt-3"
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="w-4 h-4 mr-2" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4 mr-2" />
                          Start Recording
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <Mic className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="font-medium text-green-600">Voice intro recorded!</p>
                    <Button variant="outline" size="sm" onClick={() => setHasVoiceIntro(false)}>
                      Re-record
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Craft Categories */}
            <div className="space-y-3">
              <Label>Craft Categories *</Label>
              <div className="flex flex-wrap gap-2">
                {craftCategories.map((craft) => (
                  <Badge
                    key={craft}
                    variant={formData.selectedCrafts.includes(craft) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleCraftToggle(craft)}
                  >
                    <Palette className="w-3 h-3 mr-1" />
                    {craft}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Select all that apply to help customers find your work</p>
            </div>

            {/* Languages */}
            <div className="space-y-3">
              <Label>Languages Spoken</Label>
              <div className="flex flex-wrap gap-2">
                {languages.map((language) => (
                  <Badge
                    key={language}
                    variant={formData.selectedLanguages.includes(language) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleLanguageToggle(language)}
                  >
                    {language}
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={
                !formData.displayName || !formData.location || formData.selectedCrafts.length === 0 || isLoading
              }
              className="w-full"
              size="lg"
            >
              {isLoading ? "Creating Profile..." : "Complete Profile & Continue"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
