import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import debounce from "lodash/debounce";
import { FiMapPin } from "react-icons/fi";

function AutoSuggest({ label, value, onChange, token }) {
  const [suggestions, setSuggestions] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const suggestionListRef = useRef(null);

 
  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      if (query.length < 2) {
        setSuggestions([]);
        setFocusedIndex(-1);
        return;
      }

      try {
        const response = await axios.get(
          `https://flightbookings-backend.onrender.com/api/airports?keyword=${query}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuggestions(response.data);
        setFocusedIndex(-1);
      } catch (error) {
        console.error("Auto-suggest error:", error);
        setSuggestions([]);
      }
    }, 100),
    [token]
  );

  useEffect(() => {
    if (isFocused) {
      fetchSuggestions(value);
    }
    return () => fetchSuggestions.cancel();
  }, [value, isFocused, fetchSuggestions]);

 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionListRef.current &&
        !suggestionListRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setTimeout(() => {
          setSuggestions([]);
          setFocusedIndex(-1);
          setIsFocused(false);
        }, 50); 
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (suggestion) => {
    onChange(suggestion.iataCode);
    setSuggestions([]);
    setFocusedIndex(-1);
    setIsFocused(false);
    inputRef.current.blur();
  };

  const handleKeyDown = (e) => {
    if (!suggestions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[focusedIndex]);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-white focus-within:ring-2 focus-within:ring-blue-500 transition-all">
        <FiMapPin className="text-gray-500 mr-2" />
        <input
          ref={inputRef}
          type="text"
          placeholder={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          className="w-full focus:outline-none text-gray-700"
        />
      </div>
      {suggestions.length > 0 && isFocused && (
        <motion.ul
          ref={suggestionListRef}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute z-20 bg-white border border-gray-200 rounded-lg mt-1 w-full max-h-48 overflow-y-auto shadow-lg"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.iataCode}
              onClick={() => handleSelect(suggestion)}
              onMouseEnter={() => setFocusedIndex(index)}
              className={`p-3 hover:bg-blue-50 cursor-pointer flex items-center ${
                index === focusedIndex ? "bg-blue-50" : ""
              }`}
            >
              <FiMapPin className="text-gray-500 mr-2" />
              <div>
                <p className="font-medium text-gray-800">{suggestion.name} ({suggestion.iataCode})</p>
                <p className="text-sm text-gray-500">{suggestion.city}</p>
              </div>
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  );
}

export default AutoSuggest;