import Image from "next/image";
import { PlusIcon } from "lucide-react";

import type { Sponsor } from "@/types/content";
import { cn } from "@/lib/utils";

type LogoCloudProps = React.ComponentProps<"div"> & {
  logos: Sponsor[];
  fallback: string;
  compact?: boolean;
  label?: string;
};

export function LogoCloud({
  logos,
  fallback,
  compact = false,
  label = "Partners",
  className,
  ...props
}: LogoCloudProps) {
  const visibleLogos = compact ? logos.slice(0, 4) : logos;
  const slotCount = compact ? 4 : 8;
  const slots = visibleLogos.length
    ? visibleLogos
    : Array.from({ length: slotCount }, (_, index) => ({
        name: index === 0 ? fallback : "Announcement pending",
        tier: "Partner" as const,
        href: "",
      }));

  return (
    <div className={cn("relative", className)} {...props}>
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-tbc-yellow">
          {label}
        </p>
        {!visibleLogos.length ? (
          <p className="text-xs text-muted-foreground">{fallback}</p>
        ) : null}
      </div>
      <div
        className={cn(
          "relative grid grid-cols-2 overflow-hidden border-x border-border bg-black/20 md:grid-cols-4",
          compact ? "rounded-md" : "rounded-lg",
        )}
      >
        <div className="pointer-events-none absolute -top-px left-1/2 w-screen -translate-x-1/2 border-t border-border" />

        {slots.map((logo, index) => (
          <LogoCard
            key={`${logo.name}-${index}`}
            logo={logo}
            placeholder={!visibleLogos.length}
            className={cn(
              "border-b border-border",
              index % 2 === 0 ? "border-r" : "",
              index % 4 !== 3 ? "md:border-r" : "md:border-r-0",
              index >= slotCount - 4 ? "md:border-b-0" : "",
              index === 0 || index === 2 || index === 7
                ? "bg-white/[0.065]"
                : "bg-black/20",
            )}
          >
            {(index === 0 || index === 2 || index === 4) && (
              <PlusIcon
                className="-bottom-[12.5px] -right-[12.5px] absolute z-10 size-6 text-border"
                strokeWidth={1}
              />
            )}
          </LogoCard>
        ))}

        <div className="pointer-events-none absolute -bottom-px left-1/2 w-screen -translate-x-1/2 border-b border-border" />
      </div>
    </div>
  );
}

type LogoCardProps = React.ComponentProps<"div"> & {
  logo: Pick<Sponsor, "name" | "href" | "logoSrc" | "logoTreatment">;
  placeholder: boolean;
};

function LogoCard({
  logo,
  placeholder,
  className,
  children,
  ...props
}: LogoCardProps) {
  const logoPanel = logo.logoSrc ? (
    <span className="relative flex size-full items-center justify-center bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.25)] md:p-6">
      <Image
        alt={`${logo.name} logo`}
        className={cn(
          "pointer-events-none select-none object-contain p-5 md:p-6",
          logo.logoTreatment === "dark-mark" ? "brightness-0" : "",
        )}
        fill
        loading="lazy"
        sizes="(min-width: 768px) 25vw, 50vw"
        src={logo.logoSrc}
      />
    </span>
  ) : null;

  const cardContent = logoPanel ?? (
    <span
      className={cn(
        "max-w-[12rem] text-center font-mono text-xs font-semibold uppercase tracking-[0.12em]",
        placeholder ? "text-muted-foreground" : "text-foreground",
      )}
    >
      {logo.name}
    </span>
  );

  return (
    <div
      className={cn(
        "relative flex min-h-28 items-center justify-center px-4 py-8 md:min-h-32 md:p-8",
        logoPanel ? "p-0 md:p-0" : "",
        className,
      )}
      {...props}
    >
      {logo.href ? (
        <a
          href={logo.href}
          target="_blank"
          rel="noreferrer"
          className={cn(
            "inline-flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
            logoPanel ? "absolute inset-0" : "size-full",
          )}
        >
          {cardContent}
        </a>
      ) : logoPanel ? (
        <div className="absolute inset-0">{cardContent}</div>
      ) : (
        cardContent
      )}
      {children}
    </div>
  );
}
