"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  children: ReactNode;
  ariaLabel?: string;
  className?: string;
}

const DRAG_THRESHOLD = 5;

export function Carousel({ children, ariaLabel, className }: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    startX: 0,
    startScroll: 0,
    moved: false,
    active: false,
  });
  const cleanupDragRef = useRef<(() => void) | null>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);

    const observer = new ResizeObserver(updateArrows);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
      observer.disconnect();
    };
  }, [updateArrows]);

  useEffect(() => {
    return () => cleanupDragRef.current?.();
  }, []);

  const scrollByCard = useCallback((direction: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;

    const item =
      el.querySelector<HTMLElement>("[data-carousel-item]") ??
      (el.firstElementChild as HTMLElement | null);
    const styles = window.getComputedStyle(el);
    const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
    const step = item ? item.offsetWidth + gap : el.clientWidth * 0.8;

    el.scrollBy({ left: direction * step, behavior: "smooth" });
  }, []);

  const handlePointerDown = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = scrollRef.current;
    if (!el) return;

    dragRef.current = {
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: false,
      active: true,
    };

    const handleMove = (event: globalThis.PointerEvent) => {
      const node = scrollRef.current;
      if (!node || !dragRef.current.active) return;
      const dx = event.clientX - dragRef.current.startX;

      if (!dragRef.current.moved && Math.abs(dx) > DRAG_THRESHOLD) {
        dragRef.current.moved = true;
        setIsDragging(true);
      }
      if (dragRef.current.moved) {
        node.scrollLeft = dragRef.current.startScroll - dx;
      }
    };

    const handleUp = () => {
      dragRef.current.active = false;
      setIsDragging(false);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
      cleanupDragRef.current = null;
      window.setTimeout(() => {
        dragRef.current.moved = false;
      }, 0);
    };

    cleanupDragRef.current = handleUp;
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);
  }, []);

  const handleClickCapture = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!dragRef.current.moved) return;
    e.preventDefault();
    e.stopPropagation();
    dragRef.current.moved = false;
  }, []);

  const handleDragStart = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  return (
    <div className={`group relative ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => scrollByCard(-1)}
        disabled={!canScrollLeft}
        aria-label="Scroll left"
        className="absolute -left-4 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-outline)] bg-[var(--color-surface)] text-[var(--color-on-surface)] shadow-lg transition duration-200 hover:scale-105 hover:bg-[var(--color-outline-variant)] hover:shadow-xl active:scale-95 disabled:pointer-events-none disabled:opacity-0 md:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div
        ref={scrollRef}
        role="region"
        aria-label={ariaLabel}
        onPointerDown={handlePointerDown}
        onClickCapture={handleClickCapture}
        onDragStart={handleDragStart}
        className={`no-scrollbar flex gap-4 overflow-x-auto px-2 pb-4 select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {children}
      </div>

      <button
        type="button"
        onClick={() => scrollByCard(1)}
        disabled={!canScrollRight}
        aria-label="Scroll right"
        className="absolute -right-4 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-outline)] bg-[var(--color-surface)] text-[var(--color-on-surface)] shadow-lg transition duration-200 hover:scale-105 hover:bg-[var(--color-outline-variant)] hover:shadow-xl active:scale-95 disabled:pointer-events-none disabled:opacity-0 md:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
