"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authAPI, authUtils, AuthResponse } from "../api/auth";

interface AuthContextType {
    user: AuthResponse | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: {
        email: string;
        password: string;
    }) => Promise<{ success: boolean; error?: string }>;
    register: (userData: {
        name: string;
        email: string;
        password: string;
        role: "ARTIST" | "CUSTOMER" | "INVESTOR";
        professionCode?: number;
        businessLocation?: string;
    }) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<AuthResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const isAuthenticated = !!user;

    // Check authentication status on mount and when needed
    const checkAuth = async () => {
        try {
            setIsLoading(true);
            const currentUser = await authUtils.getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Login function
    const login = async (credentials: { email: string; password: string }) => {
        try {
            setIsLoading(true);
            const response = await authAPI.login(credentials);
            setUser({
                id: response.data.userId || response.data.id,
                name: response.data.name || response.data.username || "",
                role: response.data.role,
            });
            // Redirect based on user role
            if (response.data.role === "ARTIST") {
                router.push("/dashboard");
            } else if (response.data.role === "INVESTOR") {
                router.push("/investor-dashboard");
            } else {
                router.push("/customer-dashboard");
            }

            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message || "Login failed" };
        } finally {
            setIsLoading(false);
        }
    };

    // Register function
    const register = async (userData: {
        name: string;
        email: string;
        password: string;
        role: "ARTIST" | "CUSTOMER" | "INVESTOR";
        professionCode?: number;
        businessLocation?: string;
    }) => {
        try {
            setIsLoading(true);
            const response = await authAPI.register(userData);

            setUser(response.data);

            router.push("/auth/login");
            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || "Registration failed",
            };
        } finally {
            setIsLoading(false);
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            // Even if logout API fails, clear local state
            console.error("Logout error:", error);
        } finally {
            setUser(null);
            router.push("/auth/login");
        }
    };

    // Check auth status on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const value = {
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        checkAuth,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

// Custom hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
