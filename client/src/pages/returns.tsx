import Header from "@/components/header";
import Footer from "@/components/footer";
import CartSlideout from "@/components/cart-slideout";
import { RotateCcw, CheckCircle, Clock, Package } from "lucide-react";

export default function Returns() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Returns & Exchanges</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We want you to love every purchase. If something isn't right, we make returns and exchanges simple and hassle-free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <RotateCcw className="h-8 w-8 text-accent mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Free Returns</h3>
            <p className="text-gray-600 text-sm">No return shipping costs on any order.</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <Clock className="h-8 w-8 text-accent mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">30-Day Window</h3>
            <p className="text-gray-600 text-sm">Return within 30 days of delivery.</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <Package className="h-8 w-8 text-accent mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Easy Process</h3>
            <p className="text-gray-600 text-sm">Print a prepaid label from your account.</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <CheckCircle className="h-8 w-8 text-accent mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Fast Refunds</h3>
            <p className="text-gray-600 text-sm">Refund processed within 5 business days.</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Return Policy</h2>
            <div className="space-y-4 text-gray-600">
              <p>We accept returns on all unworn items within 30 days of delivery. Items must be in their original condition with all tags attached and in the original packaging.</p>
              <h3 className="font-semibold text-gray-900 mt-6">Eligible for return:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Unworn shoes in original condition</li>
                <li>Items with all original tags and packaging</li>
                <li>Products purchased within the last 30 days</li>
                <li>Items that are the wrong size or don't meet expectations</li>
              </ul>
              <h3 className="font-semibold text-gray-900 mt-6">Not eligible for return:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Worn or used shoes (visible wear on soles)</li>
                <li>Items without original tags or packaging</li>
                <li>Final sale or clearance items marked as non-returnable</li>
                <li>Items returned after the 30-day window</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Start a Return</h2>
            <ol className="space-y-6 text-gray-600">
              <li className="flex items-start">
                <span className="bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">1</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Log into your account</h4>
                  <p>Navigate to your order history and select the item you'd like to return.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">2</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Select return reason</h4>
                  <p>Choose why you're returning the item. This helps us improve our products and service.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">3</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Print your prepaid label</h4>
                  <p>A prepaid shipping label will be emailed to you. Print it and attach it to your package.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">4</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Drop off your package</h4>
                  <p>Drop your package at any UPS or USPS location. You'll receive a refund within 5 business days of us receiving the item.</p>
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Exchanges</h2>
            <p className="text-gray-600 mb-4">
              Need a different size or color? We're happy to exchange your purchase. Simply start a return and place a new order for the item you'd like. This ensures you get the replacement as quickly as possible.
            </p>
            <p className="text-gray-600">
              If you need help finding the right size, check out our <a href="/size-guide" className="text-accent hover:underline">Size Guide</a> or contact our customer service team.
            </p>
          </div>
        </div>
      </main>
      <Footer />
      <CartSlideout />
    </div>
  );
}
