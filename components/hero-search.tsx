"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

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
    <section className="relative w-full bg-gradient-to-br from-primary to-orange-700 py-16 md:py-24">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative mx-auto max-w-2xl px-4 text-center">
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
