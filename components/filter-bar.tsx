"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
  return <FilterBarInner key={key} initialSearchParams={searchParams} />;
}
