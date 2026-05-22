import Header from "@/components/header";
import Footer from "@/components/footer";
import CartSlideout from "@/components/cart-slideout";
import { Truck, Zap, Globe, Package } from "lucide-react";

export default function Shipping() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Information</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We offer fast, reliable shipping across the United States. Find the option that works best for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center border-2 border-transparent hover:border-accent transition-colors">
            <Package className="h-10 w-10 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Standard Shipping</h3>
            <p className="text-3xl font-bold text-accent mb-2">Free</p>
            <p className="text-gray-600">On orders over $75</p>
            <p className="text-sm text-gray-500 mt-2">5–7 business days</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center border-2 border-transparent hover:border-accent transition-colors">
            <Truck className="h-10 w-10 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Express Shipping</h3>
            <p className="text-3xl font-bold text-accent mb-2">$9.99</p>
            <p className="text-gray-600">Flat rate</p>
            <p className="text-sm text-gray-500 mt-2">2–3 business days</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center border-2 border-transparent hover:border-accent transition-colors">
            <Zap className="h-10 w-10 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Next-Day Delivery</h3>
            <p className="text-3xl font-bold text-accent mb-2">$19.99</p>
            <p className="text-gray-600">Flat rate</p>
            <p className="text-sm text-gray-500 mt-2">1 business day</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Rates</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-3 px-4 font-semibold text-gray-900">Method</th>
                    <th className="py-3 px-4 font-semibold text-gray-900">Order Under $75</th>
                    <th className="py-3 px-4 font-semibold text-gray-900">Order Over $75</th>
                    <th className="py-3 px-4 font-semibold text-gray-900">Delivery Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700">Standard</td>
                    <td className="py-3 px-4 text-gray-700">$5.99</td>
                    <td className="py-3 px-4 text-green-600 font-semibold">Free</td>
                    <td className="py-3 px-4 text-gray-700">5–7 business days</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700">Express</td>
                    <td className="py-3 px-4 text-gray-700">$9.99</td>
                    <td className="py-3 px-4 text-gray-700">$9.99</td>
                    <td className="py-3 px-4 text-gray-700">2–3 business days</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700">Next-Day</td>
                    <td className="py-3 px-4 text-gray-700">$19.99</td>
                    <td className="py-3 px-4 text-gray-700">$19.99</td>
                    <td className="py-3 px-4 text-gray-700">1 business day</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Delivery Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-600">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Processing Time</h3>
                <p className="mb-4">Orders placed before 2:00 PM EST on business days are typically processed the same day. Orders placed after 2:00 PM EST or on weekends/holidays will be processed the next business day.</p>
                <h3 className="font-semibold text-gray-900 mb-3">Tracking Your Order</h3>
                <p>Once your order ships, you'll receive a confirmation email with a tracking number. You can also track your order through your account dashboard.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Delivery Areas</h3>
                <p className="mb-4">We currently ship to all 50 US states and US territories. Unfortunately, we do not ship internationally at this time.</p>
                <h3 className="font-semibold text-gray-900 mb-3">P.O. Boxes & APO/FPO</h3>
                <p>We ship to P.O. Boxes and APO/FPO addresses via Standard shipping only. Express and Next-Day options are not available for these addresses.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping FAQ</h2>
            <div className="space-y-6 text-gray-600">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Can I change my shipping address after placing an order?</h4>
                <p>Address changes can be made within 1 hour of placing your order. Contact our support team immediately if you need to update your address.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">What if my package is lost or damaged?</h4>
                <p>If your package is lost or arrives damaged, please contact us within 48 hours of the expected delivery date. We'll send a replacement or issue a full refund.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Do you offer gift shipping?</h4>
                <p>Yes! During checkout, select the "This is a gift" option. We'll remove all pricing information and include a gift receipt in the package.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <CartSlideout />
    </div>
  );
}
