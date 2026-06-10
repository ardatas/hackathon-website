import type { ComponentProps } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-[#cf362d]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-[#e6ad0e]",
        outline: "border border-border bg-card text-foreground hover:bg-muted",
        ghost: "text-foreground hover:bg-muted",
        // Hover-fill ("flow") CTA: a brand pill where a contrasting circle
        // sweeps up from the corner on hover and inverts the label. Adapted
        // from the zinc/light-dark original to the dark, boxy, TBC theme —
        // base primary (red) → secondary (yellow) fill, the two hero-gradient
        // anchors. Borderless so the colour change covers edge-to-edge. Needs
        // overflow-hidden to clip the circle, so don't pair it with
        // overflow-visible. transition-all overrides the base
        // transition-colors via tailwind-merge. Durations are 20% faster than
        // the original (500/1000ms -> 400/800ms).
        flow: cn(
          "relative z-0 overflow-hidden bg-primary text-primary-foreground transition-all duration-400",
          "before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5] before:rounded-[100%] before:bg-secondary before:transition-transform before:duration-800 before:content-['']",
          "hover:scale-[1.03] hover:text-secondary-foreground hover:before:translate-x-0 hover:before:translate-y-0 active:scale-95",
        ),
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4",
        lg: "h-12 px-6",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
