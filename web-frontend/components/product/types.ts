// API Response Types based on the actual API structure
export interface ProductMedia {
  id: number;
  productId: number;
  imageUrl: string;
  genereatedUrl: string | null;
  mediaType: string;
  altText: string;
  caption: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: number;
  productId: number;
  size: string;
  color: string;
  materialType: string;
  dimensions: string | null;
  price: number;
  stock: number;
  createdAt: string;
}

export interface ProductCategory {
  id: number;
  artistId: number;
  categoryName: string;
  categoryDescription: string;
  categoryIcon: string | null;
}

export interface ApiProductData {
  id: number;
  categoryId: number;
  productName: string;
  productDescription: string;
  generatedDescription: string;
  basePrice: number;
  isDescriptionAccepted: boolean;
  productMedia: ProductMedia[];
  variants: ProductVariant[];
  category: ProductCategory;
}

export interface ApiProductResponse {
  statusCode: number;
  data: ApiProductData;
  message: string;
  success: boolean;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  artist: string;
}