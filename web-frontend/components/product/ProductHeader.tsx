"use client";

import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/currency";
import { Product } from "@/lib/api/product";

interface ProductHeaderProps {
  product: Product;
}

export function ProductHeader({ product }: ProductHeaderProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{product.productName}</h1>
      <p className="text-3xl font-bold text-primary mb-4">{formatPrice(product.basePrice)}</p>
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">
          {product.category.categoryName}
        </Badge>
        {product.variants && product.variants.length > 0 && (
          <Badge variant="outline">
            {product.variants.length} variant{product.variants.length > 1 ? 's' : ''}
          </Badge>
        )}
      </div>
    </div>
  );
}