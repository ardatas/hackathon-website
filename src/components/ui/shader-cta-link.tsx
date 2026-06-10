"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ComponentProps } from "react";

import { buttonVariants } from "@/components/ui/button";
import {
  defaultHeroLogoShaderSettings,
  ShaderSweepCanvas,
  type HeroLogoShaderSettings,
  type ShaderPalette,
} from "@/components/ui/hero-logo-shader";
import { cn } from "@/lib/utils";

type ShaderCtaLinkProps = ComponentProps<typeof Link> & {
  shaderColors?: ShaderPalette;
  hoverShaderSettings?: HeroLogoShaderSettings;
  shaderSettings?: HeroLogoShaderSettings;
  size?: "default" | "sm" | "lg";
};

const defaultCtaShaderColors: ShaderPalette = ["#ffc110", "#ff6f1a", "#6f3de2"];
const ctaShaderBurstMs = 760;
const defaultCtaHoverShaderSettings: HeroLogoShaderSettings = {
  ...defaultHeroLogoShaderSettings,
  speed: 1.35,
  lineWidth: 0.003,
  spacing: 0.09,
  intensity: 1.25,
  zoom: 0.78,
};

export function ShaderCtaLink({
  children,
  className,
  onBlur,
  onFocus,
  onPointerEnter,
  onPointerLeave,
  shaderColors = defaultCtaShaderColors,
  hoverShaderSettings = defaultCtaHoverShaderSettings,
  shaderSettings = defaultHeroLogoShaderSettings,
  size = "default",
  ...props
}: ShaderCtaLinkProps) {
  const [hasActivated, setHasActivated] = useState(false);
  const [isBursting, setIsBursting] = useState(false);
  const [playbackKey, setPlaybackKey] = useState(0);
  const burstTimeoutRef = useRef<number | null>(null);
  const activeSettings = isBursting ? hoverShaderSettings : shaderSettings;

  const clearBurstTimeout = () => {
    if (burstTimeoutRef.current === null) return;

    window.clearTimeout(burstTimeoutRef.current);
    burstTimeoutRef.current = null;
  };

  const startShaderBurst = () => {
    clearBurstTimeout();
    // Create the WebGL canvas on first interaction, then keep it mounted and
    // pause/resume the render loop for later bursts instead of disposing and
    // recreating the GL context on every hover.
    setHasActivated(true);
    setPlaybackKey((currentKey) => currentKey + 1);
    setIsBursting(true);
    burstTimeoutRef.current = window.setTimeout(() => {
      setIsBursting(false);
      burstTimeoutRef.current = null;
    }, ctaShaderBurstMs);
  };

  const stopShaderBurst = () => {
    clearBurstTimeout();
    setIsBursting(false);
  };

  useEffect(() => {
    return () => {
      if (burstTimeoutRef.current === null) return;

      window.clearTimeout(burstTimeoutRef.current);
    };
  }, []);

  return (
    <Link
      {...props}
      className={cn(
        buttonVariants({ variant: "flow", size }),
        "group isolate shadow-[0_0_36px_rgba(244,67,54,0.22)]",
        className,
      )}
      onBlur={(event) => {
        stopShaderBurst();
        onBlur?.(event);
      }}
      onFocus={(event) => {
        startShaderBurst();
        onFocus?.(event);
      }}
      onPointerEnter={(event) => {
        startShaderBurst();
        onPointerEnter?.(event);
      }}
      onPointerLeave={(event) => {
        stopShaderBurst();
        onPointerLeave?.(event);
      }}
    >
      {hasActivated ? (
        <ShaderSweepCanvas
          active={isBursting}
          colors={shaderColors}
          deferUntilIdle={false}
          direction="from-bottom-right"
          playbackKey={playbackKey}
          settings={activeSettings}
          className={cn(
            "pointer-events-none z-0 mix-blend-screen transition-opacity duration-150",
            isBursting ? "opacity-90" : "opacity-0",
          )}
        />
      ) : null}
      <span className="relative z-10 inline-flex items-center justify-center gap-2">
        {children}
      </span>
    </Link>
  );
}
