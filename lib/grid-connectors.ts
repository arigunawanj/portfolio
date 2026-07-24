/**
 * Whether a card at `index` in a CSS grid with `columns` columns should
 * render a connector line to its right-hand neighbor. False for the last
 * card in each row and for the very last item overall.
 */
export function showRowConnector(index: number, totalItems: number, columns: number): boolean {
  const isLastInRow = (index + 1) % columns === 0
  const isLastItem = index === totalItems - 1
  return !isLastInRow && !isLastItem
}
