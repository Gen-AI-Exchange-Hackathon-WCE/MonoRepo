import { Button } from "@/components/ui/button";
import { CheckCircle, Edit, Image as ImageIcon } from "lucide-react";

interface ProfileHeaderProps {
    onGenerateDescription: () => void;
    onGenerateBackground: () => void;
    onEditProfile: () => void;
}

export function ProfileHeader({
    onGenerateDescription,
    onGenerateBackground,
    onEditProfile,
}: ProfileHeaderProps) {
    return (
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
            <div>
                <h3 className="text-lg sm:text-xl font-semibold">
                    Profile Information
                </h3>
                <p className="text-sm text-muted-foreground">
                    Manage your business and professional details
                </p>
            </div>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onGenerateDescription}
                    className="w-full sm:w-auto min-h-[2.5rem] text-xs sm:text-sm"
                >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Generate </span>
                    Description
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onGenerateBackground}
                    className="w-full sm:w-auto min-h-[2.5rem] text-xs sm:text-sm"
                >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Generate </span>
                    Background
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onEditProfile}
                    className="w-full sm:w-auto min-h-[2.5rem] text-xs sm:text-sm"
                >
                    <Edit className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Edit </span>
                    Profile
                </Button>
            </div>
        </div>
    );
}