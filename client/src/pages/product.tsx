import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Star, Minus, Plus, ChevronRight, Truck, RotateCcw, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/contexts/cart-context";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductModal from "@/components/product-modal";
import CartSlideout from "@/components/cart-slideout";
import { ShadowDomRating } from "@/components/shadow-dom-components";
import { SlotCard } from "@/components/slot-components";
import type { Product } from "@shared/schema";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addToCart } = useCart();

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ["/api/products", id],
  });

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;
    addToCart(product, selectedSize, quantity);
  };

  const renderStars = (rating: string) => {
    const numRating = parseFloat(rating);
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 !== 0;

    return (
      <div className="flex text-yellow-400">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-current" />
        ))}
        {hasHalfStar && <Star className="w-5 h-5 fill-current opacity-50" />}
        {Array.from({ length: 5 - Math.ceil(numRating) }).map((_, i) => (
          <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
        ))}
      </div>
    );
  };

  const generateReviews = (product: Product) => {
    const reviewers = [
      { name: "Alex M.", date: "2 weeks ago" },
      { name: "Sarah K.", date: "1 month ago" },
      { name: "James R.", date: "3 weeks ago" },
      { name: "Emily T.", date: "2 months ago" },
      { name: "Michael B.", date: "1 week ago" },
    ];
    const comments = [
      `Love these ${product.name}! Super comfortable and great quality. Would definitely recommend.`,
      `Great ${product.category} shoes. The fit is perfect and they look amazing. Worth every penny.`,
      `Been wearing these daily for a month now. Still look brand new. Very durable and stylish.`,
      `Ordered these for ${product.category === "dress" ? "a formal event" : product.category === "athletic" ? "my workouts" : "everyday wear"} and couldn't be happier with the purchase.`,
      `The ${product.brand} quality is outstanding as always. These are my new favorites.`,
    ];
    const ratings = ["5.0", "4.0", "5.0", "4.0", "5.0"];
    const count = Math.min(product.reviewCount || 3, 5);
    return Array.from({ length: count }).map((_, i) => ({
      ...reviewers[i % reviewers.length],
      comment: comments[i % comments.length],
      rating: ratings[i % ratings.length],
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="w-full h-[500px] rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Link href="/">
            <Button className="bg-accent text-white hover:bg-accent/90">Back to Home</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = [product.imageUrl, ...(product.thumbnails || [])];
  const discount = product.originalPrice
    ? Math.round(((parseFloat(product.originalPrice) - parseFloat(product.price)) / parseFloat(product.originalPrice)) * 100)
    : 0;
  const reviews = generateReviews(product);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ProductModal />
      <CartSlideout />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-accent">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="capitalize">{product.category}</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <div className="bg-white rounded-lg overflow-hidden mb-4">
              <img
                src={images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-[400px] sm:h-[500px] object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    className={`rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index ? "border-accent" : "border-transparent hover:border-accent/50"
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="mb-2">
              <span className="text-sm font-medium text-accent uppercase tracking-wide">{product.brand}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-500 capitalize mb-4">{product.category} • {product.subcategory} • {product.gender}</p>

            <div className="flex items-center gap-3 mb-4">
              <ShadowDomRating rating={Math.round(parseFloat(product.rating || "0"))} productName={product.name} />
              <span className="text-gray-600">
                ({product.reviewCount || 0} reviews)
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">${product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">${product.originalPrice}</span>
                  <span className="bg-red-100 text-red-700 text-sm font-semibold px-2 py-1 rounded">
                    -{discount}% OFF
                  </span>
                </>
              )}
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-3">Select Size</h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    className={selectedSize === size ? "bg-accent text-white hover:bg-accent/90" : ""}
                    onClick={() => setSelectedSize(size)}
                    size="sm"
                  >
                    {size}
                  </Button>
                ))}
              </div>
              {!selectedSize && (
                <p className="text-sm text-gray-500 mt-2">Please select a size</p>
              )}
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              data-testid="add-to-cart-btn"
              id="add-to-cart"
              className="w-full bg-accent text-white text-lg font-semibold hover:bg-accent/90 mb-6 h-12"
            >
              Add to Cart - ${(parseFloat(product.price) * quantity).toFixed(2)}
            </Button>

            <div className="grid grid-cols-3 gap-4 mb-8 border-t border-b py-4">
              <div className="flex flex-col items-center text-center">
                <Truck className="w-5 h-5 text-gray-600 mb-1" />
                <span className="text-xs text-gray-600">Free shipping over $100</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <RotateCcw className="w-5 h-5 text-gray-600 mb-1" />
                <span className="text-xs text-gray-600">30-day returns</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Shield className="w-5 h-5 text-gray-600 mb-1" />
                <span className="text-xs text-gray-600">1-year warranty</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {product.features && product.features.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-gray-600">
                      <span className="text-accent mr-2 mt-1">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 bg-white rounded-lg p-6 sm:p-8">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="flex items-center gap-4 mb-8 pb-6 border-b">
            <div className="text-center">
              <div className="text-4xl font-bold">{product.rating || "0"}</div>
              <div className="mt-1">{renderStars(product.rating || "0")}</div>
              <div className="text-sm text-gray-500 mt-1">{product.reviewCount || 0} reviews</div>
            </div>
          </div>

          <div className="space-y-6">
            {reviews.map((review, index) => (
              <SlotCard key={index}>
                <div slot="header">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "40px", height: "40px", background: "#e5e7eb", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, color: "#4b5563" }}>
                        {review.name.charAt(0)}
                      </div>
                      <span>{review.name}</span>
                    </div>
                    <div style={{ display: "flex", gap: "2px", color: "#f59e0b" }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < parseFloat(review.rating) ? "fill-current" : "text-gray-300"}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <p slot="body">{review.comment}</p>
                <span slot="footer">{review.date}</span>
              </SlotCard>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}