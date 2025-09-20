"use client";

import { Package, DollarSign } from "lucide-react";
import { Product } from "@/lib/api/product";
import { formatPrice } from "@/lib/currency";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  // Get unique material types from variants
  const materials = product.variants ? [...new Set(product.variants.map(v => v.materialType).filter(Boolean))] : [];
  
  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <p className="text-muted-foreground">Base Price</p>
        <p className="font-medium flex items-center">
          <DollarSign className="w-3 h-3 mr-1" />
          {formatPrice(product.basePrice)}
        </p>
      </div>
      <div>
        <p className="text-muted-foreground">Materials</p>
        <p className="font-medium">{materials.length > 0 ? materials.join(", ") : "Not specified"}</p>
      </div>
      <div>
        <p className="text-muted-foreground">Variants</p>
        <p className="font-medium flex items-center">
          <Package className="w-3 h-3 mr-1" />
          {product.variants ? product.variants.length : 0} available
        </p>
      </div>
      <div>
        <p className="text-muted-foreground">Category</p>
        <p className="font-medium">{product.category.categoryName}</p>
      </div>
    </div>
  );
}