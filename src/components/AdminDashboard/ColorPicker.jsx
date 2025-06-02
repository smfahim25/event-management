import { useState, useEffect, useRef } from "react";
import { HexColorPicker } from "react-colorful";

// Add this custom hook for detecting clicks outside the component
function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, handler]);
}

export default function ColorPickerInput({ color, onChange }) {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef();

  useClickOutside(pickerRef, () => {
    setShowPicker(false);
  });

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Basic validation for hex color
    if (/^#[0-9A-F]{6}$/i.test(value) || value === "") {
      onChange(value);
    }
  };

  return (
    <div className="relative" ref={pickerRef}>
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-md border border-gray-300 cursor-pointer"
          style={{ backgroundColor: color }}
          onClick={() => setShowPicker(!showPicker)}
        />
        <input
          type="text"
          value={color}
          onChange={handleInputChange}
          className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="#FFFFFF"
          maxLength={7}
        />
      </div>

      {showPicker && (
        <div className="absolute z-10 mt-2">
          <HexColorPicker
            color={color}
            onChange={(newColor) => {
              onChange(newColor);
            }}
          />
        </div>
      )}
    </div>
  );
}
