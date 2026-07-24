import { ThreadView } from "@/components/forum/ThreadView";

export const metadata = {
  title: "Thread",
};

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <ThreadView threadId={threadId} />
    </div>
  );
}
