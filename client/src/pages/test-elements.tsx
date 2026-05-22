import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CartSlideout from "@/components/cart-slideout";
import ProductModal from "@/components/product-modal";
import { ShadowDomRating, ShadowDomPriceBadge, ShadowDomToggle, ShadowDomForm } from "@/components/shadow-dom-components";
import { SlotCard, SlotProductHighlight, SlotFormContainer, SlotTabPanel } from "@/components/slot-components";
import {
  DynamicLocatorButton, DynamicLocatorInput, DynamicClassElement,
  DelayedRenderElement, StaleLocatorTable, AutoRefreshCounter,
  DynamicLocatorDropdown, DynamicLocatorCheckboxes,
} from "@/components/dynamic-elements";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, Box, Frame, Zap, BookOpen, Globe } from "lucide-react";

export default function TestElements() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [slotFormResult, setSlotFormResult] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  const handleSlotFormSubmit = () => {
    const nameEl = document.querySelector('[data-testid="slot-form-name"]') as HTMLInputElement;
    const emailEl = document.querySelector('[data-testid="slot-form-email"]') as HTMLInputElement;
    const msgEl = document.querySelector('[data-testid="slot-form-message"]') as HTMLTextAreaElement;
    const name = nameEl?.value?.trim();
    const email = emailEl?.value?.trim();
    const msg = msgEl?.value?.trim();

    if (!name || !email || !msg) {
      setSlotFormResult("Please fill in all fields.");
    } else {
      setSlotFormResult(`Thanks ${name}! We received your message and will reply to ${email}.`);
      nameEl.value = "";
      emailEl.value = "";
      msgEl.value = "";
    }
    setTimeout(() => setSlotFormResult(""), 5000);
  };

  const handleSlotClear = () => {
    const nameEl = document.querySelector('[data-testid="slot-form-name"]') as HTMLInputElement;
    const emailEl = document.querySelector('[data-testid="slot-form-email"]') as HTMLInputElement;
    const msgEl = document.querySelector('[data-testid="slot-form-message"]') as HTMLTextAreaElement;
    if (nameEl) nameEl.value = "";
    if (emailEl) emailEl.value = "";
    if (msgEl) msgEl.value = "";
    setSlotFormResult("");
  };

  const tabContent = [
    "Athletic shoes are designed for performance. Features include cushioned midsoles, breathable mesh, and durable outsoles. Perfect for running, training, and everyday active wear.",
    "Casual shoes balance comfort and style. From classic sneakers to slip-ons, they're versatile enough for work, weekends, and everything in between.",
    "Dress shoes make a statement. Crafted from premium leather with refined details, they're essential for formal occasions and professional settings.",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <CartSlideout />
      <ProductModal />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Automation Testing Playground</h1>
          <p className="text-gray-600">
            This page contains various web element types designed for practicing test automation.
            Each section includes interactable elements.
            See the <a href="#glossary" className="text-blue-600 underline hover:text-blue-800">glossary</a> below for a full reference.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-600" />
                Shadow DOM — Interactive Rating
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500 mb-4">
                Click the stars to change ratings. All elements live inside an open Shadow DOM —
                standard selectors won't reach them.
              </p>
              <ShadowDomRating rating={4} productName="Nike Air Max Pro" />
              <ShadowDomRating rating={5} productName="Adidas Ultra Boost" />
              <ShadowDomRating rating={3} productName="Puma RS-X Remix" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-600" />
                Shadow DOM — Toggle & Price Badge
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500 mb-4">
                Interactive toggles and price badges inside shadow roots.
                Click toggles to flip state.
              </p>
              <ShadowDomPriceBadge price="89.99" originalPrice="129.99" label="Sale" />
              <ShadowDomPriceBadge price="199.99" label="Premium" />
              <ShadowDomToggle
                label="Enable notifications"
                defaultChecked={notificationsEnabled}
                onChange={setNotificationsEnabled}
              />
              <ShadowDomToggle label="Dark mode" defaultChecked={false} />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-600" />
                Shadow DOM — Form (Input, Select, Checkbox, Button)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                A full form with text input, dropdown select, number input, checkbox, and submit button —
                all inside a Shadow DOM. Must pierce the shadow root to fill fields and click submit.
              </p>
              <ShadowDomForm />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Box className="w-5 h-5 text-blue-600" />
                Slots — Card & Product Highlight
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500 mb-4">
                Shadow DOM with named &lt;slot&gt; elements. Content from the light DOM is
                projected into slots. The button in the highlight is an interactive slotted element.
              </p>
              <SlotCard>
                <h3 slot="header">Featured Product: Air Max Pro</h3>
                <p slot="body">Experience unmatched comfort with Nike's latest cushioning technology. Perfect for running and everyday wear.</p>
                <p slot="footer">4.8/5 — 2,340 reviews</p>
              </SlotCard>
              <SlotProductHighlight>
                <img slot="image" src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=160&h=160&fit=crop" alt="Running shoe" />
                <h4 slot="title">Staff Pick: Ultra Boost 22</h4>
                <p slot="description">Our best-selling running shoe — now 15% off</p>
                <Button slot="action" size="sm" variant="outline" data-testid="slot-action-button">View</Button>
              </SlotProductHighlight>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Box className="w-5 h-5 text-blue-600" />
                Slots — Interactive Form
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500 mb-4">
                Form inputs in the light DOM are slotted into a Shadow DOM container.
                Fill fields, click Submit or Clear — the inputs are interactable but styled by the shadow host.
              </p>
              <SlotFormContainer>
                <h3 slot="title">Contact Us</h3>
                <input slot="fields" type="text" placeholder="Your name" data-testid="slot-form-name" />
                <input slot="fields" type="email" placeholder="Your email" data-testid="slot-form-email" />
                <textarea slot="fields" placeholder="Your message..." data-testid="slot-form-message" rows={3} style={{ resize: "vertical", fontFamily: "system-ui, sans-serif" }} />
                <button
                  slot="actions"
                  onClick={handleSlotFormSubmit}
                  data-testid="slot-form-submit"
                  style={{ background: "#6366f1", color: "white" }}
                >
                  Submit
                </button>
                <button
                  slot="actions"
                  onClick={handleSlotClear}
                  data-testid="slot-form-clear"
                  style={{ background: "white", color: "#6366f1", border: "1px solid #c7d2fe" }}
                >
                  Clear
                </button>
                <div slot="result">
                  {slotFormResult && (
                    <p className={`text-sm p-2 rounded ${slotFormResult.startsWith("Thanks") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`} data-testid="slot-form-result">
                      {slotFormResult}
                    </p>
                  )}
                </div>
              </SlotFormContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Box className="w-5 h-5 text-blue-600" />
                Slots — Tab Panel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Interactive tabs where buttons in the light DOM are slotted into a shadow host.
                Click tabs to switch content. Each tab button and panel are slotted elements.
              </p>
              <SlotTabPanel>
                {["Athletic", "Casual", "Dress"].map((tab, i) => (
                  <button
                    key={tab}
                    slot="tabs"
                    className={activeTab === i ? "active-tab" : ""}
                    data-testid={`slot-tab-${i}`}
                    onClick={() => setActiveTab(i)}
                  >
                    {tab}
                  </button>
                ))}
                {tabContent.map((content, i) => (
                  <p
                    key={i}
                    slot="content"
                    className={activeTab !== i ? "hidden-tab" : ""}
                    data-testid={`slot-tab-content-${i}`}
                  >
                    {content}
                  </p>
                ))}
              </SlotTabPanel>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Frame className="w-5 h-5 text-green-600" />
                Iframe — Embedded Promo Widget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                A full interactive widget inside an iframe: click the promo code to copy it,
                fill in the email form, and watch the live countdown. Requires iframe context switch.
              </p>
              <iframe
                src="/iframe-widget.html"
                title="Promotional Widget"
                data-testid="promo-iframe"
                className="w-full border-2 border-gray-200 rounded-lg"
                style={{ height: "320px" }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-600" />
                Dynamic — Button (All Locators Change)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-gray-500 mb-4">
                Every click regenerates the button's <code className="text-xs bg-gray-100 px-1 rounded">id</code>,
                <code className="text-xs bg-gray-100 px-1 rounded">name</code>,
                <code className="text-xs bg-gray-100 px-1 rounded">class</code>, and
                <code className="text-xs bg-gray-100 px-1 rounded">data-testid</code>.
                No stable locator exists except text content.
              </p>
              <DynamicLocatorButton />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-600" />
                Dynamic — Input (Locators Change on Keystroke)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-gray-500 mb-4">
                Every keystroke regenerates the input's <code className="text-xs bg-gray-100 px-1 rounded">id</code>,
                <code className="text-xs bg-gray-100 px-1 rounded">name</code>,
                <code className="text-xs bg-gray-100 px-1 rounded">data-testid</code>, and even the
                <code className="text-xs bg-gray-100 px-1 rounded">placeholder</code> text.
              </p>
              <DynamicLocatorInput />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-600" />
                Dynamic — Dropdown (Locators Change on Select)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-gray-500 mb-4">
                A custom dropdown whose <code className="text-xs bg-gray-100 px-1 rounded">id</code> and
                <code className="text-xs bg-gray-100 px-1 rounded">data-testid</code> change every time
                you pick an option. The menu also appears/disappears dynamically.
              </p>
              <DynamicLocatorDropdown />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-600" />
                Dynamic — Checkboxes (Shuffle & ID Regen)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-gray-500 mb-4">
                Checkboxes whose <code className="text-xs bg-gray-100 px-1 rounded">id</code> and
                <code className="text-xs bg-gray-100 px-1 rounded">name</code> regenerate on every check.
                Shuffle reorders them and regenerates all IDs. Position-based locators break.
              </p>
              <DynamicLocatorCheckboxes />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-600" />
                Dynamic — State Change (Class Cycling)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-gray-500 mb-4">
                CSS classes and data attributes cycle through states: idle → loading → success/error.
                Must wait for transitions to assert correct state.
              </p>
              <DynamicClassElement />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-600" />
                Dynamic — Delayed Render & Auto-Refresh
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-gray-500 mb-4">
                Elements that appear after a random delay (1-3s) or update every second.
                Requires explicit waits for delayed items, and timing-aware assertions for the counter.
              </p>
              <div>
                <h4 className="text-sm font-semibold mb-2 text-gray-700">Delayed Element Rendering</h4>
                <DelayedRenderElement />
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-2 text-gray-700">Auto-Refreshing Counter</h4>
                <AutoRefreshCounter />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-600" />
                Dynamic — Stale Locator Table
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Sort or shuffle to move rows in the DOM. Row indices and positional locators become stale.
                Use content-based selectors instead.
              </p>
              <StaleLocatorTable />
            </CardContent>
          </Card>
        </div>

        <div id="glossary" className="scroll-mt-20">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-gray-700" />
                Element Type Glossary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="glossary-table">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left p-3 font-semibold text-gray-700">Element Type</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Location on Page</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Interactable?</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Test ID / Selector</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Automation Challenge</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="p-3 font-medium text-purple-700">Shadow DOM</td>
                      <td className="p-3">Interactive Rating</td>
                      <td className="p-3">Yes — click stars</td>
                      <td className="p-3"><code className="bg-gray-100 px-1 rounded text-xs">shadow-host-rating</code> → <code className="bg-gray-100 px-1 rounded text-xs">.star[data-star-index]</code></td>
                      <td className="p-3 text-gray-600">Pierce shadow root, click SVG stars, verify rating text updates</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-3 font-medium text-purple-700">Shadow DOM</td>
                      <td className="p-3">Toggle Switch</td>
                      <td className="p-3">Yes — click to flip</td>
                      <td className="p-3"><code className="bg-gray-100 px-1 rounded text-xs">shadow-host-toggle</code> → <code className="bg-gray-100 px-1 rounded text-xs">shadow-toggle-track</code></td>
                      <td className="p-3 text-gray-600">Click toggle inside shadow DOM, verify ON/OFF status text change</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-purple-700">Shadow DOM</td>
                      <td className="p-3">Price Badge</td>
                      <td className="p-3">Read-only</td>
                      <td className="p-3"><code className="bg-gray-100 px-1 rounded text-xs">shadow-host-price</code> → <code className="bg-gray-100 px-1 rounded text-xs">shadow-price-value</code></td>
                      <td className="p-3 text-gray-600">Read text content from inside shadow root</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-3 font-medium text-purple-700">Shadow DOM</td>
                      <td className="p-3">Full Form</td>
                      <td className="p-3">Yes — input, select, checkbox, submit</td>
                      <td className="p-3"><code className="bg-gray-100 px-1 rounded text-xs">shadow-host-form</code> → <code className="bg-gray-100 px-1 rounded text-xs">shadow-form-name</code>, <code className="bg-gray-100 px-1 rounded text-xs">shadow-form-category</code>, <code className="bg-gray-100 px-1 rounded text-xs">shadow-form-score</code>, <code className="bg-gray-100 px-1 rounded text-xs">shadow-form-recommend</code>, <code className="bg-gray-100 px-1 rounded text-xs">shadow-form-submit</code></td>
                      <td className="p-3 text-gray-600">Fill text input, select dropdown, check checkbox, click submit — all inside shadow DOM</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-blue-700">Slot</td>
                      <td className="p-3">Card (header/body/footer)</td>
                      <td className="p-3">Read-only</td>
                      <td className="p-3"><code className="bg-gray-100 px-1 rounded text-xs">slot-host-card</code> → slots: header, body, footer</td>
                      <td className="p-3 text-gray-600">Content in light DOM projected via named slots. Use <code className="text-xs">assignedElements()</code></td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-3 font-medium text-blue-700">Slot</td>
                      <td className="p-3">Product Highlight</td>
                      <td className="p-3">Yes — button in action slot</td>
                      <td className="p-3"><code className="bg-gray-100 px-1 rounded text-xs">slot-host-highlight</code> → <code className="bg-gray-100 px-1 rounded text-xs">slot-action-button</code></td>
                      <td className="p-3 text-gray-600">Click a button that's slotted into a shadow DOM container</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-blue-700">Slot</td>
                      <td className="p-3">Interactive Form</td>
                      <td className="p-3">Yes — inputs, textarea, submit, clear</td>
                      <td className="p-3"><code className="bg-gray-100 px-1 rounded text-xs">slot-host-form</code> → <code className="bg-gray-100 px-1 rounded text-xs">slot-form-name</code>, <code className="bg-gray-100 px-1 rounded text-xs">slot-form-email</code>, <code className="bg-gray-100 px-1 rounded text-xs">slot-form-message</code>, <code className="bg-gray-100 px-1 rounded text-xs">slot-form-submit</code>, <code className="bg-gray-100 px-1 rounded text-xs">slot-form-clear</code></td>
                      <td className="p-3 text-gray-600">Light DOM inputs slotted into shadow container. Styled by shadow host but accessible from light DOM</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-3 font-medium text-blue-700">Slot</td>
                      <td className="p-3">Tab Panel</td>
                      <td className="p-3">Yes — click tab buttons</td>
                      <td className="p-3"><code className="bg-gray-100 px-1 rounded text-xs">slot-host-tabs</code> → <code className="bg-gray-100 px-1 rounded text-xs">slot-tab-0</code>, <code className="bg-gray-100 px-1 rounded text-xs">slot-tab-1</code>, <code className="bg-gray-100 px-1 rounded text-xs">slot-tab-2</code></td>
                      <td className="p-3 text-gray-600">Tab buttons are slotted. Click to switch active tab. Verify content panels show/hide correctly</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-green-700">Iframe</td>
                      <td className="p-3">Promo Widget</td>
                      <td className="p-3">Yes — click code, fill email, submit</td>
                      <td className="p-3"><code className="bg-gray-100 px-1 rounded text-xs">promo-iframe</code> → <code className="bg-gray-100 px-1 rounded text-xs">iframe-promo-code</code>, <code className="bg-gray-100 px-1 rounded text-xs">iframe-email-input</code>, <code className="bg-gray-100 px-1 rounded text-xs">iframe-submit-btn</code></td>
                      <td className="p-3 text-gray-600">Switch to iframe context. Click promo code to copy, fill email, submit form, watch live countdown</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-3 font-medium text-orange-700">Dynamic Locator</td>
                      <td className="p-3">Button (all locators change)</td>
                      <td className="p-3">Yes — click to regenerate</td>
                      <td className="p-3"><code className="bg-gray-100 px-1 rounded text-xs">id</code>, <code className="bg-gray-100 px-1 rounded text-xs">name</code>, <code className="bg-gray-100 px-1 rounded text-xs">class</code>, <code className="bg-gray-100 px-1 rounded text-xs">data-testid</code> all change every click</td>
                      <td className="p-3 text-gray-600">No stable locator except text content. All attributes regenerate on each interaction</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-orange-700">Dynamic Locator</td>
                      <td className="p-3">Input (locators change on keystroke)</td>
                      <td className="p-3">Yes — type to regenerate</td>
                      <td className="p-3"><code className="bg-gray-100 px-1 rounded text-xs">id</code>, <code className="bg-gray-100 px-1 rounded text-xs">name</code>, <code className="bg-gray-100 px-1 rounded text-xs">data-testid</code>, <code className="bg-gray-100 px-1 rounded text-xs">placeholder</code> change per keystroke</td>
                      <td className="p-3 text-gray-600">Every keystroke regenerates identifiers. Can only reliably locate by element type or role</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-3 font-medium text-orange-700">Dynamic Locator</td>
                      <td className="p-3">Dropdown (locators change on select)</td>
                      <td className="p-3">Yes — click to open, select option</td>
                      <td className="p-3"><code className="bg-gray-100 px-1 rounded text-xs">id</code>, <code className="bg-gray-100 px-1 rounded text-xs">data-testid</code> change per selection. Menu appears/disappears</td>
                      <td className="p-3 text-gray-600">Custom dropdown with dynamic IDs. Menu DOM is created/destroyed. Options have indexed test IDs</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-orange-700">Dynamic Locator</td>
                      <td className="p-3">Checkboxes (shuffle + ID regen)</td>
                      <td className="p-3">Yes — check/uncheck, shuffle</td>
                      <td className="p-3"><code className="bg-gray-100 px-1 rounded text-xs">id</code>, <code className="bg-gray-100 px-1 rounded text-xs">name</code> regen on check. Order shuffles on button click</td>
                      <td className="p-3 text-gray-600">IDs regenerate per interaction. Shuffle changes DOM order. Position + ID both unreliable</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-3 font-medium text-orange-700">Dynamic State</td>
                      <td className="p-3">State Change Element</td>
                      <td className="p-3">Yes — trigger button</td>
                      <td className="p-3"><code className="bg-gray-100 px-1 rounded text-xs">dynamic-class-element</code> with <code className="bg-gray-100 px-1 rounded text-xs">data-state</code> cycling idle→loading→success/error</td>
                      <td className="p-3 text-gray-600">Classes and data attributes change with async timing. Must wait for state transitions</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-orange-700">Delayed Render</td>
                      <td className="p-3">Delayed Items</td>
                      <td className="p-3">Yes — add button, remove button</td>
                      <td className="p-3"><code className="bg-gray-100 px-1 rounded text-xs">delayed-add-button</code>, <code className="bg-gray-100 px-1 rounded text-xs">delayed-item</code> (appears after 1-3s), <code className="bg-gray-100 px-1 rounded text-xs">delayed-item-remove</code></td>
                      <td className="p-3 text-gray-600">Click add, wait 1-3s for element. Each new item has unique dynamic ID. Remove to delete</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-3 font-medium text-orange-700">Auto-Refresh</td>
                      <td className="p-3">Live Counter</td>
                      <td className="p-3">Yes — start/stop/reset buttons</td>
                      <td className="p-3"><code className="bg-gray-100 px-1 rounded text-xs">auto-refresh-toggle</code>, <code className="bg-gray-100 px-1 rounded text-xs">auto-refresh-reset</code>, <code className="bg-gray-100 px-1 rounded text-xs">auto-refresh-count</code></td>
                      <td className="p-3 text-gray-600">Counter increments every second. Start/stop/reset. Text changes continuously</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-orange-700">Stale Locator</td>
                      <td className="p-3">Sortable Table</td>
                      <td className="p-3">Yes — sort/shuffle buttons</td>
                      <td className="p-3"><code className="bg-gray-100 px-1 rounded text-xs">stale-table-row</code> with <code className="bg-gray-100 px-1 rounded text-xs">data-row-index</code> (changes on sort/shuffle)</td>
                      <td className="p-3 text-gray-600">Sort/shuffle moves rows. Positional locators break. Use content-based selectors</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-10 mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-indigo-600" />
                  Site-Wide Special Elements
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  The following non-regular elements are integrated into actual shopping pages across the site — not just this playground.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="glossary-sitewide-table">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left p-3 font-semibold text-gray-700">Page</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Element</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Type</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Selector Path</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="p-3 font-medium">Home <code className="text-xs text-gray-400">/</code></td>
                      <td className="p-3">Promo Banner</td>
                      <td className="p-3 font-medium text-green-700">Iframe</td>
                      <td className="p-3"><code className="bg-gray-100 px-1 rounded text-xs">iframe-promo-widget</code> → <code className="bg-gray-100 px-1 rounded text-xs">iframe-promo-code</code>, <code className="bg-gray-100 px-1 rounded text-xs">iframe-email-input</code>, <code className="bg-gray-100 px-1 rounded text-xs">iframe-submit-btn</code></td>
                      <td className="p-3 text-gray-600">Iframe promo widget between hero and products. Same widget as playground. Switch to iframe context to interact</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-3 font-medium">Home <code className="text-xs text-gray-400">/</code></td>
                      <td className="p-3">Load More Products</td>
                      <td className="p-3 font-medium text-orange-700">Dynamic Locator</td>
                      <td className="p-3"><code className="bg-gray-100 px-1 rounded text-xs">id</code> and <code className="bg-gray-100 px-1 rounded text-xs">data-testid</code> regenerate per click. Text: "Load More Products"</td>
                      <td className="p-3 text-gray-600">Button below product grid. Each click loads 12 more products and regenerates id/data-testid. Use text content to locate</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Footer <code className="text-xs text-gray-400">all pages</code></td>
                      <td className="p-3">Newsletter Form</td>
                      <td className="p-3 font-medium text-purple-700">Shadow DOM</td>
                      <td className="p-3"><code className="bg-gray-100 px-1 rounded text-xs">shadow-host-newsletter</code> → <code className="bg-gray-100 px-1 rounded text-xs">shadow-newsletter-email</code>, <code className="bg-gray-100 px-1 rounded text-xs">shadow-newsletter-submit</code></td>
                      <td className="p-3 text-gray-600">Email input and submit button inside shadow root. Present on every page via shared footer component</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-3 font-medium">Product Detail <code className="text-xs text-gray-400">/product/:id</code></td>
                      <td className="p-3">Star Rating</td>
                      <td className="p-3 font-medium text-purple-700">Shadow DOM</td>
                      <td className="p-3"><code className="bg-gray-100 px-1 rounded text-xs">shadow-host-rating</code> → <code className="bg-gray-100 px-1 rounded text-xs">.star[data-star-index]</code>, <code className="bg-gray-100 px-1 rounded text-xs">shadow-rating-value</code></td>
                      <td className="p-3 text-gray-600">Interactive star rating widget on every product page. Click stars to change rating. Same component as playground</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Product Detail <code className="text-xs text-gray-400">/product/:id</code></td>
                      <td className="p-3">Review Cards</td>
                      <td className="p-3 font-medium text-blue-700">Slot</td>
                      <td className="p-3"><code className="bg-gray-100 px-1 rounded text-xs">slot-host-card</code> → slots: <code className="bg-gray-100 px-1 rounded text-xs">header</code> (reviewer), <code className="bg-gray-100 px-1 rounded text-xs">body</code> (comment), <code className="bg-gray-100 px-1 rounded text-xs">footer</code> (date)</td>
                      <td className="p-3 text-gray-600">Each customer review is wrapped in a SlotCard. Content in light DOM projected via named slots into shadow container</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-3 font-medium">Checkout <code className="text-xs text-gray-400">/checkout</code></td>
                      <td className="p-3">Payment Fields</td>
                      <td className="p-3 font-medium text-purple-700">Shadow DOM</td>
                      <td className="p-3"><code className="bg-gray-100 px-1 rounded text-xs">shadow-host-payment</code> → <code className="bg-gray-100 px-1 rounded text-xs">shadow-card-number</code>, <code className="bg-gray-100 px-1 rounded text-xs">shadow-card-expiry</code>, <code className="bg-gray-100 px-1 rounded text-xs">shadow-card-cvv</code></td>
                      <td className="p-3 text-gray-600">Card number, expiry, CVV fields inside shadow root. Simulates real payment processor embedded forms. Values feed back to form</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Checkout <code className="text-xs text-gray-400">/checkout</code></td>
                      <td className="p-3">Place Order Button</td>
                      <td className="p-3 font-medium text-orange-700">Dynamic Locator</td>
                      <td className="p-3"><code className="bg-gray-100 px-1 rounded text-xs">id</code> and <code className="bg-gray-100 px-1 rounded text-xs">data-testid</code> regenerate per click. Text: "Place Order — $X.XX"</td>
                      <td className="p-3 text-gray-600">The actual submit button. Dynamic locators regenerate on each click. Use text content or role="button" to locate</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-3 font-medium">Cart Slideout <code className="text-xs text-gray-400">all pages</code></td>
                      <td className="p-3">Cart Item Cards</td>
                      <td className="p-3 font-medium text-blue-700">Slot</td>
                      <td className="p-3"><code className="bg-gray-100 px-1 rounded text-xs">slot-host-highlight</code> → slots: <code className="bg-gray-100 px-1 rounded text-xs">image</code>, <code className="bg-gray-100 px-1 rounded text-xs">title</code>, <code className="bg-gray-100 px-1 rounded text-xs">description</code>, <code className="bg-gray-100 px-1 rounded text-xs">action</code></td>
                      <td className="p-3 text-gray-600">Each cart item uses SlotProductHighlight. Image, name, size/price, and quantity controls are slotted into shadow host</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Contact <code className="text-xs text-gray-400">/contact</code></td>
                      <td className="p-3">Contact Form</td>
                      <td className="p-3 font-medium text-purple-700">Shadow DOM</td>
                      <td className="p-3"><code className="bg-gray-100 px-1 rounded text-xs">shadow-host-contact-form</code> → <code className="bg-gray-100 px-1 rounded text-xs">shadow-contact-name</code>, <code className="bg-gray-100 px-1 rounded text-xs">shadow-contact-email</code>, <code className="bg-gray-100 px-1 rounded text-xs">shadow-contact-message</code>, <code className="bg-gray-100 px-1 rounded text-xs">shadow-contact-submit</code></td>
                      <td className="p-3 text-gray-600">Full contact form inside shadow DOM. Name, email, message inputs and submit button. Shows toast on success</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-3 font-medium">About <code className="text-xs text-gray-400">/about</code></td>
                      <td className="p-3">Value/Stats Cards</td>
                      <td className="p-3 font-medium text-blue-700">Slot</td>
                      <td className="p-3"><code className="bg-gray-100 px-1 rounded text-xs">slot-host-card</code> → slots: <code className="bg-gray-100 px-1 rounded text-xs">header</code> (icon+title), <code className="bg-gray-100 px-1 rounded text-xs">body</code> (description), <code className="bg-gray-100 px-1 rounded text-xs">footer</code> (label)</td>
                      <td className="p-3 text-gray-600">Stats cards and mission value cards wrapped in SlotCard. Light DOM content projected through named slots</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
