import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type DottedSurfaceProps = ComponentProps<"div">;

export function DottedSurface({
  className,
  style,
  ...props
}: DottedSurfaceProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-90",
        className,
      )}
      style={{
        backgroundImage:
          "radial-gradient(circle at 18% 0%, rgba(255,193,16,0.16), transparent 34rem), radial-gradient(circle at 86% 12%, rgba(111,61,226,0.16), transparent 32rem), radial-gradient(circle, rgba(255,193,16,0.34) 1px, transparent 1.8px), radial-gradient(circle, rgba(244,67,54,0.24) 1px, transparent 1.7px)",
        backgroundPosition: "center, center, 0 0, 42px 21px",
        backgroundSize: "auto, auto, 84px 42px, 84px 42px",
        maskImage:
          "linear-gradient(180deg, transparent 0%, black 12%, black 84%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(180deg, transparent 0%, black 12%, black 84%, transparent 100%)",
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
}
