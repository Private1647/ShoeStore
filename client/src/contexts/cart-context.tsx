import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { CartItemWithProduct, Product } from "@shared/schema";

interface CartState {
  items: CartItemWithProduct[];
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  total: number;
}

interface CartContextType extends CartState {
  toggleCart: () => void;
  addToCart: (product: Product, size: number, quantity?: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  isLoading: boolean;
}

type CartAction =
  | { type: "TOGGLE_CART" }
  | { type: "SET_ITEMS"; payload: CartItemWithProduct[] }
  | { type: "SET_LOADING"; payload: boolean };

const initialState: CartState = {
  items: [],
  isOpen: false,
  itemCount: 0,
  subtotal: 0,
  total: 0,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };
    case "SET_ITEMS": {
      const items = action.payload;
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
      const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0);
      const shipping = subtotal > 0 ? 9.99 : 0;
      const total = subtotal + shipping;
      
      return {
        ...state,
        items,
        itemCount,
        subtotal,
        total,
      };
    }
    default:
      return state;
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const queryClient = useQueryClient();

  // Generate session ID
  const sessionId = React.useMemo(() => {
    const stored = localStorage.getItem("sessionId");
    if (stored) return stored;
    const newId = crypto.randomUUID();
    localStorage.setItem("sessionId", newId);
    return newId;
  }, []);

  const emptyCart: CartItemWithProduct[] = useMemo(() => [], []);

  const { data: cartItems, isLoading } = useQuery({
    queryKey: ["/api/cart", sessionId],
    queryFn: async () => {
      const response = await fetch("/api/cart", {
        headers: {
          "x-session-id": sessionId,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch cart");
      return response.json() as Promise<CartItemWithProduct[]>;
    },
    enabled: !!sessionId,
  });

  const resolvedCartItems = cartItems ?? emptyCart;

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, size, quantity }: { productId: string; size: number; quantity: number }) => {
      return apiRequest("POST", "/api/cart", {
        productId,
        size,
        quantity,
      }, {
        "x-session-id": sessionId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
    },
  });

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      return apiRequest("PUT", `/api/cart/${itemId}`, { quantity }, {
        "x-session-id": sessionId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
    },
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: async (itemId: string) => {
      return apiRequest("DELETE", `/api/cart/${itemId}`, undefined, {
        "x-session-id": sessionId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
    },
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", "/api/cart", undefined, {
        "x-session-id": sessionId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
    },
  });

  useEffect(() => {
    dispatch({ type: "SET_ITEMS", payload: resolvedCartItems });
  }, [resolvedCartItems]);

  const toggleCart = useCallback(() => dispatch({ type: "TOGGLE_CART" }), []);

  const addToCart = useCallback((product: Product, size: number, quantity = 1) => {
    addToCartMutation.mutate({ productId: product.id, size, quantity });
  }, [addToCartMutation]);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    updateQuantityMutation.mutate({ itemId, quantity });
  }, [updateQuantityMutation]);

  const removeFromCart = useCallback((itemId: string) => {
    removeFromCartMutation.mutate(itemId);
  }, [removeFromCartMutation]);

  const clearCart = useCallback(() => {
    clearCartMutation.mutate();
  }, [clearCartMutation]);

  const combinedIsLoading = isLoading || addToCartMutation.isPending || updateQuantityMutation.isPending || removeFromCartMutation.isPending;

  const contextValue = useMemo<CartContextType>(() => ({
    ...state,
    toggleCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isLoading: combinedIsLoading,
  }), [state, toggleCart, addToCart, updateQuantity, removeFromCart, clearCart, combinedIsLoading]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}
