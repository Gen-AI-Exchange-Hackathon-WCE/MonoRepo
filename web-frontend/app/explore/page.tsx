"use client";

import { useState, useEffect } from "react";
import { SearchFilters, ProductGrid } from "@/components/explore";
import { CartIcon } from "@/components/cart-icon";
import { useCart } from "@/lib/cart";
import { AuthNav } from "@/components/AuthNav";
import { getProducts, Product, ProductCategory, getProductCategories } from "@/lib/api/product";

const regions = [
    "All Regions",
    "Rajasthan",
    "Gujarat", 
    "Maharashtra",
    "Uttar Pradesh",
    "West Bengal",
];

export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedRegion, setSelectedRegion] = useState("All Regions");
    const [showFilters, setShowFilters] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [savedProducts, setSavedProducts] = useState<Set<number>>(new Set());
    const { dispatch } = useCart();

    // Fetch products and categories on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Fetch products and categories in parallel
                const [productsResponse, categoriesResponse] = await Promise.all([
                    getProducts(),
                    getProductCategories().catch(() => ({ data: [] })) // Handle potential category fetch failure
                ]);

                if (productsResponse.data) {
                    setProducts(productsResponse.data);
                }

                if (categoriesResponse.data) {
                    setCategories(categoriesResponse.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load products. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Generate category options from fetched categories
    const categoryOptions = [
        "All", 
        ...categories.map(cat => cat.categoryName)
    ];

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        // TODO: Implement search API when available
        // For now, filter locally
        if (query.trim() === "") {
            // Reset to all products
            try {
                const response = await getProducts();
                if (response.data) {
                    setProducts(response.data);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        } else {
            // Simple local filtering
            const filtered = products.filter(product =>
                product.productName.toLowerCase().includes(query.toLowerCase()) ||
                product.category.categoryName.toLowerCase().includes(query.toLowerCase()) ||
                product.productDescription?.toLowerCase().includes(query.toLowerCase())
            );
            setProducts(filtered);
        }
    };

    const handleCategoryChange = async (category: string) => {
        setSelectedCategory(category);
        
        try {
            setIsLoading(true);
            
            if (category === "All") {
                // Fetch all products
                const response = await getProducts();
                if (response.data) {
                    setProducts(response.data);
                }
            } else {
                // Find the category ID
                const selectedCategoryData = categories.find(cat => cat.categoryName === category);
                if (selectedCategoryData) {
                    // Fetch products by category
                    const response = await getProducts({ categoryId: selectedCategoryData.id });
                    if (response.data) {
                        setProducts(response.data);
                    }
                }
            }
        } catch (error) {
            console.error('Error filtering by category:', error);
            setError('Failed to filter products. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const addToCart = (product: Product) => {
        // Get the first available image
        const productImage = product.productMedia.find(media => 
            media.mediaType === 'image' && media.imageUrl
        )?.imageUrl || "/placeholder.svg";

        dispatch({
            type: "ADD_ITEM",
            payload: {
                id: product.id,
                name: product.productName,
                price: product.basePrice,
                image: productImage,
                artist: "Verified Artisan", // TODO: Replace with actual artist data when available
            },
        });
    };

    const toggleSave = (productId: number) => {
        setSavedProducts(prev => {
            const newSaved = new Set(prev);
            if (newSaved.has(productId)) {
                newSaved.delete(productId);
            } else {
                newSaved.add(productId);
            }
            return newSaved;
        });
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Navigation */}
            <div className="border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold">Explore</h1>
                        <div className="flex items-center space-x-4">
                            <AuthNav />
                            <CartIcon />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <SearchFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSearchSubmit={handleSearch}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                selectedRegion={selectedRegion}
                onRegionChange={setSelectedRegion}
                categories={categoryOptions}
                regions={regions}
                showFilters={showFilters}
                onToggleFilters={() => setShowFilters(!showFilters)}
            />

            {/* Error State */}
            {error && (
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center text-red-600 bg-red-50 border border-red-200 rounded-lg p-6">
                        <p className="font-medium">{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="mt-2 text-sm underline"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            )}

            {/* Products Grid */}
            {!error && (
                <ProductGrid
                    products={products}
                    isLoading={isLoading}
                    onAddToCart={addToCart}
                    onToggleSave={toggleSave}
                    searchQuery={searchQuery}
                    savedProducts={savedProducts}
                />
            )}
        </div>
    );
}
