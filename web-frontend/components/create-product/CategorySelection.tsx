"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, ChevronRight } from "lucide-react";
import { ProductCategory } from "@/lib/api/product";

interface CategorySelectionProps {
    categories: ProductCategory[];
    selectedCategoryId: number | null;
    onCategorySelect: (category: ProductCategory) => void;
    onCreateNewCategory: () => void;
    isLoading?: boolean;
}

export function CategorySelection({
    categories,
    selectedCategoryId,
    onCategorySelect,
    onCreateNewCategory,
    isLoading = false,
}: CategorySelectionProps) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                    Select Product Category
                </h2>
                <p className="text-muted-foreground">
                    Choose an existing category or create a new one, then add your product details
                </p>
            </div>

            {/* Create New Category Button */}
            <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent
                    className="p-6 text-center"
                    onClick={onCreateNewCategory}
                >
                    <div className="flex flex-col items-center space-y-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Plus className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold">
                                Create New Category
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Add a new category for your products
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Existing Categories */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="p-6">
                                <div className="space-y-3">
                                    <div className="h-4 bg-muted rounded w-3/4"></div>
                                    <div className="h-3 bg-muted rounded w-full"></div>
                                    <div className="h-3 bg-muted rounded w-2/3"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : categories.length > 0 ? (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center">
                        <Package className="w-5 h-5 mr-2" />
                        Your Categories
                        <Badge variant="secondary" className="ml-2">
                            {categories.length}
                        </Badge>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map((category) => (
                            <Card
                                key={category.id}
                                className={`cursor-pointer transition-all hover:shadow-md ${
                                    selectedCategoryId === category.id
                                        ? "ring-2 ring-primary border-primary"
                                        : "hover:border-primary/50"
                                }`}
                                onClick={() => onCategorySelect(category)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-sm sm:text-base truncate">
                                                {category.categoryName}
                                            </h4>
                                            {category.categoryDescription && (
                                                <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                                                    {
                                                        category.categoryDescription
                                                    }
                                                </p>
                                            )}
                                        </div>
                                        {selectedCategoryId === category.id && (
                                            <ChevronRight className="w-4 h-4 text-primary ml-2 flex-shrink-0" />
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ) : (
                <Card className="border-dashed border-2">
                    <CardContent className="p-8 text-center">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                                <Package className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <div>
                                <h3 className="font-semibold">
                                    No Categories Yet
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Create your first category to organize your
                                    products
                                </p>
                            </div>
                            <Button
                                onClick={onCreateNewCategory}
                                className="mt-4"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create Your First Category
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
