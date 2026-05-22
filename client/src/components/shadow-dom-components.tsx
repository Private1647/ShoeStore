import { useEffect, useRef, useCallback } from "react";

export function ShadowDomRating({ rating, productName }: { rating: number; productName: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hostRef.current || hostRef.current.shadowRoot) return;

    const shadow = hostRef.current.attachShadow({ mode: "open" });

    shadow.innerHTML = `
      <style>
        :host { display: block; }
        .shadow-rating-container {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fefce8;
        }
        .stars { display: flex; gap: 2px; }
        .star { width: 18px; height: 18px; cursor: pointer; transition: transform 0.2s; }
        .star:hover { transform: scale(1.3); }
        .star.filled { color: #f59e0b; }
        .star.empty { color: #d1d5db; }
        .rating-text { font-size: 14px; color: #6b7280; }
        .product-label { font-size: 13px; font-weight: 500; color: #374151; }
      </style>
      <div class="shadow-rating-container" data-testid="shadow-rating">
        <span class="product-label">${productName}</span>
        <div class="stars" data-testid="shadow-stars">
          ${Array.from({ length: 5 }).map((_, i) => `
            <svg class="star ${i < rating ? 'filled' : 'empty'}" data-star-index="${i}" viewBox="0 0 24 24" fill="${i < rating ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          `).join("")}
        </div>
        <span class="rating-text" data-testid="shadow-rating-value">${rating}/5</span>
      </div>
    `;

    const stars = shadow.querySelectorAll('.star');
    const ratingText = shadow.querySelector('.rating-text');
    stars.forEach((star, idx) => {
      star.addEventListener('click', () => {
        const newRating = idx + 1;
        stars.forEach((s, si) => {
          if (si < newRating) {
            s.classList.remove('empty');
            s.classList.add('filled');
            s.setAttribute('fill', 'currentColor');
          } else {
            s.classList.remove('filled');
            s.classList.add('empty');
            s.setAttribute('fill', 'none');
          }
        });
        if (ratingText) ratingText.textContent = `${newRating}/5`;
      });
    });
  }, [rating, productName]);

  return <div ref={hostRef} data-testid="shadow-host-rating" />;
}

export function ShadowDomPriceBadge({ price, originalPrice, label }: { price: string; originalPrice?: string; label: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hostRef.current || hostRef.current.shadowRoot) return;

    const shadow = hostRef.current.attachShadow({ mode: "open" });

    shadow.innerHTML = `
      <style>
        :host { display: inline-block; }
        .badge-container {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 14px; border-radius: 999px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white; font-family: system-ui, sans-serif;
        }
        .badge-label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .badge-price { font-size: 16px; font-weight: 700; }
        .badge-original { font-size: 13px; text-decoration: line-through; opacity: 0.75; }
      </style>
      <div class="badge-container" data-testid="shadow-price-badge">
        <span class="badge-label">${label}</span>
        <span class="badge-price" data-testid="shadow-price-value">$${price}</span>
        ${originalPrice ? `<span class="badge-original">$${originalPrice}</span>` : ""}
      </div>
    `;
  }, [price, originalPrice, label]);

  return <div ref={hostRef} data-testid="shadow-host-price" />;
}

export function ShadowDomToggle({ label, defaultChecked, onChange }: { label: string; defaultChecked?: boolean; onChange?: (checked: boolean) => void }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hostRef.current || hostRef.current.shadowRoot) return;

    const shadow = hostRef.current.attachShadow({ mode: "open" });

    shadow.innerHTML = `
      <style>
        :host { display: block; }
        .toggle-wrapper { display: flex; align-items: center; gap: 12px; padding: 8px 0; }
        .toggle-label { font-size: 14px; color: #374151; font-family: system-ui, sans-serif; }
        .toggle-track {
          width: 44px; height: 24px; border-radius: 12px; background: #d1d5db;
          position: relative; cursor: pointer; transition: background 0.2s;
        }
        .toggle-track.active { background: #3b82f6; }
        .toggle-thumb {
          width: 20px; height: 20px; border-radius: 50%; background: white;
          position: absolute; top: 2px; left: 2px; transition: transform 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        .toggle-track.active .toggle-thumb { transform: translateX(20px); }
        .toggle-status { font-size: 12px; color: #9ca3af; font-family: system-ui, sans-serif; }
      </style>
      <div class="toggle-wrapper" data-testid="shadow-toggle">
        <span class="toggle-label">${label}</span>
        <div class="toggle-track ${defaultChecked ? 'active' : ''}" data-testid="shadow-toggle-track">
          <div class="toggle-thumb"></div>
        </div>
        <span class="toggle-status" data-testid="shadow-toggle-status">${defaultChecked ? 'ON' : 'OFF'}</span>
      </div>
    `;

    const track = shadow.querySelector('.toggle-track');
    const status = shadow.querySelector('.toggle-status');
    if (track && status) {
      track.addEventListener('click', () => {
        const isActive = track.classList.toggle('active');
        status.textContent = isActive ? 'ON' : 'OFF';
        onChange?.(isActive);
      });
    }
  }, [label, defaultChecked, onChange]);

  return <div ref={hostRef} data-testid="shadow-host-toggle" />;
}

export function ShadowDomForm() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hostRef.current || hostRef.current.shadowRoot) return;

    const shadow = hostRef.current.attachShadow({ mode: "open" });

    shadow.innerHTML = `
      <style>
        :host { display: block; }
        .shadow-form {
          padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px; background: #f9fafb;
          font-family: system-ui, sans-serif;
        }
        .form-title { font-size: 15px; font-weight: 600; margin-bottom: 12px; color: #111827; }
        .form-group { margin-bottom: 12px; }
        .form-label { display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 4px; }
        .form-input {
          width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px;
          font-size: 14px; outline: none; box-sizing: border-box; transition: border-color 0.2s;
        }
        .form-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.15); }
        .form-select {
          width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px;
          font-size: 14px; outline: none; background: white; cursor: pointer; box-sizing: border-box;
        }
        .form-checkbox-group { display: flex; align-items: center; gap: 8px; }
        .form-checkbox { width: 16px; height: 16px; cursor: pointer; accent-color: #3b82f6; }
        .form-btn {
          padding: 8px 20px; background: #3b82f6; color: white; border: none; border-radius: 6px;
          font-size: 14px; font-weight: 500; cursor: pointer; transition: background 0.2s;
        }
        .form-btn:hover { background: #2563eb; }
        .form-btn:disabled { background: #93c5fd; cursor: not-allowed; }
        .form-message {
          margin-top: 12px; padding: 8px 12px; border-radius: 6px; font-size: 13px;
          display: none;
        }
        .form-message.success { display: block; background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
        .form-message.error { display: block; background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
        .form-row { display: flex; gap: 12px; }
        .form-row > .form-group { flex: 1; }
      </style>
      <div class="shadow-form" data-testid="shadow-form">
        <div class="form-title">Quick Feedback (inside Shadow DOM)</div>
        <div class="form-group">
          <label class="form-label" for="shadow-name">Your Name</label>
          <input class="form-input" type="text" id="shadow-name" data-testid="shadow-form-name" placeholder="Enter your name" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="shadow-category">Category</label>
            <select class="form-select" id="shadow-category" data-testid="shadow-form-category">
              <option value="">Select...</option>
              <option value="comfort">Comfort</option>
              <option value="style">Style</option>
              <option value="durability">Durability</option>
              <option value="value">Value for Money</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="shadow-score">Score (1-10)</label>
            <input class="form-input" type="number" id="shadow-score" data-testid="shadow-form-score" min="1" max="10" placeholder="1-10" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label" for="shadow-comment">Comment</label>
          <input class="form-input" type="text" id="shadow-comment" data-testid="shadow-form-comment" placeholder="Write your feedback..." />
        </div>
        <div class="form-group">
          <div class="form-checkbox-group">
            <input class="form-checkbox" type="checkbox" id="shadow-recommend" data-testid="shadow-form-recommend" />
            <label class="form-label" for="shadow-recommend" style="margin-bottom:0">Would recommend to a friend</label>
          </div>
        </div>
        <button class="form-btn" data-testid="shadow-form-submit">Submit Feedback</button>
        <div class="form-message" data-testid="shadow-form-message"></div>
      </div>
    `;

    const btn = shadow.querySelector('[data-testid="shadow-form-submit"]') as HTMLButtonElement;
    const msg = shadow.querySelector('[data-testid="shadow-form-message"]') as HTMLDivElement;
    const nameInput = shadow.querySelector('[data-testid="shadow-form-name"]') as HTMLInputElement;
    const categorySelect = shadow.querySelector('[data-testid="shadow-form-category"]') as HTMLSelectElement;
    const scoreInput = shadow.querySelector('[data-testid="shadow-form-score"]') as HTMLInputElement;

    btn?.addEventListener('click', () => {
      msg.className = 'form-message';
      const name = nameInput?.value?.trim();
      const category = categorySelect?.value;
      const score = parseInt(scoreInput?.value || '0');

      if (!name || !category || score < 1 || score > 10) {
        msg.textContent = 'Please fill in all required fields (name, category, score 1-10).';
        msg.className = 'form-message error';
      } else {
        msg.textContent = `Thanks ${name}! Your ${category} feedback (score: ${score}/10) has been submitted.`;
        msg.className = 'form-message success';
        nameInput.value = '';
        categorySelect.value = '';
        scoreInput.value = '';
        const checkbox = shadow.querySelector('[data-testid="shadow-form-recommend"]') as HTMLInputElement;
        if (checkbox) checkbox.checked = false;
        const comment = shadow.querySelector('[data-testid="shadow-form-comment"]') as HTMLInputElement;
        if (comment) comment.value = '';
      }
      setTimeout(() => { msg.className = 'form-message'; msg.textContent = ''; }, 5000);
    });
  }, []);

  return <div ref={hostRef} data-testid="shadow-host-form" />;
}

export function ShadowDomPaymentFields({ onFieldChange }: { onFieldChange: (field: string, value: string) => void }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const onFieldChangeRef = useRef(onFieldChange);
  onFieldChangeRef.current = onFieldChange;

  useEffect(() => {
    if (!hostRef.current || hostRef.current.shadowRoot) return;

    const shadow = hostRef.current.attachShadow({ mode: "open" });

    shadow.innerHTML = `
      <style>
        :host { display: block; }
        .payment-container {
          font-family: system-ui, sans-serif;
        }
        .form-group { margin-bottom: 16px; }
        .form-label {
          display: block; font-size: 14px; font-weight: 500; color: #0f172a;
          margin-bottom: 6px;
        }
        .form-input {
          width: 100%; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px;
          font-size: 14px; outline: none; box-sizing: border-box; transition: border-color 0.2s;
          background: white; color: #0f172a;
        }
        .form-input:focus {
          border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.15);
        }
        .form-input::placeholder { color: #94a3b8; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .secure-badge {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: #64748b; margin-top: 12px;
        }
        .secure-badge svg { width: 14px; height: 14px; color: #22c55e; }
      </style>
      <div class="payment-container" data-testid="shadow-payment-container">
        <div class="form-group">
          <label class="form-label" for="shadow-card-number">Card Number</label>
          <input class="form-input" type="text" id="shadow-card-number" data-testid="shadow-card-number" placeholder="4242 4242 4242 4242" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="shadow-card-expiry">Expiry Date</label>
            <input class="form-input" type="text" id="shadow-card-expiry" data-testid="shadow-card-expiry" placeholder="MM/YY" />
          </div>
          <div class="form-group">
            <label class="form-label" for="shadow-card-cvv">CVV</label>
            <input class="form-input" type="password" id="shadow-card-cvv" data-testid="shadow-card-cvv" placeholder="123" />
          </div>
        </div>
        <div class="secure-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          Secured by Shadow DOM encryption layer
        </div>
      </div>
    `;

    const cardNumber = shadow.querySelector('#shadow-card-number') as HTMLInputElement;
    const cardExpiry = shadow.querySelector('#shadow-card-expiry') as HTMLInputElement;
    const cardCvv = shadow.querySelector('#shadow-card-cvv') as HTMLInputElement;

    cardNumber?.addEventListener('input', () => {
      onFieldChangeRef.current('cardNumber', cardNumber.value);
    });
    cardExpiry?.addEventListener('input', () => {
      onFieldChangeRef.current('cardExpiry', cardExpiry.value);
    });
    cardCvv?.addEventListener('input', () => {
      onFieldChangeRef.current('cardCvv', cardCvv.value);
    });
  }, []);

  return <div ref={hostRef} data-testid="shadow-host-payment" />;
}
