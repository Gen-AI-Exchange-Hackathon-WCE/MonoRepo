"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileInfo } from "@/lib/api/profile";
import {
    ProfileHeader,
    ProfileBanner,
    ProfileAvatar,
    ProfileInfo as ProfileInfoComponent,
    ProfileSummary,
    ProfilePhotoDialog,
    ProfileEditDialog,
    GenerateDescriptionDialog,
    GenerateBackgroundDialog,
} from "./profile";

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
        background_text?: string;
        experience_text?: string;
        custom_req_text?: string;
    }) => Promise<void>;
    onGenerateBackground: (input: {
        background_text?: string;
        experience_text?: string;
        custom_req_text?: string;
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
    // Dialog states
    const [isEditingPhoto, setIsEditingPhoto] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
    const [isGeneratingBackground, setIsGeneratingBackground] = useState(false);
    
    // Loading states
    const [isLoading, setIsLoading] = useState<{
        photo?: boolean;
        update?: boolean;
        description?: boolean;
        background?: boolean;
    }>({});

    // Generated description state for preview
    const [generatedDescription, setGeneratedDescription] = useState<string>();

    // Handlers
    const handlePhotoUpload = async (file: File) => {
        setIsLoading(prev => ({ ...prev, photo: true }));
        try {
            await onUpdatePhoto(file);
        } finally {
            setIsLoading(prev => ({ ...prev, photo: false }));
        }
    };

    const handleProfileUpdate = async (data: { businessLocation: string; professionName: string }) => {
        setIsLoading(prev => ({ ...prev, update: true }));
        try {
            // This would need to be updated to match your actual API
            await onUpdateProfile();
        } finally {
            setIsLoading(prev => ({ ...prev, update: false }));
        }
    };

    const handleDescriptionGenerate = async (data: {
        background_text?: string;
        experience_text?: string;
        custom_req_text?: string;
    }) => {
        setIsLoading(prev => ({ ...prev, description: true }));
        try {
            await onGenerateDescription(data);
            // You might want to set the generated description here for preview
            // setGeneratedDescription(result.description);
        } finally {
            setIsLoading(prev => ({ ...prev, description: false }));
        }
    };

    const handleBackgroundGenerate = async (data: {
        background_text?: string;
        experience_text?: string;
        custom_req_text?: string;
    }) => {
        setIsLoading(prev => ({ ...prev, background: true }));
        try {
            await onGenerateBackground(data);
        } finally {
            setIsLoading(prev => ({ ...prev, background: false }));
        }
    };

    if (!user) {
        return null;
    }

    return (
        <Card>
            <CardContent className="p-0">
                {/* Header with action buttons */}
                <div className="p-4 sm:p-6 pb-0">
                    <ProfileHeader
                        onGenerateDescription={() => setIsGeneratingDescription(true)}
                        onGenerateBackground={() => setIsGeneratingBackground(true)}
                        onEditProfile={() => setIsEditingProfile(true)}
                    />
                </div>

                {/* Profile Banner */}
                <div className="p-4 sm:p-6 pt-4">
                    <ProfileBanner
                        backgroundUrl={profileInfo?.backgroundPoster || null}
                        generationStatus={backgroundGenerationStatus?.status || null}
                        isGeneratingBackground={backgroundGenerationStatus?.isGenerating || false}
                        onGenerateBackground={() => setIsGeneratingBackground(true)}
                    />
                </div>

                {/* Avatar and Profile Info */}
                <div className="flex flex-col sm:flex-row sm:items-end px-4 sm:px-6">
                    <ProfileAvatar
                        imageUrl={profileInfo?.profilePhoto || null}
                        userName={user.name}
                        onPhotoClick={() => setIsEditingPhoto(true)}
                    />
                    <ProfileInfoComponent user={user} />
                </div>

                {/* Profile Summary */}
                <div className="p-4 sm:p-6 pt-6">
                    <ProfileSummary profileInfo={profileInfo} />
                </div>

                {/* Dialogs */}
                <ProfilePhotoDialog
                    isOpen={isEditingPhoto}
                    onClose={() => setIsEditingPhoto(false)}
                    onUpload={handlePhotoUpload}
                    isUploading={isLoading.photo || false}
                />

                <ProfileEditDialog
                    isOpen={isEditingProfile}
                    onClose={() => setIsEditingProfile(false)}
                    profileInfo={profileInfo}
                    onSave={handleProfileUpdate}
                    isSaving={isLoading.update || false}
                />

                <GenerateDescriptionDialog
                    isOpen={isGeneratingDescription}
                    onClose={() => setIsGeneratingDescription(false)}
                    onGenerate={handleDescriptionGenerate}
                    isGenerating={isLoading.description || false}
                    generatedDescription={generatedDescription}
                />

                <GenerateBackgroundDialog
                    isOpen={isGeneratingBackground}
                    onClose={() => setIsGeneratingBackground(false)}
                    onGenerate={handleBackgroundGenerate}
                    isGenerating={isLoading.background || false}
                />
            </CardContent>
        </Card>
    );
}