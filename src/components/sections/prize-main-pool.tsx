import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Trophy } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { prizeContent } from "@/content/prizes";
import { cn } from "@/lib/utils";
import type { PrizeTrack } from "@/types/content";

type PrizeMainPoolProps = {
  className?: string;
  compact?: boolean;
  constrained?: boolean;
  showFaqLink?: boolean;
  tracks?: PrizeTrack[];
};

export function PrizeMainPool({
  className,
  compact = false,
  constrained = true,
  showFaqLink = true,
  tracks = [],
}: PrizeMainPoolProps) {
  return (
    <div
      className={cn(constrained ? "mx-auto max-w-4xl" : "w-full", className)}
    >
      <div className="surface-panel prize-pool-field overflow-hidden">
        <div
          className={cn(
            "flex flex-col items-center justify-center text-center",
            compact ? "min-h-[300px] p-5 md:p-6" : "min-h-[420px] p-6 md:p-8",
          )}
        >
          <div
            className={cn(
              "inline-flex items-center justify-center border border-tbc-yellow/30 bg-tbc-yellow/10 text-tbc-yellow",
              compact ? "mb-4 size-11" : "mb-6 size-12",
            )}
          >
            <Trophy aria-hidden="true" size={22} />
          </div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-tbc-yellow">
            Total Prize Pool
          </p>
          <h2
            className={cn(
              "mt-3 font-display font-semibold leading-tight text-white",
              compact ? "text-3xl md:text-5xl" : "text-4xl md:text-6xl",
            )}
          >
            {prizeContent.mainPoolFallback}
          </h2>
          <p
            className={cn(
              "max-w-2xl text-sm leading-relaxed text-muted-foreground",
              compact ? "mt-4" : "mt-5 md:text-base",
            )}
          >
            Total pool numbers are hidden until confirmed. The final pool is the sum of all partner track prizes combined.
          </p>

          {/* Inline Partner Badge Chips (ETHGlobal style) */}
          {tracks.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 w-full max-w-2xl">
              {tracks.map((track, idx) => (
                <div
                  key={`${track.sponsor}-${idx}`}
                  className="flex items-center gap-2.5 border border-white/10 bg-white/[0.04] px-3 py-1.5 select-none"
                  style={{ borderRadius: "var(--radius)" }}
                >
                  {track.sponsorLogoSrc ? (
                    <div className="relative size-5 shrink-0">
                      <Image
                        src={track.sponsorLogoSrc}
                        alt={track.sponsor}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <span className="size-5 flex shrink-0 items-center justify-center bg-white/10 font-mono text-[9px] font-bold text-white">
                      {track.sponsor[0]}
                    </span>
                  )}
                  <div className="flex flex-col text-left leading-tight">
                    <span className="text-[10px] font-semibold text-white">
                      {track.sponsor}
                    </span>
                    <span className="text-[9px] text-white/50">
                      {track.amount ?? prizeContent.trackAmountFallback}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {showFaqLink ? (
        <div className="mt-5 flex justify-center">
          <Link
            href="/faq#judging-prizes"
            className={buttonVariants({ variant: "outline" })}
          >
            Judging FAQ
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
      ) : null}
    </div>
  );
}
