import type { PrizeTrack } from "@/types/content";

export const prizeContent = {
  title: "Prize Tracks",
  description:
    "Prizes are organized into tracks, each backed by one of our partners, which combine to make up the total prize pool. Tracks and amounts are announced soon.",
  fallback: "Prize tracks announced soon.",
  trackAmountFallback: "Prize amount announced soon.",
  trackDescriptionFallback: "Track brief announced soon.",
  trackIdeasFallback: "Example ideas announced soon.",
  trackRequirementsFallback: "Track-specific requirements announced soon.",
  mainPoolDescription:
    "The total prize pool is composed of all partner tracks combined.",
  mainPoolFallback: "Announced soon.",
  defaultRequirements: [
    "A working demo of your project.",
    "A public source code repository.",
    "A short demo video, with max length announced soon.",
    "A README describing what you built and how to run it.",
    "Project must be built during the hackathon. Pre-existing projects are not eligible unless meaningfully extended during the event.",
  ],
};

export const prizeTracks: PrizeTrack[] = [];
