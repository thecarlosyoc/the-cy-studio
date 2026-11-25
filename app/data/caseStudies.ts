// Work slugs that have a scene-based case study at /work/<slug>/case-study.
import { PAYMENTS_SLUG, paymentsScenes } from '#shared/data/casePaymentsScenes'

export const CASE_STUDIES = { [PAYMENTS_SLUG]: paymentsScenes } as const
export const CASE_STUDY_SLUGS = new Set<string>(Object.keys(CASE_STUDIES))
