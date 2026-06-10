"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export interface Category {
  id: string | number;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  icon?: ReactNode;
  rightMark?: ReactNode;
  onClick?: () => void;
  featured?: boolean;
  active?: boolean;
}

export interface CategoryListProps {
  title?: string;
  subtitle?: string;
  categories: Category[];
  headerIcon?: ReactNode;
  className?: string;
  listClassName?: string;
  compact?: boolean;
}

export const CategoryList = ({
  title,
  subtitle,
  categories,
  headerIcon,
  className,
  listClassName,
  compact = false,
}: CategoryListProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | number | null>(null);

  return (
    <div className={cn("w-full text-foreground", className)}>
      <div className="mx-auto w-full max-w-5xl">
        {title || subtitle || headerIcon ? (
          <div className={cn("text-center", compact ? "mb-5" : "mb-8 md:mb-10")}>
            {headerIcon ? (
              <div className="mb-5 inline-flex size-14 items-center justify-center border border-tbc-yellow/30 bg-tbc-yellow/10 text-tbc-yellow">
                {headerIcon}
              </div>
            ) : null}
            {title ? (
              <h2
                className={cn(
                  "font-display font-semibold leading-tight tracking-normal text-white",
                  compact ? "text-2xl md:text-4xl" : "text-3xl md:text-5xl",
                )}
              >
                {title}
              </h2>
            ) : null}
            {subtitle ? (
              <p
                className={cn(
                  "mx-auto max-w-2xl text-muted-foreground",
                  compact ? "mt-3 text-sm" : "mt-4 text-base",
                )}
              >
                {subtitle}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className={cn(compact ? "space-y-4" : "space-y-4", listClassName)}>
          {categories.map((category) => {
            const highlighted =
              hoveredItem === category.id || Boolean(category.active);
            const rightMark = category.rightMark ?? category.icon;
            const rowClassName = cn(
              "relative flex w-full items-center justify-between overflow-hidden border bg-[#080808] px-6 py-5 text-left transition-all duration-300 ease-in-out md:px-8",
              category.onClick ? "cursor-pointer" : "cursor-default",
              highlighted
                ? cn(
                    "border-tbc-yellow/70 bg-[#11100d]",
                    compact ? "min-h-32" : "min-h-36",
                  )
                : cn(
                    "border-border hover:border-tbc-yellow/45 hover:bg-[#101010]",
                    compact ? "min-h-24" : "min-h-28",
                  ),
              category.active
                ? "outline outline-1 outline-offset-0 outline-tbc-yellow/50"
                : "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            );

            const rowContent = (
              <>
                {highlighted ? (
                  <>
                    <div className="absolute left-3 top-3 size-5">
                      <div className="absolute left-0 top-0 h-0.5 w-4 bg-tbc-yellow" />
                      <div className="absolute left-0 top-0 h-4 w-0.5 bg-tbc-yellow" />
                    </div>
                    <div className="absolute bottom-3 right-3 size-5">
                      <div className="absolute bottom-0 right-0 h-0.5 w-4 bg-tbc-yellow" />
                      <div className="absolute bottom-0 right-0 h-4 w-0.5 bg-tbc-yellow" />
                    </div>
                  </>
                ) : null}

                <div className="min-w-0 flex-1 pr-4">
                  {category.eyebrow ? (
                    <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-tbc-yellow/85">
                      {category.eyebrow}
                    </p>
                  ) : null}
                  <h3
                    className={cn(
                      "break-words font-display font-semibold leading-tight tracking-normal transition-colors duration-300",
                      category.featured
                        ? compact
                          ? "text-xl md:text-2xl"
                          : "text-2xl md:text-3xl"
                        : compact
                          ? "text-lg md:text-xl"
                          : "text-xl md:text-2xl",
                      highlighted ? "text-tbc-yellow" : "text-white",
                    )}
                  >
                    {category.title}
                  </h3>
                  {category.subtitle ? (
                    <p
                      className={cn(
                        "mt-2 max-w-2xl leading-relaxed transition-colors duration-300",
                        compact ? "text-sm" : "text-sm md:text-base",
                        highlighted ? "text-white/90" : "text-muted-foreground",
                      )}
                    >
                      {category.subtitle}
                    </p>
                  ) : null}
                </div>

                {rightMark ? (
                  <div
                    className={cn(
                      "flex size-14 shrink-0 translate-x-2 items-center justify-center border border-white/15 bg-[#050505] font-mono text-sm font-bold uppercase tracking-[0.08em] text-tbc-yellow opacity-0 transition-all duration-300 md:size-16 md:text-base",
                      highlighted
                        ? "translate-x-0 border-tbc-yellow/70 opacity-100"
                        : "group-hover:translate-x-0 group-hover:border-tbc-yellow/70 group-hover:opacity-100",
                    )}
                  >
                    <div className="flex items-center justify-center">
                      {rightMark}
                    </div>
                  </div>
                ) : null}
              </>
            );

            return (
              <div
                key={category.id}
                className="relative group"
                onMouseEnter={() => setHoveredItem(category.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {category.onClick ? (
                  <button
                    type="button"
                    className={rowClassName}
                    onClick={category.onClick}
                    onFocus={() => setHoveredItem(category.id)}
                    onBlur={() => setHoveredItem(null)}
                    aria-pressed={category.active}
                  >
                    {rowContent}
                  </button>
                ) : (
                  <div className={rowClassName}>{rowContent}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
