import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";
import CallSimulator from "@/components/CallSimulator";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div>
          <h1 className="text-lg font-bold text-slate-800">📞 Callcenter Simulator</h1>
          <p className="text-xs text-slate-500">
            I kyçur si <span className="font-medium">{session.name}</span> ({session.email})
          </p>
        </div>
        <LogoutButton />
      </header>

      <main className="flex-1 p-4 sm:p-6">
        <CallSimulator />
      </main>
    </div>
  );
}
