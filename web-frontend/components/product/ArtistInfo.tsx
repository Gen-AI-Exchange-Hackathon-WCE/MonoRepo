"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Play, Pause } from "lucide-react";
import Link from "next/link";
import { ProductMaker } from "./types";

interface ArtistInfoProps {
  maker: ProductMaker;
}

export function ArtistInfo({ maker }: ArtistInfoProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
    // Simulate audio playback
    if (!isPlaying) {
      setTimeout(() => setIsPlaying(false), 3000);
    }
  };

  const profileSlug = maker.name.toLowerCase().replace(/\s+/g, "-");

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={maker.avatar || "/placeholder.svg"} />
            <AvatarFallback>{maker.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold">{maker.name}</h3>
            <p className="text-sm text-muted-foreground flex items-center mb-2">
              <MapPin className="w-3 h-3 mr-1" />
              {maker.location}
            </p>
            <p className="text-sm mb-3">{maker.bio}</p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleAudio}
                className="flex items-center bg-transparent"
              >
                {isPlaying ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                Listen to maker
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/artist/${profileSlug}`}>
                  Visit Profile
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}