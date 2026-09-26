"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          background: "#ffffff",
          color: "#1a1a1a",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem", maxWidth: "28rem" }}>
          <h2 style={{ fontSize: "1.25rem", margin: "0 0 0.5rem" }}>
            Something went wrong
          </h2>
          <p style={{ color: "#4d4d4d", margin: "0 0 1.5rem", fontSize: "0.875rem" }}>
            An unexpected error occurred. Please try again.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              padding: "0.625rem 1.25rem",
              borderRadius: "9999px",
              border: "none",
              background: "hsl(11, 87%, 59%)",
              color: "#ffffff",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
