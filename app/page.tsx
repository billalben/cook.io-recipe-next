import { Suspense } from "react";
import { HeroSearch } from "@/components/hero-search";
import { MealTabs } from "@/components/meal-tabs";
import { CuisineSliders } from "@/components/cuisine-slider";
import { HealthTags } from "@/components/health-tags";
import { SkeletonCard } from "@/components/skeleton-card";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <>
      <HeroSearch />
      <Suspense fallback={<MealTabsSkeleton />}>
        <MealTabs />
      </Suspense>
      <CuisineSliders />
      <HealthTags />
      <Footer />
    </>
  );
}

function MealTabsSkeleton() {
  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-24 rounded-full bg-(--color-outline-variant)"
            />
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
