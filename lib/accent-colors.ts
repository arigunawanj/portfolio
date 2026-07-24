export const ACCENT_COLORS = ["#4F8CFF", "#8B5CF6", "#22E5A0"] as const

export function getAccentColor(index: number): string {
  return ACCENT_COLORS[index % ACCENT_COLORS.length]
}
