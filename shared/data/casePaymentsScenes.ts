// shared/data/casePaymentsScenes.ts
// Copy and media for the scene-based case page of /work/payments-credits (ES + EN).
// Source of truth for the facts: the-cy-studio-core/proyectos/the-cy-studio/caso-pagos-y-creditos.md;
// scene layout: Figma XgU8eONh0EgCJmB5i6lZi4, page «Portfolio · Escenas», frames «Scene v2 …».
// Every screen under /images/work/payments-credits/ is a cleaned duplicate: no real names, no employer
// or third-party brand. Keep it that way when adding images.
import type { LocalizedText } from '#shared/types/content'

const L = (es: string, en: string): LocalizedText => ({ es, en })
const IMG = (name: string) => `/images/work/payments-credits/${name}.webp`

export const PAYMENTS_SLUG = 'payments-credits'

export interface SceneImage {
  src: string
  alt: LocalizedText
  width: number
  height: number
  // Closed framing inside a card: transform-origin (x, y in %) and scale. The full screen is 1920 px wide,
  // so a 1.6 zoom in a 590 px card still paints one image pixel per device pixel on a 2x screen.
  focus?: readonly [x: number, y: number, zoom: number]
  // Share of a pinned stage this image may take, in % of its width and height (CaseStage).
  box?: readonly [w: number, h: number]
}

const screen = (name: string, alt: LocalizedText, width = 1920, height = 1080): SceneImage => ({ src: IMG(name), alt, width, height })
const focus = (img: SceneImage, x: number, y: number, zoom: number): SceneImage => ({ ...img, focus: [x, y, zoom] })
const box = (img: SceneImage, w: number, h: number): SceneImage => ({ ...img, box: [w, h] })

export const paymentsScenes = {
  footnote: L('Pantallas reales con datos anonimizados.', 'Real screens with anonymized data.'),

  hero: {
    tag: L('Caso de estudio · Producto digital', 'Case study · Digital product'),
    title: L('Sistema de pagos y créditos', 'Payments and credit system'),
    line: L(
      'Unifica pagos, créditos y ocho operaciones contables sin hojas de cálculo.',
      'Brings payments, credits and eight accounting operations together, without spreadsheets.',
    ),
    facts: [
      { label: L('Rol', 'Role'), value: L('Diseñador UX/UI', 'UX/UI Designer') },
      { label: L('Equipo', 'Team'), value: L('+5 diseñadores · +8 devs', '5+ designers · 8+ developers') },
      { label: L('Periodo', 'Period'), value: L('2024–2026 · lanzado en 2025', '2024–2026 · launched in 2025') },
      { label: L('Plataforma', 'Platform'), value: L('Web, escritorio y móvil', 'Web, desktop and mobile') },
    ],
    // The four results sit in the first screen, next to the facts: a recruiter reads them without scrolling.
    statsNote: L(
      'Plataforma principal desde 2025 para los créditos de una financiera.',
      "The main platform since 2025 for a financial institution's credits.",
    ),
    stats: [
      { value: '+4,000', label: L('negocios afiliados', 'affiliated businesses') },
      { value: L('5–8 días', '5–8 days'), label: L('de aprobación a apertura, según la documentación', 'from approval to opening, per the documentation') },
      { value: '8', label: L('operaciones contables', 'accounting operations') },
      { value: '21', label: L('pasos de recorrido guiado', 'guided tour steps') },
    ],
    // animos.app loop (Grid Dive, approved by Carlos 2026-11-25), 1080p web encode of the master in Drive
    // `Proyectos/the CY studio · Portafolio/animos/caso-pagos-hero/`. `poster` is its frame at 4 s.
    poster: screen('hero-poster', L('Pantallas del sistema en movimiento sobre fondo cobalto', 'System screens in motion on a cobalt background')),
    video: '/videos/work/payments-credits/hero.mp4',
  },

  discovery: {
    tag: L('El problema', 'The problem'),
    title: L('Seis hallazgos antes de diseñar', 'Six findings before designing'),
    line: L(
      'Sesiones con contabilidad sobre hojas y vouchers reales, y visitas de campo con coordinadores.',
      'Sessions with accounting over real spreadsheets and vouchers, and field visits with coordinators.',
    ),
    findings: [
      L('No había sistema: todo era manual.', 'There was no system: everything was manual.'),
      L('Las gestiones no tenían seguimiento.', 'Requests had no tracking.'),
      L('Abrir un negocio afiliado era lento.', 'Opening an affiliated business was slow.'),
      L('Datos repetidos entre tablas y hojas.', 'Data repeated across tables and sheets.'),
      L('Vouchers con datos viejos o de más.', 'Vouchers with outdated or extra data.'),
      L('Faltaban documentos para trasladar fondos.', 'Documents needed to transfer funds were missing.'),
    ],
  },

  users: {
    tag: L('Usuarios', 'Users'),
    title: L('Cuatro roles en un mismo ecosistema', 'Four roles in one ecosystem'),
    line: L('Cada rol entra a su propia vista y resuelve un dolor distinto.', 'Each role gets its own view and solves a different pain.'),
    roles: [
      { name: L('Administración', 'Administration'), pain: L('Antes: operación manual, sin seguimiento central.', 'Before: manual operation, no central tracking.'), image: focus(screen('admin', L('Panel de administración de la red', 'Network administration dashboard')), 24, 30, 1.5) },
      { name: L('Coordinación', 'Coordination'), pain: L('Antes: papel y visitas repetidas, sin trazabilidad.', 'Before: paper and repeat visits, no traceability.'), image: focus(screen('bolson-1-solicitud', L('Vista del coordinador sobre un negocio afiliado', "Coordinator's view of an affiliated business")), 50, 50, 1.6) },
      { name: L('Negocio afiliado', 'Affiliated business'), pain: L('Antes: apertura lenta y gestiones sin seguimiento.', 'Before: slow opening and untracked requests.'), image: focus(screen('negocio-globo', L('Panel del negocio afiliado', 'Affiliated business panel'), 1920, 1000), 95, 18, 1.6) },
      { name: L('Contabilidad', 'Accounting'), pain: L('Antes: hojas con datos repetidos y vouchers viejos.', 'Before: sheets with repeated data and outdated vouchers.'), image: focus(screen('f2-sobrante', L('Tabla contable de sobrante y faltante', 'Accounting overage and shortage table'), 1920, 1117), 30, 34, 1.4) },
    ],
  },

  process: {
    tag: L('Cómo se hizo', 'How it was made'),
    title: L('Ciclos cortos con el área contable', 'Short cycles with the accounting team'),
    stages: [
      { name: L('Empatizar', 'Empathize'), text: L('Hojas y vouchers reales; visitas de campo.', 'Real sheets and vouchers; field visits.') },
      { name: L('Definir', 'Define'), text: L('Roles, módulos y datos críticos.', 'Roles, modules and critical data.') },
      { name: L('Idear', 'Ideate'), text: L('Propuestas comparables en Figma.', 'Comparable proposals in Figma.') },
      { name: L('Prototipar', 'Prototype'), text: L('Varios prototipos hasta el indicado.', 'Several prototypes until the right one.') },
      { name: L('Probar', 'Test'), text: L('Contabilidad, piloto en campo y QA.', 'Accounting, field pilot and QA.') },
    ],
    team: [
      { name: L('Diseño UX/UI · mi rol', 'UX/UI design · my role'), text: L('Tablas e interacciones, vouchers, ayuda y aumento de bolsón.', 'Tables and interactions, vouchers, help and the bolsón increase.'), mine: true },
      { name: L('Área contable', 'Accounting team'), text: L('Datos críticos y validación sobre el prototipo.', 'Critical data and validation on the prototype.'), mine: false },
      { name: L('Jefaturas de UX, CX y UI', 'UX, CX and UI leads'), text: L('Lineamientos, QA interno y aprobación final.', 'Guidelines, internal QA and final approval.'), mine: false },
    ],
    teamNote: L('Equipo: +5 diseñadores y +8 programadores', 'Team: 5+ designers and 8+ developers'),
  },

  // Opener of the product part: the accounting screen held on screen while two lines cross over it
  // (the /about photo hold). Both lines already lived on the page.
  threshold: {
    image: screen('f2-sobrante', L('Tabla contable de sobrante y faltante', 'Accounting overage and shortage table'), 1920, 1117),
    lines: [
      L('De *hojas de cálculo* a un solo sistema.', 'From *spreadsheets* to one system.'),
      L('Del resumen general al historial, *sin salir* a hojas externas.', 'From the overview to the history, *without leaving* for outside sheets.'),
    ],
  },

  // The six steps of the accounting flow (overview, operation table, new operation, row detail, reversal,
  // history) grouped in four stops, each one with the design decision behind it.
  operate: {
    tag: L('Arquitectura y decisiones', 'Architecture and decisions'),
    title: L('Operar y conciliar: cada paso, una decisión', 'Run and reconcile: each step, one decision'),
    // Step 1 is the table itself: the summary cards, then three fixed columns with the rest sliding behind
    // them through the three real scroll states of the capture.
    table: {
      cards: screen('resumen-tarjetas', L('Resumen general con los totales del periodo', 'Overview with the totals of the period'), 2816, 286),
      fixed: screen('tabla-fija', L('Columnas fijas: usuario, bolsón y negocio afiliado', 'Fixed columns: user, bolsón and affiliated business'), 1383, 424),
      states: [
        screen('tabla-cols-1', L('Al inicio: saldo inicial, operatoria, confronta de bancos y pago manual', 'At the start: opening balance, operations, bank reconciliation and manual payment'), 1390, 424),
        screen('tabla-cols-2', L('A la mitad: recolección, ajustes manuales y sobrante o faltante', 'Midway: collection, manual adjustments and overage or shortage'), 1390, 424),
        screen('tabla-cols-3', L('Al final: reintegro, reversas, negocio en castigo y total', 'At the end: refunds, reversals, penalized business and total'), 1390, 424),
      ],
      // Without the pinned scene (phone, reduced motion) the same three states, stacked in one capture.
      still: screen('decision-01-columnas', L('La tabla al inicio, a mitad y al final del desplazamiento, con tres columnas fijas', 'The table at the start, middle and end of the scroll, with three fixed columns'), 2816, 1708),
    },
    steps: [
      { name: L('Resumen general', 'Overview'), decision: L('Tres columnas fijas', 'Three fixed columns'), text: L('Usuario, bolsón y negocio afiliado quedan a la vista mientras la tabla se desplaza.', 'User, bolsón and affiliated business stay in view while the table scrolls.'), images: [] as SceneImage[] },
      { name: L('Tabla y detalle', 'Table and detail'), decision: L('El detalle, en la fila', 'Detail in the row'), text: L('La fila se expande con hora, monto, usuario operativo, observación y voucher.', 'The row expands with time, amount, operator, note and voucher.'), images: [box(screen('decision-02-fila', L('Fila expandida con el detalle', 'Expanded row with the detail'), 2816, 1132), 100, 100)] },
      { name: L('Nueva operación y reversa', 'New operation and reversal'), decision: L('Capturar sin perder el comprobante', 'Capture without losing the receipt'), text: L('Sobrante y faltante en pestañas, con el comprobante siempre visible.', 'Overage and shortage in tabs, with the receipt always visible.'), images: [box(screen('decision-03-comprobante', L('Ventana de sobrante y faltante con el comprobante', 'Overage and shortage dialog with the receipt'), 2816, 2000), 58, 100), box(screen('flujo-5-reversa', L('Ventana para reversar una operación', 'Dialog to reverse an operation'), 1280, 1172), 38, 82)] },
      { name: L('Historial', 'History'), decision: L('El historial, en componentes', 'Componentized history'), text: L('Vistas del historial armadas con componentes para crecer con consistencia.', 'History views built from components to grow consistently.'), images: [box(screen('decision-04-historial', L('Historial de acciones por usuario y rol', 'Action history by user and role'), 2816, 660), 100, 55), box(screen('flujo-6-historial', L('Historial de acciones en componentes', 'Action history built from components'), 2816, 526), 100, 40)] },
    ],
  },

  // Fifth decision, on its own: it belongs to the affiliated business, not to the accounting flow.
  tour: {
    tag: L('Ayuda', 'Help'),
    title: L('Recorrido guiado: globos y video', 'Guided tour: tooltips and video'),
    line: L('Globos para el primer ingreso y un modal con video en preguntas frecuentes.', 'Tooltips on first visit and a video modal in the FAQ.'),
    images: [
      focus(screen('negocio-globo', L('Globo del recorrido guiado sobre el panel', 'Guided tour tooltip over the panel'), 1920, 1000), 95, 18, 1.6),
      focus(screen('negocio-modal', L('Modal de ayuda con lista de pasos y video', 'Help modal with a step list and video'), 1920, 1000), 50, 47, 1.2),
    ],
  },

  bolson: {
    tag: L('Aumento de bolsón', 'Bolsón increase'),
    title: L('Aumento de bolsón: el flujo completo', 'Bolsón increase: the full flow'),
    line: L('Tres roles, cuatro etapas y 45 pantallas, con sus caminos alternos y de error.', 'Three roles, four stages and 45 screens, with alternate and error paths.'),
    stages: [
      { role: L('Coordinador', 'Coordinator'), text: L('Solicita el aumento', 'Requests the increase'), image: focus(screen('bolson-1-solicitud', L('El coordinador solicita el aumento', 'The coordinator requests the increase')), 50, 50, 1.6) },
      { role: L('Analista', 'Analyst'), text: L('Genera el pagaré', 'Generates the promissory note'), image: focus(screen('bolson-2-pagare', L('El analista genera el pagaré', 'The analyst generates the promissory note')), 50, 50, 1.6) },
      { role: L('Coordinador', 'Coordinator'), text: L('Carga el pagaré firmado', 'Uploads the signed note'), image: focus(screen('bolson-3-firma', L('El coordinador carga el pagaré firmado', 'The coordinator uploads the signed note')), 50, 50, 1.6) },
      { role: L('Supervisor', 'Supervisor'), text: L('Valida y aprueba', 'Validates and approves'), image: focus(screen('bolson-4-aprobado', L('El supervisor confirma el aumento', 'The supervisor confirms the increase')), 50, 46, 1.6) },
    ],
    paths: [
      { kind: L('Camino alterno', 'Alternate path'), text: L('El analista devuelve el monto con su motivo.', 'The analyst returns the amount with a reason.'), image: screen('bolson-alt-modal', L('Modal: el analista devuelve el monto con su motivo', 'Modal: the analyst returns the amount with a reason'), 720, 708) },
      { kind: L('Camino de error', 'Error path'), text: L('Un monto no permitido no pasa.', 'An amount out of range is blocked.'), image: screen('bolson-neg-modal', L('Modal: aviso de monto no permitido', 'Modal: amount out of range warning'), 720, 408) },
    ],
    rules: [
      L('Una solicitud abierta por negocio', 'One open request per business'),
      L('Toda devolución lleva motivo', 'Every return carries a reason'),
      L('El monto aprobado queda bloqueado', 'The approved amount is locked'),
    ],
    count: L('45 pantallas · 20 principales · 19 alternas · 6 de error', '45 screens · 20 main · 19 alternate · 6 error'),
  },

  validation: {
    tag: L('Validación', 'Validation'),
    title: L('Contabilidad corrigió sobre el prototipo', 'Accounting corrected on the prototype'),
    line: L('Validado también en piloto y QA.', 'Also validated in a field pilot and QA.'),
    before: L('Fase 1', 'Phase 1'),
    after: L('Fase 2', 'Phase 2'),
    tabs: [
      { name: L('Sobrante y faltante', 'Overage and shortage'), before: focus(screen('f1-sobrante', L('Fase 1: tabla sin columna de estatus', 'Phase 1: table with no status column'), 1920, 1117), 71, 75, 1.3), after: focus(screen('f2-sobrante', L('Fase 2: tabla con columna de estatus al inicio', 'Phase 2: table with a status column first'), 1920, 1117), 71, 75, 1.3) },
      { name: L('Confronta de bancos', 'Bank reconciliation'), before: focus(screen('f1-confronta', L('Fase 1: la columna se llamaba bolsón', 'Phase 1: the column was called bolsón'), 1920, 1117), 71, 20, 1.3), after: focus(screen('f2-confronta', L('Fase 2: la columna pasa a cuenta corriente', 'Phase 2: the column becomes current account'), 1920, 1117), 71, 20, 1.3) },
    ],
  },

  close: {
    tag: L('Aprendizajes', 'Takeaways'),
    title: L('Dos aprendizajes', 'Two takeaways'),
    learnings: [
      L('Depurar los datos con operación antes de diseñar tablas.', 'Clean the data with operations before designing tables.'),
      L('Componentizar las vistas secundarias desde el inicio.', 'Componentize secondary views from the start.'),
    ],
    next: L('Siguiente caso', 'Next case'),
  },
} as const
