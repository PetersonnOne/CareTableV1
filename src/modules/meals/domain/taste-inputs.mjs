import { normalize } from "./checks.mjs";
// Round-robin prevents the first member's long favorites list taking every slot.
// These remain pooled household signals, not a per-person affinity estimate.
export function householdTasteInputs(members, limit = 3) {
  const selected = [], seen = new Set();
  const longest = Math.max(0, ...members.map(m => m.favorites.length));
  for (let i=0; i<longest && selected.length<limit; i++) {
    for (const member of members) {
      const raw = member.favorites[i];
      if (!raw) continue;
      const key = normalize(raw).replace(/ (food|cuisine|cooking)$/, "");
      if (key && !seen.has(key)) { selected.push(raw); seen.add(key); }
      if (selected.length===limit) break;
    }
  }
  return selected;
}
