"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Play, Clock, Users, Star, BookOpen, CheckCircle, Download, Share, Heart, AlertCircle } from "lucide-react"
import Link from "next/link"
import { coursesAPI, Course } from "@/lib/api/courses"

interface CourseDetailPageProps {
  params: {
    id: string
  }
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<any>(null)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // For now, we'll get all courses and find the one with the matching ID
        // In the future, you might want to add a getCourseById endpoint
        const response = await coursesAPI.getAllCourses()
        const foundCourse = response.data.find(c => c.id.toString() === params.id)
        
        if (!foundCourse) {
          setError("Course not found")
          return
        }
        
        setCourse(foundCourse)
        
        // Set the first video as selected if available
        if (foundCourse.videos && foundCourse.videos.length > 0) {
          setSelectedVideo(foundCourse.videos[0])
        }
      } catch (err: any) {
        console.error("Error fetching course:", err)
        setError("Failed to load course")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchCourse()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-8 w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="aspect-video bg-muted rounded-lg mb-6"></div>
                <div className="h-8 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded mb-8 w-3/4"></div>
              </div>
              <div className="space-y-4">
                <div className="h-64 bg-muted rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/courses">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to courses
            </Link>
          </Button>
          
          <Card className="border-red-200 max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-medium text-red-900 mb-2">Course Not Found</h3>
              <p className="text-red-600 mb-4">{error || "This course doesn't exist or has been removed."}</p>
              <Button variant="outline" asChild>
                <Link href="/courses">Browse Other Courses</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/courses">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to courses
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-6">
              {selectedVideo ? (
                <video
                  controls
                  className="w-full h-full"
                  poster="/pottery-course-thumbnail.jpg"
                >
                  <source src={selectedVideo.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="flex items-center justify-center h-full bg-muted">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No videos available for this course</p>
                  </div>
                </div>
              )}
            </div>

            {/* Course Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">Course</Badge>
                  <Badge variant="outline">Published</Badge>
                </div>
                <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                <p className="text-muted-foreground text-lg">{course.description}</p>
              </div>

              {/* Course Stats */}
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {course.videos?.length || 0} videos
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  0 students
                </div>
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" />
                  Created {formatDate(course.createdAt)}
                </div>
              </div>
            </div>

            <Tabs defaultValue="curriculum" className="mt-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="curriculum" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Content</CardTitle>
                    <CardDescription>
                      {course.videos?.length || 0} videos • Total duration varies by video
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {course.videos && course.videos.length > 0 ? (
                      <div className="space-y-2">
                        {course.videos.map((video, index) => (
                          <div
                            key={video.id}
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                              selectedVideo?.id === video.id ? 'bg-primary/10' : 'hover:bg-muted'
                            }`}
                            onClick={() => setSelectedVideo(video)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <Play className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="font-medium">
                                  {video.title || `Video ${index + 1}`}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {video.description || `Added ${formatDate(video.createdAt)}`}
                                </p>
                              </div>
                            </div>
                            <CheckCircle className="w-5 h-5 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No videos available for this course yet.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="instructor">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src="" />
                        <AvatarFallback>
                          {course.artist?.user?.name?.charAt(0) || "A"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">
                          {course.artist?.user?.name || "Unknown Artist"}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Artist Profile
                        </p>
                        <div className="flex gap-6 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1 fill-current text-yellow-400" />
                            4.9 rating
                          </div>
                          <div>0 students</div>
                          <div>1 course</div>
                        </div>
                        <p className="text-sm">
                          Professional artist offering quality courses and content.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium mb-2">No reviews yet</h3>
                      <p className="text-muted-foreground">
                        Be the first to review this course after enrolling!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Actions */}
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <img
                      src="/pottery-course-thumbnail.jpg"
                      alt={course.title}
                      className="w-full aspect-video object-cover rounded-lg mb-4"
                    />
                    <div className="text-2xl font-bold mb-2">Free Course</div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Lifetime access to all course content
                    </p>
                  </div>
                  
                  <Button className="w-full" size="lg">
                    Start Learning
                  </Button>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Heart className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Includes */}
            <Card>
              <CardHeader>
                <CardTitle>This course includes:</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <Play className="w-4 h-4 mr-3 text-muted-foreground" />
                  <span className="text-sm">{course.videos?.length || 0} video lessons</span>
                </div>
                <div className="flex items-center">
                  <Download className="w-4 h-4 mr-3 text-muted-foreground" />
                  <span className="text-sm">Downloadable resources</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-3 text-muted-foreground" />
                  <span className="text-sm">Learn at your own pace</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
