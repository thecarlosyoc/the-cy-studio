// shared/data/servicesShowcase.ts
// Published /work case each /services chapter opens with (by slug). If a case is hidden or deleted,
// the chapter drops its case link (and, for Brand, its media).
export const SERVICE_SHOWCASE = {
  product: { work: 'payments-credits' },
  brand: { work: 'dts-express' },
  motion: { work: 'carbon-footprint' },
} as const
