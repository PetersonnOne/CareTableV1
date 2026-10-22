import "server-only";
export async function GET() {
  return Response.json(
    {
      application: "CareTable",
      status: "ok",
      framework: "Next.js App Router",
      database: "Convex",
      model: "gpt-6-luna",
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
