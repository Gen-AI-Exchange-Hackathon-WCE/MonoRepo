"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, ShoppingBag, Mail, Lock, AlertCircle, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth/AuthContext"

type UserType = "ARTIST" | "CUSTOMER" | "INVESTOR" | null

export default function SignupPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [step, setStep] = useState<"type" | "form">("type")
  const [userType, setUserType] = useState<UserType>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [professionCode, setProfessionCode] = useState("")
  const [businessLocation, setBusinessLocation] = useState("")
  const [error, setError] = useState("")
  const { register, isLoading } = useAuth()

  useEffect(() => {
    const type = searchParams.get("type") as UserType
    if (type === "ARTIST" || type === "CUSTOMER" || type === "INVESTOR") {
      setUserType(type)
      setStep("form")
    }
  }, [searchParams])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const registerData = {
        name,
        email,
        password,
        role: userType!,
        ...(userType === "ARTIST" ? {
          professionCode: parseInt(professionCode),
          businessLocation
        } : {})
      }

      const result = await register(registerData)

      if (!result.success) {
        setError(result.error || "Registration failed")
      }
      // If successful, redirect is handled by AuthContext
    } catch (err: any) {
      setError(err.message || "Registration failed")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {step !== "type" && (
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => setStep("type")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {step === "type" && "Welcome to Artisan Marketplace"}
              {step === "form" && `Sign up as ${userType?.toLowerCase()}`}
            </CardTitle>
            <CardDescription>
              {step === "type" && "Choose how you want to use our platform"}
              {step === "form" && "Create your account to get started"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <div className="mb-4 p-3 rounded-md bg-destructive/15 border border-destructive/20 flex items-center gap-2 text-destructive">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {step === "type" && (
              <div className="space-y-4">
                <button
                  onClick={() => {
                    setUserType("ARTIST")
                    setStep("form")
                  }}
                  className="w-full p-6 border-2 border-border hover:border-primary rounded-lg transition-colors text-left group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 group-hover:bg-primary/20 rounded-lg flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Sign up as Artist</h3>
                      <p className="text-muted-foreground text-sm">
                        Create and sell your handmade products, share your craft stories, and offer courses.
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        For Creators
                      </Badge>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setUserType("CUSTOMER")
                    setStep("form")
                  }}
                  className="w-full p-6 border-2 border-border hover:border-primary rounded-lg transition-colors text-left group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 group-hover:bg-primary/20 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Browse as Customer</h3>
                      <p className="text-muted-foreground text-sm">
                        Discover authentic handmade products and learn from skilled artisans.
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        For Shoppers
                      </Badge>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setUserType("INVESTOR")
                    setStep("form")
                  }}
                  className="w-full p-6 border-2 border-border hover:border-primary rounded-lg transition-colors text-left group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 group-hover:bg-primary/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Join as Investor</h3>
                      <p className="text-muted-foreground text-sm">
                        Invest in talented artisans and support the growth of traditional crafts.
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        For Investors
                      </Badge>
                    </div>
                  </div>
                </button>
              </div>
            )}

            {step === "form" && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {userType === "ARTIST" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="profession">Profession Code</Label>
                      <Input
                        id="profession"
                        type="number"
                        placeholder="Enter profession code (e.g., 1 for Pottery)"
                        value={professionCode}
                        onChange={(e) => setProfessionCode(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        This will be used to categorize your craft specialization
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Business Location</Label>
                      <Input
                        id="location"
                        type="text"
                        placeholder="Enter your business location (e.g., Mumbai, Maharashtra)"
                        value={businessLocation}
                        onChange={(e) => setBusinessLocation(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        This will help customers find artisans in their area
                      </p>
                    </div>
                  </>
                )}

                <Button 
                  type="submit" 
                  disabled={
                    !name || !email || !password || 
                    (userType === "ARTIST" && (!professionCode || !businessLocation)) || 
                    isLoading
                  } 
                  className="w-full"
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-primary hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
