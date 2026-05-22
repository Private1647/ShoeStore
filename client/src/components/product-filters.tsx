import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import ProductGrid from "@/components/product-grid";
import type { Product } from "@shared/schema";

interface Filters {
  categories: string[];
  sizes: number[];
  priceRange: string;
  sortBy: string;
}

export default function ProductFilters() {
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    sizes: [],
    priceRange: "all",
    sortBy: "featured",
  });

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(filters);
  const [visibleCount, setVisibleCount] = useState(12);
  const [loadMoreId, setLoadMoreId] = useState(`load-more-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  const [loadMoreTestId, setLoadMoreTestId] = useState(`load-more-cta-${Math.random().toString(36).slice(2, 6)}`);
  const [loadMoreClickCount, setLoadMoreClickCount] = useState(0);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  const sortedProducts = useMemo(() => {
    let result = [...products];

    if (appliedFilters.categories.length > 0) {
      result = result.filter(p => appliedFilters.categories.includes(p.category));
    }

    if (appliedFilters.sizes.length > 0) {
      result = result.filter(p => p.sizes.some(s => appliedFilters.sizes.includes(s)));
    }

    if (appliedFilters.priceRange && appliedFilters.priceRange !== "all") {
      result = result.filter(p => {
        const price = parseFloat(p.price);
        switch (appliedFilters.priceRange) {
          case "0-50": return price < 50;
          case "50-100": return price >= 50 && price <= 100;
          case "100-200": return price >= 100 && price <= 200;
          case "200+": return price > 200;
          default: return true;
        }
      });
    }

    switch (filters.sortBy) {
      case "price-low":
        result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-high":
        result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "newest":
        result.reverse();
        break;
      case "best-selling":
        result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
    }

    return result;
  }, [products, filters.sortBy, appliedFilters.categories, appliedFilters.sizes, appliedFilters.priceRange]);

  const visibleProducts = useMemo(() => {
    return sortedProducts.slice(0, visibleCount);
  }, [sortedProducts, visibleCount]);

  const hasMoreProducts = sortedProducts.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 12);
    setLoadMoreClickCount(c => c + 1);
    setLoadMoreId(`load-more-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
    setLoadMoreTestId(`load-more-cta-${Math.random().toString(36).slice(2, 6)}`);
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setFilters(prev => ({
        ...prev,
        categories: [...prev.categories, category]
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        categories: prev.categories.filter(c => c !== category)
      }));
    }
  };

  const handleSizeChange = (size: number, checked: boolean) => {
    if (checked) {
      setFilters(prev => ({
        ...prev,
        sizes: [...prev.sizes, size]
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        sizes: prev.sizes.filter(s => s !== size)
      }));
    }
  };

  return (
    <section id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <Button
            variant="outline"
            className="w-full flex justify-between items-center mb-2"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
          </Button>

          {filtersOpen && (
            <Card className="lg:sticky lg:top-20">
              <CardContent className="p-4 sm:p-6">
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Category</h4>
                  <div className="space-y-2">
                    {["athletic", "casual", "dress", "boots"].map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={filters.categories.includes(category)}
                          onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                        />
                        <Label htmlFor={category} className="capitalize">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium mb-3">Size</h4>
                  <div className="grid grid-cols-4 sm:grid-cols-3 gap-2">
                    {[7, 8, 9, 10, 11, 12].map((size) => (
                      <Button
                        key={size}
                        variant={filters.sizes.includes(size) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSizeChange(size, !filters.sizes.includes(size))}
                        className="text-xs sm:text-sm"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <RadioGroup
                    value={filters.priceRange}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="price-all" />
                      <Label htmlFor="price-all">All Prices</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0-50" id="price-1" />
                      <Label htmlFor="price-1">Under $50</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="50-100" id="price-2" />
                      <Label htmlFor="price-2">$50 - $100</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="100-200" id="price-3" />
                      <Label htmlFor="price-3">$100 - $200</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="200+" id="price-4" />
                      <Label htmlFor="price-4">Over $200</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button onClick={applyFilters} className="w-full bg-accent hover:bg-accent/90">
                  Apply Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Product Grid */}
        <div className="lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Featured Shoes</h2>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Sort by: Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="best-selling">Best Selling</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <ProductGrid products={visibleProducts} isLoading={isLoading} />

          {hasMoreProducts && (
            <div className="mt-8 flex flex-col items-center gap-2">
              <button
                id={loadMoreId}
                data-testid={loadMoreTestId}
                data-click-count={loadMoreClickCount}
                onClick={handleLoadMore}
                type="button"
                className="px-8 py-3 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors"
              >
                Load More Products
              </button>
              <p className="text-sm text-gray-500">
                Showing {visibleProducts.length} of {sortedProducts.length} products
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
