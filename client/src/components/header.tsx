import { useState } from "react";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/cart-context";
import { Link, useLocation } from "wouter";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleCart, itemCount } = useCart();
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-black hover:text-gray-700 transition-colors">
              SoleStyle
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="/gender/men" className="text-gray-900 hover:text-accent transition-colors">Men</Link>
            <Link href="/gender/women" className="text-gray-900 hover:text-accent transition-colors">Women</Link>
            <Link href="/category/athletic" className="text-gray-900 hover:text-accent transition-colors">Athletic</Link>
            <Link href="/category/casual" className="text-gray-900 hover:text-accent transition-colors">Casual</Link>
            <Link href="/category/dress" className="text-gray-900 hover:text-accent transition-colors">Dress</Link>
            <Link href="/category/sale" className="text-gray-900 hover:text-accent transition-colors font-semibold text-red-600 hover:text-red-700">Sale</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="hidden md:block relative">
              <Input
                type="text"
                placeholder="Search shoes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </form>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-600 hover:text-accent"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 hover:text-accent relative"
              onClick={toggleCart}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 hover:text-accent"
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white pb-4">
            <div className="px-4 py-2">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search shoes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </form>
              <nav className="space-y-2">
                <Link href="/gender/men" className="block text-gray-900 hover:text-accent transition-colors py-2" onClick={closeMobileMenu}>Men</Link>
                <Link href="/gender/women" className="block text-gray-900 hover:text-accent transition-colors py-2" onClick={closeMobileMenu}>Women</Link>
                <Link href="/category/athletic" className="block text-gray-900 hover:text-accent transition-colors py-2" onClick={closeMobileMenu}>Athletic</Link>
                <Link href="/category/casual" className="block text-gray-900 hover:text-accent transition-colors py-2" onClick={closeMobileMenu}>Casual</Link>
                <Link href="/category/dress" className="block text-gray-900 hover:text-accent transition-colors py-2" onClick={closeMobileMenu}>Dress</Link>
                <Link href="/category/sale" className="block font-semibold text-red-600 hover:text-red-700 transition-colors py-2" onClick={closeMobileMenu}>Sale</Link>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
