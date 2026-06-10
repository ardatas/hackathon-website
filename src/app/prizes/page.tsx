import type { Metadata } from "next";

import { PageHeader } from "@/components/primitives/page-header";
import { SectionShell } from "@/components/primitives/section-shell";
import { PrizeMainPool } from "@/components/sections/prize-main-pool";
import { PrizeTracks } from "@/components/sections/prize-tracks";
import { prizeContent, prizeTracks } from "@/content/prizes";

export const metadata: Metadata = {
  title: prizeContent.title,
  description: prizeContent.description,
};

export default function PrizesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Prize tracks"
        title={prizeContent.title}
        description={prizeContent.description}
      />
      <SectionShell
        eyebrow="Partner tracks"
      >
        <PrizeTracks tracks={prizeTracks} />
      </SectionShell>
      <SectionShell
        eyebrow="Total pool"
        description={prizeContent.mainPoolDescription}
      >
        <PrizeMainPool tracks={prizeTracks} />
      </SectionShell>
    </>
  );
}
