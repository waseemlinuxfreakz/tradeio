import { useState, useEffect, useRef } from "react";

type TradingPair = {
  symbol: string;
  displaySymbol: string;
  name: string;
};

type Props = {
  tradingPairs: TradingPair[];
  selectedPair: string;
  setSelectedPair: (symbol: string) => void;
};

export default function SearchablePairSelector({
  tradingPairs,
  selectedPair,
  setSelectedPair,
}: Props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = tradingPairs.find((p) => p.symbol === selectedPair);
 const filteredPairs = searchTerm
    ? tradingPairs.filter(
        (pair) =>
          pair.displaySymbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pair.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : tradingPairs.slice(0, 10); 

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        // onClick={() => setShowDropdown(true)}
        onClick={() => setShowDropdown((prev) => !prev)}
        className="w-full flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold">{selected?.displaySymbol}</span>
          <span className="text-sm text-slate-400">{selected?.name}</span>
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${
            showDropdown ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {showDropdown && (
        <div className="absolute z-10 mt-2 w-full bg-slate-800 border border-slate-700 rounded-xl shadow-lg">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search pairs..."
            className="w-full p-3 bg-slate-700 text-white rounded-t-xl border-b border-slate-600 outline-none"
          />
          <div className="max-h-60 overflow-y-auto">
            {filteredPairs.length === 0 ? (
              <div className="p-4 text-sm text-slate-400">No results found.</div>
            ) : (
              filteredPairs.map((pair) => (
                <div
                  key={pair.symbol}
                  onClick={() => {
                    setSelectedPair(pair.symbol);
                    setSearchTerm("");
                    setShowDropdown(false);
                  }}
                  className={`p-4 cursor-pointer hover:bg-slate-700 ${
                    pair.symbol === selectedPair ? "bg-slate-700" : ""
                  }`}
                >
                  <div className="text-lg font-bold">{pair.displaySymbol}</div>
                  <div className="text-sm text-slate-400">{pair.name}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
