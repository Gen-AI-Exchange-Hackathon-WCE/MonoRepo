export function formatPrice(amount: number, currency: "INR" | "USD" = "INR"): string {
  if (currency === "INR") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function convertUSDToINR(usdAmount: number): number {
  // Using approximate conversion rate of 1 USD = 83 INR
  return Math.round(usdAmount * 83)
}

export const priceRanges = {
  products: [
    { label: "Under ₹2,000", value: "under-2000", min: 0, max: 2000 },
    { label: "₹2,000 - ₹4,000", value: "2000-4000", min: 2000, max: 4000 },
    { label: "₹4,000 - ₹8,000", value: "4000-8000", min: 4000, max: 8000 },
    { label: "Over ₹8,000", value: "over-8000", min: 8000, max: Number.POSITIVE_INFINITY },
  ],
  courses: [
    { label: "Under ₹4,000", value: "under-4000", min: 0, max: 4000 },
    { label: "₹4,000 - ₹8,000", value: "4000-8000", min: 4000, max: 8000 },
    { label: "Over ₹8,000", value: "over-8000", min: 8000, max: Number.POSITIVE_INFINITY },
  ],
}
