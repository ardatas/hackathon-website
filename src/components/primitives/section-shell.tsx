import type { ReactNode } from "react";

type SectionShellProps = {
  eyebrow?: string;
  title?: string;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
};

export function SectionShell({
  eyebrow,
  title,
  description,
  action,
  children,
}: SectionShellProps) {
  return (
    <section className="site-container py-12 md:py-16">
      {eyebrow || title || description || action ? (
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            {eyebrow ? (
              <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-tbc-yellow">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2 className="font-display text-3xl font-semibold leading-tight text-foreground md:text-5xl">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-4 text-base text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          {action ? (
            <div className="flex shrink-0 justify-start md:justify-end">
              {action}
            </div>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
