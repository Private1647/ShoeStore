import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "wouter";
import { Search } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CartSlideout from "@/components/cart-slideout";
import ProductModal from "@/components/product-modal";
import ProductGrid from "@/components/product-grid";
import type { Product } from "@shared/schema";

export default function SearchPage() {
  const searchString = useSearch();
  const query = useMemo(() => {
    const params = new URLSearchParams(searchString);
    return params.get("q") || "";
  }, [searchString]);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: [`/api/products?search=${encodeURIComponent(query)}`],
    enabled: query.length > 0,
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Results
          </h1>
          {query && (
            <p className="text-gray-600">
              {isLoading
                ? `Searching for "${query}"...`
                : `${products.length} result${products.length !== 1 ? "s" : ""} for "${query}"`}
            </p>
          )}
        </div>

        {!query ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Enter a search term
            </h2>
            <p className="text-gray-500">
              Use the search bar above to find shoes by name, brand, or category.
            </p>
          </div>
        ) : !isLoading && products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No results found
            </h2>
            <p className="text-gray-500">
              We couldn't find any products matching "{query}". Try a different search term.
            </p>
          </div>
        ) : (
          <ProductGrid products={products} isLoading={isLoading} />
        )}
      </main>
      <Footer />
      <CartSlideout />
      <ProductModal />
    </div>
  );
}
