import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Truck, ShoppingBag, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/cart-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { checkoutSchema, type CheckoutData } from "@shared/schema";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ShadowDomPaymentFields } from "@/components/shadow-dom-components";

export default function Checkout() {
  const { items, subtotal, total, isLoading: cartLoading } = useCart();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [orderBtnId, setOrderBtnId] = useState(`order-btn-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  const [orderBtnTestId, setOrderBtnTestId] = useState(`place-order-${Math.random().toString(36).slice(2, 6)}`);

  const shipping = subtotal > 0 ? 9.99 : 0;

  const form = useForm<CheckoutData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      shippingAddress: "",
      shippingCity: "",
      shippingState: "",
      shippingZip: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvv: "",
      cardholderName: "",
    },
  });

  const handlePaymentFieldChange = useCallback((field: string, value: string) => {
    form.setValue(field as keyof CheckoutData, value, { shouldValidate: true });
  }, [form]);

  const regenerateOrderBtnLocators = useCallback(() => {
    setOrderBtnId(`order-btn-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
    setOrderBtnTestId(`place-order-${Math.random().toString(36).slice(2, 6)}`);
  }, []);

  const sessionId = localStorage.getItem("sessionId") || "";

  const onSubmit = async (data: CheckoutData) => {
    setIsSubmitting(true);
    setPaymentError("");

    try {
      const response = await apiRequest("POST", "/api/checkout", data, {
        "x-session-id": sessionId,
      });
      const order = await response.json();

      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });

      toast({
        title: "Order placed successfully!",
        description: `Order #${order.id.slice(0, 8)} has been confirmed.`,
      });

      navigate(`/order/${order.id}`);
    } catch (error: any) {
      const message = error.message || "Something went wrong";
      if (message.includes("402") || message.includes("declined") || message.includes("PAYMENT_DECLINED")) {
        setPaymentError("Payment declined. Your card was not accepted. Please try card number 4242 4242 4242 4242.");
      } else if (message.includes("400")) {
        setPaymentError("Please check your information and try again.");
      } else {
        setPaymentError("An error occurred while processing your payment. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !cartLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some items to your cart before checking out.</p>
            <Button onClick={() => navigate("/")} className="bg-accent hover:bg-accent/90">
              Continue Shopping
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Shipping Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="customerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="customerEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="shippingAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="shippingCity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="New York" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shippingState"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="NY" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shippingZip"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zip Code</FormLabel>
                            <FormControl>
                              <Input placeholder="10001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {paymentError && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        {paymentError}
                      </div>
                    )}
                    <FormField
                      control={form.control}
                      name="cardholderName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cardholder Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <ShadowDomPaymentFields onFieldChange={handlePaymentFieldChange} />
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.product.name}</p>
                            <p className="text-xs text-gray-500">Size {item.size} × {item.quantity}</p>
                          </div>
                          <p className="text-sm font-medium">
                            ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span>${shipping.toFixed(2)}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      id={orderBtnId}
                      data-testid={orderBtnTestId}
                      data-dynamic-locator="true"
                      className="w-full mt-6 bg-accent hover:bg-accent/90 font-semibold"
                      disabled={isSubmitting || cartLoading}
                      onClick={regenerateOrderBtnLocators}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `Place Order — $${total.toFixed(2)}`
                      )}
                    </Button>
                    <div className="mt-2 grid grid-cols-2 gap-1 text-[10px] text-gray-400">
                      <div>id: <code className="bg-gray-100 px-1 rounded break-all">{orderBtnId}</code></div>
                      <div>data-testid: <code className="bg-gray-100 px-1 rounded break-all">{orderBtnTestId}</code></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </main>
      <Footer />
    </div>
  );
}