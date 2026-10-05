// Price markup in the browser (live refresh on product pages, cart lines). Same output as Price.astro.
import { formatPrice } from '@/lib/site';

const labelled = (tag: 's' | 'span', label: string, value: number) => {
  const el = document.createElement(tag);
  const hidden = document.createElement('span');
  hidden.className = 'sr-only';
  hidden.textContent = `${label}: `;
  el.append(hidden, formatPrice(value));
  return el;
};

/** Fills `el` with the price; during a promotion the regular price comes first, struck through. */
export function renderPrice(el: Element, price: number, regularPrice?: number) {
  if (!regularPrice || regularPrice <= price) {
    el.textContent = formatPrice(price);
    return;
  }
  const old = labelled('s', 'Gewone prijs', regularPrice);
  old.className = 'price-old';
  el.replaceChildren(old, labelled('span', 'Actieprijs', price));
}
