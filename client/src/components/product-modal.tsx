import { useState, useEffect } from "react";
import { X, Star, Minus, Plus } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import type { Product } from "@shared/schema";

export default function ProductModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    const handleOpenModal = (event: CustomEvent<Product>) => {
      setProduct(event.detail);
      setSelectedSize(null);
      setQuantity(1);
      setSelectedImageIndex(0);
      setIsOpen(true);
    };

    window.addEventListener("openProductModal", handleOpenModal as EventListener);
    
    return () => {
      window.removeEventListener("openProductModal", handleOpenModal as EventListener);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const closeModal = () => {
    setIsOpen(false);
    setProduct(null);
  };

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;
    addToCart(product, selectedSize, quantity);
    closeModal();
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

  if (!isOpen || !product) return null;

  const images = [product.imageUrl, ...(product.thumbnails || [])];

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeModal}></div>
      <div className="absolute inset-2 sm:inset-4 md:inset-8 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
        <div className="flex justify-end p-4 flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={closeModal}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 p-4 sm:p-6 md:p-8 pt-0 flex-1 overflow-y-auto">
          {/* Product Images */}
          <div>
            <img 
              src={images[selectedImageIndex]} 
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg mb-4"
            />
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className={`w-full h-20 object-cover rounded cursor-pointer border-2 transition-colors ${
                      selectedImageIndex === index ? 'border-accent' : 'border-transparent hover:border-accent'
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div>
            <Link href={`/product/${product.id}`} onClick={closeModal} className="text-accent text-sm hover:underline mb-2 inline-block">View Full Details →</Link>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4 capitalize">
              {product.category} • {product.subcategory}
            </p>
            
            {/* Rating */}
            <div className="flex items-center mb-4">
              {renderStars(product.rating || "0")}
              <span className="text-gray-600 ml-2">
                {product.rating || "0"} ({product.reviewCount || 0} reviews)
              </span>
            </div>
            
            {/* Price */}
            <div className="mb-6">
              <span className="text-3xl font-bold">${product.price}</span>
              {product.originalPrice && (
                <span className="text-gray-600 line-through ml-2">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            
            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Size</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    className={selectedSize === size ? "bg-accent text-white" : ""}
                    onClick={() => setSelectedSize(size)}
                    size="sm"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Quantity */}
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
            
            {/* Add to Cart Button */}
            <Button 
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className="w-full bg-accent text-white py-3 px-6 rounded-lg hover:bg-accent/90 font-semibold text-lg mb-4"
            >
              Add to Cart
            </Button>
            
            {/* Product Description */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
            
            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Features</h3>
                <ul className="text-gray-600 space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index}>• {feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
