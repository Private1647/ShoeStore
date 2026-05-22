import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import ProductFilters from "@/components/product-filters";
import Footer from "@/components/footer";
import CartSlideout from "@/components/cart-slideout";
import ProductModal from "@/components/product-modal";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" data-testid="iframe-promo-section">
        <iframe
          src="/iframe-widget.html"
          title="Promotional Banner"
          data-testid="iframe-promo-widget"
          className="w-full border-0 rounded-xl"
          scrolling="no"
          style={{ height: "100px", overflow: "hidden" }}
        />
      </section>
      <ProductFilters />
      <Footer />
      <CartSlideout />
      <ProductModal />
    </div>
  );
}
