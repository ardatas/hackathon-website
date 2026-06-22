"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef } from "react";

import { cn } from "@/lib/utils";

const LOGO_URL = "/hero-shader/hero-composite-mask.svg";
const TOP_MASK_URL = "/hero-shader/hero-composite-mask-top.png";
const BOTTOM_MASK_URL = "/hero-shader/hero-composite-mask-bottom.png";

export type HeroLogoShaderSettings = {
  speed: number;
  lineWidth: number;
  spacing: number;
  intensity: number;
  zoom: number;
};

export type ShaderPalette = [string, string, string];
export type ShaderSweepDirection =
  | "radial"
  | "from-bottom-right"
  | "from-bottom-left";

type Rgb = [number, number, number];

type UniformState = {
  time: number;
  resolution: [number, number];
  colorA: Rgb;
  colorB: Rgb;
  colorC: Rgb;
  speed: number;
  lineWidth: number;
  spacing: number;
  intensity: number;
  zoom: number;
  sweepOriginAnchor: [number, number];
  sweepAxis: [number, number];
  directionalStrength: number;
};

type SweepDirectionConfig = {
  originAnchor: [number, number];
  axis: [number, number];
  strength: number;
};

const TOP_LAYER_COLORS: ShaderPalette = ["#f44336", "#d32f2f", "#e57373"];
const BOTTOM_LAYER_COLORS: ShaderPalette = ["#ffcdd2", "#ef9a9a", "#f44336"];

// Replicates THREE.Color's sRGB-hex -> linear conversion (color management is
// on by default in three), so this raw-WebGL renderer feeds the shader the same
// linear color values the Three.js version did and looks identical.
function hexToLinearRgb(hex: string): Rgb {
  const normalized = hex.replace("#", "");
  const toLinear = (channel: number) =>
    channel <= 0.04045
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);

  return [
    toLinear(parseInt(normalized.slice(0, 2), 16) / 255),
    toLinear(parseInt(normalized.slice(2, 4), 16) / 255),
    toLinear(parseInt(normalized.slice(4, 6), 16) / 255),
  ];
}

export const defaultHeroLogoShaderSettings: HeroLogoShaderSettings = {
  speed: 0.32,
  lineWidth: 0.0024,
  spacing: 0.13,
  intensity: 0.95,
  zoom: 0.85,
};

type HeroLogoShaderProps = {
  className?: string;
  priority?: boolean;
  settings?: HeroLogoShaderSettings;
  sizes?: string;
};

export function HeroLogoShader({
  className,
  priority = false,
  settings = defaultHeroLogoShaderSettings,
  sizes = "(min-width: 1024px) 760px, calc(100vw - 32px)",
}: HeroLogoShaderProps) {
  return (
    <div
      className={cn(
        "pointer-events-none relative flex aspect-[875/495] w-full min-w-0 items-center justify-center",
        className,
      )}
      role="img"
      aria-label="TUM Blockchain Hackathon"
    >
      <div className="relative h-full w-full overflow-hidden drop-shadow-[0_24px_80px_rgba(244,67,54,0.24)]">
        <Image
          src={LOGO_URL}
          alt=""
          fill
          fetchPriority={priority ? "high" : undefined}
          loading={priority ? "eager" : "lazy"}
          preload={priority}
          sizes={sizes}
          className="object-contain"
        />
        {/* Shader layers disabled — flip SHADER_LAYERS_ENABLED to re-enable */}
        {SHADER_LAYERS_ENABLED ? (
          <>
            <MaskedShaderLayer
              maskUrl={TOP_MASK_URL}
              settings={settings}
              colors={TOP_LAYER_COLORS}
              opacityClassName="opacity-50"
            />
            <MaskedShaderLayer
              maskUrl={BOTTOM_MASK_URL}
              settings={settings}
              colors={BOTTOM_LAYER_COLORS}
              opacityClassName="opacity-35"
            />
          </>
        ) : null}
      </div>
    </div>
  );
}

// Hero sweep layers are currently off; the CTA still uses ShaderSweepCanvas.
const SHADER_LAYERS_ENABLED = false;

function MaskedShaderLayer({
  maskUrl,
  settings,
  colors,
  opacityClassName,
}: {
  maskUrl: string;
  settings: HeroLogoShaderSettings;
  colors: [string, string, string];
  opacityClassName: string;
}) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0", opacityClassName)}
      style={{
        maskImage: `url(${maskUrl})`,
        WebkitMaskImage: `url(${maskUrl})`,
        maskPosition: "center",
        WebkitMaskPosition: "center",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskSize: "contain",
        WebkitMaskSize: "contain",
      }}
      aria-hidden="true"
    >
      <ShaderCanvas colors={colors} settings={settings} />
    </div>
  );
}

function ShaderCanvas({
  className,
  colors,
  settings,
}: {
  className?: string;
  colors: ShaderPalette;
  settings: HeroLogoShaderSettings;
}) {
  return (
    <ShaderSweepCanvas
      className={className}
      colors={colors}
      settings={settings}
      direction="from-bottom-left"
    />
  );
}

export function ShaderSweepCanvas({
  active = true,
  className,
  colors,
  deferUntilIdle = true,
  direction = "radial",
  enabled = true,
  playbackKey = 0,
  settings = defaultHeroLogoShaderSettings,
}: {
  active?: boolean;
  className?: string;
  colors: ShaderPalette;
  deferUntilIdle?: boolean;
  direction?: ShaderSweepDirection;
  enabled?: boolean;
  playbackKey?: number;
  settings?: HeroLogoShaderSettings;
}) {
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const uniformsRef = useRef<UniformState | null>(null);
  const colorsRef = useRef(colors);
  const directionRef = useRef(direction);
  const playbackKeyRef = useRef(playbackKey);
  const settingsRef = useRef(settings);
  const activeRef = useRef(active);
  const resumeLoopRef = useRef<(() => void) | null>(null);

  useLayoutEffect(() => {
    colorsRef.current = colors;
    directionRef.current = direction;
    playbackKeyRef.current = playbackKey;
    settingsRef.current = settings;
  }, [colors, direction, playbackKey, settings]);

  useEffect(() => {
    if (!enabled) {
      uniformsRef.current = null;
      return;
    }

    let disposed = false;
    let cleanupShader: (() => void) | undefined;
    let idleCallbackId: number | undefined;
    let timeoutId: number | undefined;

    const setupShader = () => {
      const canvasHost = canvasHostRef.current;
      if (!canvasHost) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      if (disposed || !canvasHost.isConnected) return;

      const vertexShader = `
      attribute vec2 position;

      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

      const fragmentShader = `
      precision highp float;

      uniform vec2 resolution;
      uniform vec3 colorA;
      uniform vec3 colorB;
      uniform vec3 colorC;
      uniform float time;
      uniform float speed;
      uniform float lineWidth;
      uniform float spacing;
      uniform float intensity;
      uniform float zoom;
      uniform vec2 sweepOriginAnchor;
      uniform vec2 sweepAxis;
      uniform float directionalStrength;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        uv *= zoom;
        vec2 extent = resolution.xy / min(resolution.x, resolution.y) * zoom;
        vec2 origin = sweepOriginAnchor * extent;
        vec2 axis = normalize(sweepAxis);
        vec2 stripeAxis = normalize(vec2(-axis.y, axis.x));

        float t = time * speed;
        float bandSpacing = max(spacing, 0.035);
        float width = max(lineWidth, 0.0008);

        vec2 cornerA = vec2(-extent.x, -extent.y);
        vec2 cornerB = vec2(extent.x, -extent.y);
        vec2 cornerC = vec2(-extent.x, extent.y);
        vec2 cornerD = vec2(extent.x, extent.y);
        float projectionA = dot(cornerA - origin, axis);
        float projectionB = dot(cornerB - origin, axis);
        float projectionC = dot(cornerC - origin, axis);
        float projectionD = dot(cornerD - origin, axis);
        float minProjection = min(min(projectionA, projectionB), min(projectionC, projectionD));
        float maxProjection = max(max(projectionA, projectionB), max(projectionC, projectionD));
        float projectedSweep = dot(uv - origin, axis);
        float directedProgress = (projectedSweep - minProjection) / max(maxProjection - minProjection, 0.001) * 4.8;
        float sweepProgress = mix(length(uv), directedProgress, directionalStrength);
        float stripeCoordinate = mix(uv.x + uv.y, dot(uv, stripeAxis), directionalStrength);

        vec3 waves = vec3(0.0);
        for (int j = 0; j < 3; j++) {
          for (int i = 0; i < 5; i++) {
            float fi = float(i + 1);
            float phase = fract(t - 0.014 * float(j) + fi * 0.018) * 4.8;
            float diagonal = mod(stripeCoordinate, bandSpacing);
            float ridge = abs(phase - sweepProgress + diagonal);
            waves[j] += width * fi * fi / max(ridge, 0.003);
          }
        }

        vec3 color = waves.r * colorA + waves.g * colorB + waves.b * colorC;
        float energy = max(max(waves.r, waves.g), waves.b);
        float alpha = clamp(energy * intensity * 0.72, 0.0, 0.92);

        gl_FragColor = vec4(color * intensity, alpha);
      }
    `;

      const initialDirection = getSweepDirectionConfig(directionRef.current);
      const initialSettings = settingsRef.current;
      const [hexA, hexB, hexC] = colorsRef.current;

      const canvas = document.createElement("canvas");
      const contextAttributes: WebGLContextAttributes = {
        alpha: true,
        antialias: true,
        premultipliedAlpha: true,
      };
      const gl =
        canvas.getContext("webgl", contextAttributes) ??
        (canvas.getContext(
          "experimental-webgl",
          contextAttributes,
        ) as WebGLRenderingContext | null);

      if (!gl) {
        uniformsRef.current = null;
        return;
      }

      const compileShader = (type: number, source: string) => {
        const shader = gl.createShader(type);
        if (!shader) return null;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          gl.deleteShader(shader);
          return null;
        }
        return shader;
      };

      const vertex = compileShader(gl.VERTEX_SHADER, vertexShader);
      const fragment = compileShader(gl.FRAGMENT_SHADER, fragmentShader);
      const program = vertex && fragment ? gl.createProgram() : null;

      if (!vertex || !fragment || !program) {
        uniformsRef.current = null;
        return;
      }

      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.deleteProgram(program);
        uniformsRef.current = null;
        return;
      }

      gl.useProgram(program);

      // Fullscreen triangle — the fragment shader works in window space, so one
      // oversized triangle covering the clip volume is all the geometry needed.
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW,
      );
      const positionLocation = gl.getAttribLocation(program, "position");
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      const locations = {
        time: gl.getUniformLocation(program, "time"),
        resolution: gl.getUniformLocation(program, "resolution"),
        colorA: gl.getUniformLocation(program, "colorA"),
        colorB: gl.getUniformLocation(program, "colorB"),
        colorC: gl.getUniformLocation(program, "colorC"),
        speed: gl.getUniformLocation(program, "speed"),
        lineWidth: gl.getUniformLocation(program, "lineWidth"),
        spacing: gl.getUniformLocation(program, "spacing"),
        intensity: gl.getUniformLocation(program, "intensity"),
        zoom: gl.getUniformLocation(program, "zoom"),
        sweepOriginAnchor: gl.getUniformLocation(program, "sweepOriginAnchor"),
        sweepAxis: gl.getUniformLocation(program, "sweepAxis"),
        directionalStrength: gl.getUniformLocation(
          program,
          "directionalStrength",
        ),
      };

      gl.disable(gl.DEPTH_TEST);
      gl.depthMask(false);
      gl.enable(gl.BLEND);
      gl.blendEquation(gl.FUNC_ADD);
      // Mirrors three's NormalBlending with premultipliedAlpha: true.
      gl.blendFuncSeparate(
        gl.ONE,
        gl.ONE_MINUS_SRC_ALPHA,
        gl.ONE,
        gl.ONE_MINUS_SRC_ALPHA,
      );
      gl.clearColor(0, 0, 0, 0);

      const uniforms: UniformState = {
        time: 0,
        resolution: [1, 1],
        colorA: hexToLinearRgb(hexA),
        colorB: hexToLinearRgb(hexB),
        colorC: hexToLinearRgb(hexC),
        speed: initialSettings.speed,
        lineWidth: initialSettings.lineWidth,
        spacing: initialSettings.spacing,
        intensity: initialSettings.intensity,
        zoom: initialSettings.zoom,
        sweepOriginAnchor: [...initialDirection.originAnchor],
        sweepAxis: [...initialDirection.axis],
        directionalStrength: initialDirection.strength,
      };

      uniformsRef.current = uniforms;

      canvasHost.appendChild(canvas);

      const handleContextLost = (event: Event) => {
        event.preventDefault();
      };
      canvas.addEventListener("webglcontextlost", handleContextLost);

      const resize = () => {
        const width = Math.max(canvasHost.clientWidth, 1);
        const height = Math.max(canvasHost.clientHeight, 1);
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        const bufferWidth = Math.max(Math.round(width * pixelRatio), 1);
        const bufferHeight = Math.max(Math.round(height * pixelRatio), 1);

        if (canvas.width !== bufferWidth || canvas.height !== bufferHeight) {
          canvas.width = bufferWidth;
          canvas.height = bufferHeight;
        }

        gl.viewport(0, 0, canvas.width, canvas.height);
        uniforms.resolution[0] = canvas.width;
        uniforms.resolution[1] = canvas.height;
      };

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvasHost);
      resize();

      const uploadUniforms = () => {
        gl.uniform1f(locations.time, uniforms.time);
        gl.uniform2f(
          locations.resolution,
          uniforms.resolution[0],
          uniforms.resolution[1],
        );
        gl.uniform3f(
          locations.colorA,
          uniforms.colorA[0],
          uniforms.colorA[1],
          uniforms.colorA[2],
        );
        gl.uniform3f(
          locations.colorB,
          uniforms.colorB[0],
          uniforms.colorB[1],
          uniforms.colorB[2],
        );
        gl.uniform3f(
          locations.colorC,
          uniforms.colorC[0],
          uniforms.colorC[1],
          uniforms.colorC[2],
        );
        gl.uniform1f(locations.speed, uniforms.speed);
        gl.uniform1f(locations.lineWidth, uniforms.lineWidth);
        gl.uniform1f(locations.spacing, uniforms.spacing);
        gl.uniform1f(locations.intensity, uniforms.intensity);
        gl.uniform1f(locations.zoom, uniforms.zoom);
        gl.uniform2f(
          locations.sweepOriginAnchor,
          uniforms.sweepOriginAnchor[0],
          uniforms.sweepOriginAnchor[1],
        );
        gl.uniform2f(
          locations.sweepAxis,
          uniforms.sweepAxis[0],
          uniforms.sweepAxis[1],
        );
        gl.uniform1f(
          locations.directionalStrength,
          uniforms.directionalStrength,
        );
      };

      // Duration of the one-shot sweep animation (seconds).
      const SWEEP_DURATION_S = 4;

      let animationId = 0;
      let animationStartedAt = performance.now();
      let activePlaybackKey = playbackKeyRef.current;
      let running = false;
      const animate = (now: number) => {
        // Pause the loop (no GPU work) without tearing down the WebGL context
        // so it can resume instantly on the next burst.
        if (!activeRef.current) {
          running = false;
          return;
        }

        if (activePlaybackKey !== playbackKeyRef.current) {
          activePlaybackKey = playbackKeyRef.current;
          animationStartedAt = now;
        }

        const elapsed = (now - animationStartedAt) * 0.001;

        // Cap the time uniform so the sweep freezes at its final position.
        uniforms.time = Math.min(elapsed, SWEEP_DURATION_S);
        uploadUniforms();
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        // Stop the loop once the sweep has finished — the last frame stays on
        // the canvas so the visual result persists without burning GPU cycles.
        if (elapsed >= SWEEP_DURATION_S) {
          running = false;
          return;
        }

        animationId = window.requestAnimationFrame(animate);
      };

      const startLoop = () => {
        if (running) return;
        running = true;
        animationId = window.requestAnimationFrame(animate);
      };

      resumeLoopRef.current = startLoop;

      if (activeRef.current) {
        startLoop();
      }

      cleanupShader = () => {
        running = false;
        resumeLoopRef.current = null;
        window.cancelAnimationFrame(animationId);
        resizeObserver.disconnect();
        canvas.removeEventListener("webglcontextlost", handleContextLost);
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        canvas.remove();
        uniformsRef.current = null;
      };
    };

    const scheduleSetup = () => {
      if (deferUntilIdle && "requestIdleCallback" in window) {
        idleCallbackId = window.requestIdleCallback(
          () => {
            setupShader();
          },
          { timeout: 1200 },
        );
        return;
      }

      if (deferUntilIdle) {
        timeoutId = window.setTimeout(() => {
          setupShader();
        }, 160);
        return;
      }

      setupShader();
    };

    scheduleSetup();

    return () => {
      disposed = true;
      if (idleCallbackId !== undefined) {
        window.cancelIdleCallback(idleCallbackId);
      }
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
      cleanupShader?.();
    };
  }, [deferUntilIdle, enabled]);

  useEffect(() => {
    activeRef.current = active;
    if (active) {
      resumeLoopRef.current?.();
    }
  }, [active]);

  useEffect(() => {
    const uniforms = uniformsRef.current;
    if (!uniforms) return;

    uniforms.speed = settings.speed;
    uniforms.lineWidth = settings.lineWidth;
    uniforms.spacing = settings.spacing;
    uniforms.intensity = settings.intensity;
    uniforms.zoom = settings.zoom;
  }, [settings]);

  useEffect(() => {
    const uniforms = uniformsRef.current;
    if (!uniforms) return;

    uniforms.colorA = hexToLinearRgb(colors[0]);
    uniforms.colorB = hexToLinearRgb(colors[1]);
    uniforms.colorC = hexToLinearRgb(colors[2]);
  }, [colors]);

  useEffect(() => {
    const uniforms = uniformsRef.current;
    if (!uniforms) return;

    const directionConfig = getSweepDirectionConfig(direction);
    uniforms.sweepOriginAnchor = [...directionConfig.originAnchor];
    uniforms.sweepAxis = [...directionConfig.axis];
    uniforms.directionalStrength = directionConfig.strength;
  }, [direction]);

  return (
    <div
      ref={canvasHostRef}
      className={cn(
        "pointer-events-none absolute inset-0 [&>canvas]:block [&>canvas]:h-full [&>canvas]:w-full",
        className,
      )}
    />
  );
}

function getSweepDirectionConfig(
  direction: ShaderSweepDirection,
): SweepDirectionConfig {
  if (direction === "from-bottom-right") {
    return {
      originAnchor: [1, -1],
      axis: normalizeVector([-1, 1]),
      strength: 1,
    };
  }

  if (direction === "from-bottom-left") {
    return {
      originAnchor: [-1, -1],
      axis: normalizeVector([1, 1]),
      strength: 1,
    };
  }

  return {
    originAnchor: [0, 0],
    axis: [0, 1],
    strength: 0,
  };
}

function normalizeVector(vector: [number, number]): [number, number] {
  const length = Math.hypot(vector[0], vector[1]);

  if (length === 0) return [0, 0];

  return [vector[0] / length, vector[1] / length];
}
