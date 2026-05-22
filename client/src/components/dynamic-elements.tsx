import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Clock, Zap, AlertCircle, CheckCircle2, Loader2, Shuffle } from "lucide-react";

export function DynamicLocatorButton() {
  const [clickCount, setClickCount] = useState(0);
  const [dynamicId, setDynamicId] = useState(`btn-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  const [dynamicClass, setDynamicClass] = useState(`action-btn-${Math.random().toString(36).slice(2, 6)}`);
  const [dynamicName, setDynamicName] = useState(`submit-${Math.random().toString(36).slice(2, 6)}`);
  const [dynamicTestId, setDynamicTestId] = useState(`cta-${Math.random().toString(36).slice(2, 6)}`);

  const handleClick = () => {
    setClickCount(c => c + 1);
    setDynamicId(`btn-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
    setDynamicClass(`action-btn-${Math.random().toString(36).slice(2, 6)}`);
    setDynamicName(`submit-${Math.random().toString(36).slice(2, 6)}`);
    setDynamicTestId(`cta-${Math.random().toString(36).slice(2, 6)}`);
  };

  return (
    <div className="space-y-3">
      <button
        id={dynamicId}
        name={dynamicName}
        className={`${dynamicClass} w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium`}
        data-testid={dynamicTestId}
        data-click-count={clickCount}
        onClick={handleClick}
        type="button"
      >
        <RefreshCw className="w-4 h-4" />
        Click me — all locators change!
      </button>
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
        <div>id: <code className="bg-gray-100 px-1 rounded break-all" data-testid="dynamic-current-id">{dynamicId}</code></div>
        <div>name: <code className="bg-gray-100 px-1 rounded break-all" data-testid="dynamic-current-name">{dynamicName}</code></div>
        <div>class: <code className="bg-gray-100 px-1 rounded break-all" data-testid="dynamic-current-class">{dynamicClass}</code></div>
        <div>data-testid: <code className="bg-gray-100 px-1 rounded break-all" data-testid="dynamic-current-testid">{dynamicTestId}</code></div>
      </div>
      <p className="text-xs text-gray-500">
        Clicks: <span data-testid="dynamic-click-count">{clickCount}</span>
      </p>
    </div>
  );
}

export function DynamicLocatorInput() {
  const [value, setValue] = useState("");
  const [fieldId, setFieldId] = useState(`input-${Date.now()}`);
  const [fieldName, setFieldName] = useState(`field-${Math.random().toString(36).slice(2, 6)}`);
  const [fieldTestId, setFieldTestId] = useState(`search-${Math.random().toString(36).slice(2, 6)}`);
  const [placeholder, setPlaceholder] = useState("Type something...");

  const placeholders = ["Type something...", "Enter text here...", "Search for items...", "Write a message...", "What are you looking for?"];

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setFieldId(`input-${Date.now()}`);
    setFieldName(`field-${Math.random().toString(36).slice(2, 6)}`);
    setFieldTestId(`search-${Math.random().toString(36).slice(2, 6)}`);
    setPlaceholder(placeholders[Math.floor(Math.random() * placeholders.length)]);
  };

  return (
    <div className="space-y-3">
      <Input
        id={fieldId}
        name={fieldName}
        data-testid={fieldTestId}
        value={value}
        onChange={handleInput}
        placeholder={placeholder}
        className="w-full"
      />
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
        <div>id: <code className="bg-gray-100 px-1 rounded break-all" data-testid="dynamic-input-current-id">{fieldId}</code></div>
        <div>name: <code className="bg-gray-100 px-1 rounded break-all" data-testid="dynamic-input-current-name">{fieldName}</code></div>
        <div>data-testid: <code className="bg-gray-100 px-1 rounded break-all" data-testid="dynamic-input-current-testid">{fieldTestId}</code></div>
        <div>placeholder: <code className="bg-gray-100 px-1 rounded break-all">{placeholder}</code></div>
      </div>
    </div>
  );
}

export function DynamicClassElement() {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

  const cycle = () => {
    setState("loading");
    setTimeout(() => {
      setState(Math.random() > 0.5 ? "success" : "error");
      setTimeout(() => setState("idle"), 2000);
    }, 1500);
  };

  const stateConfig = {
    idle: { icon: <Zap className="w-5 h-5" />, bg: "bg-gray-100 border-gray-300", text: "Ready" },
    loading: { icon: <Loader2 className="w-5 h-5 animate-spin" />, bg: "bg-blue-50 border-blue-300", text: "Processing..." },
    success: { icon: <CheckCircle2 className="w-5 h-5 text-green-600" />, bg: "bg-green-50 border-green-300", text: "Success!" },
    error: { icon: <AlertCircle className="w-5 h-5 text-red-600" />, bg: "bg-red-50 border-red-300", text: "Error occurred" },
  };

  const config = stateConfig[state];

  return (
    <div className="space-y-2">
      <div
        data-testid="dynamic-class-element"
        data-state={state}
        className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-all duration-300 ${config.bg}`}
      >
        {config.icon}
        <span className="font-medium" data-testid="dynamic-class-text">{config.text}</span>
      </div>
      <Button onClick={cycle} variant="outline" size="sm" disabled={state !== "idle"} data-testid="dynamic-class-trigger">
        Trigger State Change
      </Button>
    </div>
  );
}

export function DelayedRenderElement() {
  const [items, setItems] = useState<Array<{ id: string; text: string; timestamp: number }>>([]);
  const [isAdding, setIsAdding] = useState(false);

  const addItem = useCallback(() => {
    setIsAdding(true);
    const delay = 1000 + Math.random() * 2000;
    setTimeout(() => {
      const newItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        text: `Delayed item #${items.length + 1}`,
        timestamp: Date.now(),
      };
      setItems(prev => [...prev, newItem]);
      setIsAdding(false);
    }, delay);
  }, [items.length]);

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-3">
      <Button onClick={addItem} variant="outline" disabled={isAdding} data-testid="delayed-add-button">
        {isAdding ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Adding (1-3s delay)...
          </>
        ) : (
          <>
            <Clock className="w-4 h-4 mr-2" />
            Add Delayed Element
          </>
        )}
      </Button>
      <div data-testid="delayed-items-container" className="space-y-2 min-h-[40px]">
        {items.length === 0 && (
          <p className="text-sm text-gray-400 italic" data-testid="delayed-empty-state">No items yet. Click above to add.</p>
        )}
        {items.map(item => (
          <div
            key={item.id}
            id={item.id}
            data-testid="delayed-item"
            data-timestamp={item.timestamp}
            className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg animate-in fade-in slide-in-from-top-2"
          >
            <span className="text-sm font-medium text-purple-800">{item.text}</span>
            <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)} data-testid="delayed-item-remove">
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StaleLocatorTable() {
  const [rows, setRows] = useState([
    { name: "Nike Air Max", price: "$129.99", stock: "In Stock" },
    { name: "Adidas Ultra Boost", price: "$179.99", stock: "Low Stock" },
    { name: "Puma RS-X", price: "$109.99", stock: "In Stock" },
  ]);
  const [sortKey, setSortKey] = useState<"name" | "price">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handleSort = (key: "name" | "price") => {
    if (sortKey === key) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const shuffleRows = () => {
    setRows(prev => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
  };

  const sortedRows = [...rows].sort((a, b) => {
    const valA = sortKey === "price" ? parseFloat(a.price.replace("$", "")) : a.name;
    const valB = sortKey === "price" ? parseFloat(b.price.replace("$", "")) : b.name;
    if (valA < valB) return sortDir === "asc" ? -1 : 1;
    if (valA > valB) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={shuffleRows} data-testid="stale-shuffle-button">
          <RefreshCw className="w-4 h-4 mr-1" /> Shuffle Rows
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleSort("name")} data-testid="stale-sort-name">
          Sort by Name {sortKey === "name" ? (sortDir === "asc" ? "↑" : "↓") : ""}
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleSort("price")} data-testid="stale-sort-price">
          Sort by Price {sortKey === "price" ? (sortDir === "asc" ? "↑" : "↓") : ""}
        </Button>
      </div>
      <table className="w-full border border-gray-200 rounded-lg overflow-hidden" data-testid="stale-locator-table">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-3 text-sm font-medium text-gray-600">Product</th>
            <th className="text-left p-3 text-sm font-medium text-gray-600">Price</th>
            <th className="text-left p-3 text-sm font-medium text-gray-600">Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, index) => (
            <tr key={index} data-testid="stale-table-row" data-row-index={index} className="border-t border-gray-200">
              <td className="p-3 text-sm" data-testid="stale-cell-name">{row.name}</td>
              <td className="p-3 text-sm font-semibold" data-testid="stale-cell-price">{row.price}</td>
              <td className="p-3 text-sm" data-testid="stale-cell-stock">{row.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AutoRefreshCounter() {
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  return (
    <div className="space-y-2">
      <div
        data-testid="auto-refresh-display"
        data-count={count}
        className="text-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200"
      >
        <span className="text-3xl font-bold text-indigo-700" data-testid="auto-refresh-count">{count}</span>
        <p className="text-xs text-indigo-500 mt-1">Updates every second when running</p>
      </div>
      <div className="flex gap-2">
        <Button
          variant={running ? "destructive" : "default"}
          size="sm"
          onClick={() => setRunning(r => !r)}
          data-testid="auto-refresh-toggle"
        >
          {running ? "Stop" : "Start"} Counter
        </Button>
        <Button variant="outline" size="sm" onClick={() => setCount(0)} data-testid="auto-refresh-reset">
          Reset
        </Button>
      </div>
    </div>
  );
}

export function DynamicLocatorDropdown() {
  const [selected, setSelected] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownId, setDropdownId] = useState(`dropdown-${Date.now()}`);
  const [dropdownTestId, setDropdownTestId] = useState(`select-${Math.random().toString(36).slice(2, 6)}`);

  const options = [
    { value: "nike", label: "Nike" },
    { value: "adidas", label: "Adidas" },
    { value: "puma", label: "Puma" },
    { value: "newbalance", label: "New Balance" },
    { value: "reebok", label: "Reebok" },
  ];

  const handleSelect = (value: string) => {
    setSelected(value);
    setIsOpen(false);
    setDropdownId(`dropdown-${Date.now()}`);
    setDropdownTestId(`select-${Math.random().toString(36).slice(2, 6)}`);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <button
          id={dropdownId}
          data-testid={dropdownTestId}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
          type="button"
        >
          <span>{selected ? options.find(o => o.value === selected)?.label : "Select a brand..."}</span>
          <Shuffle className="w-4 h-4 text-gray-400" />
        </button>
        {isOpen && (
          <div
            className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
            data-testid="dynamic-dropdown-menu"
          >
            {options.map((opt, i) => (
              <button
                key={opt.value}
                data-testid={`dynamic-option-${i}`}
                data-value={opt.value}
                onClick={() => handleSelect(opt.value)}
                className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 first:rounded-t-lg last:rounded-b-lg"
                type="button"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
        <div>id: <code className="bg-gray-100 px-1 rounded break-all" data-testid="dynamic-dropdown-current-id">{dropdownId}</code></div>
        <div>data-testid: <code className="bg-gray-100 px-1 rounded break-all" data-testid="dynamic-dropdown-current-testid">{dropdownTestId}</code></div>
      </div>
    </div>
  );
}

export function DynamicLocatorCheckboxes() {
  const [checks, setChecks] = useState([false, false, false]);
  const [labels, setLabels] = useState(["Option A", "Option B", "Option C"]);
  const [ids, setIds] = useState(() => labels.map(() => `chk-${Math.random().toString(36).slice(2, 6)}`));

  const handleCheck = (index: number) => {
    const newChecks = [...checks];
    newChecks[index] = !newChecks[index];
    setChecks(newChecks);

    const newIds = [...ids];
    newIds[index] = `chk-${Math.random().toString(36).slice(2, 6)}`;
    setIds(newIds);
  };

  const shuffleOrder = () => {
    const combined = labels.map((l, i) => ({ label: l, checked: checks[i], id: ids[i] }));
    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }
    setLabels(combined.map(c => c.label));
    setChecks(combined.map(c => c.checked));
    setIds(combined.map(c => c.id));
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {labels.map((label, i) => (
          <label
            key={i}
            htmlFor={ids[i]}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <input
              type="checkbox"
              id={ids[i]}
              name={ids[i]}
              data-testid={`dynamic-checkbox-${i}`}
              checked={checks[i]}
              onChange={() => handleCheck(i)}
              className="w-4 h-4 rounded accent-blue-600"
            />
            <span className="text-sm">{label}</span>
            <code className="text-xs text-gray-400 ml-auto">id: {ids[i]}</code>
          </label>
        ))}
      </div>
      <Button variant="outline" size="sm" onClick={shuffleOrder} data-testid="dynamic-checkbox-shuffle">
        <Shuffle className="w-3 h-3 mr-1" /> Shuffle Order & Regenerate IDs
      </Button>
    </div>
  );
}
