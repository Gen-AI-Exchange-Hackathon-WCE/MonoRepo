import { apiClient } from "../api";
import { ApiResponse } from "./auth";

// Types for product management
export interface Product {
    id: number;
    categoryId: number;
    productName: string;
    productDescription: string | null;
    generatedDescription: string | null;
    basePrice: number;
    isDescriptionAccepted: boolean;
    createdAt?: string;
    updatedAt?: string;
    category: ProductCategory;
    variants?: ProductVariant[];
    productMedia: ProductMedia[];
}

export interface ProductCategory {
    id: number;
    categoryName: string;
    categoryDescription: string | null;
    artistId: number;
    categoryIcon?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProductVariant {
    id: number;
    productId: number;
    size: string | null;
    color: string | null;
    materialType: string | null;
    dimensions: string | null;
    price: number;
    stock: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProductMedia {
    id: number;
    productId: number;
    imageUrl: string;
    genereatedUrl?: string | null;
    mediaType: "image" | "video";
    altText: string | null;
    caption: string | null;
    order: number;
    createdAt?: string;
    updatedAt: string;
}

// Request interfaces
export interface CreateCategoryRequest {
    categoryName: string;
    categoryDescription?: string;
}

export interface CreateProductRequest {
    categoryId: number;
    productName: string;
    productDescription?: string;
    productPrice: number;
    availableColors?: string[];
    sizes?: string[];
    dimensions?: string;
    materialType?: string;
    productImages?: File[];
}

export interface GetProductsFilters {
    professionId?: number;
    artistId?: number;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    colors?: string[];
    sizes?: string[];
    materialType?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: "name" | "price" | "createdAt";
    sortOrder?: "asc" | "desc";
}

export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
}

export interface ProductsWithPaginationResponse {
    products: Product[];
    pagination: PaginationInfo;
    appliedFilters: GetProductsFilters;
}

// Response interfaces
export interface CategoryResponse extends ProductCategory {}

export interface ProductResponse extends Product {}

// Product description generation types
export interface GenerateProductDescriptionRequest {
    productId: number;
    custom_req?: string;
}

export interface AcceptProductDescriptionRequest {
    productId: number;
}

// Product image generation types
export interface ProductImageGenerationRequest {
    art_form: string;
    product_description: string;
    product_image_url: string;
}

export interface GenerateProductShootRequest {
    productId: number;
}

export interface ProductImageGenerationJob {
    id: number;
    productMediaId: number;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
    createdAt?: string;
    updatedAt?: string;
}

export interface GenerateProductShootResponse {
    jobs: ProductImageGenerationJob[];
}

export interface ProductImageGenerationStatus {
    id: number;
    productMediaId: number;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
    createdAt?: string;
    updatedAt?: string;
}

export interface ProductDescriptionResponse {
    product: Product;
    generatedDescription: string;
    plainText?: string;
}

export interface ArtistProductsResponse {
    artistId: number;
    createdAt: string;
    productCategories: Array<{
        id: number;
        artistId: number;
        categoryName: string;
        categoryDescription: string;
        categoryIcon: string | null;
        products: Product[];
    }>;
}

export const productAPI = {
    /**
     * Get product by ID
     */
    getProduct: async (productId: number): Promise<ApiResponse<Product>> => {
        try {
            return await apiClient.get<ApiResponse<Product>>(
                `/product/${productId}`
            );
        } catch (error: any) {
            throw new Error(error.message || "Failed to fetch product");
        }
    },

    /**
     * Create new product category
     */
    createCategory: async (
        data: CreateCategoryRequest
    ): Promise<ApiResponse<CategoryResponse>> => {
        try {
            return await apiClient.post<ApiResponse<CategoryResponse>>(
                "/product/new-category",
                data
            );
        } catch (error: any) {
            throw new Error(error.message || "Failed to create category");
        }
    },

    /**
     * Create new product with images
     */
    createProduct: async (
        data: CreateProductRequest
    ): Promise<ApiResponse<ProductResponse>> => {
        try {
            const formData = new FormData();
            
            // Add basic product data
            formData.append("categoryId", data.categoryId.toString());
            formData.append("productName", data.productName);
            formData.append("productPrice", data.productPrice.toString());
            
            if (data.productDescription) {
                formData.append("productDescription", data.productDescription);
            }
            
            if (data.dimensions) {
                formData.append("dimensions", data.dimensions);
            }
            
            if (data.materialType) {
                formData.append("materialType", data.materialType);
            }
            
            // Add arrays as JSON strings
            if (data.availableColors && data.availableColors.length > 0) {
                formData.append("availableColors", JSON.stringify(data.availableColors));
            }
            
            if (data.sizes && data.sizes.length > 0) {
                formData.append("sizes", JSON.stringify(data.sizes));
            }
            
            // Add product images
            if (data.productImages && data.productImages.length > 0) {
                data.productImages.forEach((file) => {
                    formData.append("productImages", file);
                });
            }

            return await apiClient.post<ApiResponse<ProductResponse>>(
                "/product/new-product",
                formData
            );
        } catch (error: any) {
            throw new Error(error.message || "Failed to create product");
        }
    },

    /**
     * Get all categories for current artist
     */
    getCategories: async (): Promise<ApiResponse<CategoryResponse[]>> => {
        try {
            return await apiClient.get<ApiResponse<CategoryResponse[]>>(
                "/product/categories"
            );
        } catch (error: any) {
            throw new Error(error.message || "Failed to fetch categories");
        }
    },

    /**
     * Get all products with filters and pagination
     */
    getProductsWithFilters: async (
        filters: GetProductsFilters = {}
    ): Promise<ApiResponse<ProductsWithPaginationResponse>> => {
        try {
            const params = new URLSearchParams();
            
            // Add filter parameters
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    if (Array.isArray(value)) {
                        value.forEach((item) => params.append(key, item.toString()));
                    } else {
                        params.append(key, value.toString());
                    }
                }
            });

            const queryString = params.toString();
            const url = queryString ? `/product?${queryString}` : "/product";

            return await apiClient.get<ApiResponse<ProductsWithPaginationResponse>>(url);
        } catch (error: any) {
            throw new Error(error.message || "Failed to fetch products");
        }
    },

    /**
     * Get all products with filters - uses new /products endpoint
     */
    getProducts: async (filters: GetProductsFilters = {}): Promise<ApiResponse<Product[]>> => {
        try {
            const params = new URLSearchParams();
            
            // Add filter parameters (only the ones supported by backend)
            if (filters.professionId !== undefined) {
                params.append('professionId', filters.professionId.toString());
            }
            if (filters.artistId !== undefined) {
                params.append('artistId', filters.artistId.toString());
            }
            if (filters.categoryId !== undefined) {
                params.append('categoryId', filters.categoryId.toString());
            }

            const queryString = params.toString();
            const endpoint = queryString ? `/product/products?${queryString}` : "/product/products";

            return await apiClient.get<ApiResponse<Product[]>>(endpoint);
        } catch (error: any) {
            throw new Error(error.message || "Failed to fetch products");
        }
    },

    /**
     * Get artist's own products - uses new /products endpoint with current artist's ID
     */
    getMyProducts: async (
        categoryId?: number,
        page: number = 1,
        limit: number = 10
    ): Promise<ApiResponse<Product[]>> => {
        try {
            // For the current artist's products, we can use the /products endpoint
            // The backend should automatically filter by the authenticated user's artistId
            const filters: GetProductsFilters = {
                categoryId,
            };

            return await productAPI.getProducts(filters);
        } catch (error: any) {
            throw new Error(error.message || "Failed to fetch your products");
        }
    },

    /**
     * Get products by category
     */
    getProductsByCategory: async (
        categoryId: number
    ): Promise<ApiResponse<ProductResponse[]>> => {
        try {
            return await apiClient.get<ApiResponse<ProductResponse[]>>(
                `/product/category/${categoryId}`
            );
        } catch (error: any) {
            throw new Error(error.message || "Failed to fetch products by category");
        }
    },

    /**
     * Get products by artist ID
     */
    getProductsByArtistId: async (
        artistId: number
    ): Promise<ApiResponse<ArtistProductsResponse>> => {
        try {
            return await apiClient.get<ApiResponse<ArtistProductsResponse>>(
                `/product/artist-product/${artistId}`
            );
        } catch (error: any) {
            throw new Error(error.message || "Failed to fetch products by artist");
        }
    },

    /**
     * Update product
     */
    updateProduct: async (
        productId: number,
        data: Partial<CreateProductRequest>
    ): Promise<ApiResponse<ProductResponse>> => {
        try {
            const formData = new FormData();
            
            // Add updated product data
            if (data.productName) {
                formData.append("productName", data.productName);
            }
            
            if (data.productDescription !== undefined) {
                formData.append("productDescription", data.productDescription);
            }
            
            if (data.productPrice) {
                formData.append("productPrice", data.productPrice.toString());
            }
            
            if (data.dimensions) {
                formData.append("dimensions", data.dimensions);
            }
            
            if (data.materialType) {
                formData.append("materialType", data.materialType);
            }
            
            // Add arrays as JSON strings
            if (data.availableColors) {
                formData.append("availableColors", JSON.stringify(data.availableColors));
            }
            
            if (data.sizes) {
                formData.append("sizes", JSON.stringify(data.sizes));
            }
            
            // Add new product images if provided
            if (data.productImages && data.productImages.length > 0) {
                data.productImages.forEach((file) => {
                    formData.append("productImages", file);
                });
            }

            return await apiClient.put<ApiResponse<ProductResponse>>(
                `/product/${productId}`,
                formData
            );
        } catch (error: any) {
            throw new Error(error.message || "Failed to update product");
        }
    },

    /**
     * Delete product
     */
    deleteProduct: async (productId: number): Promise<ApiResponse<void>> => {
        try {
            return await apiClient.delete<ApiResponse<void>>(
                `/product/${productId}`
            );
        } catch (error: any) {
            throw new Error(error.message || "Failed to delete product");
        }
    },

    /**
     * Delete category
     */
    deleteCategory: async (categoryId: number): Promise<ApiResponse<void>> => {
        try {
            return await apiClient.delete<ApiResponse<void>>(
                `/product/category/${categoryId}`
            );
        } catch (error: any) {
            throw new Error(error.message || "Failed to delete category");
        }
    },

    /**
     * Update product variant stock
     */
    updateVariantStock: async (
        variantId: number,
        stock: number
    ): Promise<ApiResponse<ProductVariant>> => {
        try {
            return await apiClient.put<ApiResponse<ProductVariant>>(
                `/product/variant/${variantId}/stock`,
                { stock }
            );
        } catch (error: any) {
            throw new Error(error.message || "Failed to update variant stock");
        }
    },

    /**
     * Search products
     */
    searchProducts: async (
        query: string,
        filters?: {
            categoryId?: number;
            minPrice?: number;
            maxPrice?: number;
            color?: string;
            size?: string;
            materialType?: string;
        }
    ): Promise<ApiResponse<ProductResponse[]>> => {
        try {
            const params = new URLSearchParams();
            params.append("q", query);
            
            if (filters) {
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        params.append(key, value.toString());
                    }
                });
            }

            return await apiClient.get<ApiResponse<ProductResponse[]>>(
                `/product/search?${params.toString()}`
            );
        } catch (error: any) {
            throw new Error(error.message || "Failed to search products");
        }
    },

    /**
     * Get product analytics/stats
     */
    getProductStats: async (
        productId: number
    ): Promise<ApiResponse<{
        views: number;
        sales: number;
        revenue: number;
        averageRating: number;
        totalReviews: number;
    }>> => {
        try {
            return await apiClient.get<ApiResponse<{
                views: number;
                sales: number;
                revenue: number;
                averageRating: number;
                totalReviews: number;
            }>>(`/product/${productId}/stats`);
        } catch (error: any) {
            throw new Error(error.message || "Failed to fetch product stats");
        }
    },

    // Generate product description using AI
    generateProductDescription: async (
        data: GenerateProductDescriptionRequest
    ): Promise<ApiResponse<ProductDescriptionResponse>> => {
        try {
            return await apiClient.post<ApiResponse<ProductDescriptionResponse>>(
                `/product/generate-product-desc`,
                data
            );
        } catch (error: any) {
            throw new Error(error.message || "Failed to generate product description");
        }
    },

    // Accept generated product description
    acceptProductDescription: async (
        data: AcceptProductDescriptionRequest
    ): Promise<ApiResponse<{ product: Product }>> => {
        try {
            return await apiClient.post<ApiResponse<{ product: Product }>>(
                `/product/accept-product-desc`,
                data
            );
        } catch (error: any) {
            throw new Error(error.message || "Failed to accept product description");
        }
    },

    // Generate professional product shoot
    generateProductShoot: async (
        data: GenerateProductShootRequest
    ): Promise<ApiResponse<GenerateProductShootResponse>> => {
        try {
            return await apiClient.post<ApiResponse<GenerateProductShootResponse>>(
                `/product/generate-product-shoot`,
                data
            );
        } catch (error: any) {
            throw new Error(error.message || "Failed to generate product professional shoot");
        }
    },

    // Get product image generation status
    getImageGenerationStatus: async (
        jobId: number
    ): Promise<ApiResponse<ProductImageGenerationStatus>> => {
        try {
            return await apiClient.get<ApiResponse<ProductImageGenerationStatus>>(
                `/product/image-generation-status/${jobId}`
            );
        } catch (error: any) {
            throw new Error(error.message || "Failed to get image generation status");
        }
    },
};

// Convenience wrapper functions for easier imports
export const getProduct = productAPI.getProduct;
export const createCategory = productAPI.createCategory;
export const createProduct = productAPI.createProduct;
export const getProductCategories = productAPI.getCategories;
export const getProductsWithFilters = productAPI.getProductsWithFilters;
export const getMyProducts = async (filters: {
    page?: number;
    limit?: number;
    categoryId?: number;
    search?: string;
} = {}): Promise<Product[]> => {
    const { categoryId } = filters;
    
    const response = await productAPI.getMyProducts(categoryId);
    if (response.success && response.data) {
        return response.data;
    }
    throw new Error(response.message || "Failed to fetch products");
};

export const getProducts = productAPI.getProducts;
export const getProductsByCategory = productAPI.getProductsByCategory;
export const getProductsByArtistId = productAPI.getProductsByArtistId;
export const updateProduct = productAPI.updateProduct;
export const deleteProduct = productAPI.deleteProduct;
export const deleteCategory = productAPI.deleteCategory;
export const updateVariantStock = productAPI.updateVariantStock;
export const searchProducts = productAPI.searchProducts;
export const getProductStats = productAPI.getProductStats;
export const generateProductDescription = productAPI.generateProductDescription;
export const acceptProductDescription = productAPI.acceptProductDescription;
export const generateProductShoot = productAPI.generateProductShoot;
export const getImageGenerationStatus = productAPI.getImageGenerationStatus;