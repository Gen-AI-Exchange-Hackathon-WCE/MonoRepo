"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Plus, Minus, Camera, Loader2, AlertCircle } from "lucide-react";
import { CreateProductRequest, ProductCategory } from "@/lib/api/product";

interface ProductFormProps {
    category: ProductCategory;
    onSubmit: (data: CreateProductRequest) => Promise<void>;
    onBack: () => void;
    isSubmitting?: boolean;
}

export function ProductForm({
    category,
    onSubmit,
    onBack,
    isSubmitting = false,
}: ProductFormProps) {
    const [formData, setFormData] = useState<Omit<CreateProductRequest, 'categoryId'>>({
        productName: "",
        productDescription: "",
        productPrice: 0,
        availableColors: [],
        sizes: [],
        dimensions: "",
        materialType: "",
        productImages: [],
    });

    const [newColor, setNewColor] = useState("");
    const [newSize, setNewSize] = useState("");
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.productName.trim()) {
            newErrors.productName = "Product name is required";
        } else if (formData.productName.length < 2) {
            newErrors.productName = "Product name must be at least 2 characters";
        }

        if (formData.productPrice <= 0) {
            newErrors.productPrice = "Price must be greater than 0";
        }

        if (!formData.productImages || formData.productImages.length < 1) {
            newErrors.productImages = "At least one product image is required";
        }

        if (formData.productDescription && formData.productDescription.length > 500) {
            newErrors.productDescription = "Description must be less than 500 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            await onSubmit({
                ...formData,
                categoryId: category.id,
            });
        } catch (error: any) {
            setErrors({ general: error.message || "Failed to create product" });
        }
    };

    const handleImageUpload = (files: FileList | null) => {
        if (!files) return;

        const newFiles = Array.from(files).slice(0, 5 - (formData.productImages?.length || 0));
        const newPreviews: string[] = [];

        newFiles.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    newPreviews.push(e.target?.result as string);
                    if (newPreviews.length === newFiles.length) {
                        setImagePreviews(prev => [...prev, ...newPreviews]);
                    }
                };
                reader.readAsDataURL(file);
            }
        });

        setFormData(prev => ({
            ...prev,
            productImages: [...(prev.productImages || []), ...newFiles],
        }));

        if (errors.productImages) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.productImages;
                return newErrors;
            });
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            productImages: prev.productImages?.filter((_, i) => i !== index) || [],
        }));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const addColor = () => {
        if (newColor.trim() && !formData.availableColors?.includes(newColor.trim())) {
            setFormData(prev => ({
                ...prev,
                availableColors: [...(prev.availableColors || []), newColor.trim()],
            }));
            setNewColor("");
        }
    };

    const removeColor = (color: string) => {
        setFormData(prev => ({
            ...prev,
            availableColors: prev.availableColors?.filter(c => c !== color) || [],
        }));
    };

    const addSize = () => {
        if (newSize.trim() && !formData.sizes?.includes(newSize.trim())) {
            setFormData(prev => ({
                ...prev,
                sizes: [...(prev.sizes || []), newSize.trim()],
            }));
            setNewSize("");
        }
    };

    const removeSize = (size: string) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes?.filter(s => s !== size) || [],
        }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                    Add Product Details
                </h2>
                <p className="text-muted-foreground">
                    Fill in the details and publish your product to category: <Badge variant="secondary">{category.categoryName}</Badge>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* General Error */}
                {errors.general && (
                    <div className="flex items-center p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                        {errors.general}
                    </div>
                )}

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Left Column - Product Images */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Images</CardTitle>
                            <CardDescription>
                                Upload up to 5 clear photos of your product
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Image Upload Area */}
                            <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                                errors.productImages ? "border-red-500" : "border-border"
                            }`}>
                                {(formData.productImages?.length || 0) === 0 ? (
                                    <div className="space-y-4">
                                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                                            <Camera className="w-8 h-8 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">Add Product Photos</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Choose up to 5 high-quality images
                                            </p>
                                        </div>
                                        <div>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e.target.files)}
                                                className="hidden"
                                                id="image-upload"
                                            />
                                            <Button type="button" asChild>
                                                <label htmlFor="image-upload" className="cursor-pointer">
                                                    <Upload className="w-4 h-4 mr-2" />
                                                    Choose Images
                                                </label>
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {/* Image Grid */}
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {imagePreviews.map((preview, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={preview}
                                                        alt={`Product ${index + 1}`}
                                                        className="w-full h-24 object-cover rounded-lg border"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => removeImage(index)}
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                            
                                            {/* Add More Button */}
                                            {(formData.productImages?.length || 0) < 5 && (
                                                <div className="w-full h-24 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={(e) => handleImageUpload(e.target.files)}
                                                        className="hidden"
                                                        id="image-upload-more"
                                                    />
                                                    <label htmlFor="image-upload-more" className="cursor-pointer">
                                                        <Plus className="w-6 h-6 text-muted-foreground" />
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <p className="text-xs text-muted-foreground">
                                            {formData.productImages?.length || 0}/5 images uploaded
                                        </p>
                                    </div>
                                )}
                            </div>
                            {errors.productImages && (
                                <p className="text-sm text-red-600">{errors.productImages}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Right Column - Product Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Details</CardTitle>
                            <CardDescription>
                                Provide information about your product
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Product Name */}
                            <div className="space-y-2">
                                <Label htmlFor="productName">
                                    Product Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="productName"
                                    value={formData.productName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, productName: e.target.value }))}
                                    placeholder="e.g., Handcrafted Ceramic Bowl"
                                    className={errors.productName ? "border-red-500" : ""}
                                />
                                {errors.productName && (
                                    <p className="text-sm text-red-600">{errors.productName}</p>
                                )}
                            </div>

                            {/* Product Description */}
                            <div className="space-y-2">
                                <Label htmlFor="productDescription">
                                    Description
                                </Label>
                                <Textarea
                                    id="productDescription"
                                    value={formData.productDescription}
                                    onChange={(e) => setFormData(prev => ({ ...prev, productDescription: e.target.value }))}
                                    placeholder="Describe your product, its features, and what makes it special..."
                                    className={`resize-none ${errors.productDescription ? "border-red-500" : ""}`}
                                    rows={3}
                                    maxLength={500}
                                />
                                {errors.productDescription && (
                                    <p className="text-sm text-red-600">{errors.productDescription}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    {(formData.productDescription || "").length}/500 characters
                                </p>
                            </div>

                            {/* Price */}
                            <div className="space-y-2">
                                <Label htmlFor="productPrice">
                                    Price (₹) <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="productPrice"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.productPrice || ""}
                                    onChange={(e) => setFormData(prev => ({ ...prev, productPrice: parseFloat(e.target.value) || 0 }))}
                                    placeholder="0.00"
                                    className={errors.productPrice ? "border-red-500" : ""}
                                />
                                {errors.productPrice && (
                                    <p className="text-sm text-red-600">{errors.productPrice}</p>
                                )}
                            </div>

                            {/* Material Type */}
                            <div className="space-y-2">
                                <Label htmlFor="materialType">Material Type</Label>
                                <Input
                                    id="materialType"
                                    value={formData.materialType}
                                    onChange={(e) => setFormData(prev => ({ ...prev, materialType: e.target.value }))}
                                    placeholder="e.g., Ceramic, Cotton, Wood, Metal"
                                />
                            </div>

                            {/* Dimensions */}
                            <div className="space-y-2">
                                <Label htmlFor="dimensions">Dimensions</Label>
                                <Input
                                    id="dimensions"
                                    value={formData.dimensions}
                                    onChange={(e) => setFormData(prev => ({ ...prev, dimensions: e.target.value }))}
                                    placeholder="e.g., 15cm x 10cm x 8cm"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Product Variants */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Colors */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Available Colors</CardTitle>
                            <CardDescription>
                                Add color options for your product
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    value={newColor}
                                    onChange={(e) => setNewColor(e.target.value)}
                                    placeholder="e.g., Blue, Green, Red"
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                                />
                                <Button type="button" onClick={addColor} disabled={!newColor.trim()}>
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            
                            {formData.availableColors && formData.availableColors.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {formData.availableColors.map((color) => (
                                        <Badge key={color} variant="secondary" className="gap-1">
                                            {color}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-auto p-0 hover:bg-transparent"
                                                onClick={() => removeColor(color)}
                                            >
                                                <X className="w-3 h-3" />
                                            </Button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Sizes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Available Sizes</CardTitle>
                            <CardDescription>
                                Add size options for your product
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    value={newSize}
                                    onChange={(e) => setNewSize(e.target.value)}
                                    placeholder="e.g., Small, Medium, Large"
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                                />
                                <Button type="button" onClick={addSize} disabled={!newSize.trim()}>
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            
                            {formData.sizes && formData.sizes.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {formData.sizes.map((size) => (
                                        <Badge key={size} variant="secondary" className="gap-1">
                                            {size}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-auto p-0 hover:bg-transparent"
                                                onClick={() => removeSize(size)}
                                            >
                                                <X className="w-3 h-3" />
                                            </Button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onBack}
                        disabled={isSubmitting}
                        className="flex-1"
                    >
                        Back to Categories
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting || !formData.productName.trim() || formData.productPrice <= 0}
                        className="flex-1"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Publishing Product...
                            </>
                        ) : (
                            "Create & Publish Product"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}