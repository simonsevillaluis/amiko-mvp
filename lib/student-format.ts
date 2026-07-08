export function studentInitial(name: string): string {
  return name.trim().slice(0, 1).toUpperCase();
}

export function supportLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    bajo: "Apoyo ocasional",
    medio: "Apoyo frecuente",
    alto: "Acompañamiento constante",
  };
  return labels[level] ?? level;
}
