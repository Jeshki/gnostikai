import { searchCorpus } from "@/lib/search-server";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q") ?? "";
  return Response.json({ hits: searchCorpus(query) });
}
