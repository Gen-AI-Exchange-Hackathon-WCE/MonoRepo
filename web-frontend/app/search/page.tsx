"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, Heart, MapPin, AlertCircle } from "lucide-react"
import Link from "next/link"

// Mock search results with semantic matching
const mockSearchResults = {
  "paintings for my home": [
    {
      id: 1,
      title: "Hand-painted Pottery Bowl",
      price: "$45",
      image: "/hand-painted-pottery-bowl.jpg",
      maker: {
        name: "Priya Sharma",
        location: "Jaipur, Rajasthan",
        avatar: "/artist-profile.png",
      },
      tags: ["Pottery", "Hand-painted", "Home Decor"],
      matchReason: "Matched on: hand-painted, home decor",
      relevance: "High",
      saves: 18,
    },
    {
      id: 2,
      title: "Macrame Wall Hanging",
      price: "$32",
      image: "/macrame-wall-hanging.png",
      maker: {
        name: "Anjali Patel",
        location: "Mumbai, Maharashtra",
        avatar: "/artist-profile.png",
      },
      tags: ["Macrame", "Wall Art", "Home Decor"],
      matchReason: "Matched on: wall art, home decoration",
      relevance: "High",
      saves: 12,
    },
  ],
  "handmade diwali gifts": [
    {
      id: 3,
      title: "Decorative Brass Diya Set",
      price: "$28",
      image: "/placeholder.svg?key=diya",
      maker: {
        name: "Ramesh Gupta",
        location: "Moradabad, Uttar Pradesh",
        avatar: "/artist-profile.png",
      },
      tags: ["Brass", "Diya", "Festival", "Traditional"],
      matchReason: "Matched on: diwali, traditional gifts, handmade",
      relevance: "High",
      saves: 31,
    },
  ],
}

const trendingQueries = [
  "pottery for kitchen",
  "traditional textiles",
  "wooden sculptures",
  "silver jewelry",
  "handwoven baskets",
  "ceramic planters",
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    const q = searchParams.get("q")
    if (q) {
      setQuery(q)
      handleSearch(q)
    }
  }, [searchParams])

  const handleSearch = async (searchQuery: string) => {
    setIsLoading(true)
    setHasSearched(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Find matching results
    const matchingResults = mockSearchResults[searchQuery.toLowerCase() as keyof typeof mockSearchResults] || []
    setResults(matchingResults)
    setIsLoading(false)
  }

  const handleTrendingQuery = (trendingQuery: string) => {
    setQuery(trendingQuery)
    handleSearch(trendingQuery)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-center mb-6">Search Authentic Crafts</h1>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Try 'paintings for my home' or 'handmade Diwali gifts'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch(query)}
                className="pl-12 pr-4 py-3 text-lg"
              />
              <Button onClick={() => handleSearch(query)} disabled={isLoading} className="absolute right-2 top-2">
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>

            {/* Trending Queries */}
            {!hasSearched && (
              <div className="mt-6">
                <p className="text-sm text-muted-foreground mb-3">Trending searches:</p>
                <div className="flex flex-wrap gap-2">
                  {trendingQueries.map((trendingQuery) => (
                    <Badge
                      key={trendingQuery}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => handleTrendingQuery(trendingQuery)}
                    >
                      {trendingQuery}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="container mx-auto px-4 py-8">
        {hasSearched && (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">{isLoading ? "Searching..." : `Results for "${query}"`}</h2>
                {!isLoading && <p className="text-muted-foreground">{results.length} products found</p>}
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="aspect-square bg-muted animate-pulse" />
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                        <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
                        <div className="h-6 bg-muted rounded w-1/3 animate-pulse" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Results */}
            {!isLoading && results.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="relative aspect-square bg-muted">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                        <Heart className="w-4 h-4 text-gray-600" />
                      </button>

                      {/* Match Reason */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <Badge variant="secondary" className="bg-primary/90 text-primary-foreground text-xs mb-1">
                          {product.matchReason}
                        </Badge>
                        <Badge variant="outline" className="bg-white/90 text-xs">
                          Relevance: {product.relevance}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm line-clamp-2 mb-2">{product.title}</h3>
                      <p className="text-lg font-bold text-primary mb-3">{product.price}</p>

                      <div className="flex items-center space-x-2 mb-3">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={product.maker.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">{product.maker.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{product.maker.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {product.maker.location}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {product.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <Heart className="w-3 h-3 mr-1" />
                          {product.saves} saves
                        </span>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/product/${product.id}`}>View</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* No Results */}
            {!isLoading && results.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">No exact matches found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try using different keywords or browse our categories below
                  </p>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Try these popular searches:</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {trendingQueries.slice(0, 4).map((suggestion) => (
                          <Badge
                            key={suggestion}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                            onClick={() => handleTrendingQuery(suggestion)}
                          >
                            {suggestion}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button variant="outline" asChild>
                      <Link href="/explore">Browse All Products</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Welcome State */}
        {!hasSearched && (
          <div className="text-center py-12">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Discover Authentic Crafts</h2>
              <p className="text-muted-foreground mb-8">
                Use natural language to find exactly what you're looking for. Our AI understands context and intent to
                show you the most relevant handmade products.
              </p>

              <div className="grid md:grid-cols-2 gap-6 text-left">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Natural Language Search</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Search like you speak: "pottery for my kitchen" or "gifts for Diwali"
                    </p>
                    <div className="space-y-2">
                      <Badge variant="outline" className="text-xs">
                        "paintings for my living room"
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        "handmade jewelry for wedding"
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Smart Matching</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Our AI understands context and shows why products match your search
                    </p>
                    <div className="space-y-2">
                      <Badge variant="secondary" className="text-xs">
                        Matched on: home decor, wall art
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Relevance: High
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
