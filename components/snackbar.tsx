"use client";

import { useEffect, useState, useCallback, useRef } from "react";

interface SnackbarMessage {
  id: number;
  text: string;
  state: "in" | "out";
}

let nextId = 0;

export function Snackbar() {
  const [messages, setMessages] = useState<SnackbarMessage[]>([]);
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const addMessage = useCallback((e: Event) => {
    const text = (e as CustomEvent<string>).detail;
    const id = nextId++;
    setMessages((prev) => [...prev, { id, text, state: "in" }]);

    const timer = setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, state: "out" } : m))
      );

      const removeTimer = setTimeout(() => {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }, 300);

      timersRef.current.set(id, removeTimer);
    }, 3000);

    timersRef.current.set(id, timer);
  }, []);

  useEffect(() => {
    window.addEventListener("snackbar", addMessage);
    const timers = timersRef.current;
    return () => {
      window.removeEventListener("snackbar", addMessage);
      for (const timer of timers.values()) {
        clearTimeout(timer);
      }
      timers.clear();
    };
  }, [addMessage]);

  if (messages.length === 0) return null;

  return (
    <div className="fixed bottom-[calc(var(--mobile-nav-height)+16px)] md:bottom-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 items-center">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`px-4 py-2.5 rounded-lg bg-[var(--color-on-surface)] text-[var(--color-surface)] text-sm font-medium shadow-lg ${
            msg.state === "in" ? "animate-snackbar-in" : "animate-snackbar-out"
          }`}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
}
