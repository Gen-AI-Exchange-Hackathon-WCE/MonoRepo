"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Plus, Settings } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { profileAPI, ProfileInfo } from "@/lib/api/profile";
// Import dashboard components
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { ProductSection } from "@/components/dashboard/ProductSection";
import { CourseSection } from "@/components/dashboard/CourseSection";
import { ProfileSection } from "@/components/dashboard/ProfileSection";
import { RecentOverview } from "@/components/dashboard/RecentOverview";
import { InvestmentRequestTracking } from "@/components/artist/InvestmentRequestTracking";

interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    status: "draft" | "published";
    images: string[];
    views: number;
    saves: number;
    lastUpdated: string;
}

export default function DashboardPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("overview");
    const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [isEditingPhoto, setIsEditingPhoto] = useState(false);
    const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState<{
        profile?: boolean;
        photo?: boolean;
    }>({});
    const [error, setError] = useState<{
        profile?: string;
        photo?: string;
    }>({});
    const [backgroundGenerationStatus, setBackgroundGenerationStatus] =
        useState<{
            isGenerating: boolean;
            status?: string;
            jobId?: number;
        }>({
            isGenerating: false,
        });

    useEffect(() => {
        if (!user) {
            router.push("/auth/login");
            return;
        }

        // Fetch profile info
        const fetchProfile = async () => {
            try {
                const response = await profileAPI.getProfile(
                    user.userId ? user.userId : user.id
                );
                setProfileInfo(response.data);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            }
        };

        fetchProfile();
        setProducts([]);
    }, [user, router]);

    // Handler functions for child components
    const handleUpdatePhoto = async (file: File) => {
        setIsLoading((prev) => ({ ...prev, photo: true }));
        setError((prev) => ({ ...prev, photo: undefined }));

        try {
            const response = await profileAPI.updateProfilePhoto(file);
            if (response.data.profilePhotoUrl) {
                setProfileInfo((prev) =>
                    prev
                        ? {
                              ...prev,
                              profilePhoto: response.data.profilePhotoUrl,
                          }
                        : null
                );
            }
        } catch (error: any) {
            console.error("Failed to update profile photo:", error);
            throw new Error("Failed to update profile photo");
        } finally {
            setIsLoading((prev) => ({ ...prev, photo: false }));
        }
    };

    const handleUpdateProfile = async () => {
        try {
            if (
                profileInfo?.businessLocation !== undefined ||
                profileInfo?.profession.name !== undefined
            ) {
                await profileAPI.updateProfile({
                    businessLocation: profileInfo?.businessLocation || "",
                    profession: profileInfo?.profession || { name: "" },
                });
            }

            const updatedProfile = await profileAPI.getProfile(user!.id);
            setProfileInfo(updatedProfile.data);
        } catch (error: any) {
            console.error("Failed to update profile:", error);
            throw new Error("Failed to update profile");
        }
    };

    const handleGenerateDescription = async (input: {
        background_text?: string;
        experience_text?: string;
        custom_req_text?: string;
    }) => {
        try {
            await profileAPI.generateDescription({
                background_text: input.background_text,
                experience_text: input.experience_text,
                custom_req_text: input.custom_req_text,
            });

            const updatedProfile = await profileAPI.getProfile(user!.id);
            setProfileInfo(updatedProfile.data);
        } catch (error: any) {
            console.error("Failed to generate description:", error);
            throw new Error("Failed to generate description");
        }
    };

    const handleGenerateBackground = async (input: {
        background_text?: string;
        experience_text?: string;
        custom_req_text?: string;
    }) => {
        try {
            // Start background generation
            setBackgroundGenerationStatus({
                isGenerating: true,
                status: "PENDING",
            });

            const response = await profileAPI.generateBackground({
                background_text: input.background_text,
                experience_text: input.experience_text,
                custom_req_text: input.custom_req_text,
            });

            const jobId = response.data.jobId;
            setBackgroundGenerationStatus({
                isGenerating: true,
                status: "PROCESSING",
                jobId,
            });

            // Start polling for completion
            const pollInterval = setInterval(async () => {
                try {
                    const statusResponse = await profileAPI.getBackgroundStatus(
                        jobId
                    );
                    const status = statusResponse.data;

                    setBackgroundGenerationStatus({
                        isGenerating:
                            status.status !== "completed" &&
                            status.status !== "failed",
                        status: status.status,
                        jobId,
                    });

                    if (status.status === "completed") {
                        clearInterval(pollInterval);
                        // Refresh profile to get the new background
                        const updatedProfile = await profileAPI.getProfile(
                            user!.id
                        );
                        setProfileInfo(updatedProfile.data);
                        setBackgroundGenerationStatus({
                            isGenerating: false,
                        });
                    } else if (status.status === "failed") {
                        clearInterval(pollInterval);
                        setBackgroundGenerationStatus({
                            isGenerating: false,
                        });
                        throw new Error("Background generation failed");
                    }
                    // Continue polling if status is PENDING or PROCESSING
                } catch (pollError) {
                    clearInterval(pollInterval);
                    setBackgroundGenerationStatus({
                        isGenerating: false,
                    });
                    console.error(
                        "Failed to check background status:",
                        pollError
                    );
                    throw pollError;
                }
            }, 3000); // Poll every 3 seconds

            // Set a timeout to stop polling after 5 minutes
            setTimeout(() => {
                clearInterval(pollInterval);
                setBackgroundGenerationStatus({
                    isGenerating: false,
                });
            }, 300000);
        } catch (error: any) {
            setBackgroundGenerationStatus({
                isGenerating: false,
            });
            console.error("Failed to generate background:", error);
            throw new Error("Failed to generate background");
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-card">
                <div className="container mx-auto px-4 py-4 sm:py-6">
                    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="relative">
                                <Avatar className="w-12 h-12 sm:w-16 sm:h-16">
                                    <AvatarImage
                                        src={
                                            profileInfo?.profilePhoto ||
                                            "/placeholder-user.jpg"
                                        }
                                        alt={user?.name || ""}
                                    />
                                </Avatar>
                            </div>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-lg sm:text-2xl font-bold truncate">
                                    Welcome back, {user?.name || "Artist"}!
                                </h1>
                                <p className="text-sm text-muted-foreground truncate">
                                    {profileInfo?.profession.name}
                                    {profileInfo?.businessLocation && (
                                        <span className="hidden sm:inline">
                                            {" "}
                                            • {profileInfo.businessLocation}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <Button
                                size="sm"
                                className="flex-1 sm:flex-none"
                                asChild
                            >
                                <Link href="/dashboard/create-product">
                                    <Plus className="w-4 h-4 mr-1 sm:mr-2" />
                                    <span className="hidden sm:inline">
                                        Create{" "}
                                    </span>
                                    Product
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 sm:flex-none"
                                asChild
                            >
                                <Link href="/dashboard/create-course">
                                    <Plus className="w-4 h-4 mr-1 sm:mr-2" />
                                    <span className="hidden sm:inline">
                                        Create{" "}
                                    </span>
                                    Course
                                </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/dashboard/settings">
                                    <Settings className="w-4 h-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            {/* Main Content */}
            <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-6">
                <Tabs
                    defaultValue={activeTab}
                    className="space-y-3 sm:space-y-4"
                >
                    <TabsList className="grid w-full grid-cols-5 h-auto p-0.5 sm:p-1">
                        <TabsTrigger
                            value="overview"
                            className="text-xs sm:text-sm py-2.5 px-1 sm:px-3 data-[state=active]:bg-background data-[state=active]:text-foreground"
                        >
                            Overview
                        </TabsTrigger>
                        <TabsTrigger
                            value="products"
                            className="text-xs sm:text-sm py-2.5 px-1 sm:px-3 data-[state=active]:bg-background data-[state=active]:text-foreground"
                        >
                            Products
                        </TabsTrigger>
                        <TabsTrigger
                            value="courses"
                            className="text-xs sm:text-sm py-2.5 px-1 sm:px-3 data-[state=active]:bg-background data-[state=active]:text-foreground"
                        >
                            Courses
                        </TabsTrigger>
                        <TabsTrigger
                            value="profile"
                            className="text-xs sm:text-sm py-2.5 px-1 sm:px-3 data-[state=active]:bg-background data-[state=active]:text-foreground"
                        >
                            Profile
                        </TabsTrigger>
                        <TabsTrigger
                            value="investments"
                            className="text-xs sm:text-sm py-2.5 px-1 sm:px-3 data-[state=active]:bg-background data-[state=active]:text-foreground"
                        >
                            Investments
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent
                        value="overview"
                        className="space-y-3 sm:space-y-4"
                    >
                        <StatsOverview
                            products={{
                                length: products.length,
                                views: products.reduce(
                                    (sum, p) => sum + p.views,
                                    0
                                ),
                                saves: products.reduce(
                                    (sum, p) => sum + p.saves,
                                    0
                                ),
                            }}
                            courses={{ length: 0 }}
                        />
                        <RecentOverview products={products} courses={[]} />
                    </TabsContent>

                    <TabsContent
                        value="products"
                        className="space-y-3 sm:space-y-4"
                    >
                        <ProductSection />
                    </TabsContent>

                    <TabsContent
                        value="courses"
                        className="space-y-3 sm:space-y-4"
                    >
                        <CourseSection />
                    </TabsContent>

                    <TabsContent
                        value="profile"
                        className="space-y-3 sm:space-y-4"
                    >
                        <ProfileSection
                            user={user}
                            profileInfo={profileInfo}
                            onUpdateProfile={handleUpdateProfile}
                            onUpdatePhoto={handleUpdatePhoto}
                            onGenerateDescription={handleGenerateDescription}
                            onGenerateBackground={handleGenerateBackground}
                            backgroundGenerationStatus={
                                backgroundGenerationStatus
                            }
                        />
                    </TabsContent>

                    <TabsContent
                        value="investments"
                        className="space-y-3 sm:space-y-4"
                    >
                        <InvestmentRequestTracking />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
