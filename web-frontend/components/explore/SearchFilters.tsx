"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  categories: string[];
  regions: string[];
  showFilters: boolean;
  onToggleFilters: () => void;
}

const quickSearchSuggestions = [
  "paintings for my home",
  "handmade Diwali gifts", 
  "pottery for kitchen",
  "traditional textiles"
];

export function SearchFilters({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  selectedCategory,
  onCategoryChange,
  selectedRegion,
  onRegionChange,
  categories,
  regions,
  showFilters,
  onToggleFilters
}: SearchFiltersProps) {
  const [inputValue, setInputValue] = useState(searchQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(inputValue);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    onSearchSubmit(suggestion);
  };

  return (
    <div className="space-y-6">
      {/* Hero Search Section */}
      <div className=" py-16">
        <div className="container mx-auto px-4 text-center">
          {/* <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Discover Authentic Handmade Treasures
          </h1>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Find unique, handcrafted items made by skilled artisans across India.
            Each piece tells a story of tradition and craftsmanship.
          </p> */}

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search for handmade items, artists, or categories..."
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    onSearchChange(e.target.value);
                  }}
                  className="pl-10 py-3 text-base"
                />
              </div>
              <Button type="submit" size="lg" className="px-8">
                Search
              </Button>
            </form>
          </div>

          {/* Quick Search Suggestions */}
          <div className="flex flex-wrap gap-2 mt-6 justify-center">
            {quickSearchSuggestions.map((suggestion) => (
              <Badge
                key={suggestion}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="border-b border-t bg-muted/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 overflow-x-auto">
              {/* Category Filters */}
              <div className="flex space-x-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className="cursor-pointer whitespace-nowrap"
                    onClick={() => onCategoryChange(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleFilters}
              className="ml-4 flex-shrink-0"
            >
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Region</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={selectedRegion}
                    onChange={(e) => onRegionChange(e.target.value)}
                  >
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Price Range</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>All Prices</option>
                    <option>Under ₹1,000</option>
                    <option>₹1,000 - ₹5,000</option>
                    <option>₹5,000 - ₹10,000</option>
                    <option>Above ₹10,000</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>New Arrivals</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Most Popular</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}