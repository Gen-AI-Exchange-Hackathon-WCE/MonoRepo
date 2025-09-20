"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Edit3, Sparkles } from "lucide-react";
import { Product, ProductCategory } from "@/lib/api/product";
import { getDisplayImageUrl, hasGeneratedImage } from "@/lib/image-utils";

interface EditProductFormProps {
    product: Product;
    categories: ProductCategory[];
    onSave: (updatedData: any) => Promise<void>;
    isSaving: boolean;
}

export function EditProductForm({ product, categories, onSave, isSaving }: EditProductFormProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        productName: product.productName,
        productDescription: product.productDescription || "",
        basePrice: product.basePrice,
        categoryId: product.categoryId,
    });

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        await onSave(formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({
            productName: product.productName,
            productDescription: product.productDescription || "",
            basePrice: product.basePrice,
            categoryId: product.categoryId,
        });
        setIsEditing(false);
    };

    return (
        <div className="space-y-4">
            {/* Form Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Product Details</h2>
                {!isEditing && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                    >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                )}
            </div>

            {/* Tabbed Interface */}
            <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="variants">Media</TabsTrigger>
                </TabsList>

                {/* Basic Information Tab */}
                <TabsContent value="basic">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Product Name */}
                            <div className="space-y-2">
                                <Label htmlFor="productName">Product Name</Label>
                                {isEditing ? (
                                    <Input
                                        id="productName"
                                        value={formData.productName}
                                        onChange={(e) => handleInputChange("productName", e.target.value)}
                                        placeholder="Enter product name"
                                    />
                                ) : (
                                    <div className="py-2 px-3 bg-muted/50 rounded-md">
                                        <span>{product.productName}</span>
                                    </div>
                                )}
                            </div>

                            {/* Base Price */}
                            <div className="space-y-2">
                                <Label htmlFor="basePrice">Price (₹)</Label>
                                {isEditing ? (
                                    <Input
                                        id="basePrice"
                                        type="number"
                                        value={formData.basePrice}
                                        onChange={(e) => handleInputChange("basePrice", parseFloat(e.target.value) || 0)}
                                        placeholder="Enter price"
                                        min="0"
                                        step="0.01"
                                    />
                                ) : (
                                    <div className="py-2 px-3 bg-muted/50 rounded-md">
                                        <span className="font-medium">₹{product.basePrice.toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label>Category</Label>
                            {isEditing ? (
                                <select
                                    value={formData.categoryId}
                                    onChange={(e) => handleInputChange("categoryId", parseInt(e.target.value))}
                                    className="w-full py-2 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.categoryName}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <div className="py-2 px-3 bg-muted/50 rounded-md">
                                    <Badge variant="secondary">
                                        {product.category?.categoryName}
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </div>
                </TabsContent>

                {/* Description Tab */}
                <TabsContent value="description">
                    <div className="space-y-4">
                        {/* Manual Description */}
                        <div className="space-y-2">
                            <Label htmlFor="productDescription">Product Description</Label>
                            {isEditing ? (
                                <Textarea
                                    id="productDescription"
                                    value={formData.productDescription}
                                    onChange={(e) => handleInputChange("productDescription", e.target.value)}
                                    placeholder="Enter product description..."
                                    rows={5}
                                    className="resize-none"
                                />
                            ) : (
                                <div className="min-h-[120px] p-3 bg-muted/50 rounded-md">
                                    {product.productDescription ? (
                                        <p className="text-sm whitespace-pre-wrap">
                                            {product.productDescription}
                                        </p>
                                    ) : (
                                        <span className="text-muted-foreground text-sm">
                                            No description provided
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* AI Generated Description */}
                        {product.generatedDescription && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>AI Description</Label>
                                    <Badge variant={product.isDescriptionAccepted ? "default" : "secondary"}>
                                        {product.isDescriptionAccepted ? "Active" : "Pending"}
                                    </Badge>
                                </div>
                                <div className="p-3 bg-muted/50 rounded-md">
                                    <div 
                                        className="text-sm"
                                        dangerouslySetInnerHTML={{ __html: product.generatedDescription }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* Variants & Media Tab */}
                <TabsContent value="variants">
                    <div className="space-y-4">
                        {/* Product Variants */}
                        <div className="space-y-2">
                            <Label>Variants</Label>
                            {product.variants && product.variants.length > 0 ? (
                                <div className="space-y-3">
                                    <div className="text-sm text-muted-foreground">
                                        {product.variants.length} variant{product.variants.length !== 1 ? "s" : ""}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {product.variants.slice(0, 4).map((variant, index) => (
                                            <div key={index} className="p-3 border rounded-md">
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-1">
                                                        <div className="flex gap-2">
                                                            {variant.size && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    {variant.size}
                                                                </Badge>
                                                            )}
                                                            {variant.color && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    {variant.color}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        {variant.materialType && (
                                                            <p className="text-xs text-muted-foreground">
                                                                {variant.materialType}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-medium">₹{variant.price.toLocaleString()}</div>
                                                        <div className="text-xs text-muted-foreground">
                                                            Stock: {variant.stock}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {product.variants.length > 4 && (
                                        <div className="text-center">
                                            <span className="text-sm text-muted-foreground">
                                                +{product.variants.length - 4} more
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-muted-foreground text-sm">No variants configured</p>
                                </div>
                            )}
                        </div>

                        {/* Product Media */}
                        <div className="space-y-2">
                            <Label>Images</Label>
                            {product.productMedia && product.productMedia.length > 0 ? (
                                <div className="space-y-3">
                                    <div className="text-sm text-muted-foreground">
                                        {product.productMedia.length} image{product.productMedia.length !== 1 ? "s" : ""}
                                    </div>
                                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                        {product.productMedia.slice(0, 4).map((media, index) => (
                                            <div key={index} className="relative aspect-square border rounded-md overflow-hidden">
                                                <img 
                                                    src={getDisplayImageUrl(media)} 
                                                    alt={media.altText || `Product image ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                {hasGeneratedImage(media) && (
                                                    <div className="absolute top-1 right-1">
                                                        <Badge variant="default" className="text-xs bg-gradient-to-r from-purple-600 to-blue-600">
                                                            <Sparkles className="w-2 h-2 mr-1" />
                                                            AI
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    {product.productMedia.length > 4 && (
                                        <div className="text-center">
                                            <span className="text-sm text-muted-foreground">
                                                +{product.productMedia.length - 4} more
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-muted-foreground text-sm">No images uploaded</p>
                                </div>
                            )}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            {isEditing && (
                <div className="pt-4 border-t">
                    <div className="flex gap-3">
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex-1"
                        >
                            {isSaving ? (
                                <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                        <Button
                            onClick={handleCancel}
                            variant="outline"
                            disabled={isSaving}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}