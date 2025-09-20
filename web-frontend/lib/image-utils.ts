import { ProductMedia } from "@/lib/api/product";

/**
 * Get the appropriate image URL for display - prioritizes generated URL if available
 * @param media - ProductMedia object containing imageUrl and genereatedUrl
 * @returns The URL to display (generated URL if available, otherwise original URL)
 */
export function getDisplayImageUrl(media: ProductMedia): string {
    return media.genereatedUrl || media.imageUrl;
}

/**
 * Check if a media item has an AI-generated version
 * @param media - ProductMedia object
 * @returns true if the media has a generated URL
 */
export function hasGeneratedImage(media: ProductMedia): boolean {
    return Boolean(media.genereatedUrl);
}

/**
 * Get all display URLs from an array of product media
 * @param mediaArray - Array of ProductMedia objects
 * @returns Array of display URLs (prioritizing generated URLs)
 */
export function getDisplayImageUrls(mediaArray: ProductMedia[]): string[] {
    return mediaArray.map(getDisplayImageUrl);
}