"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Search,
    Star,
    Clock,
    Users,
    BookOpen,
    Play,
    Heart,
} from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/currency";

export default function ExploreCourses() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedLevel, setSelectedLevel] = useState("all");
    const [selectedPrice, setSelectedPrice] = useState("all");

    const categories = [
        "All Categories",
        "Pottery & Ceramics",
        "Textiles & Weaving",
        "Jewelry Making",
        "Woodworking",
        "Metalwork",
        "Painting",
        "Embroidery",
        "Leather Crafts",
    ];

    const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];
    const priceRanges = [
        "All Prices",
        "Under ₹4,000",
        "₹4,000 - ₹8,000",
        "Over ₹8,000",
    ];

    const featuredCourses = [
        {
            id: 1,
            title: "Master the Potter's Wheel",
            instructor: "Arjun Mehta",
            rating: 4.9,
            students: 1247,
            duration: "8 weeks",
            lessons: 24,
            price: 7385, // ₹7,385 (converted from $89)
            originalPrice: 9960, // ₹9,960 (converted from $120)
            level: "Beginner",
            category: "Pottery & Ceramics",
            image: "/pottery-course-thumbnail.jpg",
            description:
                "Learn traditional pottery techniques from a master craftsman with 20+ years of experience.",
            isPopular: true,
        },
        {
            id: 2,
            title: "Handloom Weaving Fundamentals",
            instructor: "Lakshmi Devi",
            rating: 4.8,
            students: 892,
            duration: "6 weeks",
            lessons: 18,
            price: 5810, // ₹5,810 (converted from $70)
            level: "Beginner",
            category: "Textiles & Weaving",
            image: "/weaving-course.jpg",
            description:
                "Discover the ancient art of handloom weaving and create beautiful textiles.",
        },
        {
            id: 3,
            title: "Silver Jewelry Design",
            instructor: "Rajesh Kumar",
            rating: 4.7,
            students: 634,
            duration: "10 weeks",
            lessons: 30,
            price: 12450, // ₹12,450 (converted from $150)
            level: "Intermediate",
            category: "Jewelry Making",
            image: "/jewelry-course.jpg",
            description:
                "Master the art of silver jewelry making from design to finished piece.",
        },
    ];

    const trendingCourses = [
        {
            id: 4,
            title: "Block Printing Workshop",
            instructor: "Meera Sharma",
            rating: 4.6,
            students: 445,
            duration: "4 weeks",
            lessons: 12,
            price: 4150, // ₹4,150 (converted from $50)
            level: "Beginner",
            category: "Textiles & Weaving",
            image: "/block-printing.jpg",
        },
        {
            id: 5,
            title: "Wood Carving Basics",
            instructor: "Suresh Patel",
            rating: 4.5,
            students: 328,
            duration: "5 weeks",
            lessons: 15,
            price: 4980, // ₹4,980 (converted from $60)
            level: "Beginner",
            category: "Woodworking",
            image: "/wood-carving.jpg",
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link
                            href="/"
                            className="text-xl font-bold text-primary"
                        >
                            Artisan Marketplace
                        </Link>
                        <div className="flex items-center space-x-4">
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/explore">Explore Products</Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/customer-dashboard">
                                    Dashboard
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">
                        Learn Traditional Crafts
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Master ancient techniques from skilled artisans. Learn
                        pottery, weaving, jewelry making, and more through
                        hands-on video courses.
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto mb-6">
                        <div className="relative flex items-center">
                            <Search className="absolute left-4 z-10 w-5 h-5 text-muted-foreground" />
                            <Input
                                placeholder="Search courses, skills, or instructors..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) =>
                                    e.key === "Enter" &&
                                    console.log("Search:", searchQuery)
                                }
                                className="pl-12 pr-24 py-3 text-lg h-12"
                            />
                            <Button
                                onClick={() =>
                                    console.log("Search:", searchQuery)
                                }
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-4"
                                size="sm"
                            >
                                Search
                            </Button>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        <select
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                            className="px-4 py-2 border border-input bg-background rounded-md text-sm"
                        >
                            {categories.map((category) => (
                                <option
                                    key={category}
                                    value={category
                                        .toLowerCase()
                                        .replace(/\s+/g, "-")}
                                >
                                    {category}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedLevel}
                            onChange={(e) => setSelectedLevel(e.target.value)}
                            className="px-4 py-2 border border-input bg-background rounded-md text-sm"
                        >
                            {levels.map((level) => (
                                <option
                                    key={level}
                                    value={level
                                        .toLowerCase()
                                        .replace(/\s+/g, "-")}
                                >
                                    {level}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedPrice}
                            onChange={(e) => setSelectedPrice(e.target.value)}
                            className="px-4 py-2 border border-input bg-background rounded-md text-sm"
                        >
                            {priceRanges.map((range) => (
                                <option
                                    key={range}
                                    value={range
                                        .toLowerCase()
                                        .replace(/\s+/g, "-")}
                                >
                                    {range}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <Tabs defaultValue="featured" className="space-y-8">
                    <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
                        <TabsTrigger value="featured">Featured</TabsTrigger>
                        <TabsTrigger value="trending">Trending</TabsTrigger>
                        <TabsTrigger value="new">New</TabsTrigger>
                    </TabsList>

                    <TabsContent value="featured" className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-semibold">
                                Featured Courses
                            </h2>
                            <Badge variant="secondary">
                                Hand-picked by experts
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredCourses.map((course) => (
                                <Card
                                    key={course.id}
                                    className="overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    <div className="aspect-video bg-muted relative">
                                        <img
                                            src={
                                                course.image ||
                                                "/placeholder.svg"
                                            }
                                            alt={course.title}
                                            className="w-full h-full object-cover"
                                        />
                                        {course.isPopular && (
                                            <Badge className="absolute top-2 left-2 bg-orange-500">
                                                Popular
                                            </Badge>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="absolute top-2 right-2"
                                        >
                                            <Heart className="w-4 h-4" />
                                        </Button>
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                            <Button variant="secondary">
                                                <Play className="w-4 h-4 mr-2" />
                                                Preview
                                            </Button>
                                        </div>
                                    </div>

                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <Badge
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {course.category}
                                            </Badge>
                                            <Badge
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                {course.level}
                                            </Badge>
                                        </div>

                                        <h3 className="font-semibold mb-1 line-clamp-2">
                                            {course.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            by {course.instructor}
                                        </p>
                                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                                            {course.description}
                                        </p>

                                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                <span>{course.rating}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users className="w-3 h-3" />
                                                <span>
                                                    {course.students.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span>{course.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <BookOpen className="w-3 h-3" />
                                                <span>
                                                    {course.lessons} lessons
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg font-bold text-primary">
                                                    {formatPrice(course.price)}
                                                </span>
                                                {course.originalPrice && (
                                                    <span className="text-sm text-muted-foreground line-through">
                                                        {formatPrice(
                                                            course.originalPrice
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                            <Button size="sm" asChild>
                                                <Link
                                                    href={`/courses/${course.id}`}
                                                >
                                                    Enroll Now
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="trending" className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-semibold">
                                Trending This Week
                            </h2>
                            <Badge variant="secondary">Most enrolled</Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {trendingCourses.map((course) => (
                                <Card
                                    key={course.id}
                                    className="overflow-hidden"
                                >
                                    <div className="aspect-video bg-muted">
                                        <img
                                            src={
                                                course.image ||
                                                "/placeholder.svg"
                                            }
                                            alt={course.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <CardContent className="p-4">
                                        <Badge
                                            variant="outline"
                                            className="text-xs mb-2"
                                        >
                                            {course.category}
                                        </Badge>
                                        <h3 className="font-semibold mb-1 text-sm">
                                            {course.title}
                                        </h3>
                                        <p className="text-xs text-muted-foreground mb-2">
                                            by {course.instructor}
                                        </p>

                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                <span>{course.rating}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users className="w-3 h-3" />
                                                <span>{course.students}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-primary">
                                                {formatPrice(course.price)}
                                            </span>
                                            <Button size="sm" variant="outline">
                                                View
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="new" className="space-y-8">
                        <div className="text-center py-12">
                            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">
                                New Courses Coming Soon
                            </h3>
                            <p className="text-muted-foreground">
                                We're working with artisans to bring you fresh
                                content every week.
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
