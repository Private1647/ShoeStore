import { useEffect, useRef } from "react";

export function SlotCard({ children }: { children: React.ReactNode }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hostRef.current || hostRef.current.shadowRoot) return;

    const shadow = hostRef.current.attachShadow({ mode: "open" });

    shadow.innerHTML = `
      <style>
        :host { display: block; }
        .slot-card {
          border: 2px solid #e5e7eb; border-radius: 12px; overflow: hidden;
          background: white; transition: box-shadow 0.2s;
        }
        .slot-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .slot-header { padding: 16px; background: #f9fafb; border-bottom: 1px solid #e5e7eb; }
        .slot-body { padding: 16px; }
        .slot-footer { padding: 12px 16px; background: #f3f4f6; border-top: 1px solid #e5e7eb; }
        ::slotted([slot="header"]) { margin: 0; font-weight: 600; font-size: 16px; color: #111827; }
        ::slotted([slot="body"]) { margin: 0; font-size: 14px; color: #4b5563; line-height: 1.5; }
        ::slotted([slot="footer"]) { margin: 0; font-size: 13px; color: #6b7280; }
      </style>
      <div class="slot-card" data-testid="slot-card">
        <div class="slot-header"><slot name="header"></slot></div>
        <div class="slot-body"><slot name="body"></slot></div>
        <div class="slot-footer"><slot name="footer"></slot></div>
      </div>
    `;
  }, []);

  return (
    <div ref={hostRef} data-testid="slot-host-card">
      {children}
    </div>
  );
}

export function SlotProductHighlight({ children }: { children: React.ReactNode }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hostRef.current || hostRef.current.shadowRoot) return;

    const shadow = hostRef.current.attachShadow({ mode: "open" });

    shadow.innerHTML = `
      <style>
        :host { display: block; }
        .highlight-wrapper {
          display: flex; gap: 16px; align-items: center; padding: 16px;
          border: 1px solid #dbeafe; border-radius: 12px;
          background: linear-gradient(to right, #eff6ff, #f0f9ff);
        }
        .highlight-image { flex-shrink: 0; }
        .highlight-content { flex: 1; min-width: 0; }
        .highlight-action { flex-shrink: 0; }
        ::slotted([slot="image"]) { width: 80px; height: 80px; object-fit: cover; border-radius: 8px; }
        ::slotted([slot="title"]) { margin: 0 0 4px 0; font-weight: 600; font-size: 15px; color: #1e3a5f; }
        ::slotted([slot="description"]) { margin: 0; font-size: 13px; color: #64748b; }
      </style>
      <div class="highlight-wrapper" data-testid="slot-product-highlight">
        <div class="highlight-image"><slot name="image"></slot></div>
        <div class="highlight-content"><slot name="title"></slot><slot name="description"></slot></div>
        <div class="highlight-action"><slot name="action"></slot></div>
      </div>
    `;
  }, []);

  return (
    <div ref={hostRef} data-testid="slot-host-highlight">
      {children}
    </div>
  );
}

export function SlotFormContainer({ children }: { children: React.ReactNode }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hostRef.current || hostRef.current.shadowRoot) return;

    const shadow = hostRef.current.attachShadow({ mode: "open" });

    shadow.innerHTML = `
      <style>
        :host { display: block; }
        .slot-form-wrapper {
          border: 2px solid #c7d2fe; border-radius: 12px; overflow: hidden;
          background: linear-gradient(135deg, #eef2ff, #f5f3ff);
        }
        .slot-form-title { padding: 14px 16px; background: #6366f1; color: white; }
        .slot-form-title ::slotted(*) { margin: 0; font-size: 15px; font-weight: 600; }
        .slot-form-fields { padding: 16px; display: flex; flex-direction: column; gap: 12px; }
        .slot-form-actions {
          padding: 12px 16px; background: rgba(99,102,241,0.08);
          border-top: 1px solid #c7d2fe; display: flex; gap: 8px; align-items: center;
        }
        .slot-form-result {
          padding: 12px 16px; border-top: 1px solid #c7d2fe; min-height: 20px;
        }
        ::slotted(input), ::slotted(select), ::slotted(textarea) {
          width: 100%; padding: 8px 12px; border: 1px solid #c7d2fe; border-radius: 6px;
          font-size: 14px; outline: none; box-sizing: border-box; font-family: system-ui, sans-serif;
        }
        ::slotted(input:focus), ::slotted(select:focus), ::slotted(textarea:focus) {
          border-color: #6366f1; box-shadow: 0 0 0 2px rgba(99,102,241,0.15);
        }
        ::slotted(button) {
          padding: 8px 16px; border-radius: 6px; font-size: 14px; font-weight: 500;
          cursor: pointer; border: 1px solid transparent; font-family: system-ui, sans-serif;
        }
      </style>
      <div class="slot-form-wrapper" data-testid="slot-form-wrapper">
        <div class="slot-form-title"><slot name="title"></slot></div>
        <div class="slot-form-fields"><slot name="fields"></slot></div>
        <div class="slot-form-actions"><slot name="actions"></slot></div>
        <div class="slot-form-result"><slot name="result"></slot></div>
      </div>
    `;
  }, []);

  return (
    <div ref={hostRef} data-testid="slot-host-form">
      {children}
    </div>
  );
}

export function SlotTabPanel({ children }: { children: React.ReactNode }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hostRef.current || hostRef.current.shadowRoot) return;

    const shadow = hostRef.current.attachShadow({ mode: "open" });

    shadow.innerHTML = `
      <style>
        :host { display: block; }
        .tab-container { border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; background: white; }
        .tab-bar {
          display: flex; background: #f3f4f6; border-bottom: 1px solid #e5e7eb;
        }
        .tab-bar ::slotted(button) {
          flex: 1; padding: 10px 16px; border: none; background: transparent;
          font-size: 14px; font-weight: 500; cursor: pointer; color: #6b7280;
          border-bottom: 2px solid transparent; transition: all 0.2s;
          font-family: system-ui, sans-serif;
        }
        .tab-bar ::slotted(button:hover) { color: #111827; background: rgba(0,0,0,0.03); }
        .tab-bar ::slotted(button.active-tab) {
          color: #6366f1; border-bottom-color: #6366f1; background: white;
        }
        .tab-content { padding: 16px; min-height: 80px; }
        .tab-content ::slotted(*) { font-size: 14px; color: #374151; line-height: 1.6; }
        .tab-content ::slotted(.hidden-tab) { display: none; }
      </style>
      <div class="tab-container" data-testid="slot-tab-container">
        <div class="tab-bar"><slot name="tabs"></slot></div>
        <div class="tab-content"><slot name="content"></slot></div>
      </div>
    `;
  }, []);

  return (
    <div ref={hostRef} data-testid="slot-host-tabs">
      {children}
    </div>
  );
}
