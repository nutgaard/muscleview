type ClassMap = Record<string, boolean | null | undefined>;
type ClassValue = ClassMap | string | false | null | undefined;

export function cls(...parts: ClassValue[]) {
  return parts
    .flatMap((part) => {
      if (!part) {
        return [];
      }

      if (typeof part === "string") {
        return [part];
      }

      return Object.entries(part)
        .filter(([, include]) => Boolean(include))
        .map(([className]) => className);
    })
    .join(" ");
}
