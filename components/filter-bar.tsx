"use client";

import { Suspense, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { FILTER_DATA } from "@/lib/filter-data";
import { FilterBarInner } from "./filter-bar-inner";

export function FilterBar() {
  return (
    <Suspense fallback={<FilterBarShell />}>
      <FilterBarWithParams />
    </Suspense>
  );
}

function FilterBarShell() {
  return (
    <aside className="hidden md:block w-[300px] lg:w-[340px] shrink-0 border-r border-[var(--color-outline)] md:min-h-[calc(100vh-var(--header-height))]" />
  );
}

function FilterBarWithParams() {
  const searchParams = useSearchParams();
  const key = searchParams.toString();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    for (const section of FILTER_DATA) {
      if (searchParams.has(section.key)) initial.add(section.key);
    }
    return initial;
  });

  const handleToggleSection = useCallback((sectionKey: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionKey)) {
        next.delete(sectionKey);
      } else {
        next.add(sectionKey);
      }
      return next;
    });
  }, []);

  return (
    <FilterBarInner
      key={key}
      initialSearchParams={searchParams}
      expandedSections={expandedSections}
      onToggleSection={handleToggleSection}
    />
  );
}
