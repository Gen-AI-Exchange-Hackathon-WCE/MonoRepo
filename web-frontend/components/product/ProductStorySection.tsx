"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Copy, Facebook, Twitter, MessageCircle } from "lucide-react";
import { ProductStory, ProductSocialKit } from "./types";

interface ProductStorySectionProps {
  story: ProductStory;
  socialKit: ProductSocialKit;
}

export function ProductStorySection({ story, socialKit }: ProductStorySectionProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("english");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const shareToSocial = (platform: string) => {
    const url = window.location.href;
    const text = socialKit.caption;

    switch (platform) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`);
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
    }
  };

  return (
    <div className="mt-12">
      <Tabs defaultValue="story" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="story">Story</TabsTrigger>
          <TabsTrigger value="social">Social Kit</TabsTrigger>
        </TabsList>

        <TabsContent value="story" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>The Story Behind This Craft</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant={selectedLanguage === "english" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLanguage("english")}
                  >
                    English
                  </Button>
                  <Button
                    variant={selectedLanguage === "hindi" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLanguage("hindi")}
                  >
                    हिंदी
                  </Button>
                  <Button
                    variant={selectedLanguage === "marathi" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLanguage("marathi")}
                  >
                    मराठी
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {selectedLanguage === "english" && (
                  <p className="text-muted-foreground leading-relaxed">{story.long}</p>
                )}
                {selectedLanguage === "hindi" && (
                  <p className="text-muted-foreground leading-relaxed">{story.translations.hindi}</p>
                )}
                {selectedLanguage === "marathi" && (
                  <p className="text-muted-foreground leading-relaxed">{story.translations.marathi}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Kit</CardTitle>
              <CardDescription>Ready-to-share content for your social media</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="font-medium">Caption</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(socialKit.caption)}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">{socialKit.caption}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="font-medium">Hashtags</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(socialKit.hashtags)}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">{socialKit.hashtags}</p>
                </div>
              </div>

              <div>
                <Label className="font-medium mb-2 block">Share</Label>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => shareToSocial("whatsapp")}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button variant="outline" onClick={() => shareToSocial("facebook")}>
                    <Facebook className="w-4 h-4 mr-2" />
                    Facebook
                  </Button>
                  <Button variant="outline" onClick={() => shareToSocial("twitter")}>
                    <Twitter className="w-4 h-4 mr-2" />
                    Twitter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}