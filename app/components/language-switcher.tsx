"use client";

import { languages, type Language } from "../lib/demo-data";

export function LanguageSwitcher({
  language,
  onChange,
}: {
  language: Language;
  onChange: (language: Language) => void;
}) {
  return (
    <div className="flex rounded-sm border border-stone-200 bg-offwhite p-1">
      {languages.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={`rounded-xs px-3 py-2 text-sm font-bold transition ${
            language === item.id ? "bg-forest text-ivory" : "text-ink-soft hover:text-ink"
          }`}
          aria-label={`Switch language to ${item.label}`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
