export function Footer() {
  return (
    <footer className="mt-auto py-6 border-t border-[var(--color-outline)] bg-[var(--color-surface)]">
      <div className="mx-auto max-w-7xl px-4 flex flex-col items-center gap-2 text-sm text-[var(--color-on-surface-variant)]">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-display text-primary">Cook.io</span>. Built by
          Billal Ben.
        </p>
        <a
          href="https://www.edamam.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          Powered by Edamam
        </a>
      </div>
    </footer>
  );
}
