import { useState } from "react";
import { Star, ShoppingCart, Plus, Minus } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const { addToCart, items, updateQuantity, removeFromCart } = useCart();

  const cartItem = items.find(item => item.product.id === product.id);
  const cartQuantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!selectedSize) {
      setSelectedSize(product.sizes[0]);
    }
    addToCart(product, selectedSize || product.sizes[0]);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (cartItem) {
      updateQuantity(cartItem.id.toString(), cartQuantity + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (cartItem) {
      if (cartQuantity <= 1) {
        removeFromCart(cartItem.id.toString());
      } else {
        updateQuantity(cartItem.id.toString(), cartQuantity - 1);
      }
    }
  };

  const renderStars = (rating: string) => {
    const numRating = parseFloat(rating);
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 !== 0;
    
    return (
      <div className="flex text-yellow-400">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-current" />
        ))}
        {hasHalfStar && <Star className="w-4 h-4 fill-current opacity-50" />}
        {Array.from({ length: 5 - Math.ceil(numRating) }).map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
        ))}
      </div>
    );
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow cursor-pointer group">
      <Link href={`/product/${product.id}`}>
        <div className="relative overflow-hidden rounded-t-lg">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.originalPrice && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
              Sale
            </div>
          )}
        </div>
      </Link>
        
      <CardContent className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-accent transition-colors">{product.name}</h3>
        </Link>
        <p className="text-gray-600 text-sm mb-2 capitalize">
          {product.category} • {product.subcategory}
        </p>
          
        <div className="flex items-center mb-2">
          {renderStars(product.rating || "0")}
          <span className="text-gray-600 text-sm ml-2">
            ({product.reviewCount ?? 0} reviews)
          </span>
        </div>
          
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold">${product.price}</span>
            {cartQuantity === 0 && product.originalPrice && (
              <span className="text-gray-600 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          {cartQuantity === 0 ? (
            <Button 
              onClick={handleAddToCart}
              size="icon"
              className="bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors h-9 w-9"
              aria-label="Add to cart"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          ) : (
            <div className="flex items-center gap-1" onClick={e => e.preventDefault()}>
              <Button
                onClick={handleDecrement}
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-md"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-7 text-center text-sm font-semibold" data-testid="cart-quantity">
                {cartQuantity}
              </span>
              <Button
                onClick={handleIncrement}
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-md"
                aria-label="Increase quantity"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
