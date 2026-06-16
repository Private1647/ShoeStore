import { useEffect } from "react";
import { useLocation } from "wouter";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/cart-context";
import { SlotProductHighlight } from "@/components/slot-components";

// QA pipeline validation: harmless touch to exercise PR-impact regression
// (cart-slideout → cart feature → REG-005/006/007). No behavior change.
export default function CartSlideout() {
  const [, navigate] = useLocation();
  const { 
    isOpen, 
    toggleCart, 
    items, 
    subtotal, 
    total, 
    updateQuantity, 
    removeFromCart,
    isLoading 
  } = useCart();

  // Prevent background scrolling when cart is open
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

  if (!isOpen) return null;

  const shipping = subtotal > 0 ? 9.99 : 0;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={toggleCart}></div>
      <div className={`absolute right-0 top-0 h-full w-full max-w-sm sm:max-w-md bg-white shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Shopping Cart</h2>
            <Button variant="ghost" size="icon" onClick={toggleCart}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <p>Your cart is empty</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-2 border-b">
                  <SlotProductHighlight>
                    <img
                      slot="image"
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <h4 slot="title">{item.product.name}</h4>
                    <p slot="description">Size: {item.size} · ${item.product.price}</p>
                    <div slot="action" className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={isLoading}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={isLoading}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => removeFromCart(item.id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </SlotProductHighlight>
                </div>
              ))
            )}
          </div>
          
          {/* Cart Summary */}
          {items.length > 0 && (
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-2">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span>Shipping:</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between items-center mb-4 text-lg font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Button 
                className="w-full bg-accent text-white py-3 px-4 rounded-lg hover:bg-accent/90 font-semibold"
                disabled={isLoading}
                onClick={() => {
                  toggleCart();
                  navigate("/checkout");
                }}
              >
                Proceed to Checkout
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
