"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Download } from "lucide-react";
import { ProductAuthenticity } from "./types";

interface AuthenticityBadgeProps {
  authenticity: ProductAuthenticity;
}

export function AuthenticityBadge({ authenticity }: AuthenticityBadgeProps) {
  const downloadCertificate = () => {
    // Implement certificate download logic
    console.log("Downloading authenticity certificate...");
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-primary">Authenticity Certificate</h3>
            <p className="text-sm text-muted-foreground">
              {authenticity.maker} • {authenticity.region}
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-auto bg-transparent"
            onClick={downloadCertificate}
          >
            <Download className="w-3 h-3 mr-1" />
            Download PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}