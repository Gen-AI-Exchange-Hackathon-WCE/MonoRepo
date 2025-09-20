"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, ShoppingBag, BookOpen, User, Search, Star, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import { formatPrice } from "@/lib/currency"
import { CartIcon } from "@/components/cart-icon"
import { useCart } from "@/lib/cart"

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("wishlist")
  const { dispatch } = useCart()

  const wishlistItems = [
    {
      id: 1,
      name: "Handwoven Cotton Scarf",
      artist: "Priya Sharma",
      price: 3735, // ₹3,735 (converted from $45)
      image: "/handwoven-cotton-scarf.jpg",
      location: "Rajasthan, India",
    },
    {
      id: 2,
      name: "Ceramic Tea Set",
      artist: "Ravi Kumar",
      price: 4150, // ₹4,150 (converted from $50)
      image: "/ceramic-tea-set.png",
      location: "Kerala, India",
    },
  ]

  const recentOrders = [
    {
      id: "ORD-001",
      name: "Hand-painted Pottery Bowl",
      artist: "Maya Patel",
      price: 2490, // ₹2,490 (converted from $30)
      status: "Delivered",
      date: "2024-01-15",
      image: "/hand-painted-pottery-bowl.jpg",
    },
  ]

  const enrolledCourses = [
    {
      id: 1,
      title: "Introduction to Pottery",
      instructor: "Arjun Mehta",
      progress: 65,
      price: 7385, // ₹7,385 (converted from $89)
      image: "/pottery-course-thumbnail.jpg",
      nextLesson: "Glazing Techniques",
    },
  ]

  const addToCart = (item: (typeof wishlistItems)[0]) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        artist: item.artist,
      },
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold text-primary">
              Artisan Marketplace
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/explore">
                  <Search className="w-4 h-4 mr-2" />
                  Explore
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/courses">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Courses
                </Link>
              </Button>
              <CartIcon />
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-muted-foreground">Discover amazing handmade products and learn new crafts</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="wishlist" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Wishlist
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              My Courses
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wishlist" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Your Wishlist</h2>
              <Badge variant="secondary">{wishlistItems.length} items</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-square bg-muted relative">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <Button size="sm" variant="secondary" className="absolute top-2 right-2">
                      <Heart className="w-4 h-4 fill-current" />
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">by {item.artist}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{item.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">{formatPrice(item.price)}</span>
                      <Button size="sm" onClick={() => addToCart(item)}>
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl font-semibold">Order History</h2>

            <div className="space-y-4">
              {recentOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                        <img
                          src={order.image || "/placeholder.svg"}
                          alt={order.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{order.name}</h3>
                        <p className="text-sm text-muted-foreground">by {order.artist}</p>
                        <p className="text-sm text-muted-foreground">Order #{order.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatPrice(order.price)}</p>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          {order.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{order.date}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <h2 className="text-2xl font-semibold">My Learning Journey</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {enrolledCourses.map((course) => (
                <Card key={course.id}>
                  <div className="aspect-video bg-muted relative">
                    <img
                      src={course.image || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Button variant="secondary">Continue Learning</Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">by {course.instructor}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Clock className="w-4 h-4" />
                      Next: {course.nextLesson}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Paid {formatPrice(course.price)}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">4.8</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <h2 className="text-2xl font-semibold">Profile Settings</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full bg-transparent">
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>Customize your experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full bg-transparent">
                    Update Interests
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
