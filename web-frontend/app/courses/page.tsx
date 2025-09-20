"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, Play, Clock, Users, Star, BookOpen, AlertCircle } from "lucide-react"
import Link from "next/link"
import { coursesAPI, Course } from "@/lib/api/courses"

const categories = ["All", "Pottery", "Textiles", "Jewelry", "Woodworking", "Painting", "Metalwork"]
const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"]

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedLevel, setSelectedLevel] = useState("All Levels")
  const [showFilters, setShowFilters] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await coursesAPI.getAllCourses()
        setCourses(response.data)
      } catch (err: any) {
        console.error("Error fetching courses:", err)
        setError("Failed to load courses. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    try {
      setLoading(true)
      setError(null)
      const response = await coursesAPI.searchCourses({
        courseTitle: searchQuery,
        videoTitle: searchQuery,
        artistName: searchQuery
      })
      setCourses(response.data)
    } catch (err: any) {
      console.error("Error searching courses:", err)
      setError("Failed to search courses. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (videoCount: number) => {
    // Estimate duration based on video count (assuming 20 minutes per video on average)
    const estimatedMinutes = videoCount * 20
    const hours = Math.floor(estimatedMinutes / 60)
    const minutes = estimatedMinutes % 60
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  const getVideoCount = (course: Course) => {
    return course.videos?.length || 0
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Learn from Master Artisans</h1>
            <p className="text-muted-foreground text-lg">Discover traditional crafts through hands-on video courses</p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-6">
            <div className="relative flex items-center">
              <Search className="absolute left-4 z-10 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search courses, skills, or instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-12 pr-24 py-3 text-lg h-12"
              />
              <Button 
                onClick={handleSearch} 
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-4"
                size="sm"
                disabled={loading}
              >
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer whitespace-nowrap"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-muted-foreground">{courses.length} courses available</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm"
              >
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-background rounded-lg border">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Price Range</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>All Prices</option>
                    <option>Free</option>
                    <option>Under $50</option>
                    <option>$50 - $100</option>
                    <option>Over $100</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Duration</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Any Duration</option>
                    <option>Under 2 hours</option>
                    <option>2-5 hours</option>
                    <option>5+ hours</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Rating</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Any Rating</option>
                    <option>4.5+ stars</option>
                    <option>4.0+ stars</option>
                    <option>3.5+ stars</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Most Popular</option>
                    <option>Newest</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="aspect-video bg-muted"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-4 w-3/4"></div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-muted rounded-full"></div>
                    <div className="h-3 bg-muted rounded w-24"></div>
                  </div>
                  <div className="h-3 bg-muted rounded mb-2 w-1/2"></div>
                  <div className="h-8 bg-muted rounded w-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 
                "Try adjusting your search terms or browse all courses." :
                "No courses are available at the moment."
              }
            </p>
            {searchQuery && (
              <Button variant="outline" onClick={() => {
                setSearchQuery("")
                const fetchAllCourses = async () => {
                  try {
                    setLoading(true)
                    const response = await coursesAPI.getAllCourses()
                    setCourses(response.data)
                  } catch (err) {
                    setError("Failed to load courses.")
                  } finally {
                    setLoading(false)
                  }
                }
                fetchAllCourses()
              }}>
                Show All Courses
              </Button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative aspect-video bg-muted">
                  <img
                    src="/pottery-course-thumbnail.jpg"
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-gray-800 ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-black/70 text-white">
                      Course
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-black/70 text-white">
                      {getVideoCount(course)} videos
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg line-clamp-2 flex-1">{course.title}</h3>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{course.description}</p>

                  {/* Instructor */}
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/artist-profile.png" />
                      <AvatarFallback className="text-xs">
                        {course.artist?.user?.name?.[0] || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {course.artist?.user?.name || "Anonymous Artist"}
                      </p>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-muted-foreground ml-1">4.8</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Course Stats */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDuration(getVideoCount(course))}
                    </span>
                    <span className="flex items-center">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {getVideoCount(course)} videos
                    </span>
                    <span className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      0 students
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">4.8</span>
                    <span className="text-xs text-muted-foreground">(12 reviews)</span>
                  </div>

                  {/* Videos Preview */}
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-2">Course includes:</p>
                    <div className="flex flex-wrap gap-1">
                      {course.videos?.slice(0, 2).map((video: any) => (
                        <Badge key={video.id} variant="outline" className="text-xs">
                          {video.title}
                        </Badge>
                      ))}
                      {getVideoCount(course) > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{getVideoCount(course) - 2} more videos
                        </Badge>
                      )}
                      {getVideoCount(course) === 0 && (
                        <span className="text-xs text-muted-foreground italic">No videos yet</span>
                      )}
                    </div>
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-primary">Free</span>
                    </div>
                    <Button asChild>
                      <Link href={`/courses/${course.id}`}>View Course</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Load More - Only show if we have courses */}
        {!loading && courses.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" disabled>
              Load More Courses
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
