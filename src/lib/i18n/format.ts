/** Simple {placeholder} interpolation helper for translation strings. Safe for client components. */
export function t(
  template: string,
  values: Record<string, string | number> = {}
): string {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in values ? String(values[key]) : match
  );
}
