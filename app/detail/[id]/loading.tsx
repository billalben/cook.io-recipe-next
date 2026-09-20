const INGREDIENT_WIDTHS = [
  "w-full",
  "w-11/12",
  "w-10/12",
  "w-3/4",
  "w-full",
  "w-11/12",
  "w-2/3",
];

export default function DetailLoading() {
  return (
    <div
      className="mx-auto max-w-5xl"
      aria-busy="true"
      aria-label="Loading recipe"
    >
      <div className="skeleton rounded-none w-full max-h-100 aspect-4/3" />

      <div className="p-4 md:p-8">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="skeleton h-8 w-2/3 rounded-lg" />
          <div className="skeleton h-8 w-8 rounded-full" />
        </div>

        <div className="skeleton h-4 w-44 mb-6" />

        <div className="grid grid-cols-3 gap-4 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl p-4">
              <div className="skeleton h-7 w-12 mx-auto" />
              <div className="skeleton h-3 w-16 mx-auto mt-2" />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-7 w-20 rounded-full" />
          ))}
        </div>

        <div className="skeleton h-5 w-36 mb-4" />

        <ul className="space-y-2">
          {INGREDIENT_WIDTHS.map((width, i) => (
            <li key={i} className={`skeleton h-4 ${width}`} />
          ))}
        </ul>
      </div>
    </div>
  );
}
