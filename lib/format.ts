export function money(n: number): string {
  return n % 1 === 0 ? `$${n.toFixed(0)}` : `$${n.toFixed(2)}`;
}

export function priceLabel(min: number, max: number): string {
  return min === max ? money(min) : `${money(min)} – ${money(max)}`;
}
