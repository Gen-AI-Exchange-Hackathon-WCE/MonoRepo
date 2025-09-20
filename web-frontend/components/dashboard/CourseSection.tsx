"use client"

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Edit, Users, Play, AlertCircle } from "lucide-react";
import Link from "next/link";
import { coursesAPI, Course } from "@/lib/api/courses";
import { useAuth } from "@/lib/auth";

interface CourseSectionProps {
    showCreateButton?: boolean;
    title?: string;
    maxItems?: number;
}

export function CourseSection({ 
    showCreateButton = true, 
    title = "Your Courses",
    maxItems 
}: CourseSectionProps) {
    const { user } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            if (!user) return;

            try {
                setLoading(true);
                setError(null);

                // For now, fetch all courses since we don't have a getMyMyCourses endpoint
                // In the future, you might want to filter by artist ID on the backend
                const response = await coursesAPI.getAllCourses();
                
                // Filter courses to only show those created by the current user
                const userCourses = response.data.filter(course => 
                    course.artist?.user?.id === user.userId || course.artist?.user?.id === user.id
                );
                
                setCourses(userCourses);
            } catch (err: any) {
                console.error("Error fetching courses:", err);
                setError("Failed to load courses");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [user]);

    const displayCourses = maxItems ? courses.slice(0, maxItems) : courses;

    const getVideoCount = (course: Course) => {
        return course.videos?.length || 0;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {showCreateButton && (
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">{title}</h2>
                        <Button asChild>
                            <Link href="/dashboard/create-course">
                                <Plus className="w-4 h-4 mr-2" />
                                New Course
                            </Link>
                        </Button>
                    </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="p-0">
                                <div className="w-full h-48 bg-muted rounded-t-lg"></div>
                                <div className="p-4">
                                    <div className="h-4 bg-muted rounded mb-2"></div>
                                    <div className="h-3 bg-muted rounded mb-4 w-3/4"></div>
                                    <div className="h-8 bg-muted rounded"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-4">
                {showCreateButton && (
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">{title}</h2>
                        <Button asChild>
                            <Link href="/dashboard/create-course">
                                <Plus className="w-4 h-4 mr-2" />
                                New Course
                            </Link>
                        </Button>
                    </div>
                )}
                <Card className="border-red-200">
                    <CardContent className="p-6 text-center">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="font-medium text-red-900 mb-2">Error Loading Courses</h3>
                        <p className="text-red-600 mb-4">{error}</p>
                        <Button variant="outline" onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {showCreateButton && (
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <Button asChild>
                        <Link href="/dashboard/create-course">
                            <Plus className="w-4 h-4 mr-2" />
                            New Course
                        </Link>
                    </Button>
                </div>
            )}
            
            {courses.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="p-12 text-center">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <Play className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold mb-2">
                            No courses yet
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            Share your skills and create an additional revenue stream by offering courses.
                        </p>
                        <Button asChild>
                            <Link href="/dashboard/create-course">
                                Create Your First Course
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {displayCourses.map((course) => (
                        <Card key={course.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-0">
                                <div className="relative">
                                    <img
                                        src="/pottery-course-thumbnail.jpg"
                                        alt={course.title}
                                        className="w-full h-48 object-cover rounded-t-lg"
                                    />
                                    <div className="absolute top-3 right-3">
                                        <Badge variant="secondary" className="bg-black/70 text-white">
                                            {getVideoCount(course)} videos
                                        </Badge>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-semibold line-clamp-2">
                                            {course.title}
                                        </h3>
                                        <Badge variant="default">
                                            Published
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                        {course.description}
                                    </p>
                                    <div className="flex space-x-4 text-sm text-muted-foreground mb-4">
                                        <div className="flex items-center">
                                            <Play className="w-4 h-4 mr-1" />
                                            {getVideoCount(course)} videos
                                        </div>
                                        <div className="flex items-center">
                                            <Users className="w-4 h-4 mr-1" />
                                            0 students
                                        </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground mb-4">
                                        Created: {formatDate(course.createdAt)}
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/courses/${course.id}`}>
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="outline" size="sm" disabled>
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}