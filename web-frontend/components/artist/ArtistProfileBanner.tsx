import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Award, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ProfileInfo } from "@/lib/api/profile";

interface ArtistProfileBannerProps {
    profileInfo: ProfileInfo;
    showBackButton?: boolean;
    backButtonHref?: string;
}

export function ArtistProfileBanner({ 
    profileInfo, 
    showBackButton = true, 
    backButtonHref = "/explore" 
}: ArtistProfileBannerProps) {
    return (
        <>
            {/* Banner Section */}
            <div 
                className="relative h-64 bg-gradient-to-r from-blue-500 to-purple-600 bg-cover bg-center"
                style={profileInfo.backgroundPoster ? {
                    backgroundImage: `url(${profileInfo.backgroundPoster})`,
                } : {}}
            >
                <div className="absolute inset-0 bg-black/40" />
                {showBackButton && (
                    <div className="absolute top-4 left-4">
                        <Button variant="secondary" size="sm" asChild>
                            <Link href={backButtonHref}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Link>
                        </Button>
                    </div>
                )}
            </div>

            {/* Profile Header */}
            <div className="container mx-auto px-4 -mt-16 relative z-10">
                <div className="bg-card rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                        <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                            <AvatarImage
                                src={profileInfo.profilePhoto || "/placeholder-user.jpg"}
                                alt="Artist profile"
                            />
                        </Avatar>
                        
                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold mb-2">
                                        {profileInfo.businessName || `Artist #${profileInfo.id}`}
                                    </h1>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <Badge variant="secondary" className="text-sm">
                                            {profileInfo.profession.name}
                                        </Badge>
                                        {profileInfo.businessLocation && (
                                            <Badge variant="outline" className="text-sm">
                                                <MapPin className="w-3 h-3 mr-1" />
                                                {profileInfo.businessLocation}
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            Joined {new Date(profileInfo.createdAt).toLocaleDateString()}
                                        </div>
                                        {profileInfo.badgeIds.length > 0 && (
                                            <div className="flex items-center gap-1">
                                                <Award className="w-4 h-4" />
                                                {profileInfo.badgeIds.length} badge{profileInfo.badgeIds.length !== 1 ? 's' : ''}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex gap-2">
                                    <Button variant="outline">Follow</Button>
                                    <Button>Message</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}