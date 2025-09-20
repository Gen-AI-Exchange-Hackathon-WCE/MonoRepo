import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";

interface ProfileBannerProps {
    backgroundUrl: string | null;
    generationStatus?: string | null;
    isGeneratingBackground: boolean;
    onGenerateBackground: () => void;
}

export function ProfileBanner({
    backgroundUrl,
    generationStatus,
    isGeneratingBackground,
    onGenerateBackground,
}: ProfileBannerProps) {
    return (
        <div className="relative w-full aspect-[3/1] rounded-lg overflow-hidden bg-gradient-to-r from-purple-400 to-pink-400">
            {backgroundUrl && (
                <img
                    src={backgroundUrl}
                    alt="Profile background"
                    className="w-full h-full object-cover"
                />
            )}
            <div className="absolute inset-0 bg-black/20"></div>
            
            {/* Generation Status */}
            {generationStatus && (
                <div className="absolute top-2 left-2 flex items-center bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                    {isGeneratingBackground ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    ) : (
                        <CheckCircle className="w-3 h-3 mr-1" />
                    )}
                    {generationStatus}
                </div>
            )}
            
            {/* Generate Background Button */}
            {!backgroundUrl && !isGeneratingBackground && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={onGenerateBackground}
                        className="bg-white bg-opacity-90 hover:bg-opacity-100"
                    >
                        Generate Background
                    </Button>
                </div>
            )}
        </div>
    );
}