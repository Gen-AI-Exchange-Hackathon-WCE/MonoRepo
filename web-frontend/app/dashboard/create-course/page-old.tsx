"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, Play, Plus, X, Mic, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { VoiceRecorder } from "@/components/voice-recorder"
import { coursesAPI } from "@/lib/api/courses"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface Video {
  id: string
  title: string
  description: string
  tags: string[]
  videoFile?: File
  voiceNote?: { blob: Blob; duration: number }
  voiceTranscription?: string
  isUploading?: boolean
  uploadProgress?: number
}

export default function CreateCoursePage() {
  const { user } = useAuth()
  const router = useRouter()
  
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    voiceIntro: null as { blob: Blob; duration: number } | null,
    voiceIntroTranscription: "",
  })
  
  const [videos, setVideos] = useState<Video[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [showVoiceIntro, setShowVoiceIntro] = useState(false)
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

  const updateVideo = (id: string, field: keyof Video, value: string | File | string[] | { blob: Blob; duration: number } | boolean | number) => {
    setVideos(videos.map((video) => (video.id === id ? { ...video, [field]: value } : video)))
  }

  const removeVideo = (id: string) => {
    setVideos(videos.filter((video) => video.id !== id))
  }

  const handleCourseVoiceComplete = (audioBlob: Blob, duration: number) => {
    setCourseData((prev) => ({ ...prev, voiceIntro: { blob: audioBlob, duration } }))
  }

  const handleCourseTranscriptionComplete = (text: string) => {
    setCourseData((prev) => ({ ...prev, voiceIntroTranscription: text }))
  }

  const handleVideoVoiceComplete = (videoId: string) => (audioBlob: Blob, duration: number) => {
    updateVideo(videoId, "voiceNote", { blob: audioBlob, duration })
  }

  const handleVideoTranscriptionComplete = (videoId: string) => (text: string) => {
    updateVideo(videoId, "voiceTranscription", text)
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
          <p className="text-muted-foreground">Share your skills and create an additional revenue stream</p>
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

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Course Introduction</Label>
                  <Button variant="outline" size="sm" onClick={() => setShowVoiceIntro(!showVoiceIntro)}>
                    <Mic className="w-4 h-4 mr-2" />
                    {showVoiceIntro ? "Hide Voice Intro" : "Add Voice Intro"}
                  </Button>
                </div>

                {showVoiceIntro && (
                  <div className="space-y-4">
                    <VoiceRecorder
                      onRecordingComplete={handleCourseVoiceComplete}
                      onTranscriptionComplete={handleCourseTranscriptionComplete}
                      maxDuration={180} // 3 minutes for course intro
                    />

                    {courseData.voiceIntroTranscription && (
                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-medium mb-2">Transcription:</h4>
                        <p className="text-sm text-muted-foreground">{courseData.voiceIntroTranscription}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Thumbnail Upload */}
              <div className="space-y-2">
                <Label>Course Thumbnail</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6">
                  {courseData.thumbnail ? (
                    <div className="flex items-center space-x-4">
                      <div className="w-24 h-16 bg-muted rounded overflow-hidden">
                        <img
                          src={URL.createObjectURL(courseData.thumbnail) || "/placeholder.svg"}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{courseData.thumbnail.name}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCourseData((prev) => ({ ...prev, thumbnail: null }))}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">Upload course thumbnail</p>
                      <Label htmlFor="thumbnail-upload" className="cursor-pointer">
                        <Button variant="outline" asChild>
                          <span>Choose File</span>
                        </Button>
                      </Label>
                      <Input
                        id="thumbnail-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) setCourseData((prev) => ({ ...prev, thumbnail: file }))
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Trailer Upload */}
              <div className="space-y-2">
                <Label>Course Trailer (Optional)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6">
                  {courseData.trailer ? (
                    <div className="flex items-center space-x-4">
                      <div className="w-24 h-16 bg-muted rounded flex items-center justify-center">
                        <Play className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{courseData.trailer.name}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCourseData((prev) => ({ ...prev, trailer: null }))}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Play className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">Upload a 30-60s preview video</p>
                      <Label htmlFor="trailer-upload" className="cursor-pointer">
                        <Button variant="outline" asChild>
                          <span>Choose Video</span>
                        </Button>
                      </Label>
                      <Input
                        id="trailer-upload"
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) setCourseData((prev) => ({ ...prev, trailer: file }))
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Curriculum */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Course Curriculum</CardTitle>
                  <CardDescription>Add lessons to your course</CardDescription>
                </div>
                <Button onClick={addLesson}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Lesson
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {lessons.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4">No lessons added yet</p>
                  <Button onClick={addLesson}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Lesson
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {lessons.map((lesson, index) => (
                    <Card key={lesson.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <Badge variant="secondary">Lesson {index + 1}</Badge>
                          <Button variant="ghost" size="sm" onClick={() => removeLesson(lesson.id)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <Label>Lesson Title</Label>
                            <Input
                              placeholder="e.g., Introduction to Clay Types"
                              value={lesson.title}
                              onChange={(e) => updateLesson(lesson.id, "title", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Duration</Label>
                            <Input
                              placeholder="e.g., 15 minutes"
                              value={lesson.duration}
                              onChange={(e) => updateLesson(lesson.id, "duration", e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <Label>Lesson Description</Label>
                          <Textarea
                            placeholder="What will students learn in this lesson?"
                            value={lesson.description}
                            onChange={(e) => updateLesson(lesson.id, "description", e.target.value)}
                            rows={2}
                          />
                        </div>

                        <div className="space-y-4 mb-4">
                          <div className="flex items-center justify-between">
                            <Label>Lesson Voice Note (Optional)</Label>
                            <Badge variant="outline">
                              <Mic className="w-3 h-3 mr-1" />
                              Voice Note
                            </Badge>
                          </div>

                          <VoiceRecorder
                            onRecordingComplete={handleLessonVoiceComplete(lesson.id)}
                            onTranscriptionComplete={handleLessonTranscriptionComplete(lesson.id)}
                            maxDuration={300} // 5 minutes for lesson notes
                            className="border-0 p-0"
                          />

                          {lesson.voiceTranscription && (
                            <div className="p-3 bg-muted rounded-lg">
                              <h5 className="font-medium text-sm mb-1">Transcription:</h5>
                              <p className="text-xs text-muted-foreground">{lesson.voiceTranscription}</p>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Video File</Label>
                          <div className="border-2 border-dashed border-border rounded-lg p-4">
                            {lesson.videoFile ? (
                              <div className="flex items-center space-x-3">
                                <Play className="w-6 h-6 text-primary" />
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{lesson.videoFile.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {(lesson.videoFile.size / (1024 * 1024)).toFixed(1)} MB
                                  </p>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateLesson(lesson.id, "videoFile", "")}
                                >
                                  Remove
                                </Button>
                              </div>
                            ) : (
                              <div className="text-center">
                                <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground mb-2">Upload lesson video</p>
                                <Label htmlFor={`video-${lesson.id}`} className="cursor-pointer">
                                  <Button variant="outline" size="sm" asChild>
                                    <span>Choose Video</span>
                                  </Button>
                                </Label>
                                <Input
                                  id={`video-${lesson.id}`}
                                  type="file"
                                  accept="video/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) updateLesson(lesson.id, "videoFile", file)
                                  }}
                                />
                              </div>
                            )}
                          </div>
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
            <Button variant="outline">Save Draft</Button>
            <Button
              onClick={handleCreateCourse}
              disabled={
                !courseData.title || !courseData.description || !courseData.price || lessons.length === 0 || isCreating
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
