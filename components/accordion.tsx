"use client";

import { useState, useRef, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionProps {
  label: string;
  children: ReactNode;
  defaultExpanded?: boolean;
}

export function Accordion({
  label,
  children,
  defaultExpanded = false,
}: AccordionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border-b border-[var(--color-outline)]">
      <button
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        className="w-full flex items-center justify-between py-3 text-sm font-medium text-[var(--color-on-surface)] hover:text-primary transition-colors"
      >
        {label}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        ref={contentRef}
        className="grid transition-all duration-200"
        style={{
          gridTemplateRows: expanded ? "1fr" : "0fr",
        }}
      >
        <div className="overflow-hidden">
          <div className="pb-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
