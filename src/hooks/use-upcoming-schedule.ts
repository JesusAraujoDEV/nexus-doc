import { useQuery } from "@tanstack/react-query";
import { fetchUpcomingRange } from "@/lib/calendar-api";

export function useUpcomingSchedule(from: string, to: string, enabled = true) {
  return useQuery({
    queryKey: ["upcoming-schedule", from, to],
    queryFn: () => fetchUpcomingRange(from, to),
    enabled,
  });
}
