import { useState, useMemo, useEffect, useRef } from "react";
import { ChevronDown, Search, X } from "lucide-react";

const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  error = null,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter((option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
    setSearchTerm("");
  };

  const handleToggle = (e) => {
    // Check if the click target is the clear button or its child
    if (e.target.closest(".clear-button")) {
      return; // Don't toggle dropdown if clear button was clicked
    }
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const displayValue = value || placeholder;
  const hasValue = Boolean(value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* FIXED: Changed button to div to avoid nested button issue */}
      <div
        onClick={handleToggle}
        className={`w-full bg-white px-4 py-3 text-left rounded-lg border transition-colors cursor-pointer ${
          error ? "border-red-500" : "border-gray-300"
        } ${
          disabled
            ? "opacity-50 cursor-not-allowed bg-gray-50"
            : "hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent"
        } ${isOpen ? "ring-2 ring-[#E167FF] border-transparent" : ""}`}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle(e);
          }
        }}
      >
        <div className="flex items-center justify-between">
          <span className={hasValue ? "text-gray-900" : "text-gray-500"}>
            {displayValue}
          </span>
          <div className="flex items-center gap-1">
            {hasValue && !disabled && (
              // FIXED: Changed to div with button behavior instead of actual button
              <div
                onClick={handleClear}
                className="clear-button p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClear(e);
                  }
                }}
              >
                <X className="w-4 h-4 text-gray-400" />
              </div>
            )}
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-screen overflow-hidden">
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder={`Search ${placeholder.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent"
              />
            </div>
          </div>

          {/* Options list */}
          <div className="max-h-64 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                    value === option
                      ? "bg-[#E167FF] bg-opacity-10 text-[#E167FF]"
                      : "text-gray-900"
                  }`}
                >
                  {option}
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500 text-center">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
