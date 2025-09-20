"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Clock, CheckCircle, XCircle, MessageSquare, Users, TrendingUp } from "lucide-react";
import Link from "next/link";

export function InvestmentRequestTracking() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Investment Requests</h2>
          <p className="text-muted-foreground">
            Track and manage your investment opportunities
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Stats Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investors Contacted</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              No requests sent yet
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Responses</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Awaiting investor responses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">
              Based on responses received
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Start Building Investment Relationships</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Connect with potential investors who are interested in supporting artists like you. 
              Browse our investor network and send personalized investment requests.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/investors">
                <Button>
                  <Users className="h-4 w-4 mr-2" />
                  Find Investors
                </Button>
              </Link>
              <Link href="/investor-dashboard">
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Investor Portal
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <p className="text-sm text-muted-foreground">
            Your latest investment-related activities will appear here
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-muted rounded-full"></div>
              <span>No recent activity</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investment Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Investment Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-medium mb-1">Craft a compelling message</h4>
              <p className="text-sm text-muted-foreground">
                Personalize your investment requests with your unique story and vision
              </p>
            </div>
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-medium mb-1">Showcase your best work</h4>
              <p className="text-sm text-muted-foreground">
                Make sure your profile highlights your most impressive pieces and achievements
              </p>
            </div>
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-medium mb-1">Be professional and responsive</h4>
              <p className="text-sm text-muted-foreground">
                Quick responses and professional communication build trust with investors
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}