"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvestmentRequests } from "@/components/investor/InvestmentRequests";
import {
  TrendingUp,
  DollarSign,
  Users,
  Target,
  ArrowUpRight,
  Eye,
  Star,
  Calendar,
} from "lucide-react";
import Link from "next/link";

export default function InvestorDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/auth/login");
      } else if (user.role !== "INVESTOR") {
        // Redirect to appropriate dashboard based on role
        if (user.role === "ARTIST") {
          router.push("/dashboard");
        } else {
          router.push("/customer-dashboard");
        }
      }
    }
  }, [user, isLoading, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not an investor (will redirect)
  if (!user || user.role !== "INVESTOR") {
    return null;
  }

  // Mock data for investor dashboard
  const investmentStats = {
    totalInvested: 125000,
    activeInvestments: 8,
    totalReturns: 18500,
    averageROI: 14.8,
  };

  const activeInvestments = [
    {
      id: 1,
      artistName: "Priya Sharma",
      craftType: "Pottery",
      amountInvested: 25000,
      currentValue: 28500,
      roi: 14,
      status: "active",
      lastUpdate: "2 days ago",
    },
    {
      id: 2,
      artistName: "Rajesh Kumar",
      craftType: "Handloom",
      amountInvested: 30000,
      currentValue: 34200,
      roi: 14,
      status: "active",
      lastUpdate: "1 week ago",
    },
    {
      id: 3,
      artistName: "Meera Devi",
      craftType: "Jewelry",
      amountInvested: 20000,
      currentValue: 22800,
      roi: 14,
      status: "active",
      lastUpdate: "3 days ago",
    },
  ];

  const opportunities = [
    {
      id: 1,
      artistName: "Amit Patel",
      craftType: "Wood Carving",
      fundingGoal: 50000,
      raised: 32000,
      investors: 12,
      daysLeft: 15,
      minInvestment: 5000,
    },
    {
      id: 2,
      artistName: "Sunita Rani",
      craftType: "Embroidery",
      fundingGoal: 35000,
      raised: 18000,
      investors: 8,
      daysLeft: 22,
      minInvestment: 3000,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Investor Dashboard</h1>
                <p className="text-gray-600">
                  Welcome back, {user?.name}! Track your investments and discover new opportunities.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" asChild>
                <Link href="/explore">
                  <Eye className="w-4 h-4 mr-2" />
                  Explore Artists
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/investors">
                  <Target className="w-4 h-4 mr-2" />
                  New Opportunities
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Invested
                  </p>
                  <p className="text-2xl font-bold">
                    ₹{investmentStats.totalInvested.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Investments
                  </p>
                  <p className="text-2xl font-bold">
                    {investmentStats.activeInvestments}
                  </p>
                </div>
                <Target className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Returns
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    +₹{investmentStats.totalReturns.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Average ROI
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {investmentStats.averageROI}%
                  </p>
                </div>
                <ArrowUpRight className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="requests">Investment Requests</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Active Investments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Your Active Investments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeInvestments.map((investment) => (
                    <div
                      key={investment.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{investment.artistName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {investment.craftType}
                          </p>
                        </div>
                        <Badge
                          variant={investment.roi > 0 ? "default" : "secondary"}
                        >
                          +{investment.roi}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Invested</p>
                          <p className="font-medium">
                            ₹{investment.amountInvested.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Current Value</p>
                          <p className="font-medium text-green-600">
                            ₹{investment.currentValue.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t">
                        <span className="text-xs text-muted-foreground">
                          Updated {investment.lastUpdate}
                        </span>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Performance Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Performance Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Best Performing</span>
                      <span className="font-medium">Pottery (+18%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Portfolio Growth</span>
                      <span className="font-medium text-green-600">+14.8%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Monthly Return</span>
                      <span className="font-medium">₹3,200</span>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    View Detailed Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="requests" className="mt-6">
            <InvestmentRequests />
          </TabsContent>

          <TabsContent value="opportunities" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  New Investment Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {opportunities.map((opportunity) => (
                  <div
                    key={opportunity.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{opportunity.artistName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {opportunity.craftType}
                        </p>
                      </div>
                      <Badge variant="outline">
                        <Calendar className="w-3 h-3 mr-1" />
                        {opportunity.daysLeft} days left
                      </Badge>
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Funding Progress</span>
                        <span>
                          {Math.round(
                            (opportunity.raised / opportunity.fundingGoal) * 100
                          )}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${
                              (opportunity.raised / opportunity.fundingGoal) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-muted-foreground">Goal</p>
                        <p className="font-medium">
                          ₹{opportunity.fundingGoal.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Min. Investment</p>
                        <p className="font-medium">
                          ₹{opportunity.minInvestment.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        {opportunity.investors} investors
                      </div>
                      <Button size="sm">
                        Invest Now
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="text-center pt-4">
                  <Button variant="outline" asChild>
                    <Link href="/explore-opportunities">
                      View All Opportunities
                      <ArrowUpRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}