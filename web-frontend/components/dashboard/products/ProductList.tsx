"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Plus,
    Eye,
    Edit,
    Search,
    Filter,
    Package,
    Grid,
    List,
} from "lucide-react";
import Link from "next/link";
import {
    Product,
    ProductCategory,
    ProductsWithPaginationResponse,
} from "@/lib/api/product";

interface ProductListProps {
    products: Product[];
    categories: ProductCategory[];
    pagination?: ProductsWithPaginationResponse["pagination"];
    isLoading?: boolean;
    selectedCategoryId?: number;
    searchQuery?: string;
    viewMode?: "grid" | "list";
    onCategoryFilter: (categoryId?: number) => void;
    onSearch: (query: string) => void;
    onViewModeChange: (mode: "grid" | "list") => void;
    onPageChange?: (page: number) => void;
}

export function ProductList({
    products = [],
    categories,
    pagination,
    isLoading = false,
    selectedCategoryId,
    searchQuery = "",
    viewMode = "grid",
    onCategoryFilter,
    onSearch,
    onViewModeChange,
    onPageChange,
}: ProductListProps) {
    const [searchInput, setSearchInput] = useState(searchQuery);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchInput);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="space-y-6">
            {/* Header with Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Your Products</h2>
                    <p className="text-muted-foreground">
                        {pagination
                            ? `${pagination.totalCount} total products`
                            : `${products.length} products`}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {/* View Mode Toggle */}
                    <div className="flex rounded-lg border">
                        <Button
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => onViewModeChange("grid")}
                            className="rounded-r-none"
                        >
                            <Grid className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => onViewModeChange("list")}
                            className="rounded-l-none"
                        >
                            <List className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Create Product Button */}
                    <Button asChild>
                        <Link href="/dashboard/create-product">
                            <Plus className="w-4 h-4 mr-2" />
                            New Product
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <form
                    onSubmit={handleSearchSubmit}
                    className="flex gap-2 flex-1"
                >
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search products..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button type="submit" variant="outline">
                        Search
                    </Button>
                </form>

                {/* Category Filter */}
                <Select
                    value={selectedCategoryId?.toString() || "all"}
                    onValueChange={(value: string) =>
                        onCategoryFilter(
                            value === "all" ? undefined : parseInt(value)
                        )
                    }
                >
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                            <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                            >
                                {category.categoryName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div
                    className={
                        viewMode === "grid"
                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                            : "space-y-4"
                    }
                >
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="p-0">
                                {viewMode === "grid" ? (
                                    <>
                                        <div className="w-full h-48 bg-muted rounded-t-lg" />
                                        <div className="p-4 space-y-3">
                                            <div className="h-4 bg-muted rounded w-3/4" />
                                            <div className="h-3 bg-muted rounded w-1/2" />
                                            <div className="h-8 bg-muted rounded w-full" />
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center p-4 space-x-4">
                                        <div className="w-16 h-16 bg-muted rounded" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-muted rounded w-3/4" />
                                            <div className="h-3 bg-muted rounded w-1/2" />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : products.length === 0 ? (
                /* Empty State */
                <Card className="border-dashed">
                    <CardContent className="p-12 text-center">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold mb-2">
                            {selectedCategoryId || searchInput
                                ? "No products found"
                                : "No products yet"}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            {selectedCategoryId || searchInput
                                ? "Try adjusting your search or filter criteria."
                                : "Start by creating your first product to showcase your work."}
                        </p>
                        {!selectedCategoryId && !searchInput && (
                            <Button asChild>
                                <Link href="/dashboard/create-product">
                                    Create Your First Product
                                </Link>
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                /* Products Display */
                <>
                    {viewMode === "grid" ? (
                        /* Grid View */
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {products.map((product) => (
                                <Card
                                    key={product.id}
                                    className="group hover:shadow-lg transition-shadow"
                                >
                                    <CardContent className="p-0">
                                        {product.productMedia.length > 0 ? (
                                            <img
                                                src={
                                                    product.productMedia[0]
                                                        .genereatedUrl ||
                                                    product.productMedia[0]
                                                        .imageUrl
                                                }
                                                alt={product.productName}
                                                className="w-full h-48 object-cover rounded-t-lg"
                                            />
                                        ) : (
                                            <div className="w-full h-48 bg-muted rounded-t-lg flex items-center justify-center">
                                                <Package className="w-12 h-12 text-muted-foreground" />
                                            </div>
                                        )}
                                        <div className="p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="font-semibold text-sm sm:text-base line-clamp-2">
                                                    {product.productName}
                                                </h3>
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-2 flex-shrink-0"
                                                >
                                                    {
                                                        product.category
                                                            ?.categoryName
                                                    }
                                                </Badge>
                                            </div>

                                            {product.productDescription && (
                                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                                    {product.productDescription}
                                                </p>
                                            )}

                                            <p className="text-lg font-semibold text-primary mb-3">
                                                {formatPrice(product.basePrice)}
                                            </p>

                                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                                                {product.variants &&
                                                    product.variants.length >
                                                        0 && (
                                                        <span>
                                                            {
                                                                product.variants
                                                                    .length
                                                            }{" "}
                                                            variants
                                                        </span>
                                                    )}
                                            </div>

                                            <div className="flex justify-end space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/product/${product.id}`}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/dashboard/edit-product/${product.id}`}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        /* List View */
                        <div className="space-y-4">
                            {products.map((product) => (
                                <Card
                                    key={product.id}
                                    className="group hover:shadow-md transition-shadow"
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center space-x-4">
                                            {product.productMedia.length > 0 ? (
                                                <img
                                                    src={
                                                        product.productMedia[0]
                                                            .imageUrl
                                                    }
                                                    alt={product.productName}
                                                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <Package className="w-8 h-8 text-muted-foreground" />
                                                </div>
                                            )}

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-base truncate">
                                                            {
                                                                product.productName
                                                            }
                                                        </h3>
                                                        {product.productDescription && (
                                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                                                {
                                                                    product.productDescription
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center space-x-4 ml-4">
                                                        <div className="text-right">
                                                            <p className="text-lg font-semibold text-primary">
                                                                {formatPrice(
                                                                    product.basePrice
                                                                )}
                                                            </p>
                                                            {product.variants &&
                                                                product.variants
                                                                    .length >
                                                                    0 && (
                                                                    <p className="text-xs text-muted-foreground">
                                                                        {
                                                                            product
                                                                                .variants
                                                                                .length
                                                                        }{" "}
                                                                        variants
                                                                    </p>
                                                                )}
                                                        </div>

                                                        <div className="flex space-x-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={`/product/${product.id}`}
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                </Link>
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={`/dashboard/edit-product/${product.id}`}
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </Link>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center space-x-2 mt-8">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    onPageChange?.(pagination.currentPage - 1)
                                }
                                disabled={!pagination.hasPrevPage}
                            >
                                Previous
                            </Button>

                            <div className="flex items-center space-x-1">
                                {Array.from(
                                    {
                                        length: Math.min(
                                            5,
                                            pagination.totalPages
                                        ),
                                    },
                                    (_, i) => {
                                        const pageNum =
                                            pagination.currentPage - 2 + i;
                                        if (
                                            pageNum < 1 ||
                                            pageNum > pagination.totalPages
                                        )
                                            return null;

                                        return (
                                            <Button
                                                key={pageNum}
                                                variant={
                                                    pageNum ===
                                                    pagination.currentPage
                                                        ? "default"
                                                        : "outline"
                                                }
                                                size="sm"
                                                onClick={() =>
                                                    onPageChange?.(pageNum)
                                                }
                                                className="w-10"
                                            >
                                                {pageNum}
                                            </Button>
                                        );
                                    }
                                )}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    onPageChange?.(pagination.currentPage + 1)
                                }
                                disabled={!pagination.hasNextPage}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
