import Image from "next/image";
import Link from "next/link";
import { BriefcaseBusiness, Mail } from "lucide-react";

import { DottedSurface } from "@/components/ui/dotted-surface";
import { footerLinks, siteConfig, socialLinks } from "@/content/site";
import wordmark from "../../../assets/logos/c26-wordmark-full.svg";
import tbcWordmark from "../../../assets/logos/tbc-wordmark.svg";

const socialIcons: Record<
  string,
  (props: React.SVGProps<SVGSVGElement> & { size?: number }) => React.ReactNode
> = {
  instagram: ({ size = 18, ...props }) => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      {...props}
    >
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
    </svg>
  ),
  linkedin: ({ size = 18, ...props }) => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      {...props}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
    </svg>
  ),
  x: ({ size = 18, ...props }) => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      {...props}
    >
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153ZM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644Z" />
    </svg>
  ),
  telegram: ({ size = 18, ...props }) => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      {...props}
    >
      <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42l10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.703l-.33 4.955c.488 0 .702-.223.974-.488l2.338-2.274l4.861 3.592c.896.494 1.54.239 1.763-.832l3.185-15.008c.326-1.307-.5-1.892-1.357-1.512z" />
    </svg>
  ),
};

export function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden bg-black">
      {/* Organic uneven edge — blends footer hue into the page background */}
      <div
        className="absolute -top-px left-0 right-0 z-20 h-24 md:h-32 pointer-events-none"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          fill="none"
        >
          <defs>
            <linearGradient id="footer-fade-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="black" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          {/* The organic top edge — irregular curves that look natural */}
          <path
            d="M0,0 L0,48 C120,68 200,38 320,52 C440,66 480,32 600,42 C720,52 780,72 900,58 C1020,44 1080,64 1200,54 C1320,44 1380,56 1440,50 L1440,0 Z"
            fill="black"
          />
          {/* Soft feathered blend below the edge */}
          <path
            d="M0,44 C120,64 200,34 320,48 C440,62 480,28 600,38 C720,48 780,68 900,54 C1020,40 1080,60 1200,50 C1320,40 1380,52 1440,46 L1440,120 L0,120 Z"
            fill="url(#footer-fade-fill)"
            opacity="0.7"
          />
        </svg>
      </div>

      <DottedSurface />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0.4)_0%,rgba(38,10,12,0.84)_50%,rgba(27,10,43,0.92)_100%)]" />
      <div className="site-container relative z-10 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 rounded-lg border border-border bg-black/56 p-6 backdrop-blur-md md:grid-cols-[1.1fr_0.9fr_0.9fr]">
          <div>
            <Image
              src={wordmark}
              alt="TUM Blockchain Conference + Hackathon 26"
              className="h-auto w-52"
            />
            <p className="mt-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Organized by
            </p>
            <a
              href={siteConfig.clubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-3 opacity-90 hover:opacity-100 transition-opacity"
            >
              <Image
                src={tbcWordmark}
                alt="TUM Blockchain Club"
                className="h-9 w-auto object-contain"
              />
            </a>
          </div>

          <div>
            <p className="font-display text-sm font-semibold uppercase text-foreground">
              Links
            </p>
            <div className="mt-3 grid gap-1 text-sm text-muted-foreground">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  className="inline-flex w-fit items-center py-1.5 transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="font-display text-sm font-semibold uppercase text-foreground">
              Contact
            </p>
            <div className="mt-4 flex flex-col gap-4 text-sm text-muted-foreground">
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  General Inquiries
                </span>
                <Link
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="inline-flex items-center gap-2 hover:text-foreground"
                >
                  <Mail aria-hidden="true" size={16} />
                  {siteConfig.contactEmail}
                </Link>
              </div>
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Sponsorship Inquiries
                </span>
                <Link
                  href={`mailto:${siteConfig.sponsorEmail}`}
                  className="inline-flex items-center gap-2 hover:text-foreground"
                >
                  <BriefcaseBusiness aria-hidden="true" size={16} />
                  {siteConfig.sponsorEmail}
                </Link>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              {socialLinks.map((link) => {
                const Icon = socialIcons[link.icon];

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.label}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Icon aria-hidden="true" size={17} />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <Link
            href={siteConfig.privacyPolicyUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center py-1.5 hover:text-foreground"
          >
            Privacy Policy
          </Link>
          <Link
            href={siteConfig.imprintUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center py-1.5 hover:text-foreground"
          >
            Imprint
          </Link>
        </div>
      </div>
    </footer>
  );
}
