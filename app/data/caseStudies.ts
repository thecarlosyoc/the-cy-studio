// Scene-based case studies, one file per case in shared/data/cases/. Listing a case here gives it its
// page at /work/<slug>/case-study and the «Ver caso de estudio» button on /work/<slug>.
import type { CaseScene, CaseStudy } from '#shared/types/caseStudy'
import { paymentsCase } from '#shared/data/cases/payments-credits'

// Blocks built on a pinned stage (CaseHold), and blocks without the numbered mono tag.
export const PINNED_KINDS = new Set<CaseScene['kind']>(['decisions', 'flow', 'system'])
export const UNNUMBERED_KINDS = new Set<CaseScene['kind']>(['threshold'])

// The rules a block cannot check on its own. It runs when this file loads, so a case that breaks one
// stops the dev server and the build instead of shipping.
export function assertCaseStudy(c: CaseStudy): CaseStudy {
  const fail = (rule: string) => {
    throw new Error(`Case study «${c.slug}»: ${rule}`)
  }
  const kinds = c.scenes.map(s => s.kind)
  kinds.forEach((k, i) => {
    // ponytail: one of each block per case, because each block owns its ids; give the blocks an `id`
    // prop when a case needs the same block twice.
    if (kinds.indexOf(k) !== i) fail(`«${k}» appears twice`)
    const prev = kinds[i - 1]
    if (prev && PINNED_KINDS.has(k) && PINNED_KINDS.has(prev)) fail(`two pinned scenes in a row («${prev}», «${k}»)`)
  })
  for (const s of c.scenes) {
    if (s.kind === 'decisions' && s.table && s.steps.length !== 4) fail('«decisions» with a table needs 4 steps (its rail is tuned for them)')
  }
  return c
}

export const CASE_STUDIES: Record<string, CaseStudy> = Object.fromEntries(
  [paymentsCase].map(c => [c.slug, assertCaseStudy(c)]),
)
export const CASE_STUDY_SLUGS = new Set(Object.keys(CASE_STUDIES))
