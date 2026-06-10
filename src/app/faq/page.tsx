import type { Metadata } from "next";

import { FaqsSection } from "@/components/ui/faqs-1";
import { faqContent, faqGroups, faqResources } from "@/content/faq";

export const metadata: Metadata = {
  title: faqContent.title,
  description: faqContent.description,
};

export default function FaqPage() {
  return <FaqsSection groups={faqGroups} resources={faqResources} />;
}
