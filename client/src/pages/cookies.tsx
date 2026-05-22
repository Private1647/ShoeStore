import Header from "@/components/header";
import Footer from "@/components/footer";
import CartSlideout from "@/components/cart-slideout";

export default function Cookies() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: January 15, 2024</p>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8 text-gray-600">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. What Are Cookies?</h2>
            <p>Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and give website owners useful information about how their site is being used. Cookies can be "persistent" (remaining on your device until they expire or are deleted) or "session" cookies (deleted when you close your browser).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Cookies</h2>
            <p className="mb-4">SoleStyle uses cookies for several purposes:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-3 px-4 font-semibold text-gray-900">Cookie Type</th>
                    <th className="py-3 px-4 font-semibold text-gray-900">Purpose</th>
                    <th className="py-3 px-4 font-semibold text-gray-900">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">Essential</td>
                    <td className="py-3 px-4">Required for the website to function. These enable core features like shopping cart, checkout, and account authentication.</td>
                    <td className="py-3 px-4">Session</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">Functional</td>
                    <td className="py-3 px-4">Remember your preferences such as language, region, and display settings to provide a personalized experience.</td>
                    <td className="py-3 px-4">1 year</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">Analytics</td>
                    <td className="py-3 px-4">Help us understand how visitors interact with our website by collecting and reporting information anonymously.</td>
                    <td className="py-3 px-4">2 years</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">Marketing</td>
                    <td className="py-3 px-4">Used to track visitors across websites to display relevant advertisements and measure campaign effectiveness.</td>
                    <td className="py-3 px-4">90 days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Specific Cookies We Use</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-3 px-4 font-semibold text-gray-900">Cookie Name</th>
                    <th className="py-3 px-4 font-semibold text-gray-900">Provider</th>
                    <th className="py-3 px-4 font-semibold text-gray-900">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-mono text-sm">session_id</td>
                    <td className="py-3 px-4">SoleStyle</td>
                    <td className="py-3 px-4">Maintains your session while browsing</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-mono text-sm">cart_data</td>
                    <td className="py-3 px-4">SoleStyle</td>
                    <td className="py-3 px-4">Stores your shopping cart contents</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-mono text-sm">preferences</td>
                    <td className="py-3 px-4">SoleStyle</td>
                    <td className="py-3 px-4">Remembers your site preferences</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-mono text-sm">_ga</td>
                    <td className="py-3 px-4">Google Analytics</td>
                    <td className="py-3 px-4">Distinguishes unique users</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-mono text-sm">_gid</td>
                    <td className="py-3 px-4">Google Analytics</td>
                    <td className="py-3 px-4">Stores and counts page views</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Managing Cookies</h2>
            <p className="mb-4">You can control and manage cookies in several ways:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Browser settings:</strong> Most browsers allow you to view, manage, delete, and block cookies. Note that deleting or blocking cookies may affect your experience on our website and you may not be able to access all features.</li>
              <li><strong>Opt-out links:</strong> You can opt out of analytics tracking by visiting the Google Analytics opt-out page.</li>
              <li><strong>Do Not Track:</strong> We honor "Do Not Track" browser signals when detected.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Third-Party Cookies</h2>
            <p>Some cookies are placed by third-party services that appear on our pages. We do not control these cookies and recommend reviewing the privacy policies of these third parties for more information about their cookie practices. Third-party services we use include Google Analytics, payment processors, and social media platforms.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Updates to This Policy</h2>
            <p>We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We encourage you to periodically review this page for the latest information on our cookie practices.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Contact Us</h2>
            <p>If you have questions about our use of cookies, please contact us at:</p>
            <div className="mt-2">
              <p>SoleStyle, Inc.</p>
              <p>123 Shoe Lane, Suite 400</p>
              <p>Portland, OR 97201</p>
              <p>Email: privacy@solestyle.com</p>
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
