import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const scrollToProducts = () => {
    const productsSection = document.getElementById("products-section");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative bg-gray-900 text-white">
      <img 
        src="https://images.unsplash.com/photo-1556906781-9a412961c28c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&h=800" 
        alt="Modern shoe store display" 
        className="w-full h-56 md:h-72 object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Step Into Style</h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">Discover premium footwear for every occasion</p>
          <Button 
            onClick={scrollToProducts}
            className="bg-accent hover:bg-accent/90 text-white font-semibold py-3 px-8 rounded-lg text-lg"
          >
            Shop Now
          </Button>
        </div>
      </div>
    </section>
  );
}
