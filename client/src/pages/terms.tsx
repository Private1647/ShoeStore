import Header from "@/components/header";
import Footer from "@/components/footer";
import CartSlideout from "@/components/cart-slideout";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-gray-500 mb-8">Last updated: January 15, 2024</p>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8 text-gray-600">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using the SoleStyle website (solestyle.com), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services. These terms apply to all visitors, users, and customers of the website.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Use of Website</h2>
            <p className="mb-2">You agree to use our website only for lawful purposes and in accordance with these Terms. You agree not to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Use the website in any way that violates applicable laws or regulations</li>
              <li>Attempt to gain unauthorized access to any part of the website</li>
              <li>Use any automated system to access the website in a manner that sends more requests than a human could reasonably produce</li>
              <li>Introduce any viruses, trojans, or other malicious material</li>
              <li>Impersonate or attempt to impersonate SoleStyle, a SoleStyle employee, or another user</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Products and Pricing</h2>
            <p className="mb-2">We make every effort to display our products and their prices accurately. However:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Product colors may vary slightly due to monitor display settings</li>
              <li>We reserve the right to correct pricing errors at any time</li>
              <li>Prices are subject to change without notice</li>
              <li>We reserve the right to limit quantities or refuse any order</li>
              <li>All prices are listed in US Dollars (USD)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Orders and Payment</h2>
            <p className="mb-2">When you place an order through our website:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>You confirm that all information provided is accurate and complete</li>
              <li>You authorize us to charge the payment method provided</li>
              <li>An order confirmation does not guarantee acceptance; we may cancel orders due to pricing errors, stock issues, or suspected fraud</li>
              <li>We accept major credit cards, debit cards, and other payment methods as displayed at checkout</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Shipping and Delivery</h2>
            <p>Shipping times are estimates and are not guaranteed. SoleStyle is not responsible for delays caused by shipping carriers, weather, or other circumstances beyond our control. Risk of loss and title for items purchased pass to you upon delivery to the carrier. Please refer to our Shipping Information page for detailed shipping rates and policies.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Returns and Refunds</h2>
            <p>Our return and refund policy is outlined on our Returns page. By making a purchase, you agree to our return policy terms. Refunds will be issued to the original payment method within the timeframe specified in our Returns policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Intellectual Property</h2>
            <p>All content on the SoleStyle website, including text, graphics, logos, images, and software, is the property of SoleStyle or its content suppliers and is protected by United States and international copyright laws. You may not reproduce, distribute, modify, or create derivative works from any content without our express written permission.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. User Accounts</h2>
            <p>If you create an account on our website, you are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account. We reserve the right to terminate accounts at our discretion.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Limitation of Liability</h2>
            <p>To the fullest extent permitted by law, SoleStyle shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or goodwill, arising out of or in connection with your use of our website or services.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Governing Law</h2>
            <p>These Terms of Service shall be governed by and construed in accordance with the laws of the State of Oregon, United States, without regard to its conflict of law provisions. Any disputes arising under these terms shall be resolved in the courts of Multnomah County, Oregon.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Changes to Terms</h2>
            <p>We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting on the website. Your continued use of the website after changes are posted constitutes your acceptance of the modified terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">12. Contact Information</h2>
            <p>For questions about these Terms of Service, please contact us at:</p>
            <div className="mt-2">
              <p>SoleStyle, Inc.</p>
              <p>123 Shoe Lane, Suite 400</p>
              <p>Portland, OR 97201</p>
              <p>Email: legal@solestyle.com</p>
              <p>Phone: 1-800-765-3789</p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <CartSlideout />
    </div>
  );
}
