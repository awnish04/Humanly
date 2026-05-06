import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const clerk = await clerkClient();
    const { data: users } = await clerk.users.getUserList({
      limit: 500,
      orderBy: "-created_at",
    });

    const result = users.map((user) => {
      const meta = user.publicMetadata as {
        plan?: string;
        wordsUsed?: number;
        wordsLimit?: number;
        requests?: number;
        billing?: string;
      };

      return {
        id: user.id,
        name: user.fullName ?? user.firstName ?? "Unknown",
        email: user.emailAddresses?.[0]?.emailAddress ?? "",
        avatar: user.imageUrl,
        plan: meta.plan ?? "free",
        billing: meta.billing ?? null,
        wordsUsed: meta.wordsUsed ?? 0,
        wordsLimit: meta.wordsLimit ?? 500,
        requests: meta.requests ?? 0,
        createdAt: new Date(user.createdAt).toISOString(),
        lastSignIn: user.lastSignInAt
          ? new Date(user.lastSignInAt).toISOString()
          : null,
      };
    });

    return NextResponse.json({ users: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
