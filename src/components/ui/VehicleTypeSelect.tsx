"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { VehicleTypeIcon } from "./VehicleTypeIcon";

interface VehicleTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  vehicleTypes: Array<{ id: string; name: string; description?: string }>;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export function VehicleTypeSelect({
  value,
  onChange,
  vehicleTypes,
  placeholder = "Select type...",
  className = "",
  required = false,
}: VehicleTypeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const selectedType = vehicleTypes.find((t) => t.id === value);

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full input-base flex items-center justify-between gap-2 text-left cursor-pointer min-h-[42px] select-none"
      >
        <div className="flex items-center gap-2 overflow-hidden py-0.5">
          {selectedType ? (
            <>
              <VehicleTypeIcon name={selectedType.name} className="scale-85 origin-left" />
              <span className="text-white font-medium text-sm truncate">{selectedType.name}</span>
            </>
          ) : (
            <span className="text-white/40 text-sm">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-white/40 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
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
        <div className="absolute left-0 mt-1.5 w-full rounded-xl bg-[#0f172a]/95 border border-white/10 shadow-2xl z-50 max-h-60 overflow-y-auto backdrop-blur-md">
          <div className="py-1">
            {vehicleTypes.length === 0 ? (
              <div className="px-4 py-3 text-sm text-white/40 text-center">No vehicle types found.</div>
            ) : (
              vehicleTypes.map((t) => {
                const isSelected = t.id === value;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      onChange(t.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2 text-left text-sm transition-colors cursor-pointer hover:bg-white/5 ${
                      isSelected ? "bg-white/5" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <VehicleTypeIcon name={t.name} className="scale-90 origin-left" />
                      <span className={`font-medium text-white ${isSelected ? "text-brand-400 font-semibold" : ""}`}>
                        {t.name}
                      </span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-brand-400 shrink-0" />}
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
