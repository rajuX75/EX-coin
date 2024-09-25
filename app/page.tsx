import TelegramAuth from "@/components/TelegramAuth";
import { getSession } from "@/utils/session";

export default async function Home() {
  const session = await getSession();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">JWT Auth for telegram</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <TelegramAuth />
    </main>
  );
}
