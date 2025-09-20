"use client";

import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User, LogOut, TrendingUp } from "lucide-react";

export function AuthNav() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  if (isLoading) {
    return <div className="w-20 h-8 bg-muted animate-pulse rounded"></div>;
  }

  if (isAuthenticated && user) {
    const getDashboardLink = () => {
      switch (user.role) {
        case "ARTIST":
          return "/dashboard";
        case "INVESTOR":
          return "/investor-dashboard";
        default:
          return "/customer-dashboard";
      }
    };

    return (
      <div className="flex items-center gap-2">
        {user.role === "ARTIST" && (
          <Button variant="outline" size="sm" asChild>
            <Link href="/investors">
              <TrendingUp className="w-4 h-4 mr-2" />
              Find Investors
            </Link>
          </Button>
        )}
        <Button variant="ghost" size="sm" asChild>
          <Link href={getDashboardLink()}>
            <User className="w-4 h-4 mr-2" />
            {user.name}
          </Link>
        </Button>
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/auth/login">Login</Link>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <Link href="/auth/signup">Sign Up</Link>
      </Button>
    </div>
  );
}
