import { getSession } from "@/lib/auth";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { getDailyQuote } from "@/lib/engine";

export default async function DashboardPage() {
  const session = await getSession();
  const quote = getDailyQuote();

  return (
    <DashboardClient
      userName={session?.user?.name || ""}
      quote={quote}
    />
  );
}
