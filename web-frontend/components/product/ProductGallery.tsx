"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn as Zoom, Sparkles } from "lucide-react";
import { Product } from "@/lib/api/product";
import { getDisplayImageUrl, hasGeneratedImage } from "@/lib/image-utils";
import { Badge } from "@/components/ui/badge";

interface ProductGalleryProps {
  product: Product;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  
  // Extract images with priority for generated URLs
  const images = product.productMedia.map(getDisplayImageUrl);
  const currentMedia = product.productMedia[currentImageIndex];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
        <img
          src={images[currentImageIndex] || "/placeholder.svg"}
          alt={currentMedia?.altText || product.productName}
          className="w-full h-full object-cover cursor-zoom-in"
          onClick={() => setShowZoom(true)}
        />
        
        {/* AI Enhanced Badge */}
        {hasGeneratedImage(currentMedia) && (
          <div className="absolute top-4 left-4">
            <Badge variant="default" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Enhanced
            </Badge>
          </div>
        )}
        
        <button
          onClick={() => setShowZoom(true)}
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <Zoom className="w-5 h-5" />
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="flex space-x-2">
          {product.productMedia.map((media, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                currentImageIndex === index ? "border-primary" : "border-transparent"
              }`}
            >
              <img
                src={getDisplayImageUrl(media) || "/placeholder.svg"}
                alt={media?.altText || `${product.productName} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      {showZoom && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowZoom(false)}
        >
          <div className="relative max-w-full max-h-full">
            <img
              src={images[currentImageIndex] || "/placeholder.svg"}
              alt={currentMedia?.altText || product.productName}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* AI Enhanced Badge in zoom */}
            {/* {hasGeneratedImage(currentMedia) && (
              <div className="absolute top-4 left-4">
                <Badge variant="default" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Enhanced Professional Shot
                </Badge>
              </div>
            )} */}
            
            <button
              onClick={() => setShowZoom(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}