import { HeroSearch } from "@/components/hero-search";
import { MealTabs } from "@/components/meal-tabs";
import { CuisineSliders } from "@/components/cuisine-slider";
import { HealthTags } from "@/components/health-tags";

export default function HomePage() {
  return (
    <>
      <HeroSearch />
      <MealTabs />
      <CuisineSliders />
      <HealthTags />
    </>
  );
}
