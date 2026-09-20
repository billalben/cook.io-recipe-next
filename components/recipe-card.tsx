import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { SaveButton } from "@/components/save-button";
import { getTime, extractRecipeId } from "@/lib/utils";

interface RecipeCardProps {
  title: string;
  image: string;
  cookingTime: number;
  uri: string;
  index?: number;
}

export function RecipeCard({
  title,
  image,
  cookingTime,
  uri,
  index = 0,
}: RecipeCardProps) {
  const recipeId = extractRecipeId(uri);
  const { time, timeUnit } = getTime(cookingTime);

  return (
    <div
      className="card flex flex-col h-full bg-[var(--color-surface)] rounded-xl overflow-hidden border border-[var(--color-outline)] transition-shadow hover:shadow-lg animate-fade-in"
      style={{ animationDelay: `${100 * index}ms` }}
    >
      <Link
        href={`/detail/${recipeId}`}
        className="relative block grow aspect-square min-h-0 overflow-hidden"
      >
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 16vw"
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </Link>

      <div className="p-3 flex flex-col shrink-0">
        <h3 className="text-sm font-medium leading-snug line-clamp-2 mb-2 min-h-10">
          <Link
            href={`/detail/${recipeId}`}
            className="text-[var(--color-on-surface)] hover:text-primary transition-colors"
          >
            {title ?? "Untitled"}
          </Link>
        </h3>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-[var(--color-on-surface-variant)]">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {time || "<1"} {timeUnit}
            </span>
          </div>
          <SaveButton recipeId={recipeId} />
        </div>
      </div>
    </div>
  );
}
