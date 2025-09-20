"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, Play, Plus, X, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { coursesAPI } from "@/lib/api/courses"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface Video {
  id: string
  title: string
  description: string
  tags: string[]
  videoFile?: File
  isUploading?: boolean
}

export default function CreateCoursePage() {
  const { user } = useAuth()
  const router = useRouter()
  
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
  })
  
  const [videos, setVideos] = useState<Video[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [createdCourseId, setCreatedCourseId] = useState<number | null>(null)

  // Check if user is authenticated and is an artist
  if (!user || user.role !== "ARTIST") {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Access Restricted</h3>
            <p className="text-muted-foreground mb-4">
              Only artists can create courses. Please ensure you're logged in with an artist account.
            </p>
            <Button asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const addVideo = () => {
    const newVideo: Video = {
      id: Date.now().toString(),
      title: "",
      description: "",
      tags: [],
    }
    setVideos([...videos, newVideo])
  }

  const updateVideo = (id: string, field: keyof Video, value: string | File | string[] | boolean | undefined) => {
    setVideos(videos.map((video) => (video.id === id ? { ...video, [field]: value } : video)))
  }

  const removeVideo = (id: string) => {
    setVideos(videos.filter((video) => video.id !== id))
  }

  const addTag = (videoId: string, tag: string) => {
    if (!tag.trim()) return
    const video = videos.find(v => v.id === videoId)
    if (video && !video.tags.includes(tag)) {
      updateVideo(videoId, "tags", [...video.tags, tag])
    }
  }

  const removeTag = (videoId: string, tagToRemove: string) => {
    const video = videos.find(v => v.id === videoId)
    if (video) {
      updateVideo(videoId, "tags", video.tags.filter(tag => tag !== tagToRemove))
    }
  }

  const handleCreateCourse = async () => {
    try {
      setIsCreating(true)
      setError(null)
      setSuccess(null)

      // Step 1: Create the course
      const courseResponse = await coursesAPI.createCourse({
        title: courseData.title,
        description: courseData.description,
      })

      const courseId = courseResponse.data.id
      setCreatedCourseId(courseId)
      setSuccess("Course created successfully!")

      // Step 2: Upload videos for the course
      if (videos.length > 0) {
        for (const video of videos) {
          if (video.videoFile && video.title && video.description) {
            try {
              updateVideo(video.id, "isUploading", true)
              
              await coursesAPI.uploadVideoToCourse({
                courseId: courseId,
                title: video.title,
                description: video.description,
                tags: video.tags,
                courseVideo: video.videoFile,
              })

              updateVideo(video.id, "isUploading", false)
            } catch (videoError) {
              console.error(`Error uploading video ${video.title}:`, videoError)
              updateVideo(video.id, "isUploading", false)
            }
          }
        }
      }

      setSuccess("Course and videos created successfully!")
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)

    } catch (err: any) {
      console.error("Error creating course:", err)
      setError(err.message || "Failed to create course. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center mb-6">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Course</h1>
          <p className="text-muted-foreground">Share your skills and knowledge with the world</p>
        </div>

        <div className="space-y-8">
          {/* Course Details */}
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
              <CardDescription>Basic details about your course</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-green-600">{success}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Pottery Basics: From Clay to Creation"
                  value={courseData.title}
                  onChange={(e) => setCourseData((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Course Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what students will learn in this course..."
                  value={courseData.description}
                  onChange={(e) => setCourseData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Course Videos */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Course Videos</CardTitle>
                  <CardDescription>Upload videos that will make up your course content</CardDescription>
                </div>
                <Button onClick={addVideo}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Video
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {videos.length === 0 ? (
                <div className="text-center py-8">
                  <Play className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No videos added yet</h3>
                  <p className="text-muted-foreground mb-4">Add videos to make your course content engaging</p>
                  <Button onClick={addVideo}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Video
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {videos.map((video, index) => (
                    <Card key={video.id} className="relative">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Video {index + 1}</CardTitle>
                          <Button variant="ghost" size="sm" onClick={() => removeVideo(video.id)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Video Title *</Label>
                            <Input
                              placeholder="Enter video title"
                              value={video.title}
                              onChange={(e) => updateVideo(video.id, "title", e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Video Description *</Label>
                          <Textarea
                            placeholder="Describe what this video covers..."
                            value={video.description}
                            onChange={(e) => updateVideo(video.id, "description", e.target.value)}
                            rows={3}
                          />
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                          <Label>Tags (Optional)</Label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {video.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                {tag}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0"
                                  onClick={() => removeTag(video.id, tag)}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add a tag and press Enter"
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  const target = e.target as HTMLInputElement
                                  addTag(video.id, target.value)
                                  target.value = ""
                                }
                              }}
                            />
                          </div>
                        </div>

                        {/* Video Upload */}
                        <div className="space-y-2">
                          <Label>Video File *</Label>
                          <div className="border-2 border-dashed border-border rounded-lg p-6">
                            {video.videoFile ? (
                              <div className="flex items-center space-x-3">
                                <Play className="w-6 h-6 text-primary" />
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{video.videoFile.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {(video.videoFile.size / (1024 * 1024)).toFixed(1)} MB
                                  </p>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateVideo(video.id, "videoFile", undefined)}
                                >
                                  Remove
                                </Button>
                              </div>
                            ) : (
                              <div className="text-center">
                                <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground mb-2">Upload video file</p>
                                <Label htmlFor={`video-${video.id}`} className="cursor-pointer">
                                  <Button variant="outline" size="sm" asChild>
                                    <span>Choose Video</span>
                                  </Button>
                                </Label>
                                <Input
                                  id={`video-${video.id}`}
                                  type="file"
                                  accept="video/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) updateVideo(video.id, "videoFile", file)
                                  }}
                                />
                              </div>
                            )}
                          </div>
                          {video.isUploading && (
                            <div className="text-sm text-muted-foreground">
                              Uploading video...
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Button variant="outline" disabled={isCreating}>
              Save Draft
            </Button>
            <Button
              onClick={handleCreateCourse}
              disabled={
                !courseData.title || !courseData.description || isCreating
              }
            >
              {isCreating ? "Creating Course..." : "Create Course"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}