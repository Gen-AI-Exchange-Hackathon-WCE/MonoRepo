"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import { CreateCategoryRequest } from "@/lib/api/product";

interface NewCategoryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateCategory: (data: CreateCategoryRequest) => Promise<void>;
    isCreating?: boolean;
}

export function NewCategoryDialog({
    isOpen,
    onClose,
    onCreateCategory,
    isCreating = false,
}: NewCategoryDialogProps) {
    const [formData, setFormData] = useState<CreateCategoryRequest>({
        categoryName: "",
        categoryDescription: "",
    });
    const [errors, setErrors] = useState<{
        categoryName?: string;
        categoryDescription?: string;
        general?: string;
    }>({});

    const validateForm = (): boolean => {
        const newErrors: typeof errors = {};

        if (!formData.categoryName.trim()) {
            newErrors.categoryName = "Category name is required";
        } else if (formData.categoryName.trim().length < 2) {
            newErrors.categoryName = "Category name must be at least 2 characters";
        } else if (formData.categoryName.trim().length > 50) {
            newErrors.categoryName = "Category name must be less than 50 characters";
        }

        if (formData.categoryDescription && formData.categoryDescription.length > 200) {
            newErrors.categoryDescription = "Description must be less than 200 characters";
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
            setErrors({});
            await onCreateCategory({
                categoryName: formData.categoryName.trim(),
                categoryDescription: formData.categoryDescription?.trim() || undefined,
            });
            
            // Reset form on success
            setFormData({
                categoryName: "",
                categoryDescription: "",
            });
            onClose();
        } catch (error: any) {
            setErrors({
                general: error.message || "Failed to create category. Please try again.",
            });
        }
    };

    const handleClose = () => {
        setFormData({
            categoryName: "",
            categoryDescription: "",
        });
        setErrors({});
        onClose();
    };

    const handleNameChange = (value: string) => {
        setFormData(prev => ({ ...prev, categoryName: value }));
        if (errors.categoryName) {
            setErrors(prev => ({ ...prev, categoryName: undefined }));
        }
    };

    const handleDescriptionChange = (value: string) => {
        setFormData(prev => ({ ...prev, categoryDescription: value }));
        if (errors.categoryDescription) {
            setErrors(prev => ({ ...prev, categoryDescription: undefined }));
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <Plus className="w-5 h-5 mr-2" />
                        Create New Category
                    </DialogTitle>
                    <DialogDescription>
                        Create a new category to organize your products better.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* General Error */}
                    {errors.general && (
                        <div className="flex items-center p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                            {errors.general}
                        </div>
                    )}

                    {/* Category Name */}
                    <div className="space-y-2">
                        <Label htmlFor="categoryName">
                            Category Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="categoryName"
                            value={formData.categoryName}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder="e.g., Handmade Pottery, Jewelry, Textiles"
                            className={errors.categoryName ? "border-red-500" : ""}
                            maxLength={50}
                        />
                        {errors.categoryName && (
                            <p className="text-sm text-red-600">{errors.categoryName}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            {formData.categoryName.length}/50 characters
                        </p>
                    </div>

                    {/* Category Description */}
                    <div className="space-y-2">
                        <Label htmlFor="categoryDescription">
                            Description (Optional)
                        </Label>
                        <Textarea
                            id="categoryDescription"
                            value={formData.categoryDescription}
                            onChange={(e) => handleDescriptionChange(e.target.value)}
                            placeholder="Describe what types of products will be in this category..."
                            className={`resize-none ${errors.categoryDescription ? "border-red-500" : ""}`}
                            rows={3}
                            maxLength={200}
                        />
                        {errors.categoryDescription && (
                            <p className="text-sm text-red-600">{errors.categoryDescription}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            {(formData.categoryDescription || "").length}/200 characters
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isCreating}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isCreating || !formData.categoryName.trim()}
                            className="flex-1"
                        >
                            {isCreating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Category
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}