"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Search, Check } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";

interface Unit {
  id: string;
  name: string;
  symbol: string;
}

interface UnitSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function UnitSelect({
  value,
  onChange,
  placeholder = "Select unit...",
  required = false,
  className = "",
}: UnitSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { token } = useAuthStore();

  useEffect(() => {
    if (!token) return;
    const fetchUnits = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/units", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUnits(data.units || []);
      } catch (err) {
        console.error("Failed to fetch units:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUnits();
  }, [token]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (symbol: string) => {
    onChange(symbol);
    setIsOpen(false);
    setSearchQuery("");
  };

  // Find the selected unit by its symbol
  const selectedUnit = units.find(
    (u) => u.symbol.toLowerCase() === value.toLowerCase()
  );

  const filteredUnits = units.filter((u) => {
    const term = searchQuery.toLowerCase();
    return (
      u.symbol.toLowerCase().includes(term) ||
      u.name.toLowerCase().includes(term)
    );
  });

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full input-base flex items-center justify-between gap-2 text-left cursor-pointer min-h-[42px] select-none"
      >
        <div className="flex items-center gap-2 overflow-hidden py-0.5">
          {selectedUnit ? (
            <span className="text-white font-medium text-sm truncate">
              {selectedUnit.symbol} ({selectedUnit.name})
            </span>
          ) : (
            <span className="text-white/40 text-sm">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-white/40 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Hidden input for HTML form validation */}
      {required && (
        <input
          type="text"
          value={value}
          onChange={() => {}}
          className="absolute inset-0 opacity-0 pointer-events-none w-full h-full"
          required
        />
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-full rounded-xl bg-[#0f172a]/95 border border-white/10 shadow-2xl z-50 backdrop-blur-md overflow-hidden flex flex-col max-h-72">
          {/* Search Bar */}
          <div className="p-2 border-b border-white/5 flex items-center gap-2 bg-white/[0.02]">
            <Search className="w-4 h-4 text-white/30 shrink-0" />
            <input
              type="text"
              placeholder="Search unit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 outline-0 p-0.5 text-sm text-white placeholder-white/30 w-full"
              autoFocus
            />
          </div>

          {/* Option List */}
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="px-4 py-6 text-sm text-white/40 text-center flex-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Loading units...
              </div>
            ) : filteredUnits.length === 0 ? (
              <div className="px-4 py-6 text-sm text-white/40 text-center">
                No units found.
              </div>
            ) : (
              filteredUnits.map((u) => {
                const isSelected = u.symbol.toLowerCase() === value.toLowerCase();
                
                // Format name: uppercase and wrap in parentheses, but remove redundant symbol if present in name
                let formattedName = u.name.toUpperCase();
                if (!formattedName.startsWith("(")) {
                  formattedName = `(${formattedName})`;
                }

                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSelect(u.symbol)}
                    className={`w-full flex flex-col items-center justify-center py-2.5 text-center transition-colors cursor-pointer border-b border-white/5 hover:bg-white/5 relative ${
                      isSelected ? "bg-white/[0.04]" : ""
                    }`}
                  >
                    <span
                      className={`font-semibold text-white tracking-wider text-sm ${
                        isSelected ? "text-brand-400 font-bold" : ""
                      }`}
                    >
                      {u.symbol.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-white/40 tracking-wide mt-0.5">
                      {formattedName}
                    </span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-brand-400 absolute right-4 top-1/2 -translate-y-1/2 shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
