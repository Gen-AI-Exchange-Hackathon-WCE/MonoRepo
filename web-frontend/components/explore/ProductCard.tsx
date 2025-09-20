"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MapPin, Volume2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/currency";
import { Product } from "@/lib/api/product";

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
    onToggleSave?: (productId: number) => void;
    matchReason?: string | null;
    saved?: boolean;
}

// Helper function to get the first available image
const getProductImage = (product: Product): string => {
    const imageMedia = product.productMedia.find(
        (media) => media.mediaType === "image" && media.imageUrl
    );
    return imageMedia?.imageUrl || "/placeholder.svg";
};

// Helper function to get product tags from category and materials
const getProductTags = (product: Product): string[] => {
    const tags = [product.category.categoryName];

    // Add unique materials from variants
    const materials = product.variants
        ?.map((v) => v.materialType)
        .filter(
            (material): material is string =>
                material !== null && material.trim() !== ""
        )
        .filter((material, index, array) => array.indexOf(material) === index);

    if (materials && materials.length > 0) {
        tags.push(...materials.slice(0, 2)); // Add up to 2 materials as tags
    }

    return tags.slice(0, 3); // Limit to 3 tags total
};

// Helper function to get variant count
const getVariantInfo = (product: Product): string | null => {
    if (!product.variants || product.variants.length === 0) return null;

    const variantCount = product.variants.length;
    return `${variantCount} option${variantCount > 1 ? "s" : ""}`;
};

export function ProductCard({
    product,
    onAddToCart,
    onToggleSave,
    matchReason,
    saved = false,
}: ProductCardProps) {
    const productImage = getProductImage(product);
    const tags = getProductTags(product);
    const variantInfo = getVariantInfo(product);

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
            <div className="relative aspect-square bg-muted">
                <img
                    src={productImage}
                    alt={product.productName}
                    className="h-[400px] w-auto mx-auto object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Save Button */}
                <button
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    onClick={() => onToggleSave?.(product.id)}
                >
                    <Heart
                        className={`w-4 h-4 ${
                            saved
                                ? "text-red-500 fill-current"
                                : "text-gray-600"
                        }`}
                    />
                </button>

                {/* Match Reason Badge */}
                {matchReason && (
                    <div className="absolute bottom-3 left-3 right-3">
                        <Badge
                            variant="secondary"
                            className="bg-primary/90 text-primary-foreground text-xs"
                        >
                            {matchReason}
                        </Badge>
                    </div>
                )}
            </div>

            <CardContent className="p-4">
                {/* Product Title and Category */}
                <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm line-clamp-2 flex-1">
                        {product.productName}
                    </h3>
                    <Badge variant="outline" className="ml-2 text-xs">
                        {product.category.categoryName}
                    </Badge>
                </div>

                {/* Price */}
                <p className="text-lg font-bold text-primary mb-3">
                    {formatPrice(product.basePrice)}
                </p>

                {/* Product Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                    {tags.map((tag, index) => (
                        <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                        >
                            {tag}
                        </Badge>
                    ))}
                </div>

                {/* Product Description (if available) */}
                {product.productDescription && (
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                        {product.productDescription}
                    </p>
                )}

                {/* Footer with variant info and actions */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center">
                        {variantInfo ? (
                            <span>{variantInfo} available</span>
                        ) : (
                            <span>Handmade</span>
                        )}
                    </span>

                    <div className="flex space-x-1">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onAddToCart(product)}
                            className="text-xs px-2"
                        >
                            <ShoppingCart className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                            <Link href={`/product/${product.id}`}>View</Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
