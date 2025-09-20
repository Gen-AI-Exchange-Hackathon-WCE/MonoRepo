import { apiClient } from "../api";

// Types for authentication
export interface LoginRequest {
    name?: string;
    email?: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    role: "CUSTOMER" | "ARTIST" | "INVESTOR";
    professionCode?: number; // Required when role is ARTIST
    businessLocation?: string; // Required when role is ARTIST
}

export interface AuthResponse {
    userId?: number;
    username?: string;
    id: number;
    name: string;
    role: "CUSTOMER" | "ARTIST" | "INVESTOR";
}

export interface ApiResponse<T> {
    statusCode: number;
    data: T;
    message: string;
    success: boolean;
}

export interface ApiError {
    statusCode: number;
    message: string;
    errors: string[];
    success: boolean;
    stack?: string;
}

export const authAPI = {
    /**
     * Login user with name/email and password
     */
    login: async (
        credentials: LoginRequest
    ): Promise<ApiResponse<AuthResponse>> => {
        try {
            return await apiClient.post<ApiResponse<AuthResponse>>(
                "/auth/login",
                credentials
            );
        } catch (error: any) {
            throw new Error(error.message || "Login failed");
        }
    },

    /**
     * Register a new user
     */
    register: async (
        userData: RegisterRequest
    ): Promise<ApiResponse<AuthResponse>> => {
        try {
            // Validate required fields for artist role
            if (userData.role === "ARTIST" && !userData.professionCode) {
                throw new Error(
                    "Profession code is required for artist registration"
                );
            }

            return await apiClient.post<ApiResponse<AuthResponse>>(
                "/auth/register",
                userData
            );
        } catch (error: any) {
            throw new Error(error.message || "Registration failed");
        }
    },

    /**
     * Logout current user
     */
    logout: async (): Promise<ApiResponse<{}>> => {
        try {
            return await apiClient.post<ApiResponse<{}>>("/auth/logout");
        } catch (error: any) {
            throw new Error(error.message || "Logout failed");
        }
    },

    /**
     * Verify current session
     */
    verifySession: async (): Promise<ApiResponse<AuthResponse>> => {
        try {
            return await apiClient.get<ApiResponse<AuthResponse>>(
                "/auth/verify-session"
            );
        } catch (error: any) {
            throw new Error(error.message || "Session verification failed");
        }
    },
};

// Utility functions for authentication state management
export const authUtils = {
    /**
     * Check if user is authenticated by verifying session
     */
    isAuthenticated: async (): Promise<boolean> => {
        try {
            await authAPI.verifySession();
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Get current user data if authenticated
     */
    getCurrentUser: async (): Promise<AuthResponse | null> => {
        try {
            const response = await authAPI.verifySession();
            return response.data;
        } catch {
            return null;
        }
    },
};

// Export default auth API
export default authAPI;
