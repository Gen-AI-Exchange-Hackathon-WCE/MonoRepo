import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Edit, Camera, Image as ImageIcon } from "lucide-react";
import { ProfileInfo } from "@/lib/api/profile";

interface User {
    id: number;
    name: string;
    email?: string;
}

interface ProfileSectionProps {
    user: User | null;
    profileInfo: ProfileInfo | null;
    onUpdateProfile: () => Promise<void>;
    onUpdatePhoto: (file: File) => Promise<void>;
    onGenerateDescription: (input: {
        background: string;
        experience: string;
        custom: string;
    }) => Promise<void>;
    onGenerateBackground: (input: {
        background: string;
        experience: string;
        custom: string;
    }) => Promise<void>;
    backgroundGenerationStatus?: {
        isGenerating: boolean;
        status?: string;
        jobId?: number;
    };
}

export function ProfileSection({
    user,
    profileInfo,
    onUpdateProfile,
    onUpdatePhoto,
    onGenerateDescription,
    onGenerateBackground,
    backgroundGenerationStatus,
}: ProfileSectionProps) {
    const [isEditingPhoto, setIsEditingPhoto] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isGeneratingDescription, setIsGeneratingDescription] =
        useState(false);
    const [isGeneratingBackground, setIsGeneratingBackground] = useState(false);
    const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState<{
        photo?: boolean;
        update?: boolean;
        description?: boolean;
        background?: boolean;
    }>({});
    const [error, setError] = useState<{
        photo?: string;
        update?: string;
        description?: string;
        background?: string;
    }>({});
    const [descriptionInput, setDescriptionInput] = useState({
        background: "",
        experience: "",
        custom: "",
    });
    const [backgroundInput, setBackgroundInput] = useState({
        background: "",
        experience: "",
        custom: "",
    });
    const [tempProfileInfo, setTempProfileInfo] = useState<ProfileInfo | null>(
        profileInfo
    );

    const handlePhotoUpload = async () => {
        if (!profilePhotoFile) return;

        setIsLoading((prev) => ({ ...prev, photo: true }));
        setError((prev) => ({ ...prev, photo: undefined }));

        try {
            await onUpdatePhoto(profilePhotoFile);
            setIsEditingPhoto(false);
            setProfilePhotoFile(null);
        } catch (error: any) {
            console.error("Failed to update profile photo:", error);
            setError((prev) => ({
                ...prev,
                photo: "Failed to update profile photo",
            }));
        } finally {
            setIsLoading((prev) => ({ ...prev, photo: false }));
        }
    };

    const handleUpdateProfile = async () => {
        setIsLoading((prev) => ({ ...prev, update: true }));
        setError((prev) => ({ ...prev, update: undefined }));

        try {
            await onUpdateProfile();
            setIsEditingProfile(false);
        } catch (error: any) {
            console.error("Failed to update profile:", error);
            setError((prev) => ({
                ...prev,
                update: "Failed to update profile",
            }));
        } finally {
            setIsLoading((prev) => ({ ...prev, update: false }));
        }
    };

    const handleGenerateDescription = async () => {
        setIsLoading((prev) => ({ ...prev, description: true }));
        setError((prev) => ({ ...prev, description: undefined }));

        try {
            await onGenerateDescription(descriptionInput);
            setIsGeneratingDescription(false);
            setDescriptionInput({ background: "", experience: "", custom: "" });
        } catch (error: any) {
            console.error("Failed to generate description:", error);
            setError((prev) => ({
                ...prev,
                description: "Failed to generate description",
            }));
        } finally {
            setIsLoading((prev) => ({ ...prev, description: false }));
        }
    };

    const handleGenerateBackground = async () => {
        setIsLoading((prev) => ({ ...prev, background: true }));
        setError((prev) => ({ ...prev, background: undefined }));

        try {
            await onGenerateBackground(backgroundInput);
            setIsGeneratingBackground(false);
            setBackgroundInput({ background: "", experience: "", custom: "" });
        } catch (error: any) {
            console.error("Failed to generate background:", error);
            setError((prev) => ({
                ...prev,
                background: "Failed to generate background",
            }));
        } finally {
            setIsLoading((prev) => ({ ...prev, background: false }));
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
                    <div>
                        <CardTitle className="text-lg sm:text-xl">
                            Profile Information
                        </CardTitle>
                        <CardDescription className="text-sm">
                            Manage your business and professional details
                        </CardDescription>
                    </div>
                    <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsGeneratingDescription(true)}
                            className="w-full sm:w-auto min-h-[2.5rem] text-xs sm:text-sm"
                        >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">Generate </span>
                            Description
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsGeneratingBackground(true)}
                            className="w-full sm:w-auto min-h-[2.5rem] text-xs sm:text-sm"
                        >
                            <ImageIcon className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">Generate </span>
                            Background
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditingProfile(true)}
                            className="w-full sm:w-auto min-h-[2.5rem] text-xs sm:text-sm"
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">Edit </span>
                            Profile
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
                {/* Photo Edit Dialog */}
                <Dialog open={isEditingPhoto} onOpenChange={setIsEditingPhoto}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Update Profile Photo</DialogTitle>
                            <DialogDescription>
                                Choose a new profile photo
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="photo">Profile Photo</Label>
                                <Input
                                    id="photo"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setProfilePhotoFile(file);
                                        }
                                    }}
                                />
                            </div>
                            {error.photo && (
                                <p className="text-sm text-destructive">
                                    {error.photo}
                                </p>
                            )}
                            <div className="flex justify-end space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditingPhoto(false)}
                                    disabled={isLoading.photo}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handlePhotoUpload}
                                    disabled={
                                        !profilePhotoFile || isLoading.photo
                                    }
                                >
                                    {isLoading.photo
                                        ? "Uploading..."
                                        : "Upload Photo"}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Edit Profile Dialog */}
                <Dialog
                    open={isEditingProfile}
                    onOpenChange={setIsEditingProfile}
                >
                    <DialogContent className="sm:max-w-[725px]">
                        <DialogHeader>
                            <DialogTitle>Edit Profile</DialogTitle>
                            <DialogDescription>
                                Update your business and professional
                                information.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="profession">
                                        Profession
                                    </Label>
                                    <Input
                                        id="profession"
                                        value={
                                            tempProfileInfo?.profession.name ||
                                            ""
                                        }
                                        onChange={(e) => {
                                            setTempProfileInfo((prev) =>
                                                prev
                                                    ? {
                                                          ...prev,
                                                          profession: {
                                                              ...prev.profession,
                                                              name: e.target
                                                                  .value,
                                                          },
                                                      }
                                                    : null
                                            );
                                        }}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="businessLocation">
                                        Business Location
                                    </Label>
                                    <Input
                                        id="businessLocation"
                                        value={
                                            tempProfileInfo?.businessLocation ||
                                            ""
                                        }
                                        onChange={(e) => {
                                            setTempProfileInfo((prev) =>
                                                prev
                                                    ? {
                                                          ...prev,
                                                          businessLocation:
                                                              e.target.value,
                                                      }
                                                    : null
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        {error.update && (
                            <p className="text-sm text-destructive">
                                {error.update}
                            </p>
                        )}
                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsEditingProfile(false)}
                                disabled={isLoading.update}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleUpdateProfile}
                                disabled={isLoading.update}
                            >
                                {isLoading.update
                                    ? "Saving..."
                                    : "Save Changes"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Generate Description Dialog */}
                <Dialog
                    open={isGeneratingDescription}
                    onOpenChange={setIsGeneratingDescription}
                >
                    <DialogContent className="sm:max-w-[725px]">
                        <DialogHeader>
                            <DialogTitle>
                                Generate Professional Description
                            </DialogTitle>
                            <DialogDescription>
                                Our AI will help generate a professional
                                description based on your background and
                                experience.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="background">Background</Label>
                                <Textarea
                                    id="background"
                                    placeholder="Tell us about your background in this field..."
                                    value={descriptionInput.background}
                                    onChange={(e) =>
                                        setDescriptionInput((prev) => ({
                                            ...prev,
                                            background: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="experience">
                                    Experience & Achievements
                                </Label>
                                <Textarea
                                    id="experience"
                                    placeholder="Share your experience, achievements, and notable projects..."
                                    value={descriptionInput.experience}
                                    onChange={(e) =>
                                        setDescriptionInput((prev) => ({
                                            ...prev,
                                            experience: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="custom">
                                    Additional Information
                                </Label>
                                <Textarea
                                    id="custom"
                                    placeholder="Any other details you'd like to highlight (specializations, teaching experience, etc.)..."
                                    value={descriptionInput.custom}
                                    onChange={(e) =>
                                        setDescriptionInput((prev) => ({
                                            ...prev,
                                            custom: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                        </div>
                        {error.description && (
                            <p className="text-sm text-destructive">
                                {error.description}
                            </p>
                        )}
                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="outline"
                                onClick={() =>
                                    setIsGeneratingDescription(false)
                                }
                                disabled={isLoading.description}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleGenerateDescription}
                                disabled={isLoading.description}
                            >
                                {isLoading.description
                                    ? "Generating..."
                                    : "Generate Description"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Generate Background Dialog */}
                <Dialog
                    open={isGeneratingBackground}
                    onOpenChange={setIsGeneratingBackground}
                >
                    <DialogContent className="mx-4 sm:mx-0 sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-base sm:text-lg">
                                Generate Background Image
                            </DialogTitle>
                            <DialogDescription className="text-sm">
                                Provide information to generate a custom
                                background image for your profile.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="bg-background"
                                    className="text-sm font-medium"
                                >
                                    Background Information
                                </Label>
                                <Textarea
                                    id="bg-background"
                                    placeholder="Describe your artistic background and style..."
                                    value={backgroundInput.background}
                                    className="min-h-[80px] text-sm"
                                    onChange={(e) =>
                                        setBackgroundInput((prev) => ({
                                            ...prev,
                                            background: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="bg-experience"
                                    className="text-sm font-medium"
                                >
                                    Experience & Skills
                                </Label>
                                <Textarea
                                    id="bg-experience"
                                    placeholder="Describe your experience and expertise..."
                                    value={backgroundInput.experience}
                                    className="min-h-[80px] text-sm"
                                    onChange={(e) =>
                                        setBackgroundInput((prev) => ({
                                            ...prev,
                                            experience: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="bg-custom"
                                    className="text-sm font-medium"
                                >
                                    Custom Requests (Optional)
                                </Label>
                                <Textarea
                                    id="bg-custom"
                                    placeholder="Any specific style, colors, or elements you'd like to include..."
                                    value={backgroundInput.custom}
                                    className="min-h-[80px] text-sm"
                                    onChange={(e) =>
                                        setBackgroundInput((prev) => ({
                                            ...prev,
                                            custom: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                            {error.background && (
                                <p className="text-sm text-destructive">
                                    {error.background}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-end sm:space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsGeneratingBackground(false)}
                                disabled={isLoading.background}
                                className="w-full sm:w-auto min-h-[2.5rem]"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleGenerateBackground}
                                disabled={isLoading.background}
                                className="w-full sm:w-auto min-h-[2.5rem]"
                            >
                                {isLoading.background
                                    ? "Generating..."
                                    : "Generate Background"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                <div className="grid gap-4 sm:gap-6">
                    {/* Profile Banner */}
                    <div
                        className="relative w-full aspect-[3/1] bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg overflow-hidden"
                        style={
                            profileInfo?.backgroundPoster
                                ? {
                                      backgroundImage: `url(${profileInfo.backgroundPoster})`,
                                      backgroundSize: "cover",
                                      backgroundPosition: "center",
                                  }
                                : {}
                        }
                    >
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 text-white max-w-[calc(100%-1rem)] sm:max-w-[calc(100%-2rem)]">
                            <h2 className="text-lg sm:text-2xl font-bold truncate">
                                {profileInfo?.businessName ||
                                    user?.name ||
                                    "Your Profile"}
                            </h2>
                            <p className="text-xs sm:text-sm opacity-90 truncate">
                                {profileInfo?.profession?.name || "Artist"}
                            </p>
                        </div>
                        {backgroundGenerationStatus?.isGenerating && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <div className="text-white text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                                    <p className="text-sm">
                                        {backgroundGenerationStatus.status ===
                                        "PENDING"
                                            ? "Queuing background generation..."
                                            : backgroundGenerationStatus.status ===
                                              "PROCESSING"
                                            ? "Generating background..."
                                            : "Processing..."}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
                        <div className="relative">
                            <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
                                <AvatarImage
                                    src={
                                        profileInfo?.profilePhoto ||
                                        "/placeholder-user.jpg"
                                    }
                                    alt={user?.name || ""}
                                />
                            </Avatar>
                            <div className="absolute bottom-0 right-0">
                                <button
                                    className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground"
                                    onClick={() => setIsEditingPhoto(true)}
                                >
                                    <Camera className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2 flex-1 text-center sm:text-left">
                            <div>
                                <h3 className="text-base sm:text-lg font-medium">
                                    {user?.name}
                                </h3>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    {profileInfo?.id
                                        ? `Artist #${profileInfo.id}`
                                        : ""}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center sm:justify-start">
                                {profileInfo?.profession?.name && (
                                    <Badge variant="secondary">
                                        {profileInfo.profession.name}
                                    </Badge>
                                )}
                                {profileInfo?.businessLocation && (
                                    <Badge variant="outline">
                                        {profileInfo.businessLocation}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:gap-6 mt-3 sm:mt-4">
                        <div className="bg-muted/50 rounded-lg p-3 sm:p-4">
                            <h4 className="text-sm font-medium mb-2">
                                Professional Summary
                            </h4>
                            <div className="prose prose-sm max-w-none text-sm sm:text-base">
                                {profileInfo?.descriptions.find(
                                    (d) => d.isActive
                                )?.descriptionMarkdown ? (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: profileInfo.descriptions
                                                .find((d) => d.isActive)!
                                                .descriptionMarkdown.replace(
                                                    "```",
                                                    ""
                                                )
                                                .replace("```", "")
                                                .replace("markdown", "")
                                                .trim(),
                                        }}
                                    />
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No professional description available.
                                        Click "Generate Description" to create
                                        one.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-4 px-2 sm:px-4">
                            <div>
                                <h4 className="text-sm font-medium mb-2">
                                    Business Details
                                </h4>
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                    <div className="flex justify-between sm:contents">
                                        <dt className="font-medium">
                                            Location
                                        </dt>
                                        <dd className="text-muted-foreground">
                                            {profileInfo?.businessLocation ||
                                                "Not specified"}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between sm:contents">
                                        <dt className="font-medium">
                                            Profession
                                        </dt>
                                        <dd className="text-muted-foreground">
                                            {profileInfo?.profession.name ||
                                                "Not specified"}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
