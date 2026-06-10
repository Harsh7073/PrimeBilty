"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function LocationAutocomplete({
  value,
  onChange,
  placeholder = "",
  required = false,
}: LocationAutocompleteProps) {
  const { token } = useAuthStore();
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync internal input value with prop value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Handle clicking outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions when query changes (debounced)
  useEffect(() => {
    if (!token || !inputValue || inputValue.length < 2) {
      setSuggestions([]);
      return;
    }

    // Don't fetch if the input matches an already selected city
    if (suggestions.some((s) => `${s.name}, ${s.state?.name}` === inputValue)) {
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const { data } = await axios.get(`/api/cities/search?query=${inputValue}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuggestions(data.cities || []);
        setIsOpen(true);
      } catch (err) {
        console.error(err);
      }
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue, token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(val);
    setIsOpen(true);
  };

  const handleSelectSuggestion = (city: any) => {
    const formatted = `${city.name}, ${city.state?.name}`;
    setInputValue(formatted);
    onChange(formatted);
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="input-base w-full"
        required={required}
      />
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 mt-1 w-full rounded-xl bg-[#0f172a]/95 border border-white/10 shadow-2xl z-50 max-h-48 overflow-y-auto backdrop-blur-md">
          <div className="py-1">
            {suggestions.map((city) => (
              <button
                key={city.id}
                type="button"
                onClick={() => handleSelectSuggestion(city)}
                className="w-full px-4 py-2.5 text-left text-sm text-white/80 hover:bg-white/5 cursor-pointer font-medium border-b border-white/5 last:border-b-0 transition-colors"
              >
                <span className="text-white font-semibold">{city.name}</span>
                <span className="text-white/40 text-xs ml-1.5">{city.state?.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
