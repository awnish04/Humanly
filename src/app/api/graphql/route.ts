import { createSchema, createYoga } from "graphql-yoga";
import { typeDefs } from "@/lib/graphql/schema";
import { resolvers } from "@/lib/graphql/resolvers";
import { NextRequest, NextResponse } from "next/server";

const yoga = createYoga({
  schema: createSchema({ typeDefs, resolvers }),
  graphqlEndpoint: "/api/graphql",
});

export async function GET(request: NextRequest) {
  const response = await yoga.handleRequest(request, {});
  return new NextResponse(response.body, {
    status: response.status,
    headers: response.headers,
  });
}

export async function POST(request: NextRequest) {
  const response = await yoga.handleRequest(request, {});
  return new NextResponse(response.body, {
    status: response.status,
    headers: response.headers,
  });
}
