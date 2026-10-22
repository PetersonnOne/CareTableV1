export const themes = [
  { id: "garden", name: "Garden", shades: "Sage · cream · forest" },
  { id: "midnight", name: "Midnight", shades: "Navy · slate · mint" },
] as const;
export type Theme = (typeof themes)[number]["id"];
export type ThemeChoice = Theme | "site";
export function isTheme(value: string): value is Theme {
  return themes.some((t) => t.id === value);
}
