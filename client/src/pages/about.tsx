import Header from "@/components/header";
import Footer from "@/components/footer";
import CartSlideout from "@/components/cart-slideout";
import { SlotCard } from "@/components/slot-components";
import { Users, Award, Heart, Globe } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About SoleStyle</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Founded in 2018, SoleStyle has grown from a small online boutique to one of the most trusted names in footwear retail.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
          <div className="prose max-w-none text-gray-600 space-y-4">
            <p>
              SoleStyle was born out of a simple idea: everyone deserves access to quality footwear that combines style, comfort, and durability — without breaking the bank. Our founders, avid shoe enthusiasts themselves, noticed a gap in the market for a curated online shoe store that offered premium brands alongside emerging designers.
            </p>
            <p>
              What started as a small operation run from a garage in Portland, Oregon has evolved into a thriving e-commerce platform serving customers across the United States. Today, we partner with over 50 brands and carry thousands of styles for men, women, and children.
            </p>
            <p>
              We believe that the right pair of shoes can transform your day — whether you're hitting the trails, heading to the office, or dancing the night away. That belief drives everything we do, from the brands we select to the customer service we provide.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {[
            { Icon: Users, title: "500K+ Customers", description: "Trusted by over half a million happy customers nationwide.", category: "Community" },
            { Icon: Award, title: "50+ Brands", description: "Curated selection from the world's best footwear brands.", category: "Quality" },
            { Icon: Heart, title: "98% Satisfaction", description: "Our customers love us — and we love them right back.", category: "Service" },
            { Icon: Globe, title: "Nationwide Shipping", description: "Fast, reliable delivery to all 50 states.", category: "Sustainability" },
          ].map((item) => (
            <SlotCard key={item.title}>
              <div slot="header" className="text-center">
                <item.Icon className="h-10 w-10 text-accent mx-auto mb-2" />
                <span className="text-xl font-semibold text-gray-900">{item.title}</span>
              </div>
              <p slot="body">{item.description}</p>
              <span slot="footer">{item.category}</span>
            </SlotCard>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            At SoleStyle, our mission is to make premium footwear accessible to everyone. We are committed to offering an exceptional shopping experience through carefully curated collections, competitive pricing, and outstanding customer service.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Quality First", description: "Every product in our catalog is vetted for quality, comfort, and durability before it reaches our shelves.", label: "Core Value" },
              { title: "Customer Focused", description: "Your satisfaction is our top priority. Our support team is available 7 days a week to help you find the perfect fit.", label: "Core Value" },
              { title: "Sustainability", description: "We're committed to reducing our environmental impact through eco-friendly packaging and partnerships with sustainable brands.", label: "Core Value" },
            ].map((value) => (
              <SlotCard key={value.title}>
                <h4 slot="header">{value.title}</h4>
                <p slot="body">{value.description}</p>
                <span slot="footer">{value.label}</span>
              </SlotCard>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Sarah Chen", role: "CEO & Co-Founder", bio: "Former Nike designer with 15 years in the footwear industry." },
              { name: "Marcus Johnson", role: "CTO & Co-Founder", bio: "Tech entrepreneur passionate about building seamless shopping experiences." },
              { name: "Emily Rodriguez", role: "Head of Buying", bio: "Expert curator with an eye for emerging trends and timeless classics." },
              { name: "David Kim", role: "Customer Experience Lead", bio: "Dedicated to ensuring every customer interaction exceeds expectations." },
            ].map((member) => (
              <div key={member.name} className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-400">
                    {member.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900">{member.name}</h4>
                <p className="text-accent text-sm mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <CartSlideout />
    </div>
  );
}
