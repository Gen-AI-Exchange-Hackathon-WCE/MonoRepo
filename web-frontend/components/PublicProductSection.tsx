"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart } from "lucide-react";
import Link from "next/link";

interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    status: "draft" | "published";
    images: string[];
    views: number;
    saves: number;
    lastUpdated: string;
}

interface PublicProductSectionProps {
    products: Product[];
    showCreateButton?: boolean;
    title?: string;
    maxItems?: number;
}

export function PublicProductSection({ 
    products, 
    showCreateButton = false, 
    title = "Products",
    maxItems 
}: PublicProductSectionProps) {
    const displayProducts = maxItems ? products.slice(0, maxItems) : products;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle>{title}</CardTitle>
                    {showCreateButton && (
                        <Button asChild>
                            <Link href="/dashboard/create-product">
                                Create Product
                            </Link>
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {displayProducts.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">
                            {showCreateButton 
                                ? "You haven't created any products yet." 
                                : "No products available."
                            }
                        </p>
                        {showCreateButton && (
                            <Button asChild>
                                <Link href="/dashboard/create-product">
                                    Create Your First Product
                                </Link>
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {displayProducts.map((product) => (
                            <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                                <CardContent className="p-0">
                                    <img
                                        src={product.images[0] || "/placeholder.jpg"}
                                        alt={product.title}
                                        className="w-full h-48 object-cover rounded-t-lg"
                                    />
                                    <div className="p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-semibold text-sm sm:text-base line-clamp-2">
                                                {product.title}
                                            </h3>
                                            <Badge 
                                                variant={product.status === "published" ? "default" : "secondary"} 
                                                className="ml-2 flex-shrink-0"
                                            >
                                                {product.status}
                                            </Badge>
                                        </div>
                                        
                                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                            {product.description}
                                        </p>
                                        
                                        <p className="text-lg font-semibold text-primary mb-3">
                                            {formatPrice(product.price)}
                                        </p>
                                        
                                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                                            <span>Updated {formatDate(product.lastUpdated)}</span>
                                            <div className="flex items-center space-x-4">
                                                <span className="flex items-center">
                                                    <Eye className="w-3 h-3 mr-1" />
                                                    {product.views}
                                                </span>
                                                <span className="flex items-center">
                                                    <Heart className="w-3 h-3 mr-1" />
                                                    {product.saves}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-end">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/product/${product.id}`}>
                                                    View Details
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}