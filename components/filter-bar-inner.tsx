"use client";

import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
  useId,
  type FormEvent,
  type MouseEvent,
} from "react";
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

interface FilterPanelBodyProps {
  headingId: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: FormEvent) => void;
  checkedValues: Record<string, string[]>;
  onCheck: (filterKey: string, value: string, isCheckbox: boolean) => void;
  expandedSections: Set<string>;
  onToggleSection: (sectionKey: string) => void;
  activeCount: number;
  onClear: () => void;
  onApply: () => void;
  onClose?: () => void;
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

function FilterPanelBody({
  headingId,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  checkedValues,
  onCheck,
  expandedSections,
  onToggleSection,
  activeCount,
  onClear,
  onApply,
  onClose,
}: FilterPanelBodyProps) {
  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between p-4 border-b border-outline">
        <h3 id={headingId} className="font-medium text-on-surface">
          Filters
        </h3>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-outline-variant"
          >
            <X className="w-5 h-5 text-on-surface" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <form onSubmit={onSearchSubmit} className="mb-4">
          <div className="flex items-center rounded-lg border border-outline overflow-hidden">
            <Search className="w-4 h-4 text-on-surface-variant ml-3" />
            <input
              type="search"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search recipes"
              placeholder="Search recipes..."
              className="flex-1 py-2.5 px-3 text-sm bg-transparent outline-none text-on-surface placeholder:text-on-surface-variant"
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
              {section.options.map((opt) => {
                const checked = (checkedValues[section.key] ?? []).includes(
                  opt.value
                );
                return (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-2.5 px-2 py-1.5 rounded cursor-pointer hover:bg-outline-variant transition-colors text-sm text-on-surface ${
                      checked ? "text-primary" : ""
                    }`}
                  >
                    <input
                      type={section.type}
                      name={section.key}
                      value={opt.value}
                      checked={checked}
                      onChange={() =>
                        onCheck(section.key, opt.value, section.type === "checkbox")
                      }
                      className="accent-primary"
                    />
                    {opt.label}
                  </label>
                );
              })}
            </div>
          </Accordion>
        ))}
      </div>

      <div className="flex gap-3 p-4 border-t border-outline">
        <button
          type="button"
          onClick={onClear}
          className="flex-1 py-2.5 rounded-full border border-outline text-sm font-medium text-on-surface hover:bg-outline-variant transition-colors"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={onApply}
          className="flex-1 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-orange-600 transition-colors"
        >
          Apply
          {activeCount > 0 && <span className="ml-1.5 text-xs">({activeCount})</span>}
        </button>
      </div>
    </div>
  );
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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

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

  const handleCheck = useCallback(
    (filterKey: string, value: string, isCheckbox: boolean) => {
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
    },
    []
  );

  const handleBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) setIsOpen(false);
  };

  const panelProps = {
    headingId,
    searchValue,
    onSearchChange: setSearchValue,
    onSearchSubmit: handleSearchSubmit,
    checkedValues,
    onCheck: handleCheck,
    expandedSections,
    onToggleSection,
    activeCount,
    onClear: handleClear,
    onApply: handleApply,
  };

  return (
    <>
      <button
        type="button"
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

      <aside className="hidden md:flex md:sticky md:top-[var(--header-height)] md:h-[calc(100vh-var(--header-height))] md:w-[300px] lg:w-[340px] shrink-0 flex-col border-r border-outline bg-surface">
        <FilterPanelBody {...panelProps} />
      </aside>

      <dialog
        ref={dialogRef}
        aria-labelledby={headingId}
        onClose={() => setIsOpen(false)}
        onClick={handleBackdropClick}
        className="m-0 ml-auto h-full max-h-none w-[min(100%,400px)] max-w-none border-y-0 border-r-0 border-l border-outline bg-surface p-0 open:flex flex-col md:hidden"
      >
        <FilterPanelBody {...panelProps} onClose={() => setIsOpen(false)} />
      </dialog>
    </>
  );
}
