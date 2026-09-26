"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

function SteamWisp({ className }: { className: string }) {
  return (
    <svg className={`hero-steam ${className}`} viewBox="0 0 60 200" aria-hidden="true">
      <path d="M30 200 C10 170 50 150 30 120 C10 90 50 70 30 40 C15 20 30 10 30 0" />
    </svg>
  );
}

const CITRUS_SPOKES: [number, number, number, number][] = [
  [50, 12, 50, 88],
  [12, 50, 88, 50],
  [21, 21, 79, 79],
  [79, 21, 21, 79],
];

function CitrusSlice({ className, spokes = 4 }: { className: string; spokes?: number }) {
  return (
    <svg className={`hero-citrus ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill="#f2a34d" stroke="#d97b2b" strokeWidth="3" />
      <circle cx="50" cy="50" r="38" fill="#f7c477" />
      <g stroke="#f2a34d" strokeWidth="2">
        {CITRUS_SPOKES.slice(0, spokes).map(([x1, y1, x2, y2]) => (
          <line key={`${x1}-${y1}-${x2}-${y2}`} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>
    </svg>
  );
}

function HerbLeaf({ className }: { className: string }) {
  return (
    <svg className={`hero-leaf ${className}`} viewBox="0 0 40 40" aria-hidden="true">
      <path d="M20 2 C36 10 36 30 20 38 C4 30 4 10 20 2 Z" fill="#7a9a4a" />
      <line x1="20" y1="4" x2="20" y2="36" stroke="#5c7a34" strokeWidth="1.5" />
    </svg>
  );
}

export function HeroSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/recipes?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <section className="hero-bg relative w-full overflow-hidden py-16 md:py-24">
      <div className="hero-glow" aria-hidden="true" />

      <SteamWisp className="hero-s1" />
      <SteamWisp className="hero-s2" />
      <SteamWisp className="hero-s3" />
      <SteamWisp className="hero-s4" />

      <CitrusSlice className="hero-c1" />
      <CitrusSlice className="hero-c2" />
      <CitrusSlice className="hero-c3" spokes={2} />
      <CitrusSlice className="hero-c4" spokes={3} />

      <HerbLeaf className="hero-l1" />
      <HerbLeaf className="hero-l2" />

      <div className="relative z-10 mx-auto max-w-2xl px-4 text-center">
        <h1 className="font-display text-3xl md:text-5xl text-white mb-4">
          Discover Delicious Recipes
        </h1>
        <p className="text-white/80 mb-8 text-base md:text-lg">
          Your desired dish? Search thousands of recipes.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex items-center bg-white rounded-full overflow-hidden shadow-lg"
        >
          <div className="flex-1 flex items-center px-5">
            <Search className="w-5 h-5 text-gray-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search recipes"
              placeholder="Search recipes..."
              className="w-full py-3.5 pl-3 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 bg-primary text-white text-sm font-medium hover:bg-orange-600 transition-colors shrink-0"
          >
            Search
          </button>
        </form>
      </div>
    </section>
  );
}
