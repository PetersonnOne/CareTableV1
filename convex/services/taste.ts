import { normalize } from "../../src/modules/meals/domain/checks.mjs";
export type TasteConnection = {
  id: string;
  name: string;
  affinity: number | null;
};
export type TasteEvidence = {
  provider: "Qloo";
  mode: "live";
  seeds: { id: string; name: string }[];
  unresolved: string[];
  connections: TasteConnection[];
  fetchedAt: string;
  message: string;
};
// Best-effort warm-worker cache: cuisine signals only, never household records.
const cache = new Map<string, { expires: number; evidence: TasteEvidence }>();
export async function discoverTaste(
  favorites: string[],
): Promise<TasteEvidence> {
  const key = process.env.QLOO_API_KEY;
  if (!key) throw new Error("QLOO_NOT_CONFIGURED");
  const get = async (path: string, params: Record<string, string>) => {
    const r = await fetch(
      `https://hackathon.api.qloo.com${path}?${new URLSearchParams(params)}`,
      { headers: { "X-Api-Key": key }, signal: AbortSignal.timeout(30000) },
    );
    if (!r.ok) throw new Error(`QLOO_HTTP_${r.status}`);
    const data = await r.json();
    if (data.success === false) throw new Error("QLOO_REJECTED");
    return data;
  };
  const inputs = [
    ...new Set(
      favorites.map((s) =>
        normalize(s).replace(/ (food|cuisine|cooking)$/, ""),
      ),
    ),
  ]
    .filter(Boolean)
    .slice(0, 3) as string[];
  const cacheKey = JSON.stringify(inputs.slice().sort());
  const cached = cache.get(cacheKey);
  if (cached && cached.expires > Date.now())
    return structuredClone(cached.evidence);
  const seeds: { id: string; name: string }[] = [],
    unresolved: string[] = [];
  await Promise.all(
    inputs.map(async (input) => {
      const data = await get("/v2/tags", { "filter.query": input, take: "10" });
      const match = (data.results?.tags || []).find(
        (t: { id: string; name: string }) =>
          normalize(t.name) === input &&
          (t.id?.startsWith("urn:tag:genre:place:restaurant:") ||
            t.id?.startsWith("urn:tag:cuisine:")),
      );
      if (match) seeds.push({ id: match.id, name: match.name });
      else unresolved.push(input);
    }),
  );
  seeds.sort((a,b)=>a.id.localeCompare(b.id));
  unresolved.sort();
  if (!seeds.length)
    return {
      provider: "Qloo",
      mode: "live",
      seeds,
      unresolved,
      connections: [],
      fetchedAt: new Date().toISOString(),
      message:
        "No exact dining/cuisine tag matched these inputs. Add a cuisine you enjoy; unsupported food names are not attributed to Qloo.",
    };
  const data = await get("/v2/insights", {
    "filter.type": "urn:tag",
    "filter.tag.types": "urn:tag:genre:place",
    "signal.interests.tags": seeds.map((s) => s.id).join(","),
    take: "40",
  });
  const connections: TasteConnection[] = (data.results?.tags || [])
    .filter(
      (t: { tag_id?: string; id?: string }) =>
        (t.tag_id || t.id || "").startsWith(
          "urn:tag:genre:place:restaurant:",
        ) || (t.tag_id || t.id || "").startsWith("urn:tag:cuisine:"),
    )
    .map(
      (t: {
        tag_id?: string;
        id: string;
        name: string;
        query?: { affinity?: number };
      }) => ({
        id: t.tag_id || t.id,
        name: t.name,
        affinity:
          typeof t.query?.affinity === "number" ? t.query.affinity : null,
      }),
    );
  const evidence: TasteEvidence = {
    provider: "Qloo",
    mode: "live",
    seeds,
    unresolved,
    connections,
    fetchedAt: new Date().toISOString(),
    message:
      "Qloo returned aggregate cultural affinities. CareTable maps dining tags to its original recipe suggestions; Qloo does not supply or certify these recipes.",
  };
  if (cache.size >= 50) cache.delete(cache.keys().next().value!);
  cache.set(cacheKey, { expires: Date.now() + 10 * 60 * 1000, evidence });
  return structuredClone(evidence);
}
