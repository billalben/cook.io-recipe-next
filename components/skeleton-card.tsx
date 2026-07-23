export function SkeletonCard() {
  return (
    <div className="bg-[var(--color-surface)] rounded-xl overflow-hidden border border-[var(--color-outline)]">
      <div className="skeleton skeleton-card-banner" />
      <div className="p-3">
        <div className="skeleton skeleton-card-title" />
        <div className="skeleton skeleton-card-text" />
      </div>
    </div>
  );
}
