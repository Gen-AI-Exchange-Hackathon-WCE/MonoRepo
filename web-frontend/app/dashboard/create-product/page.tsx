"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { productAPI, ProductCategory, CreateProductRequest } from "@/lib/api/product";
import {
    CategorySelection,
    NewCategoryDialog,
    ProductForm,
    StepNavigation,
    PRODUCT_CREATION_STEPS,
} from "@/components/create-product";

type Step = "category" | "product";

export default function CreateProductPage() {
    const router = useRouter();
    
    // Step management
    const [currentStep, setCurrentStep] = useState<Step>("category");
    const [completedSteps, setCompletedSteps] = useState<string[]>([]);
    
    // Category management
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    
    // Dialog states
    const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
    
    // Loading states
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [isCreatingProduct, setIsCreatingProduct] = useState(false);

    // Load categories on mount
    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setIsLoadingCategories(true);
            const response = await productAPI.getCategories();
            setCategories(response.data);
        } catch (error) {
            console.error("Failed to load categories:", error);
            // You might want to show a toast or error message here
        } finally {
            setIsLoadingCategories(false);
        }
    };

    const handleCategorySelect = (category: ProductCategory) => {
        setSelectedCategory(category);
        setCurrentStep("product");
        setCompletedSteps(["category"]);
    };

    const handleCreateCategory = async (data: { categoryName: string; categoryDescription?: string }) => {
        try {
            setIsCreatingCategory(true);
            const response = await productAPI.createCategory(data);
            const newCategory = response.data;
            
            // Add to categories list and select it
            setCategories(prev => [...prev, newCategory]);
            setSelectedCategory(newCategory);
            setIsNewCategoryDialogOpen(false);
            setCurrentStep("product");
            setCompletedSteps(["category"]);
        } catch (error: any) {
            console.error("Failed to create category:", error);
            throw error; // Re-throw to be handled by the dialog
        } finally {
            setIsCreatingCategory(false);
        }
    };

    const handleCreateProduct = async (data: CreateProductRequest) => {
        try {
            setIsCreatingProduct(true);
            const response = await productAPI.createProduct(data);
            
            // Redirect to product page or dashboard with success message
            router.push(`/dashboard?productCreated=${response.data.id}`);
        } catch (error: any) {
            console.error("Failed to create product:", error);
            throw error; // Re-throw to be handled by the form
        } finally {
            setIsCreatingProduct(false);
        }
    };

    const handleBackToCategories = () => {
        setCurrentStep("category");
        setSelectedCategory(null);
        setCompletedSteps([]);
    };

    const handleStepClick = (stepId: string) => {
        if (stepId === "category") {
            handleBackToCategories();
        }
        // Only allow going back to completed steps
        if (completedSteps.includes(stepId)) {
            setCurrentStep(stepId as Step);
        }
    };

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <Button variant="ghost" asChild>
                        <Link href="/dashboard">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Link>
                    </Button>
                </div>

                {/* Step Navigation */}
                <StepNavigation
                    steps={PRODUCT_CREATION_STEPS}
                    currentStep={currentStep}
                    completedSteps={completedSteps}
                    onStepClick={handleStepClick}
                    className="mb-8"
                />

                {/* Step Content */}
                <div className="max-w-4xl mx-auto">
                    {currentStep === "category" && (
                        <CategorySelection
                            categories={categories}
                            selectedCategoryId={selectedCategory?.id || null}
                            onCategorySelect={handleCategorySelect}
                            onCreateNewCategory={() => setIsNewCategoryDialogOpen(true)}
                            isLoading={isLoadingCategories}
                        />
                    )}

                    {currentStep === "product" && selectedCategory && (
                        <ProductForm
                            category={selectedCategory}
                            onSubmit={handleCreateProduct}
                            onBack={handleBackToCategories}
                            isSubmitting={isCreatingProduct}
                        />
                    )}
                </div>

                {/* New Category Dialog */}
                <NewCategoryDialog
                    isOpen={isNewCategoryDialogOpen}
                    onClose={() => setIsNewCategoryDialogOpen(false)}
                    onCreateCategory={handleCreateCategory}
                    isCreating={isCreatingCategory}
                />
            </div>
        </div>
    );
}