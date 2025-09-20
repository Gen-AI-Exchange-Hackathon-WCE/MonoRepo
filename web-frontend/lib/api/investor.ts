import { apiClient } from "../api";
import { ApiResponse } from "./auth";

// Types for investor management
export interface Investor {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    investmentFocusCode: number | null;
    organization: string | null;
    minInvestment: number | null;
    maxInvestment: number | null;
    location: string | null;
    description: string | null;
    website: string | null;
    linkedInUrl: string | null;
    createdAt: string;
    updatedAt: string;
    investmentFocus: {
        code: number;
        name: string;
        description: string;
        iconUrl: string | null;
    } | null;
}

export interface InvestmentInterest {
    id: number;
    artistId: number;
    investorId: number;
    message: string;
    status: "PENDING" | "ACCEPTED" | "REJECTED";
    createdAt: string;
    updatedAt: string;
    artist?: {
        id: number;
        name: string;
        email: string;
        profile?: {
            id: number;
            businessName: string | null;
            businessLocation: string;
            profilePhoto: string | null;
        };
    };
}

export interface UpdateInvestorProfileRequest {
    phone?: string;
    organization?: string;
    investmentFocus?: string;
    minInvestment?: number;
    maxInvestment?: number;
    location?: string;
    description?: string;
    website?: string;
    linkedInUrl?: string;
    investmentFocusCode?: number;
}

export interface ShowInterestRequest {
    investorId: number;
    message: string;
}

export interface UpdateInterestStatusRequest {
    interestId: number;
    isAccepted: boolean;
}

export interface GetInvestorsFilters {
    professionId?: number;
    location?: string;
    minInvestment?: number;
    maxInvestment?: number;
}

export const investorAPI = {
    /**
     * Get all investors with optional filters
     */
    getInvestors: async (filters: GetInvestorsFilters = {}): Promise<ApiResponse<Investor[]>> => {
        try {
            const params = new URLSearchParams();
            
            // Add filter parameters
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    params.append(key, value.toString());
                }
            });

            const queryString = params.toString();
            const url = queryString ? `/investor?${queryString}` : "/investor";

            return await apiClient.get<ApiResponse<Investor[]>>(url);
        } catch (error: any) {
            throw new Error(error.message || "Failed to fetch investors");
        }
    },

    /**
     * Get investor by ID
     */
    getInvestorById: async (investorId: number): Promise<ApiResponse<Investor>> => {
        try {
            return await apiClient.get<ApiResponse<Investor>>(
                `/investor/${investorId}`
            );
        } catch (error: any) {
            throw new Error(error.message || "Failed to fetch investor");
        }
    },

    /**
     * Update investor profile (for authenticated investor)
     */
    updateInvestorProfile: async (
        data: UpdateInvestorProfileRequest
    ): Promise<ApiResponse<Investor>> => {
        try {
            return await apiClient.put<ApiResponse<Investor>>(
                "/investor/update-profile",
                data
            );
        } catch (error: any) {
            throw new Error(error.message || "Failed to update investor profile");
        }
    },

    /**
     * Show interest in investment (artist requests investor)
     */
    showInterest: async (
        data: ShowInterestRequest
    ): Promise<ApiResponse<InvestmentInterest>> => {
        try {
            return await apiClient.post<ApiResponse<InvestmentInterest>>(
                "/investor/show-interest",
                data
            );
        } catch (error: any) {
            throw new Error(error.message || "Failed to send investment request");
        }
    },

    /**
     * Get investment interests by status (for investor)
     */
    getInvestmentInterestsByStatus: async (
        status: "PENDING" | "ACCEPTED" | "REJECTED"
    ): Promise<ApiResponse<InvestmentInterest[]>> => {
        try {
            return await apiClient.get<ApiResponse<InvestmentInterest[]>>(
                `/investor/interest/${status}`
            );
        } catch (error: any) {
            throw new Error(error.message || "Failed to fetch investment interests");
        }
    },

    /**
     * Update investment interest status (accept/reject)
     */
    updateInterestStatus: async (
        data: UpdateInterestStatusRequest
    ): Promise<ApiResponse<InvestmentInterest>> => {
        try {
            return await apiClient.patch<ApiResponse<InvestmentInterest>>(
                "/investor/update-status",
                data
            );
        } catch (error: any) {
            throw new Error(error.message || "Failed to update interest status");
        }
    },
};

// Convenience wrapper functions for easier imports
export const getInvestors = investorAPI.getInvestors;
export const getInvestorById = investorAPI.getInvestorById;
export const updateInvestorProfile = investorAPI.updateInvestorProfile;
export const showInterest = investorAPI.showInterest;
export const getInvestmentInterestsByStatus = investorAPI.getInvestmentInterestsByStatus;
export const updateInterestStatus = investorAPI.updateInterestStatus;