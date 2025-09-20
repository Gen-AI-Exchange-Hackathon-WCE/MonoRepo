"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductList } from "./products/ProductList";
import { useAuth } from "@/lib/auth";
import { profileAPI } from "@/lib/api/profile";
import { 
    getProductsByArtistId, 
    getProductCategories, 
    Product, 
    ProductCategory, 
    ArtistProductsResponse 
} from "@/lib/api/product";

export function ProductSection() {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [artistId, setArtistId] = useState<number | null>(null);
    
    // Filter states
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>();
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // Get artist ID from profile
    useEffect(() => {
        const getArtistId = async () => {
            if (!user) return;
            
            try {
                const profileResponse = await profileAPI.getProfile(user.id);
                if (profileResponse.success && profileResponse.data) {
                    setArtistId(profileResponse.data.artistId);
                }
            } catch (err) {
                console.error('Failed to load profile:', err);
            }
        };
        
        getArtistId();
    }, [user]);

    // Load categories on mount
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await getProductCategories();
                if (response.success && response.data) {
                    setCategories(response.data);
                }
            } catch (err) {
                console.error('Failed to load categories:', err);
            }
        };
        
        loadCategories();
    }, []);

    // Load products when filters change or artistId is available
    useEffect(() => {
        if (!artistId) return;
        
        const loadProducts = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                const response = await getProductsByArtistId(artistId);
                
                if (response.success && response.data) {
                    // Flatten products from the nested structure
                    const allProducts: Product[] = [];
                    if (response.data.productCategories) {
                        response.data.productCategories.forEach((category: any) => {
                            if (category.products) {
                                allProducts.push(...category.products);
                            }
                        });
                    }
                    
                    let filteredProducts = allProducts;
                    
                    // Apply category filter
                    if (selectedCategoryId) {
                        filteredProducts = filteredProducts.filter((product: Product) =>
                            product.categoryId === selectedCategoryId
                        );
                    }
                    
                    // Apply search filter
                    if (searchQuery.trim()) {
                        const query = searchQuery.toLowerCase().trim();
                        filteredProducts = filteredProducts.filter((product: Product) =>
                            product.productName.toLowerCase().includes(query) ||
                            (product.productDescription && product.productDescription.toLowerCase().includes(query))
                        );
                    }
                    
                    setProducts(filteredProducts);
                } else {
                    setError(response.message || 'Failed to load products');
                }
            } catch (err: any) {
                console.error('Failed to load products:', err);
                setError(err.message || 'Failed to load products');
            } finally {
                setIsLoading(false);
            }
        };
        
        loadProducts();
    }, [artistId, selectedCategoryId, searchQuery]);

    const handleCategoryFilter = (categoryId?: number) => {
        setSelectedCategoryId(categoryId);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Your Products</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <p className="text-destructive mb-4">Failed to load products</p>
                        <p className="text-sm text-muted-foreground">{error}</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Products</CardTitle>
            </CardHeader>
            <CardContent>
                <ProductList
                    products={products}
                    categories={categories}
                    isLoading={isLoading}
                    selectedCategoryId={selectedCategoryId}
                    searchQuery={searchQuery}
                    viewMode={viewMode}
                    onCategoryFilter={handleCategoryFilter}
                    onSearch={handleSearch}
                    onViewModeChange={setViewMode}
                    onPageChange={() => {}} // No-op since pagination is disabled
                />
            </CardContent>
        </Card>
    );
}