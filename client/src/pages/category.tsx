import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CartSlideout from "@/components/cart-slideout";
import ProductModal from "@/components/product-modal";
import ProductGrid from "@/components/product-grid";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import type { Product } from "@shared/schema";

const categoryConfig: Record<string, { title: string; subtitle: string; image: string }> = {
  athletic: {
    title: "Athletic Shoes",
    subtitle: "Performance footwear for running, training, and sport",
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&h=600",
  },
  casual: {
    title: "Casual Shoes",
    subtitle: "Everyday comfort meets effortless style",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&h=600",
  },
  dress: {
    title: "Dress Shoes",
    subtitle: "Elegant footwear for formal and professional occasions",
    image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&h=600",
  },
  boots: {
    title: "Boots",
    subtitle: "Rugged style and protection for every adventure",
    image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&h=600",
  },
  sale: {
    title: "Sale",
    subtitle: "Great deals on premium footwear — limited time only",
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&h=600",
  },
};

const genderConfig: Record<string, { title: string; subtitle: string; image: string }> = {
  men: {
    title: "Men's Shoes",
    subtitle: "Premium footwear designed for men",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&h=600",
  },
  women: {
    title: "Women's Shoes",
    subtitle: "Stylish and comfortable shoes for women",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&h=600",
  },
};

interface CategoryPageProps {
  type: "category" | "gender";
}

export default function CategoryPage({ type }: CategoryPageProps) {
  const params = useParams();
  const slug = type === "category" ? params.category : params.gender;

  const config = type === "category"
    ? categoryConfig[slug || ""] || { title: slug || "", subtitle: "", image: "" }
    : genderConfig[slug || ""] || { title: slug || "", subtitle: "", image: "" };

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState("featured");

  const queryUrl = useMemo(() => {
    if (type === "category") {
      if (slug === "sale") return "/api/products?sale=true";
      return `/api/products?category=${slug}`;
    }
    return `/api/products?gender=${slug}`;
  }, [type, slug]);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", type, slug],
    queryFn: async () => {
      const response = await fetch(queryUrl);
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    if (selectedSizes.length > 0) {
      result = result.filter(p => p.sizes.some(s => selectedSizes.includes(s)));
    }

    if (priceRange !== "all") {
      result = result.filter(p => {
        const price = parseFloat(p.price);
        switch (priceRange) {
          case "0-50": return price < 50;
          case "50-100": return price >= 50 && price <= 100;
          case "100-200": return price >= 100 && price <= 200;
          case "200+": return price > 200;
          default: return true;
        }
      });
    }

    switch (sortBy) {
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
  }, [products, selectedCategories, selectedSizes, priceRange, sortBy]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories(prev =>
      checked ? [...prev, category] : prev.filter(c => c !== category)
    );
  };

  const handleSizeChange = (size: number, checked: boolean) => {
    setSelectedSizes(prev =>
      checked ? [...prev, size] : prev.filter(s => s !== size)
    );
  };

  const showCategoryFilter = type === "gender" || slug === "sale";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="relative bg-gray-900 text-white">
        <img
          src={config.image}
          alt={config.title}
          className="w-full h-48 md:h-72 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-2">{config.title}</h1>
            <p className="text-base md:text-lg text-gray-200">{config.subtitle}</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

                {showCategoryFilter && (
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Category</h4>
                    <div className="space-y-2">
                      {["athletic", "casual", "dress", "boots"].map((cat) => (
                        <div key={cat} className="flex items-center space-x-2">
                          <Checkbox
                            id={`cat-${cat}`}
                            checked={selectedCategories.includes(cat)}
                            onCheckedChange={(checked) => handleCategoryChange(cat, checked as boolean)}
                          />
                          <Label htmlFor={`cat-${cat}`} className="capitalize">{cat}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h4 className="font-medium mb-3">Size</h4>
                  <div className="grid grid-cols-4 sm:grid-cols-3 gap-2">
                    {[5, 6, 7, 8, 9, 10, 11, 12, 13].map((size) => (
                      <Button
                        key={size}
                        variant={selectedSizes.includes(size) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSizeChange(size, !selectedSizes.includes(size))}
                        className="text-xs sm:text-sm"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <RadioGroup value={priceRange} onValueChange={setPriceRange}>
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
              </CardContent>
            </Card>
            )}
          </div>

          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {config.title}
                <span className="text-gray-500 text-base font-normal ml-2">
                  ({filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"})
                </span>
              </h2>
              <Select value={sortBy} onValueChange={setSortBy}>
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

            {!isLoading && filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No products found matching your filters.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedSizes([]);
                    setPriceRange("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <ProductGrid products={filteredProducts} isLoading={isLoading} />
            )}
          </div>
        </div>
      </section>

      <Footer />
      <CartSlideout />
      <ProductModal />
    </div>
  );
}
