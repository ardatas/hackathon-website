import type { Metadata } from "next";

import { scheduleContent } from "@/content/schedule";
import { ScheduleClient } from "./schedule-client";

export const metadata: Metadata = {
  title: scheduleContent.title,
  description: scheduleContent.description,
};

export default function SchedulePage() {
  return <ScheduleClient />;
}
