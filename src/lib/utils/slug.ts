export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildMobilHomeSlug(
  brand: string,
  model: string,
  reference: string
): string {
  const refSuffix = reference.split("-").pop() ?? "";
  return slugify(`${brand}-${model}-${refSuffix}`);
}
