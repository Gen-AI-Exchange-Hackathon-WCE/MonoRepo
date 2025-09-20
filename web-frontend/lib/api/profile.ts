import { apiClient } from "../api";
import { ApiResponse } from "./auth";

// Types for profile management
export interface ProfileInfo {
    id: number;
    artistId: number;
    professionCode: number;
    businessName: string | null;
    businessLocation: string;
    profilePhoto: string | null;
    backgroundPoster: string;
    backgroundVideos: string[];
    badgeIds: number[];
    createdAt: string;
    profession: {
        code: number;
        name: string;
        description: string;
        iconUrl: string | null;
    };
    descriptions: Array<{
        id: number;
        descriptionMarkdown: string;
        descriptionText: string;
        location: string;
        backgroundInfo: string;
        experience: string;
        isActive: boolean;
        createdAt: string;
    }>;
}

export interface GenerateDescriptionRequest {
    background_text?: string;
    experience_text?: string;
    custom_req_text?: string;
}

export interface UpdateProfileRequest {
    businessLocation?: string;
    profession?: {
        name: string;
    };
}

export interface GenerateBackgroundRequest {
    background_text?: string;
    experience_text?: string;
    custom_req_text?: string;
}

export interface BackgroundGenerationJob {
    id: number;
    artistId: number;
    status: "pending" | "completed" | "failed";
    imageUrl: string | null;
    createdAt: string;
    updatedAt: string;
}

export const profileAPI = {
    /**
     * Get artist profile by ID
     */
    getProfile: async (artistId: number): Promise<ApiResponse<ProfileInfo>> => {
        try {
            return await apiClient.get<ApiResponse<ProfileInfo>>(
                `/profile/${artistId}`
            );
        } catch (error: any) {
            throw new Error(error.message || "Failed to fetch profile");
        }
    },

    /**
     * Update profile photo
     */
    updateProfilePhoto: async (
        file: File
    ): Promise<ApiResponse<{ profilePhotoUrl: string }>> => {
        try {
            const formData = new FormData();
            formData.append("profilePhoto", file);

            return await apiClient.put<
                ApiResponse<{ profilePhotoUrl: string }>
            >("/profile/photo", formData);
        } catch (error: any) {
            throw new Error(error.message || "Failed to update profile photo");
        }
    },

    /**
     * Generate profile description
     */
    generateDescription: async (
        data: GenerateDescriptionRequest
    ): Promise<ApiResponse<string>> => {
        try {
            return await apiClient.post<ApiResponse<string>>(
                "/profile/generate-description",
                data
            );
        } catch (error: any) {
            throw new Error(
                error.message || "Failed to generate profile description"
            );
        }
    },

    /**
     * Update profile information
     */
    updateProfile: async (
        data: UpdateProfileRequest
    ): Promise<ApiResponse<ProfileInfo>> => {
        try {
            return await apiClient.put<ApiResponse<ProfileInfo>>(
                "/profile",
                data
            );
        } catch (error: any) {
            throw new Error(
                error.message || "Failed to update profile information"
            );
        }
    },

    /**
     * Generate profile background image
     */
    generateBackground: async (
        data: GenerateBackgroundRequest
    ): Promise<ApiResponse<{ jobId: number }>> => {
        try {
            return await apiClient.post<ApiResponse<{ jobId: number }>>(
                "/profile/generate-background",
                data
            );
        } catch (error: any) {
            throw new Error(
                error.message || "Failed to generate profile background"
            );
        }
    },

    /**
     * Get background generation status
     */
    getBackgroundStatus: async (
        jobId: number
    ): Promise<ApiResponse<BackgroundGenerationJob>> => {
        try {
            return await apiClient.get<ApiResponse<BackgroundGenerationJob>>(
                `/profile/background-status/${jobId}`
            );
        } catch (error: any) {
            throw new Error(
                error.message || "Failed to get background generation status"
            );
        }
    },
};
// I am very good artist who makes authentic handmade pots
// I have experience of more than 20 years and made 1000+ pots
