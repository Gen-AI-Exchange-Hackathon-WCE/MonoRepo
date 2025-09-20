"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    Sparkles,
    Check,
    X,
    RefreshCw,
    Image as ImageIcon,
    Zap,
    Download,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { showSuccessToast, showErrorToast, showInfoToast } from "@/lib/toast";
import { getDisplayImageUrl, hasGeneratedImage } from "@/lib/image-utils";
import {
    getProduct,
    updateProduct,
    generateProductDescription,
    acceptProductDescription,
    generateProductShoot,
    getImageGenerationStatus,
    Product,
    ProductCategory,
    getProductCategories,
    ProductImageGenerationJob,
} from "@/lib/api/product";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditProductForm } from "@/components/edit-product";

interface EditProductPageProps {
    params: { id: string };
}

export default function EditProductPage({ params }: EditProductPageProps) {
    const router = useRouter();

    // Product data
    const [product, setProduct] = useState<Product | null>(null);
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // AI Description states
    const [isGeneratingDescription, setIsGeneratingDescription] =
        useState(false);
    const [generatedDescription, setGeneratedDescription] = useState<
        string | null
    >(null);
    const [showDescriptionPreview, setShowDescriptionPreview] = useState(false);
    const [customRequest, setCustomRequest] = useState("");

    // Professional Image Generation states
    const [isGeneratingImages, setIsGeneratingImages] = useState(false);
    const [imageJobs, setImageJobs] = useState<ProductImageGenerationJob[]>([]);
    const [jobStatuses, setJobStatuses] = useState<{ [key: number]: string }>(
        {}
    );
    const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(
        null
    );

    // Form states
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadProductData();
        loadCategories();

        // Cleanup function to clear any active polling interval
        return () => {
            if (pollInterval) {
                clearInterval(pollInterval);
            }
        };
    }, [params.id, pollInterval]);

    const loadProductData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await getProduct(parseInt(params.id));

            if (response.success && response.data) {
                setProduct(response.data);
            } else {
                setError(response.message || "Failed to load product");
            }
        } catch (error) {
            console.error("Failed to load product:", error);
            setError("Failed to load product data");
        } finally {
            setIsLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const response = await getProductCategories();
            if (response.success && response.data) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error("Failed to load categories:", error);
        }
    };

    const handleGenerateDescription = async () => {
        if (!product) return;

        try {
            setIsGeneratingDescription(true);

            const response = await generateProductDescription({
                productId: product.id,
                custom_req: customRequest || undefined,
            });

            if (response.success && response.data) {
                setGeneratedDescription(response.data.generatedDescription);
                setShowDescriptionPreview(true);
                setProduct(response.data.product);

                showSuccessToast(
                    "Description Generated!",
                    "AI has generated a new description for your product."
                );
            }
        } catch (error) {
            console.error("Failed to generate description:", error);
            showErrorToast(
                "Generation Failed",
                "Failed to generate description. Please try again."
            );
        } finally {
            setIsGeneratingDescription(false);
        }
    };

    const handleAcceptDescription = async () => {
        if (!product) return;

        try {
            const response = await acceptProductDescription({
                productId: product.id,
            });

            if (response.success && response.data) {
                setProduct(response.data.product);
                setShowDescriptionPreview(false);

                showSuccessToast(
                    "Description Accepted!",
                    "The AI-generated description has been accepted and saved."
                );
            }
        } catch (error) {
            console.error("Failed to accept description:", error);
            showErrorToast(
                "Accept Failed",
                "Failed to accept description. Please try again."
            );
        }
    };

    const handleRejectDescription = () => {
        setGeneratedDescription(null);
        setShowDescriptionPreview(false);
        setCustomRequest("");

        showInfoToast(
            "Description Rejected",
            "You can generate a new description with different requirements."
        );
    };

    const handleGenerateProductShoot = async () => {
        if (!product || !product.productMedia?.length) {
            showErrorToast(
                "No Images Found",
                "Please upload product images first to generate professional shots."
            );
            return;
        }

        try {
            setIsGeneratingImages(true);

            const response = await generateProductShoot({
                productId: product.id,
            });

            if (response.success && response.data) {
                setImageJobs(response.data.jobs);

                // Initialize job statuses
                const initialStatuses: { [key: number]: string } = {};
                response.data.jobs.forEach((job) => {
                    initialStatuses[job.id] = job.status;
                });
                setJobStatuses(initialStatuses);

                showSuccessToast(
                    "Image Generation Started!",
                    `${response.data.jobs.length} professional image generation jobs have been queued.`
                );

                // Start polling for status updates
                pollJobStatuses(response.data.jobs);
            }
        } catch (error) {
            console.error("Failed to generate professional images:", error);
            showErrorToast(
                "Generation Failed",
                "Failed to start professional image generation. Please try again."
            );
        } finally {
            setIsGeneratingImages(false);
        }
    };

    const pollJobStatuses = async (jobs: ProductImageGenerationJob[]) => {
        // Clear any existing polling interval
        if (pollInterval) {
            clearInterval(pollInterval);
        }

        const newPollInterval = setInterval(async () => {
            let allCompleted = true;
            let successfulUpdates = 0;

            for (const job of jobs) {
                try {
                    const statusResponse = await getImageGenerationStatus(
                        job.id
                    );
                    if (statusResponse.success && statusResponse.data) {
                        const status = statusResponse.data.status;
                        setJobStatuses((prev) => ({
                            ...prev,
                            [job.id]: status,
                        }));
                        successfulUpdates++;

                        if (status === "PENDING") {
                            allCompleted = false;
                        }
                    } else {
                        // Failed to get status - don't mark as completed
                        allCompleted = false;
                        console.error(
                            `Failed to get status for job ${job.id}:`,
                            statusResponse.message
                        );
                    }
                } catch (error) {
                    console.error(
                        `Failed to get status for job ${job.id}:`,
                        error
                    );
                    allCompleted = false;
                }
            }

            // Only consider completion if we successfully updated all job statuses
            if (allCompleted && successfulUpdates === jobs.length) {
                if (newPollInterval) {
                    clearInterval(newPollInterval);
                }
                setPollInterval(null);
                showSuccessToast(
                    "Generation Complete!",
                    "All professional images have been generated successfully."
                );
                // Reload product data to get updated images
                loadProductData();
            }
        }, 3000); // Poll every 3 seconds

        setPollInterval(newPollInterval);

        // Clear interval after 5 minutes to prevent infinite polling
        setTimeout(() => {
            if (newPollInterval) {
                clearInterval(newPollInterval);
                setPollInterval(null);
                showInfoToast(
                    "Polling Timeout",
                    "Image generation is taking longer than expected. Please refresh to check status."
                );
            }
        }, 300000);
    };

    const refreshJobStatuses = async () => {
        if (imageJobs.length === 0) return;

        let allCompleted = true;
        let updatedStatuses: { [key: number]: string } = {};

        for (const job of imageJobs) {
            try {
                const statusResponse = await getImageGenerationStatus(job.id);
                if (statusResponse.success && statusResponse.data) {
                    const status = statusResponse.data.status;
                    updatedStatuses[job.id] = status;

                    if (status !== "COMPLETED" && status !== "FAILED") {
                        allCompleted = false;
                    }
                } else {
                    allCompleted = false;
                }
            } catch (error) {
                console.error(
                    `Failed to refresh status for job ${job.id}:`,
                    error
                );
                allCompleted = false;
            }
        }

        setJobStatuses((prev) => ({ ...prev, ...updatedStatuses }));

        if (allCompleted) {
            if (pollInterval) {
                clearInterval(pollInterval);
                setPollInterval(null);
            }
            showSuccessToast(
                "Generation Complete!",
                "All professional images have been generated successfully."
            );
            loadProductData();
        }
    };

    const clearImageJobs = () => {
        if (pollInterval) {
            clearInterval(pollInterval);
            setPollInterval(null);
        }
        setImageJobs([]);
        setJobStatuses({});
        setIsGeneratingImages(false);
        showInfoToast(
            "Jobs Cleared",
            "Image generation jobs have been cleared from the interface."
        );
    };

    const handleSaveProduct = async (updatedData: any) => {
        if (!product) return;

        try {
            setIsSaving(true);

            // Convert Product data to CreateProductRequest format
            const updateData = {
                productName: updatedData.productName,
                productDescription: updatedData.productDescription || undefined,
                productPrice: updatedData.basePrice,
                categoryId: updatedData.categoryId,
            };

            const response = await updateProduct(product.id, updateData);

            if (response.success && response.data) {
                setProduct(response.data);
                showSuccessToast(
                    "Product Updated!",
                    "Your product has been updated successfully."
                );
            }
        } catch (error) {
            console.error("Failed to save product:", error);
            showErrorToast(
                "Save Failed",
                "Failed to save product changes. Please try again."
            );
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-6 max-w-6xl">
                    <div className="mb-8">
                        <div className="h-10 w-32 bg-muted rounded animate-pulse"></div>
                    </div>

                    <div className="space-y-6">
                        <div className="h-8 bg-muted rounded animate-pulse w-1/3"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                <Card>
                                    <CardHeader>
                                        <div className="h-6 bg-muted rounded animate-pulse w-1/2"></div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                                        <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                                        <div className="h-10 bg-muted rounded animate-pulse"></div>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <div className="h-6 bg-muted rounded animate-pulse w-3/4"></div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="h-4 bg-muted rounded animate-pulse"></div>
                                            <div className="h-4 bg-muted rounded animate-pulse w-2/3"></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-6 max-w-6xl">
                    <div className="mb-8">
                        <Link href="/dashboard">
                            <Button variant="ghost" className="hover:bg-muted">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Dashboard
                            </Button>
                        </Link>
                    </div>

                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="text-center max-w-md">
                            <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-6 flex items-center justify-center">
                                <X className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h2 className="text-xl font-bold text-foreground mb-3">
                                Product Not Found
                            </h2>
                            <p className="text-muted-foreground mb-6 text-sm">
                                {error ||
                                    "The product you are trying to edit does not exist or has been removed."}
                            </p>
                            <Button asChild>
                                <Link href="/dashboard">
                                    Return to Dashboard
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-6 max-w-6xl">
                {/* Navigation */}
                <div className="mb-8">
                    <Link href="/dashboard">
                        <Button variant="ghost" className="hover:bg-muted">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* Main Content - Takes 3/4 of the width on xl screens */}
                    <div className="xl:col-span-3 space-y-6">
                        {/* Page Header with breadcrumb */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <span>Dashboard</span>
                                <span>/</span>
                                <span>Products</span>
                                <span>/</span>
                                <span className="text-foreground font-medium">
                                    {product.productName}
                                </span>
                            </div>
                            <div className="flex items-start justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight">
                                        {product.productName}
                                    </h1>
                                    <p className="text-muted-foreground">
                                        Manage your product details and enhance
                                        with AI
                                    </p>
                                </div>
                                <Badge
                                    variant={
                                        product.isDescriptionAccepted
                                            ? "default"
                                            : "secondary"
                                    }
                                >
                                    {product.isDescriptionAccepted
                                        ? "AI Enhanced"
                                        : "Standard"}
                                </Badge>
                            </div>
                        </div>

                        {/* Workflow Sections */}
                        <div className="space-y-12">
                            {/* Completion Summary */}
                            {product.isDescriptionAccepted && imageJobs.some(job => jobStatuses[job.id] === 'COMPLETED') && (
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">
                                            <Check className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-green-800 dark:text-green-400">
                                                Product Fully Enhanced! 🎉
                                            </h3>
                                            <p className="text-green-700 dark:text-green-300 text-sm">
                                                Your product is now optimized with AI-enhanced description and professional images.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button asChild size="sm">
                                            <Link href={`/product/${product.id}`}>
                                                View Product Page
                                            </Link>
                                        </Button>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href="/dashboard">
                                                Back to Dashboard
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Progress Overview */}
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-6 border">
                                <h3 className="text-lg font-semibold mb-4">Product Enhancement Workflow</h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                                        <span className="text-sm font-medium">Product Details</span>
                                    </div>
                                    <div className="w-8 h-px bg-border"></div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                            product.isDescriptionAccepted 
                                            ? 'bg-green-600 text-white' 
                                            : 'bg-purple-600 text-white'
                                        }`}>
                                            {product.isDescriptionAccepted ? <Check className="w-3 h-3" /> : '2'}
                                        </div>
                                        <span className="text-sm font-medium">AI Description</span>
                                    </div>
                                    <div className="w-8 h-px bg-border"></div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                            imageJobs.some(job => jobStatuses[job.id] === 'COMPLETED') 
                                            ? 'bg-green-600 text-white' 
                                            : product.productMedia?.length 
                                            ? 'bg-orange-600 text-white' 
                                            : 'bg-gray-400 text-white'
                                        }`}>
                                            {imageJobs.some(job => jobStatuses[job.id] === 'COMPLETED') ? <Check className="w-3 h-3" /> : '3'}
                                        </div>
                                        <span className="text-sm font-medium">Image Enhancement</span>
                                    </div>
                                </div>
                            </div>

                            {/* Step 1: Basic Product Details */}
                            <div className="relative">
                                {/* Connecting line to next step */}
                                <div className="absolute left-4 top-16 w-px h-16 bg-border z-0"></div>
                                
                                <div className="flex items-center gap-4 mb-6 relative z-10">
                                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                                        1
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold">Edit Product Details</h2>
                                        <p className="text-muted-foreground">Update your product information and upload images</p>
                                    </div>
                                </div>
                                <Card className="border-2">
                                    <CardContent className="p-6">
                                        <EditProductForm
                                            product={product}
                                            categories={categories}
                                            onSave={handleSaveProduct}
                                            isSaving={isSaving}
                                        />
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Step 2: AI Description Enhancement */}
                            <div className="relative">
                                {/* Connecting line to next step */}
                                <div className="absolute left-4 top-16 w-px h-16 bg-border z-0"></div>
                                
                                <div className="flex items-center gap-4 mb-6 relative z-10">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${
                                        product.isDescriptionAccepted 
                                        ? 'bg-green-600 text-white' 
                                        : 'bg-purple-600 text-white'
                                    }`}>
                                        {product.isDescriptionAccepted ? <Check className="w-4 h-4" /> : '2'}
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-xl font-semibold flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-purple-600" />
                                            AI Description Enhancement
                                            {product.isDescriptionAccepted && (
                                                <Badge variant="default" className="ml-2">
                                                    <Check className="w-3 h-3 mr-1" />
                                                    Enhanced
                                                </Badge>
                                            )}
                                        </h2>
                                        <p className="text-muted-foreground">
                                            {product.isDescriptionAccepted 
                                                ? "Your product has an AI-enhanced description" 
                                                : "Generate a compelling product description using AI"
                                            }
                                        </p>
                                    </div>
                                </div>
                                <Card className="border-2 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-purple-600" />
                                            AI Description Generator
                                            <Badge
                                                variant="secondary"
                                                className="ml-auto"
                                            >
                                                New
                                            </Badge>
                                        </CardTitle>
                                        <p className="text-muted-foreground">
                                            Generate compelling product
                                            descriptions using AI based on your
                                            product details.
                                        </p>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {!showDescriptionPreview ? (
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="p-4 border border-border/50 rounded-lg bg-background/50">
                                                        <h4 className="font-medium mb-2">
                                                            What we'll use:
                                                        </h4>
                                                        <ul className="text-sm text-muted-foreground space-y-1">
                                                            <li>
                                                                • Product name:{" "}
                                                                {
                                                                    product.productName
                                                                }
                                                            </li>
                                                            <li>
                                                                • Category:{" "}
                                                                {
                                                                    product
                                                                        .category
                                                                        ?.categoryName
                                                                }
                                                            </li>
                                                            <li>
                                                                • Price: ₹
                                                                {product.basePrice.toLocaleString()}
                                                            </li>
                                                            {product.productDescription && (
                                                                <li>
                                                                    • Current
                                                                    description
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                    <div className="p-4 border border-border/50 rounded-lg bg-background/50">
                                                        <h4 className="font-medium mb-2">
                                                            Custom Requirements
                                                        </h4>
                                                        <Textarea
                                                            placeholder="e.g., Make it sound more artisanal, focus on sustainability, target luxury market..."
                                                            value={
                                                                customRequest
                                                            }
                                                            onChange={(
                                                                e: React.ChangeEvent<HTMLTextAreaElement>
                                                            ) =>
                                                                setCustomRequest(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="resize-none h-24"
                                                            rows={3}
                                                        />
                                                    </div>
                                                </div>

                                                <Button
                                                    onClick={
                                                        handleGenerateDescription
                                                    }
                                                    disabled={
                                                        isGeneratingDescription
                                                    }
                                                    size="lg"
                                                    className="w-full md:w-auto px-8"
                                                >
                                                    {isGeneratingDescription ? (
                                                        <>
                                                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                                            Generating Magic...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Sparkles className="mr-2 h-4 w-4" />
                                                            Generate Description
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                <div className="p-6 border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20 rounded-lg">
                                                    <h4 className="font-semibold text-green-800 dark:text-green-400 mb-3">
                                                        Generated Description
                                                        Preview
                                                    </h4>
                                                    <div
                                                        className="prose prose-sm max-w-none text-green-700 dark:text-green-300"
                                                        dangerouslySetInnerHTML={{
                                                            __html:
                                                                generatedDescription ||
                                                                "",
                                                        }}
                                                    />
                                                </div>

                                                <div className="flex gap-3">
                                                    <Button
                                                        onClick={
                                                            handleAcceptDescription
                                                        }
                                                        className="flex-1"
                                                    >
                                                        <Check className="mr-2 h-4 w-4" />
                                                        Accept & Save
                                                    </Button>
                                                    <Button
                                                        onClick={
                                                            handleRejectDescription
                                                        }
                                                        variant="outline"
                                                        className="flex-1"
                                                    >
                                                        <X className="mr-2 h-4 w-4" />
                                                        Generate New
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Step 3: Professional Image Enhancement */}
                            <div className="relative">
                                <div className="flex items-center gap-4 mb-6 relative z-10">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${
                                        imageJobs.some(job => jobStatuses[job.id] === 'COMPLETED') 
                                        ? 'bg-green-600 text-white' 
                                        : product.productMedia?.length 
                                        ? 'bg-orange-600 text-white'
                                        : 'bg-gray-400 text-white'
                                    }`}>
                                        {imageJobs.some(job => jobStatuses[job.id] === 'COMPLETED') ? <Check className="w-4 h-4" /> : '3'}
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-xl font-semibold flex items-center gap-2">
                                            <Zap className="w-5 h-5 text-orange-600" />
                                            Professional Image Studio
                                            {imageJobs.some(job => jobStatuses[job.id] === 'COMPLETED') && (
                                                <Badge variant="default" className="ml-2">
                                                    <Check className="w-3 h-3 mr-1" />
                                                    Enhanced
                                                </Badge>
                                            )}
                                        </h2>
                                        <p className="text-muted-foreground">
                                            {!product.productMedia?.length
                                                ? "Upload product images first to enable AI enhancement"
                                                : imageJobs.some(job => jobStatuses[job.id] === 'COMPLETED')
                                                ? "Your images have been enhanced with professional AI shots"
                                                : "Transform your product images into professional studio shots using AI"
                                            }
                                        </p>
                                    </div>
                                    {!product.productMedia?.length && (
                                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                            Requires Images
                                        </Badge>
                                    )}
                                </div>
                                <Card className={`border-2 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 ${
                                    !product.productMedia?.length ? 'opacity-60' : ''
                                }`}>
                                    <CardContent className="p-6 space-y-6">
                                        {/* Current Images */}
                                        <div className="space-y-4">
                                            <h4 className="font-medium">
                                                Current Product Images
                                            </h4>
                                            {product.productMedia &&
                                            product.productMedia.length > 0 ? (
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                    {product.productMedia.map(
                                                        (media, index) => (
                                                            <div
                                                                key={index}
                                                                className="relative group"
                                                            >
                                                                <div className="aspect-square border rounded-lg overflow-hidden bg-muted">
                                                                    <img
                                                                        src={getDisplayImageUrl(
                                                                            media
                                                                        )}
                                                                        alt={
                                                                            media.altText ||
                                                                            `Product image ${
                                                                                index +
                                                                                1
                                                                            }`
                                                                        }
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                {hasGeneratedImage(
                                                                    media
                                                                ) && (
                                                                    <div className="absolute top-2 right-2">
                                                                        <Badge
                                                                            variant="default"
                                                                            className="text-xs bg-gradient-to-r from-purple-600 to-blue-600"
                                                                        >
                                                                            <Sparkles className="w-3 h-3 mr-1" />
                                                                            AI
                                                                            Enhanced
                                                                        </Badge>
                                                                    </div>
                                                                )}
                                                                {/* Show both original and generated if available */}
                                                                {hasGeneratedImage(
                                                                    media
                                                                ) && (
                                                                    <div className="absolute bottom-2 left-2">
                                                                        <div className="flex gap-1">
                                                                            <div className="w-8 h-8 border border-white rounded overflow-hidden">
                                                                                <img
                                                                                    src={
                                                                                        media.imageUrl
                                                                                    }
                                                                                    alt="Original"
                                                                                    className="w-full h-full object-cover opacity-80"
                                                                                    title="Original image"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 border border-dashed rounded-lg">
                                                    <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                                    <p className="text-muted-foreground">
                                                        No images uploaded yet
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Upload images in the
                                                        Edit tab first
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Generation Jobs Status */}
                                        {imageJobs.length > 0 && (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-medium">
                                                        Generation Status
                                                    </h4>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            onClick={
                                                                refreshJobStatuses
                                                            }
                                                            variant="outline"
                                                            size="sm"
                                                            disabled={
                                                                isGeneratingImages
                                                            }
                                                        >
                                                            <RefreshCw className="w-4 h-4 mr-2" />
                                                            Refresh
                                                        </Button>
                                                        <Button
                                                            onClick={
                                                                clearImageJobs
                                                            }
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <X className="w-4 h-4 mr-2" />
                                                            Clear
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    {imageJobs.map((job) => (
                                                        <div
                                                            key={job.id}
                                                            className="flex items-center justify-between p-3 border rounded-lg"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div
                                                                    className={`w-2 h-2 rounded-full ${
                                                                        jobStatuses[
                                                                            job
                                                                                .id
                                                                        ] ===
                                                                        "COMPLETED"
                                                                            ? "bg-green-500"
                                                                            : jobStatuses[
                                                                                  job
                                                                                      .id
                                                                              ] ===
                                                                              "FAILED"
                                                                            ? "bg-red-500"
                                                                            : "bg-blue-500 animate-pulse"
                                                                    }`}
                                                                ></div>
                                                                <span className="text-sm">
                                                                    Job #
                                                                    {job.id}
                                                                </span>
                                                            </div>
                                                            <Badge
                                                                variant={
                                                                    jobStatuses[
                                                                        job.id
                                                                    ] ===
                                                                    "COMPLETED"
                                                                        ? "default"
                                                                        : jobStatuses[
                                                                              job
                                                                                  .id
                                                                          ] ===
                                                                          "FAILED"
                                                                        ? "destructive"
                                                                        : "secondary"
                                                                }
                                                            >
                                                                {jobStatuses[
                                                                    job.id
                                                                ] || job.status}
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex gap-3">
                                            <Button
                                                onClick={
                                                    handleGenerateProductShoot
                                                }
                                                disabled={
                                                    isGeneratingImages ||
                                                    !product.productMedia
                                                        ?.length
                                                }
                                                size="lg"
                                                className="flex-1"
                                            >
                                                {isGeneratingImages ? (
                                                    <>
                                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                                        Generating Professional
                                                        Shots...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Zap className="mr-2 h-4 w-4" />
                                                        Generate Professional
                                                        Images
                                                    </>
                                                )}
                                            </Button>
                                        </div>

                                        {!product.productMedia?.length && (
                                            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                                <p className="text-sm text-yellow-800 dark:text-yellow-400">
                                                    <strong>Tip:</strong> Upload
                                                    your raw product images
                                                    first in the Edit tab, then
                                                    come back here to generate
                                                    professional studio shots.
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Sidebar */}
                    <div className="space-y-6">
                        {/* Product Status Card */}
                        <Card className="border-2">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    Product Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                                        <div className="text-2xl font-bold text-primary">
                                            ₹
                                            {product.basePrice.toLocaleString()}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Base Price
                                        </div>
                                    </div>
                                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                                        <div className="text-2xl font-bold text-orange-500">
                                            {product.variants?.length || 0}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Variants
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-2 border-t">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">
                                            Category
                                        </span>
                                        <Badge
                                            variant="secondary"
                                            className="text-xs"
                                        >
                                            {product.category?.categoryName}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">
                                            Description
                                        </span>
                                        <Badge
                                            variant={
                                                product.isDescriptionAccepted
                                                    ? "default"
                                                    : "secondary"
                                            }
                                            className="text-xs"
                                        >
                                            {product.isDescriptionAccepted
                                                ? "AI Approved"
                                                : "Manual"}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">
                                            Images
                                        </span>
                                        <span className="text-xs font-medium">
                                            {product.productMedia?.length || 0}{" "}
                                            uploaded
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start"
                                >
                                    <ImageIcon className="mr-2 h-4 w-4" />
                                    Upload Images
                                </Button>
                                <div className="pt-2 border-t">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full justify-start text-blue-600 border-blue-200 hover:bg-blue-50"
                                    >
                                        <X className="mr-2 h-4 w-4" />
                                        Duplicate Product
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 mt-2"
                                    >
                                        <X className="mr-2 h-4 w-4" />
                                        Delete Product
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Product Performance */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">
                                    Performance
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Views</span>
                                        <span className="font-semibold">-</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Saves</span>
                                        <span className="font-semibold">-</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Orders</span>
                                        <span className="font-semibold">-</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground pt-2 border-t">
                                        Analytics will be available once the
                                        product is published
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
