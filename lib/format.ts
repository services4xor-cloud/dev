/** Display formatting shared by server and client. */

/** Compact money / count formatting for the panel: 1.2 T, 110 B, 4.5 M */
export function formatCompact(n: number, unit = ''): string {
  const abs = Math.abs(n)
  const [div, suffix] =
    abs >= 1e12
      ? [1e12, ' T']
      : abs >= 1e9
        ? [1e9, ' B']
        : abs >= 1e6
          ? [1e6, ' M']
          : abs >= 1e3
            ? [1e3, ' K']
            : [1, '']
  const v = n / div
  return `${unit}${v >= 100 || div === 1 ? Math.round(v).toLocaleString('en-US') : v.toFixed(1)}${suffix}`
}
