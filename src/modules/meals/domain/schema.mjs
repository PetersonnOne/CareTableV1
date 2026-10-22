import { z } from "zod";
const phrase = z.string().trim().min(1).max(90);
const phrases = z.array(phrase).max(12);
export const memberSchema = z.object({
  id: z.string().min(1).max(50),
  name: phrase,
  favorites: phrases,
  exclusions: phrases,
  dislikes: phrases.default([]),
  texture: z.enum(["any", "soft"]),
});
export const requestSchema = z
  .object({
    mode: z.enum(["individual", "partner", "family"]),
    members: z.array(memberSchema).min(1).max(8),
    region: z.string().trim().max(80),
    currency: z.string().regex(/^[A-Z]{3}$/),
    units: z.enum(["metric", "imperial"]),
    days: z.union([z.literal(3), z.literal(7), z.literal(14)]),
    slots: z
      .array(z.enum(["breakfast", "lunch", "dinner"]))
      .min(1)
      .max(3)
      .transform((slots) =>
        slots.sort(
          (a, b) =>
            ["breakfast", "lunch", "dinner"].indexOf(a) -
            ["breakfast", "lunch", "dinner"].indexOf(b),
        ),
      ),
    maxMinutes: z.number().int().min(10).max(180),
    equipment: z.array(z.enum(["hob", "oven", "blender"])).max(3),
    budget: z.number().positive().max(10000000).nullable(),
    confirmed: z.literal(true),
  })
  .superRefine((v, ctx) => {
    const n = v.members.length;
    if (
      (v.mode === "individual" && n !== 1) ||
      (v.mode === "partner" && n !== 2) ||
      (v.mode === "family" && n < 2)
    )
      ctx.addIssue({
        code: "custom",
        message: "Member count does not match household type.",
      });
    if (
      new Set(v.members.map((m) => m.id)).size !== n ||
      new Set(v.slots).size !== v.slots.length
    )
      ctx.addIssue({
        code: "custom",
        message: "Members and meal slots must be unique.",
      });
  });
