"use client";

import { Button } from "@/components/ui/button";
import { Heart, Share } from "lucide-react";
import { Product } from "@/lib/api/product";

interface ProductActionsProps {
  product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log("Add to cart:", product.productName);
  };

  const handleBuyNow = () => {
    // TODO: Implement buy now functionality
    console.log("Buy now:", product.productName);
  };

  const handleWishlist = () => {
    // TODO: Implement wishlist functionality
    console.log("Added to wishlist:", product.productName);
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log("Share product:", product.productName);
  };

  return (
    <div className="flex space-x-3">
      <Button onClick={handleBuyNow} className="flex-1" size="lg">
        Buy Now
      </Button>
      <Button onClick={handleAddToCart} variant="outline" size="lg">
        Add to Cart
      </Button>
      <Button onClick={handleWishlist} variant="outline" size="lg">
        <Heart className="w-4 h-4 mr-2" />
        Wishlist
      </Button>
      <Button onClick={handleShare} variant="outline" size="lg">
        <Share className="w-4 h-4" />
      </Button>
    </div>
  );
}