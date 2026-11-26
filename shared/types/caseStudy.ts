// shared/types/caseStudy.ts
// The block catalog of the scene-based case pages (/work/<slug>/case-study). A case is a hero, an
// ordered list of scenes picked from this catalog, and a closing scene. Each block owns its layout and
// its motion: the data only says what goes in it. `assertCaseStudy` (app/data/caseStudies.ts) checks the
// rules the blocks cannot check on their own.
//
// The counts noted per block are the ones the layout was tuned with on the payments case; another count
// works but has not been looked at. Retune the block when a case needs it.
import type { LocalizedText } from './content'

export interface SceneImage {
  src: string
  alt: LocalizedText
  width: number
  height: number
  // Closed framing inside a card: transform-origin (x, y in %) and scale. Keep at least 2 served image px per
  // CSS px of the zoomed screen at 1440@2x and 375@3x: a screen zoomed past what 1920 px holds is a 2x export
  // (3840 px), and the component's `sizes` must ask for that width.
  focus?: readonly [x: number, y: number, zoom: number]
  // Share of a pinned stage this image may take, in % of its width and height (CaseStage).
  box?: readonly [w: number, h: number]
}

type L = LocalizedText

// First screen: title, facts and results (tuned: 3 facts, 4 stats), then the product loop edge to edge.
export interface CaseHeroData {
  tag: L
  title: L
  line: L
  // Stands in only when the work item fails to load; the page shows `work_items.role`.
  role: L
  facts: { label: L; value: L }[]
  statsNote: L
  stats: { value: string | L; label: L }[]
  poster: SceneImage
  video: string
}

// Problem: context and a grid of findings (tuned: 6).
export interface DiscoveryScene {
  kind: 'discovery'
  tag: L
  title: L
  context: L
  line: L
  findings: L[]
}

// Who uses it: one card per role with its pain and a screen (tuned: 4).
export interface UsersScene {
  kind: 'users'
  tag: L
  title: L
  line: L
  roles: { name: L; pain: L; image: SceneImage }[]
}

// How it was made: stages on a rail that fills (tuned: 5) and the team (`mine` marks Carlos's part).
export interface ProcessScene {
  kind: 'process'
  tag: L
  title: L
  stages: { name: L; text: L }[]
  team: { name: L; text: L; mine: boolean }[]
  teamNote: L
}

// Dark band that opens the product part: one screen under one line (*asterisks* mark the accent).
export interface ThresholdScene {
  kind: 'threshold'
  image: SceneImage
  line: L
}

// Pinned: the screens of a flow, one step at a time, each with the decision behind it (tuned: 4 steps).
// `table` turns step 1 into the wide table whose columns slide behind fixed ones; it takes two stretches
// of the hold, and its rail is tuned for exactly 4 steps (checked by assertCaseStudy).
export interface DecisionsScene {
  kind: 'decisions'
  tag: L
  title: L
  table?: DecisionsTable
  steps: { name: L; decision: L; text: L; images: SceneImage[] }[]
}

export interface DecisionsTable {
  cards: SceneImage
  fixed: SceneImage
  // The real scroll states of the table: start, middle, end.
  states: SceneImage[]
  // The same states stacked in one capture, for phones and reduced motion.
  still: SceneImage
}

// Two captures side by side, each held on the piece that matters (`focus`).
export interface PairScene {
  kind: 'pair'
  tag: L
  title: L
  line: L
  images: SceneImage[]
}

// Pinned: a row of hand-offs between roles that the scroll carries sideways, then the alternate and error
// paths (tuned: 4 stages, 2 paths, 3 rules).
export interface FlowScene {
  kind: 'flow'
  tag: L
  title: L
  line: L
  stages: { role: L; text: L; image: SceneImage }[]
  paths: { kind: L; text: L; image: SceneImage }[]
  rules: L[]
  count: L
}

// Before and after on the same screens (tuned: 2 pairs).
export interface ValidationScene {
  kind: 'validation'
  tag: L
  title: L
  line: L
  before: L
  after: L
  tabs: { name: L; before: SceneImage; after: SceneImage }[]
}

// Design system: component sheets (tuned: 4), then a pinned laptop and phone whose screens scroll
// (tuned: 2 states). `mat` is the sheet's own background colour, shown around a sheet shrunk to fit.
export interface SystemScene {
  kind: 'system'
  tag: L
  title: L
  line: L
  groups: { name: L; text: L; image: SceneImage; mat: string }[]
  dashboards: {
    title: L
    line: L
    // Desktop: `sidebar` width and `header` height stay fixed while the rest scrolls. Phone: `status` bar
    // height stays fixed; `skip` rows (the browser bar) never show. Sizes in px of the capture itself.
    states: {
      label: L
      caption: L
      desktop: SceneImage & { sidebar: number; header: number }
      mobile: SceneImage & { status: number; skip: number }
    }[]
  }
}

export type CaseScene =
  | DiscoveryScene
  | UsersScene
  | ProcessScene
  | ThresholdScene
  | DecisionsScene
  | PairScene
  | FlowScene
  | ValidationScene
  | SystemScene

// Closing scene: takeaways (tuned: 4) and the link to the next case.
export interface CaseCloseData {
  tag: L
  title: L
  learnings: L[]
  next: L
}

export interface CaseStudy {
  slug: string
  // Shown under the closing scene, e.g. «Real screens with anonymized data».
  footnote: L
  hero: CaseHeroData
  scenes: CaseScene[]
  close: CaseCloseData
}
