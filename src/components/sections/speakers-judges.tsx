import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Person } from "@/types/content";

type SpeakersJudgesProps = {
  people: Person[];
  fallback: string;
  className?: string;
  limit?: number;
  showCta?: boolean;
};

export function SpeakersJudges({
  people,
  fallback,
  className,
  limit,
  showCta = false,
}: SpeakersJudgesProps) {
  const visiblePeople =
    typeof limit === "number" ? people.slice(0, limit) : people;

  if (visiblePeople.length === 0) {
    return (
      <div
        className={cn(
          "relative overflow-hidden border border-border bg-black/45 p-6 md:p-10",
          className,
        )}
      >
        <PixelBackdrop />
        <div className="relative z-10 max-w-2xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-tbc-yellow">
            Roster
          </p>
          <p className="mt-3 text-2xl font-semibold text-white md:text-3xl">
            {fallback}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <div className="speakers-field relative overflow-hidden border border-border bg-black/52 p-4 sm:p-5 md:p-6">
        <PixelBackdrop />
        <div className="relative z-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {visiblePeople.map((person, index) => (
            <PersonCard key={person.id} person={person} index={index} />
          ))}
        </div>
      </div>

      {showCta ? (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/speakers-and-judges"
            className={buttonVariants({ variant: "outline" })}
          >
            All Speakers & Judges
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function PersonCard({ person, index }: { person: Person; index: number }) {
  const rolloverSrc =
    person.thumbnailSrc && person.thumbnailSrc !== person.imageSrc
      ? person.thumbnailSrc
      : undefined;
  const categoryTone =
    person.category === "Judge"
      ? "text-tbc-yellow"
      : person.category === "Mentor"
        ? "text-[#ff7a62]"
        : "text-[var(--tbc-warm-white)]";

  return (
    <article
      className="speaker-card"
      style={{ "--speaker-delay": `${index * 35}ms` } as CSSProperties}
    >
      <div className="speaker-portrait-frame" aria-hidden="true">
        <div
          className={cn(
            "speaker-portrait",
            !rolloverSrc && "speaker-portrait--single",
          )}
        >
          <div className="speaker-portrait__glow" />
          {person.imageSrc ? (
            <>
              <Image
                src={person.imageSrc}
                alt=""
                fill
                sizes="(min-width: 1024px) 240px, (min-width: 640px) 30vw, 46vw"
                className="speaker-portrait__image speaker-portrait__image--base"
                loading="lazy"
              />
              {rolloverSrc ? (
                <Image
                  src={rolloverSrc}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 240px, (min-width: 640px) 30vw, 46vw"
                  className="speaker-portrait__image speaker-portrait__image--hover"
                  loading="eager"
                />
              ) : null}
            </>
          ) : (
            <div className="speaker-portrait__initials">
              {person.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 3)}
            </div>
          )}
          <div className="speaker-portrait__pixels" />
          <div className="speaker-portrait__shade" />
        </div>
      </div>

      <div className="speaker-card__text">
        <p
          className={cn(
            "font-mono text-[11px] uppercase tracking-[0.16em] sm:text-xs",
            categoryTone,
          )}
        >
          {person.category}
        </p>
        <h3>{person.name}</h3>
        <p>
          {person.role}
          {person.company ? `, ${person.company}` : ""}
        </p>
      </div>
    </article>
  );
}

function PixelBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 opacity-55"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
        backgroundSize: "34px 34px",
      }}
    />
  );
}
