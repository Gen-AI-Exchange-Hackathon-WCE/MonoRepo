"use client";

import { Button } from "@/components/ui/button";
import { Product } from "@/lib/api/product";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onAddToCart: (product: Product) => void;
  onToggleSave?: (productId: number) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
  searchQuery?: string;
  savedProducts?: Set<number>;
}

// Loading skeleton component
function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="aspect-square bg-muted animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
        <div className="h-6 bg-muted rounded animate-pulse w-1/2" />
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-muted rounded-full animate-pulse" />
          <div className="flex-1 space-y-1">
            <div className="h-3 bg-muted rounded animate-pulse w-full" />
            <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
          </div>
        </div>
        <div className="flex gap-1">
          <div className="h-5 bg-muted rounded animate-pulse w-12" />
          <div className="h-5 bg-muted rounded animate-pulse w-16" />
        </div>
        <div className="flex justify-between items-center">
          <div className="h-3 bg-muted rounded animate-pulse w-16" />
          <div className="flex gap-1">
            <div className="h-7 bg-muted rounded animate-pulse w-8" />
            <div className="h-7 bg-muted rounded animate-pulse w-12" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Empty state component
function EmptyState({ searchQuery }: { searchQuery?: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
        <svg
          className="w-12 h-12 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {searchQuery ? "No products found" : "No products available"}
      </h3>
      <p className="text-muted-foreground max-w-md">
        {searchQuery
          ? `We couldn't find any products matching "${searchQuery}". Try adjusting your search or filters.`
          : "There are no products to display at the moment. Please check back later."}
      </p>
    </div>
  );
}

export function ProductGrid({
  products,
  isLoading = false,
  onAddToCart,
  onToggleSave,
  onLoadMore,
  hasMore = false,
  loadingMore = false,
  searchQuery,
  savedProducts = new Set()
}: ProductGridProps) {
  
  // Generate match reasons for search results (simulate semantic search)
  const getMatchReason = (product: Product, query?: string): string | null => {
    if (!query || query.trim() === "") return null;
    
    const queryLower = query.toLowerCase();
    const productName = product.productName.toLowerCase();
    const categoryName = product.category.categoryName.toLowerCase();
    const description = product.productDescription?.toLowerCase() || "";
    
    // Simple matching logic
    if (queryLower.includes("home") && (categoryName.includes("pot") || categoryName.includes("decor"))) {
      return "Perfect for home decoration";
    }
    if (queryLower.includes("gift") && product.basePrice < 5000) {
      return "Great gift option";
    }
    if (queryLower.includes("kitchen") && categoryName.includes("pot")) {
      return "Kitchen & dining use";
    }
    if (productName.includes(queryLower) || categoryName.includes(queryLower)) {
      return "Matches your search";
    }
    
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Loading Skeletons */}
        {isLoading &&
          Array.from({ length: 8 }).map((_, index) => (
            <ProductSkeleton key={`skeleton-${index}`} />
          ))
        }

        {/* Products */}
        {!isLoading &&
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onToggleSave={onToggleSave}
              matchReason={getMatchReason(product, searchQuery)}
              saved={savedProducts.has(product.id)}
            />
          ))
        }

        {/* Empty State */}
        {!isLoading && products.length === 0 && (
          <EmptyState searchQuery={searchQuery} />
        )}
      </div>

      {/* Load More Button */}
      {!isLoading && products.length > 0 && hasMore && (
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            onClick={onLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? "Loading..." : "Load More Products"}
          </Button>
        </div>
      )}

      {/* Loading More Indicator */}
      {loadingMore && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductSkeleton key={`loading-more-${index}`} />
          ))}
        </div>
      )}
    </div>
  );
}