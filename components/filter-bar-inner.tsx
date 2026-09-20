"use client";

import { useState, useMemo, useCallback, type FormEvent } from "react";
import { useRouter, type ReadonlyURLSearchParams } from "next/navigation";
import { Search, X, Filter } from "lucide-react";
import { Accordion } from "@/components/accordion";
import { FILTER_DATA } from "@/lib/filter-data";
import { isRadioFilterKey, normalizeFilterValue } from "@/lib/filter-validation";

interface FilterBarInnerProps {
  initialSearchParams: ReadonlyURLSearchParams;
  expandedSections: Set<string>;
  onToggleSection: (sectionKey: string) => void;
}

function parseCheckedValues(
  params: URLSearchParams
): Record<string, string[]> {
  const values: Record<string, string[]> = {};
  for (const [key, value] of params.entries()) {
    const canonical = normalizeFilterValue(key, value);
    if (!canonical) continue;
    const current = values[key];
    if (isRadioFilterKey(key) && current?.length) continue;
    if (current?.includes(canonical)) continue;
    values[key] = [...(current ?? []), canonical];
  }
  return values;
}

export function FilterBarInner({
  initialSearchParams,
  expandedSections,
  onToggleSection,
}: FilterBarInnerProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(initialSearchParams.get("q") ?? "");
  const [checkedValues, setCheckedValues] = useState<Record<string, string[]>>(
    () => parseCheckedValues(initialSearchParams)
  );

  const activeCount = useMemo(
    () => Object.values(checkedValues).reduce((sum, values) => sum + values.length, 0),
    [checkedValues]
  );

  const handleApply = useCallback(() => {
    const params = new URLSearchParams();
    if (searchValue.trim()) params.set("q", searchValue.trim());
    for (const [key, values] of Object.entries(checkedValues)) {
      for (const val of values) {
        params.append(key, val);
      }
    }
    const qs = params.toString();
    router.push(qs ? `/recipes?${qs}` : "/recipes");
    setIsOpen(false);
  }, [checkedValues, searchValue, router]);

  const handleClear = useCallback(() => {
    setSearchValue("");
    setCheckedValues({});
    router.push("/recipes");
  }, [router]);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleApply();
  };

  const handleCheck = (filterKey: string, value: string, isCheckbox: boolean) => {
    setCheckedValues((prev) => {
      const current = prev[filterKey] ?? [];
      const exists = current.includes(value);
      const updated = isCheckbox
        ? exists
          ? current.filter((v) => v !== value)
          : [...current, value]
        : [value];
      return { ...prev, [filterKey]: updated };
    });
  };

  const isChecked = (filterKey: string, value: string) => {
    return (checkedValues[filterKey] ?? []).includes(value);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-[calc(var(--mobile-nav-height)+16px)] right-4 z-30 md:hidden w-12 h-12 rounded-full bg-primary text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105 ${
          isOpen ? "scale-0" : "scale-100"
        }`}
        aria-label="Open filters"
      >
        <Filter className="w-5 h-5" />
        {activeCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-primary rounded-full text-xs font-bold flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      <aside
        className={`fixed top-0 right-0 z-50 h-full w-[min(100%,400px)] bg-[var(--color-surface)] border-l border-[var(--color-outline)] transform transition-transform duration-300 flex flex-col md:sticky md:top-[var(--header-height)] md:h-[calc(100vh-var(--header-height))] md:w-[300px] lg:w-[340px] md:translate-x-0 md:z-0 md:border-l-0 md:border-r ${
          isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-outline)]">
          <h3 className="font-medium text-[var(--color-on-surface)]">Filters</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--color-outline-variant)]"
          >
            <X className="w-5 h-5 text-[var(--color-on-surface)]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="flex items-center rounded-lg border border-[var(--color-outline)] overflow-hidden">
              <Search className="w-4 h-4 text-[var(--color-on-surface-variant)] ml-3" />
              <input
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search recipes..."
                className="flex-1 py-2.5 px-3 text-sm bg-transparent outline-none text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]"
              />
            </div>
          </form>

          {FILTER_DATA.map((section) => (
            <Accordion
              key={section.key}
              label={section.label}
              expanded={expandedSections.has(section.key)}
              onToggle={() => onToggleSection(section.key)}
            >
              <div className="space-y-1.5">
                {section.options.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-2.5 px-2 py-1.5 rounded cursor-pointer hover:bg-[var(--color-outline-variant)] transition-colors text-sm text-[var(--color-on-surface)] ${
                      isChecked(section.key, opt.value)
                        ? "text-primary"
                        : ""
                    }`}
                  >
                    <input
                      type={section.type}
                      name={section.key}
                      value={opt.value}
                      checked={isChecked(section.key, opt.value)}
                      onChange={() =>
                        handleCheck(
                          section.key,
                          opt.value,
                          section.type === "checkbox"
                        )
                      }
                      className="accent-[var(--color-primary)]"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </Accordion>
          ))}
        </div>

        <div className="flex gap-3 p-4 border-t border-[var(--color-outline)]">
          <button
            onClick={handleClear}
            className="flex-1 py-2.5 rounded-full border border-[var(--color-outline)] text-sm font-medium text-[var(--color-on-surface)] hover:bg-[var(--color-outline-variant)] transition-colors"
          >
            Clear
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            Apply
            {activeCount > 0 && (
              <span className="ml-1.5 text-xs">({activeCount})</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
