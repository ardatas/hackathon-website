import "@testing-library/jest-dom/vitest";
import React from "react";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    onClick,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string | { toString(): string };
    children: React.ReactNode;
  }) => (
    <a
      href={String(href)}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
      }}
      {...props}
    >
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    fill,
    priority,
    unoptimized,
    ...props
  }: Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> & {
    src: string | { src?: string };
    fill?: boolean;
    priority?: boolean;
    unoptimized?: boolean;
  }) => {
    void fill;
    void priority;
    void unoptimized;

    return React.createElement("img", {
      src: typeof src === "string" ? src : (src.src ?? ""),
      alt: alt ?? "",
      ...props,
    });
  },
}));
