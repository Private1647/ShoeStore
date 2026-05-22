import { useEffect, useRef, useCallback } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CartSlideout from "@/components/cart-slideout";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

function ShadowDomContactForm({ onSubmit }: { onSubmit: () => void }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const onSubmitRef = useRef(onSubmit);
  onSubmitRef.current = onSubmit;

  useEffect(() => {
    if (!hostRef.current || hostRef.current.shadowRoot) return;

    const shadow = hostRef.current.attachShadow({ mode: "open" });

    shadow.innerHTML = `
      <style>
        :host { display: block; }
        .shadow-contact-form {
          font-family: system-ui, -apple-system, sans-serif;
        }
        .form-group { margin-bottom: 20px; }
        .form-label {
          display: block; font-size: 14px; font-weight: 500; color: #111827; margin-bottom: 6px;
        }
        .form-input, .form-textarea {
          width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 8px;
          font-size: 14px; outline: none; box-sizing: border-box; transition: border-color 0.2s;
          background: white; color: #111827;
        }
        .form-input:focus, .form-textarea:focus {
          border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.15);
        }
        .form-input::placeholder, .form-textarea::placeholder { color: #9ca3af; }
        .form-textarea { resize: vertical; min-height: 120px; font-family: inherit; }
        .form-btn {
          width: 100%; padding: 12px 20px; background: hsl(25, 95%, 53%); color: white;
          border: none; border-radius: 8px; font-size: 15px; font-weight: 600;
          cursor: pointer; transition: background 0.2s;
        }
        .form-btn:hover { background: hsl(25, 95%, 45%); }
        .form-error {
          margin-top: 12px; padding: 10px 14px; border-radius: 8px; font-size: 13px;
          background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; display: none;
        }
        .form-error.visible { display: block; }
      </style>
      <div class="shadow-contact-form" data-testid="shadow-contact-form">
        <div class="form-group">
          <label class="form-label" for="shadow-contact-name">Name</label>
          <input class="form-input" type="text" id="shadow-contact-name" data-testid="shadow-contact-name" placeholder="Your full name" />
        </div>
        <div class="form-group">
          <label class="form-label" for="shadow-contact-email">Email</label>
          <input class="form-input" type="email" id="shadow-contact-email" data-testid="shadow-contact-email" placeholder="your@email.com" />
        </div>
        <div class="form-group">
          <label class="form-label" for="shadow-contact-message">Message</label>
          <textarea class="form-textarea" id="shadow-contact-message" data-testid="shadow-contact-message" placeholder="How can we help you?" rows="5"></textarea>
        </div>
        <button class="form-btn" data-testid="shadow-contact-submit">Send Message</button>
        <div class="form-error" data-testid="shadow-contact-error"></div>
      </div>
    `;

    const btn = shadow.querySelector('[data-testid="shadow-contact-submit"]') as HTMLButtonElement;
    const errorDiv = shadow.querySelector('[data-testid="shadow-contact-error"]') as HTMLDivElement;
    const nameInput = shadow.querySelector('[data-testid="shadow-contact-name"]') as HTMLInputElement;
    const emailInput = shadow.querySelector('[data-testid="shadow-contact-email"]') as HTMLInputElement;
    const messageInput = shadow.querySelector('[data-testid="shadow-contact-message"]') as HTMLTextAreaElement;

    btn?.addEventListener('click', () => {
      errorDiv.className = 'form-error';
      const name = nameInput?.value?.trim();
      const email = emailInput?.value?.trim();
      const message = messageInput?.value?.trim();

      if (!name || !email || !message) {
        errorDiv.textContent = 'Please fill in all fields.';
        errorDiv.className = 'form-error visible';
        setTimeout(() => { errorDiv.className = 'form-error'; errorDiv.textContent = ''; }, 4000);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errorDiv.textContent = 'Please enter a valid email address.';
        errorDiv.className = 'form-error visible';
        setTimeout(() => { errorDiv.className = 'form-error'; errorDiv.textContent = ''; }, 4000);
        return;
      }

      nameInput.value = '';
      emailInput.value = '';
      messageInput.value = '';
      onSubmitRef.current();
    });
  }, []);

  return <div ref={hostRef} data-testid="shadow-host-contact-form" />;
}

export default function Contact() {
  const { toast } = useToast();

  const handleFormSubmit = useCallback(() => {
    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have a question or need help? We'd love to hear from you. Reach out using the form below or contact us directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
            <ShadowDomContactForm onSubmit={handleFormSubmit} />
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in touch</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Address</h4>
                    <p className="text-gray-600">123 Shoe Lane, Suite 400<br />Portland, OR 97201</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Phone</h4>
                    <p className="text-gray-600">1-800-SOLE-STY (1-800-765-3789)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-600">support@solestyle.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Business Hours</h4>
                    <p className="text-gray-600">
                      Mon – Fri: 9:00 AM – 8:00 PM EST<br />
                      Sat – Sun: 10:00 AM – 6:00 PM EST
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="font-semibold text-gray-900 mb-3">Frequently Asked</h3>
              <ul className="space-y-3 text-gray-600 text-sm">
                <li><strong>Order status:</strong> Check your order confirmation email or contact us with your order number.</li>
                <li><strong>Returns:</strong> We offer free returns within 30 days. Visit our returns page for details.</li>
                <li><strong>Sizing help:</strong> Check our size guide for detailed measurements and fitting tips.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <CartSlideout />
    </div>
  );
}
