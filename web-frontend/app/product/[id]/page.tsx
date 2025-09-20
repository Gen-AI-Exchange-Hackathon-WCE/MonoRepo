"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Product } from "@/lib/api/product";
import { productAPI } from "@/lib/api/product";
import { ProductHeader } from "@/components/product/ProductHeader";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductDetails } from "@/components/product/ProductDetails";
import { ProductActions } from "@/components/product/ProductActions";
import { Button } from "@/components/ui/button";
import { User, ArrowRight } from "lucide-react";

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getProduct(parseInt(productId));
        setProduct(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
          <p className="text-muted-foreground mb-4">{error || 'The product you are looking for does not exist.'}</p>
          <button 
            onClick={() => window.history.back()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Determine which description to show
  const description = product.isDescriptionAccepted && product.generatedDescription 
    ? product.generatedDescription 
    : (product.productDescription || "No description available");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Gallery */}
          <div className="space-y-4">
            <ProductGallery product={product} />
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <ProductHeader product={product} />
            
            {/* Artist Profile Link */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium">Visit Artist Profile</span>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/artist/${product.category.artistId}`}>
                  View Profile
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
            
            {/* Product Description */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Description</h2>
              <div 
                className="prose prose-sm max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>

            {/* Category Information */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Category</h3>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium">{product.category.categoryName}</h4>
                <p className="text-sm text-muted-foreground">{product.category.categoryDescription}</p>
              </div>
            </div>

            {/* Product Details */}
            <ProductDetails product={product} />

            {/* Product Actions */}
            <ProductActions product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}