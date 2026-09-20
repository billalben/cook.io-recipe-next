"use client";

import { useState, useRef, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionProps {
  label: string;
  children: ReactNode;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
}

export function Accordion({
  label,
  children,
  expanded,
  defaultExpanded = false,
  onToggle,
}: AccordionProps) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isControlled = expanded !== undefined;
  const isExpanded = isControlled ? expanded : internalExpanded;
  const contentRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    if (isControlled) {
      onToggle?.(!isExpanded);
    } else {
      setInternalExpanded((prev) => !prev);
    }
  };

  return (
    <div className="border-b border-[var(--color-outline)]">
      <button
        onClick={handleToggle}
        aria-expanded={isExpanded}
        className="w-full flex items-center justify-between py-3 text-sm font-medium text-[var(--color-on-surface)] hover:text-primary transition-colors"
      >
        {label}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        ref={contentRef}
        className="grid transition-all duration-200"
        style={{
          gridTemplateRows: isExpanded ? "1fr" : "0fr",
        }}
      >
        <div className="overflow-hidden">
          <div className="pb-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
