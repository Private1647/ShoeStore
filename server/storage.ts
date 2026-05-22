import { type Product, type InsertProduct, type CartItem, type InsertCartItem, type CartItemWithProduct, type Order, type InsertOrder } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProductsByGender(gender: string): Promise<Product[]>;
  getSaleProducts(): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  getCartItems(sessionId: string): Promise<CartItemWithProduct[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrdersBySession(sessionId: string): Promise<Order[]>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private cartItems: Map<string, CartItem>;
  private orders: Map<string, Order>;

  constructor() {
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.seedProducts();
  }

  private seedProducts() {
    const mockProducts: Product[] = [
      {
        id: "nike-air-max-pro",
        name: "Nike Air Max Pro",
        description: "Experience ultimate comfort and performance with the Nike Air Max Pro. Featuring advanced cushioning technology, breathable mesh upper, and durable rubber outsole. Perfect for running, training, or casual wear.",
        price: "129.99",
        originalPrice: "159.99",
        category: "athletic",
        subcategory: "running",
        brand: "Nike",
        gender: "men",
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        thumbnails: [
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=100",
          "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=100",
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=100"
        ],
        sizes: [7, 8, 9, 10, 11, 12, 13, 14],
        inStock: true,
        isOnSale: true,
        rating: "4.8",
        reviewCount: 127,
        features: ["Air Max cushioning for superior comfort", "Breathable mesh construction", "Durable rubber outsole with traction pattern", "Lightweight design for all-day wear"]
      },
      {
        id: "nike-revolution-6",
        name: "Nike Revolution 6",
        description: "The Nike Revolution 6 is built for everyday running with a lightweight, breathable design. Soft foam midsole delivers a smooth, comfortable ride mile after mile.",
        price: "74.99",
        originalPrice: null,
        category: "athletic",
        subcategory: "running",
        brand: "Nike",
        gender: "men",
        imageUrl: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        thumbnails: ["https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=100"],
        sizes: [7, 8, 9, 10, 11, 12],
        inStock: true,
        isOnSale: false,
        rating: "4.3",
        reviewCount: 89,
        features: ["Lightweight mesh upper", "Soft foam midsole", "Rubber outsole for durability", "Heel pull tab for easy on/off"]
      },
      {
        id: "nike-free-run-womens",
        name: "Nike Free Run 5.0",
        description: "The Nike Free Run 5.0 delivers a barefoot-like feel with flexible grooves that let your foot move naturally. Lightweight and breathable for warm-weather runs.",
        price: "99.99",
        originalPrice: "119.99",
        category: "athletic",
        subcategory: "running",
        brand: "Nike",
        gender: "women",
        imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        thumbnails: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=100"],
        sizes: [5, 6, 7, 8, 9, 10],
        inStock: true,
        isOnSale: true,
        rating: "4.6",
        reviewCount: 215,
        features: ["Flexible sole for natural movement", "Lightweight knit upper", "Cushioned insole", "Reflective details for visibility"]
      },
      {
        id: "adidas-ultraboost-22",
        name: "Adidas Ultraboost 22",
        description: "The Adidas Ultraboost 22 delivers incredible energy return with every stride. Primeknit upper adapts to the shape of your foot for a custom-like fit.",
        price: "189.99",
        originalPrice: null,
        category: "athletic",
        subcategory: "running",
        brand: "Adidas",
        gender: "unisex",
        imageUrl: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        thumbnails: ["https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=100"],
        sizes: [6, 7, 8, 9, 10, 11, 12, 13],
        inStock: true,
        isOnSale: false,
        rating: "4.7",
        reviewCount: 342,
        features: ["Boost midsole for energy return", "Primeknit adaptive upper", "Continental rubber outsole", "Torsion System for midfoot support"]
      },
      {
        id: "adidas-casual-classic",
        name: "Adidas Stan Smith",
        description: "The iconic Adidas Stan Smith sneaker with its clean, minimalist design. Premium leather upper with perforated 3-Stripes and the signature green heel tab.",
        price: "89.99",
        originalPrice: null,
        category: "casual",
        subcategory: "lifestyle",
        brand: "Adidas",
        gender: "unisex",
        imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        thumbnails: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=100"],
        sizes: [6, 7, 8, 9, 10, 11, 12],
        inStock: true,
        isOnSale: false,
        rating: "4.5",
        reviewCount: 456,
        features: ["Premium leather upper", "Perforated 3-Stripes", "Rubber cupsole", "OrthoLite sockliner"]
      },
      {
        id: "adidas-superstar-womens",
        name: "Adidas Superstar",
        description: "Born on the basketball court, the Adidas Superstar has become a streetwear icon. Features the signature shell toe and classic three stripes.",
        price: "94.99",
        originalPrice: "109.99",
        category: "casual",
        subcategory: "lifestyle",
        brand: "Adidas",
        gender: "women",
        imageUrl: "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        thumbnails: ["https://images.unsplash.com/photo-1584735175315-9d5df23860e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=100"],
        sizes: [5, 6, 7, 8, 9, 10],
        inStock: true,
        isOnSale: true,
        rating: "4.4",
        reviewCount: 189,
        features: ["Signature rubber shell toe", "Leather upper", "Herringbone-pattern rubber outsole", "Classic three stripes"]
      },
      {
        id: "puma-speed-runner",
        name: "Puma Velocity Nitro",
        description: "The Puma Velocity Nitro combines NITRO foam with a responsive plate for a propulsive ride. Built for speed with a lightweight engineered mesh upper.",
        price: "109.99",
        originalPrice: null,
        category: "athletic",
        subcategory: "running",
        brand: "Puma",
        gender: "men",
        imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        thumbnails: ["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=100"],
        sizes: [7, 8, 9, 10, 11, 12],
        inStock: true,
        isOnSale: false,
        rating: "4.4",
        reviewCount: 156,
        features: ["NITRO foam midsole", "Engineered mesh upper", "PUMAGRIP rubber outsole", "Lightweight and responsive"]
      },
      {
        id: "puma-cali-womens",
        name: "Puma Cali Star",
        description: "The Puma Cali Star is a fashion-forward sneaker with a stacked platform sole. Premium leather upper with perforated details and the iconic Puma Formstrip.",
        price: "79.99",
        originalPrice: null,
        category: "casual",
        subcategory: "lifestyle",
        brand: "Puma",
        gender: "women",
        imageUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        thumbnails: ["https://images.unsplash.com/photo-1539185441755-769473a23570?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=100"],
        sizes: [5, 6, 7, 8, 9, 10],
        inStock: true,
        isOnSale: false,
        rating: "4.2",
        reviewCount: 98,
        features: ["Premium leather upper", "Stacked platform sole", "Perforated details", "SoftFoam+ comfort insole"]
      },
      {
        id: "new-balance-574",
        name: "New Balance 574",
        description: "The New Balance 574 is a timeless classic that blends heritage style with modern comfort. ENCAP midsole technology provides support and durability for everyday wear.",
        price: "84.99",
        originalPrice: null,
        category: "casual",
        subcategory: "lifestyle",
        brand: "New Balance",
        gender: "men",
        imageUrl: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        thumbnails: ["https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=100"],
        sizes: [7, 8, 9, 10, 11, 12, 13],
        inStock: true,
        isOnSale: false,
        rating: "4.5",
        reviewCount: 312,
        features: ["ENCAP midsole technology", "Suede and mesh upper", "Rubber outsole", "EVA foam cushioning"]
      },
      {
        id: "new-balance-fresh-foam",
        name: "New Balance Fresh Foam 1080v12",
        description: "Premium cushioned running shoe with Fresh Foam X midsole technology. Hypoknit upper offers stretch and support where you need it most.",
        price: "159.99",
        originalPrice: "179.99",
        category: "athletic",
        subcategory: "running",
        brand: "New Balance",
        gender: "women",
        imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        thumbnails: ["https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=100"],
        sizes: [5, 6, 7, 8, 9, 10, 11],
        inStock: true,
        isOnSale: true,
        rating: "4.8",
        reviewCount: 267,
        features: ["Fresh Foam X midsole", "Hypoknit upper", "Ultra Heel design", "Blown rubber outsole"]
      },
      {
        id: "vans-sk8-classic",
        name: "Vans SK8-Hi Classic",
        description: "The legendary Vans SK8-Hi features sturdy canvas and suede uppers, signature rubber waffle outsoles, and padded collars for support and flexibility.",
        price: "69.99",
        originalPrice: null,
        category: "casual",
        subcategory: "skate",
        brand: "Vans",
        gender: "unisex",
        imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        thumbnails: ["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=100"],
        sizes: [6, 7, 8, 9, 10, 11, 12, 13],
        inStock: true,
        isOnSale: false,
        rating: "4.6",
        reviewCount: 534,
        features: ["Canvas and suede upper", "Padded collar for comfort", "Signature waffle outsole", "Vulcanized construction"]
      },
      {
        id: "vans-old-skool",
        name: "Vans Old Skool",
        description: "The Vans Old Skool is a classic skate shoe featuring the iconic side stripe. Durable canvas and suede upper with the original waffle outsole.",
        price: "64.99",
        originalPrice: null,
        category: "casual",
        subcategory: "skate",
        brand: "Vans",
        gender: "unisex",
        imageUrl: "https://images.unsplash.com/photo-1463100099107-aa0980c362e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        thumbnails: ["https://images.unsplash.com/photo-1463100099107-aa0980c362e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=100"],
        sizes: [6, 7, 8, 9, 10, 11, 12],
        inStock: true,
        isOnSale: false,
        rating: "4.5",
        reviewCount: 423,
        features: ["Canvas and suede upper", "Iconic side stripe", "Waffle rubber outsole", "Padded tongue and lining"]
      },
      {
        id: "oxford-classic-dress",
        name: "Oxford Classic Dress Shoe",
        description: "Timeless black leather Oxford dress shoes handcrafted with premium full-grain leather. Goodyear welt construction ensures longevity and resoling capability.",
        price: "179.99",
        originalPrice: null,
        category: "dress",
        subcategory: "formal",
        brand: "Cole Haan",
        gender: "men",
        imageUrl: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        thumbnails: ["https://images.unsplash.com/photo-1614252369475-531eba835eb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=100"],
        sizes: [8, 9, 10, 11, 12, 13],
        inStock: true,
        isOnSale: false,
        rating: "4.7",
        reviewCount: 203,
        features: ["Premium full-grain leather", "Goodyear welt construction", "Leather sole with rubber heel", "Classic cap-toe design"]
      },
      {
        id: "executive-loafer",
        name: "Cole Haan Grand Loafer",
        description: "Sophisticated leather loafers combining traditional craftsmanship with modern comfort technology. Grand.OS cushioning provides lightweight, responsive comfort.",
        price: "159.99",
        originalPrice: null,
        category: "dress",
        subcategory: "business",
        brand: "Cole Haan",
        gender: "men",
        imageUrl: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        thumbnails: ["https://images.unsplash.com/photo-1533867617858-e7b97e060509?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=100"],
        sizes: [8, 9, 10, 11, 12],
        inStock: true,
        isOnSale: false,
        rating: "4.3",
        reviewCount: 78,
        features: ["Premium leather upper", "Grand.OS cushioning", "Flexible rubber sole", "Slip-on convenience"]
      },
      {
        id: "derby-brown-dress",
        name: "Brown Derby Dress Shoe",
        description: "Elegant brown leather Derby shoes with an open lacing system for a comfortable fit. Perfect for business casual and semi-formal occasions.",
        price: "149.99",
        originalPrice: "189.99",
        category: "dress",
        subcategory: "formal",
        brand: "Cole Haan",
        gender: "men",
        imageUrl: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        thumbnails: ["https://images.unsplash.com/photo-1608256246200-53e635b5b65f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=100"],
        sizes: [8, 9, 10, 11, 12],
        inStock: true,
        isOnSale: true,
        rating: "4.5",
        reviewCount: 134,
        features: ["Full-grain leather upper", "Open lacing system", "Cushioned insole", "Blake stitch construction"]
      },
      {
        id: "womens-heel-pump",
        name: "Classic Pointed Toe Pump",
        description: "Elegant pointed toe pump crafted in smooth leather with a comfortable block heel. A wardrobe essential that transitions from office to evening.",
        price: "139.99",
        originalPrice: null,
        category: "dress",
        subcategory: "heels",
        brand: "Cole Haan",
        gender: "women",
        imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        thumbnails: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=100"],
        sizes: [5, 6, 7, 8, 9, 10],
        inStock: true,
        isOnSale: false,
        rating: "4.1",
        reviewCount: 67,
        features: ["Smooth leather upper", "Comfortable block heel", "Padded footbed", "Pointed toe silhouette"]
      },
      {
        id: "womens-ballet-flat",
        name: "Leather Ballet Flat",
        description: "Versatile leather ballet flats with a soft, cushioned insole. Elegant bow detail and flexible sole make these perfect for all-day comfort.",
        price: "89.99",
        originalPrice: "109.99",
        category: "dress",
        subcategory: "flats",
        brand: "Cole Haan",
        gender: "women",
        imageUrl: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        thumbnails: ["https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=100"],
        sizes: [5, 6, 7, 8, 9, 10],
        inStock: true,
        isOnSale: true,
        rating: "4.4",
        reviewCount: 145,
        features: ["Soft leather upper", "Cushioned insole", "Flexible sole", "Elegant bow detail"]
      },
      {
        id: "timberland-premium-boot",
        name: "Timberland 6-Inch Premium Boot",
        description: "The iconic Timberland 6-Inch Premium Waterproof Boot. Made with premium nubuck leather, seam-sealed construction, and 400 grams of PrimaLoft insulation.",
        price: "198.00",
        originalPrice: null,
        category: "boots",
        subcategory: "work",
        brand: "Timberland",
        gender: "men",
        imageUrl: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        thumbnails: ["https://images.unsplash.com/photo-1520639888713-7851133b1ed0?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=100"],
        sizes: [7, 8, 9, 10, 11, 12, 13],
        inStock: true,
        isOnSale: false,
        rating: "4.6",
        reviewCount: 891,
        features: ["Premium waterproof nubuck leather", "Seam-sealed construction", "400g PrimaLoft insulation", "Rubber lug outsole"]
      },
      {
        id: "dr-martens-1460",
        name: "Dr. Martens 1460 Boot",
        description: "The original Dr. Martens 8-eye boot. Smooth leather with the iconic yellow stitching, grooved sides, and air-cushioned AirWair sole.",
        price: "169.99",
        originalPrice: null,
        category: "boots",
        subcategory: "fashion",
        brand: "Dr. Martens",
        gender: "unisex",
        imageUrl: "https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        thumbnails: ["https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=100"],
        sizes: [6, 7, 8, 9, 10, 11, 12, 13],
        inStock: true,
        isOnSale: false,
        rating: "4.7",
        reviewCount: 678,
        features: ["Smooth leather upper", "Air-cushioned AirWair sole", "Iconic yellow welt stitching", "Goodyear welt construction"]
      },
      {
        id: "dr-martens-jadon-womens",
        name: "Dr. Martens Jadon Platform Boot",
        description: "A bold platform version of the classic Dr. Martens boot. Features a chunky Quad Retro sole and smooth polished leather upper with signature yellow stitching.",
        price: "199.99",
        originalPrice: "219.99",
        category: "boots",
        subcategory: "fashion",
        brand: "Dr. Martens",
        gender: "women",
        imageUrl: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        thumbnails: ["https://images.unsplash.com/photo-1603808033192-082d6919d3e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=100"],
        sizes: [5, 6, 7, 8, 9, 10],
        inStock: true,
        isOnSale: true,
        rating: "4.5",
        reviewCount: 234,
        features: ["Polished smooth leather", "Quad Retro chunky sole", "Inside zip for easy on/off", "Yellow welt stitching"]
      },
      {
        id: "chelsea-boot-mens",
        name: "Classic Chelsea Boot",
        description: "Sleek leather Chelsea boot with elastic side panels and pull tab. A timeless design that works with both casual and dressed-up outfits.",
        price: "149.99",
        originalPrice: null,
        category: "boots",
        subcategory: "fashion",
        brand: "Cole Haan",
        gender: "men",
        imageUrl: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        thumbnails: ["https://images.unsplash.com/photo-1638247025967-b4e38f787b76?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=100"],
        sizes: [8, 9, 10, 11, 12],
        inStock: true,
        isOnSale: false,
        rating: "4.3",
        reviewCount: 112,
        features: ["Premium leather upper", "Elastic side panels", "Pull tab for easy on/off", "Stacked heel"]
      },
      {
        id: "hiking-boot-waterproof",
        name: "Timberland Trail Hiker",
        description: "Waterproof hiking boot designed for rugged terrain. Features TimberDry waterproof membrane, EVA midsole for cushioning, and a multi-directional lug outsole.",
        price: "139.99",
        originalPrice: "169.99",
        category: "boots",
        subcategory: "hiking",
        brand: "Timberland",
        gender: "unisex",
        imageUrl: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        thumbnails: ["https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=100"],
        sizes: [7, 8, 9, 10, 11, 12, 13],
        inStock: true,
        isOnSale: true,
        rating: "4.4",
        reviewCount: 198,
        features: ["TimberDry waterproof membrane", "EVA midsole cushioning", "Multi-directional lug outsole", "Recycled PET mesh lining"]
      },
      {
        id: "converse-chuck-taylor",
        name: "Converse Chuck Taylor All Star",
        description: "The timeless Converse Chuck Taylor All Star high-top. Canvas upper with the iconic rubber toe cap and All Star ankle patch.",
        price: "59.99",
        originalPrice: null,
        category: "casual",
        subcategory: "lifestyle",
        brand: "Converse",
        gender: "unisex",
        imageUrl: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        thumbnails: ["https://images.unsplash.com/photo-1607522370275-f14206abe5d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=100"],
        sizes: [5, 6, 7, 8, 9, 10, 11, 12, 13],
        inStock: true,
        isOnSale: false,
        rating: "4.6",
        reviewCount: 1247,
        features: ["Canvas upper", "Rubber toe cap", "Vulcanized rubber sole", "OrthoLite insole"]
      },
      {
        id: "reebok-classic-leather",
        name: "Reebok Classic Leather",
        description: "The Reebok Classic Leather sneaker delivers clean, understated style with a soft leather upper and die-cut EVA midsole for lightweight cushioning.",
        price: "74.99",
        originalPrice: "89.99",
        category: "casual",
        subcategory: "lifestyle",
        brand: "Reebok",
        gender: "men",
        imageUrl: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        thumbnails: ["https://images.unsplash.com/photo-1605348532760-6753d2c43329?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=100"],
        sizes: [7, 8, 9, 10, 11, 12],
        inStock: true,
        isOnSale: true,
        rating: "4.3",
        reviewCount: 267,
        features: ["Soft leather upper", "Die-cut EVA midsole", "High abrasion rubber outsole", "Terry cloth lining"]
      },
    ];

    mockProducts.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.category === category
    );
  }

  async getProductsByGender(gender: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.gender === gender || product.gender === "unisex"
    );
  }

  async getSaleProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.isOnSale
    );
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      product =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.brand.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  async getCartItems(sessionId: string): Promise<CartItemWithProduct[]> {
    const items = Array.from(this.cartItems.values())
      .filter(item => item.sessionId === sessionId);

    const itemsWithProducts: CartItemWithProduct[] = [];
    for (const item of items) {
      const product = this.products.get(item.productId);
      if (product) {
        itemsWithProducts.push({ ...item, product });
      }
    }
    return itemsWithProducts;
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    const existingItem = Array.from(this.cartItems.values()).find(
      item =>
        item.productId === insertItem.productId &&
        item.size === insertItem.size &&
        item.sessionId === insertItem.sessionId
    );

    if (existingItem) {
      existingItem.quantity = insertItem.quantity;
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    }

    const id = randomUUID();
    const item: CartItem = { ...insertItem, id };
    this.cartItems.set(id, item);
    return item;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;

    if (quantity <= 0) {
      this.cartItems.delete(id);
      return undefined;
    }

    item.quantity = quantity;
    this.cartItems.set(id, item);
    return item;
  }

  async removeFromCart(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const itemsToDelete = Array.from(this.cartItems.entries())
      .filter(([_, item]) => item.sessionId === sessionId);

    itemsToDelete.forEach(([id]) => {
      this.cartItems.delete(id);
    });

    return true;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      ...insertOrder,
      id,
      createdAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersBySession(sessionId: string): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.sessionId === sessionId);
  }
}

export const storage = new MemStorage();
