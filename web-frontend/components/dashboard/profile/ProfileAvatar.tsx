import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

interface ProfileAvatarProps {
    imageUrl: string | null;
    userName: string;
    onPhotoClick: () => void;
}

export function ProfileAvatar({
    imageUrl,
    userName,
    onPhotoClick,
}: ProfileAvatarProps) {
    return (
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 -mt-10 sm:-mt-12 ml-4 sm:ml-6">
            <Avatar className="w-full h-full border-4 border-white shadow-lg">
                <AvatarImage src={imageUrl || undefined} alt={userName} />
                <AvatarFallback className="text-lg sm:text-xl font-semibold">
                    {userName?.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <Button
                size="sm"
                variant="secondary"
                className="absolute -bottom-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full p-0 shadow-md"
                onClick={onPhotoClick}
            >
                <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
        </div>
    );
}