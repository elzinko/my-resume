/**
 * Hauteur totale (px) d’un flex-wrap donné une largeur conteneur,
 * largeurs d’items, hauteur de ligne et gap — même logique que JobFrameworkPills.
 */
export function layoutHeightPx(
  itemWidths: number[],
  moreWidth: number | null,
  containerWidth: number,
  itemHeight: number,
  gap: number,
): number {
  const items = moreWidth != null ? [...itemWidths, moreWidth] : itemWidths;
  if (items.length === 0) return 0;

  let rowWidth = 0;
  let rows = 1;

  for (const w of items) {
    const gapSpace = rowWidth > 0 ? gap : 0;
    if (rowWidth + gapSpace + w > containerWidth && rowWidth > 0) {
      rows += 1;
      rowWidth = w;
    } else if (rowWidth + gapSpace + w > containerWidth && rowWidth === 0) {
      rowWidth = w;
    } else {
      rowWidth += gapSpace + w;
    }
  }

  return rows * itemHeight + (rows - 1) * gap;
}

/** Nombre d’items affichés avant la pastille « … » pour rester dans maxTotalHeightPx. */
export function maxFitCountOneRow(
  widths: number[],
  moreW: number,
  cw: number,
  H: number,
  gap: number,
  maxTotalHeightPx: number,
): number {
  const n = widths.length;
  const epsilon = 2;

  if (layoutHeightPx(widths, null, cw, H, gap) <= maxTotalHeightPx + epsilon) {
    return n;
  }

  for (let k = n - 1; k >= 0; k -= 1) {
    if (
      layoutHeightPx(widths.slice(0, k), moreW, cw, H, gap) <=
      maxTotalHeightPx + epsilon
    ) {
      return k;
    }
  }

  return 0;
}
