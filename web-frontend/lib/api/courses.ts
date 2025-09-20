import { apiClient } from "../api";
import { ApiResponse } from "./auth";

// Types for course management
export interface Course {
    id: number;
    artistId: number;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    artist?: {
        id: number;
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    videos?: Video[];
}

export interface Video {
    id: number;
    title: string;
    description: string;
    url: string;
    tags: string[];
    courseId: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCourseRequest {
    title: string;
    description: string;
}

export interface UploadVideoRequest {
    courseId: number;
    title: string;
    description: string;
    tags: string[];
    courseVideo: File;
}

export interface SearchCoursesFilters {
    courseTitle?: string;
    videoTitle?: string;
    artistName?: string;
    tags?: string[];
}

export const coursesAPI = {
    /**
     * Create a new course
     */
    createCourse: async (data: CreateCourseRequest): Promise<ApiResponse<Course>> => {
        try {
            return await apiClient.post<ApiResponse<Course>>("/course/create-course", data);
        } catch (error: any) {
            throw new Error(error.message || "Failed to create course");
        }
    },

    /**
     * Upload video to a course
     */
    uploadVideoToCourse: async (data: UploadVideoRequest): Promise<ApiResponse<Video>> => {
        try {
            const formData = new FormData();
            formData.append("courseId", data.courseId.toString());
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("tags", JSON.stringify(data.tags));
            formData.append("courseVideo", data.courseVideo);

            return await apiClient.post<ApiResponse<Video>>("/course/upload-video", formData);
        } catch (error: any) {
            throw new Error(error.message || "Failed to upload video");
        }
    },

    /**
     * Search courses with filters
     */
    searchCourses: async (filters: SearchCoursesFilters = {}): Promise<ApiResponse<Course[]>> => {
        try {
            const params = new URLSearchParams();
            
            // Add filter parameters
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    if (Array.isArray(value)) {
                        value.forEach(item => params.append(key, item));
                    } else {
                        params.append(key, value.toString());
                    }
                }
            });

            const queryString = params.toString();
            const url = queryString ? `/course/search-courses?${queryString}` : "/course/search-courses";

            return await apiClient.get<ApiResponse<Course[]>>(url);
        } catch (error: any) {
            throw new Error(error.message || "Failed to search courses");
        }
    },

    /**
     * Get course by ID (using search with course title)
     */
    getCourseById: async (courseId: number): Promise<ApiResponse<Course[]>> => {
        try {
            // Since there's no direct getCourseById endpoint, we'll use search to find all courses
            // and then filter on the frontend, or we can enhance the search API
            const response = await coursesAPI.searchCourses({});
            const filteredCourses = response.data.filter(course => course.id === courseId);
            
            return {
                ...response,
                data: filteredCourses
            };
        } catch (error: any) {
            throw new Error(error.message || "Failed to fetch course");
        }
    },

    /**
     * Get all courses
     */
    getAllCourses: async (): Promise<ApiResponse<Course[]>> => {
        try {
            return await coursesAPI.searchCourses({});
        } catch (error: any) {
            throw new Error(error.message || "Failed to fetch courses");
        }
    },

    /**
     * Get courses by artist
     */
    getCoursesByArtist: async (artistName: string): Promise<ApiResponse<Course[]>> => {
        try {
            return await coursesAPI.searchCourses({ artistName });
        } catch (error: any) {
            throw new Error(error.message || "Failed to fetch artist courses");
        }
    }
};