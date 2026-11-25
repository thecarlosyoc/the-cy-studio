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
}

const screen = (name: string, alt: LocalizedText, width = 1920, height = 1080): SceneImage => ({ src: IMG(name), alt, width, height })

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
    // animos.app loop (Grid Dive, approved by Carlos 2026-11-25), web encode of the 1080p master in Drive
    // `Proyectos/the CY studio · Portafolio/animos/caso-pagos-hero/`. `poster` is its frame at 4 s;
    // `sidePosters` are only for a layout without the video.
    poster: screen('hero-poster', L('Pantallas del sistema en movimiento sobre fondo cobalto', 'System screens in motion on a cobalt background'), 1600, 900),
    sidePosters: [
      screen('negocio-globo', L('Panel del negocio afiliado con el recorrido guiado', 'Affiliated business panel with the guided tour'), 1920, 1000),
      screen('bolson-2-pagare', L('Generación del pagaré en el aumento de bolsón', 'Promissory note in the bolsón increase')),
    ],
    video: '/videos/work/payments-credits/hero.mp4' as string | null,
  },

  impact: {
    tag: L('Resultados', 'Results'),
    title: L('De hojas de cálculo a un solo sistema', 'From spreadsheets to one system'),
    line: L(
      'Plataforma principal desde 2025 para los créditos de una financiera.',
      "The main platform since 2025 for a financial institution's credits.",
    ),
    stats: [
      { value: '+4,000', label: L('negocios afiliados', 'affiliated businesses') },
      { value: L('5–8 días', '5–8 days'), label: L('de aprobación a apertura, según la documentación', 'from approval to opening, per the documentation') },
      { value: '8', label: L('operaciones contables', 'accounting operations') },
      { value: '21', label: L('pasos de recorrido guiado', 'guided tour steps') },
    ],
  },

  discovery: {
    tag: L('Descubrimiento', 'Discovery'),
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
      { name: L('Administración', 'Administration'), pain: L('Antes: operación manual, sin seguimiento central.', 'Before: manual operation, no central tracking.'), image: screen('admin', L('Panel de administración de la red', 'Network administration dashboard')) },
      { name: L('Coordinación', 'Coordination'), pain: L('Antes: papel y visitas repetidas, sin trazabilidad.', 'Before: paper and repeat visits, no traceability.'), image: screen('bolson-1-solicitud', L('Vista del coordinador sobre un negocio afiliado', "Coordinator's view of an affiliated business")) },
      { name: L('Negocio afiliado', 'Affiliated business'), pain: L('Antes: apertura lenta y gestiones sin seguimiento.', 'Before: slow opening and untracked requests.'), image: screen('negocio-globo', L('Panel del negocio afiliado', 'Affiliated business panel'), 1920, 1000) },
      { name: L('Contabilidad', 'Accounting'), pain: L('Antes: hojas con datos repetidos y vouchers viejos.', 'Before: sheets with repeated data and outdated vouchers.'), image: screen('f2-sobrante', L('Tabla contable de sobrante y faltante', 'Accounting overage and shortage table'), 1946, 1132) },
    ],
  },

  process: {
    tag: L('Proceso y rol', 'Process and role'),
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

  flow: {
    tag: L('Arquitectura', 'Architecture'),
    title: L('Seis pasos para operar y conciliar', 'Six steps to run and reconcile'),
    line: L('Del resumen general al historial, sin salir a hojas externas.', 'From the overview to the history, without leaving for outside sheets.'),
    steps: [
      { name: L('Resumen general', 'Overview'), image: screen('flujo-1-resumen', L('Resumen general con totales y tabla por operación', 'Overview with totals and a table per operation'), 1408, 228) },
      { name: L('Tabla de la operación', 'Operation table'), image: screen('flujo-2-tabla', L('Tabla de una operación con su estatus', 'Operation table with its status'), 1408, 137) },
      { name: L('Nueva operación', 'New operation'), image: screen('flujo-3-nueva', L('Ventana para registrar una nueva operación', 'Dialog to record a new operation'), 640, 586) },
      { name: L('Detalle en la fila', 'Detail in the row'), image: screen('flujo-4-detalle', L('Fila expandida con el detalle de la operación', 'Expanded row with the operation detail'), 1408, 243) },
      { name: L('Reversa', 'Reversal'), image: screen('flujo-5-reversa', L('Ventana para reversar una operación', 'Dialog to reverse an operation'), 640, 586) },
      { name: L('Historial', 'History'), image: screen('flujo-6-historial', L('Historial de acciones en componentes', 'Action history built from components'), 1408, 263) },
    ],
  },

  decisions: {
    tag: L('Decisiones de diseño', 'Design decisions'),
    title: L('Cinco decisiones de diseño', 'Five design decisions'),
    items: [
      { name: L('Tres columnas fijas', 'Three fixed columns'), text: L('Usuario, bolsón y negocio afiliado quedan a la vista mientras la tabla se desplaza.', 'User, bolsón and affiliated business stay in view while the table scrolls.'), images: [screen('decision-01-columnas', L('La tabla al inicio, a mitad y al final del desplazamiento, con tres columnas fijas', 'The table at the start, middle and end of the scroll, with three fixed columns'), 1408, 854)] },
      { name: L('El detalle, en la fila', 'Detail in the row'), text: L('La fila se expande con hora, monto, usuario operativo, observación y voucher.', 'The row expands with time, amount, operator, note and voucher.'), images: [screen('decision-02-fila', L('Fila expandida con el detalle', 'Expanded row with the detail'), 1408, 594)] },
      { name: L('Capturar sin perder el comprobante', 'Capture without losing the receipt'), text: L('Sobrante y faltante en pestañas, con el comprobante siempre visible.', 'Overage and shortage in tabs, with the receipt always visible.'), images: [screen('decision-03-comprobante', L('Ventana de sobrante y faltante con el comprobante', 'Overage and shortage dialog with the receipt'), 1408, 1028)] },
      { name: L('El historial, en componentes', 'Componentized history'), text: L('Vistas del historial armadas con componentes para crecer con consistencia.', 'History views built from components to grow consistently.'), images: [screen('decision-04-historial', L('Historial de acciones por usuario y rol', 'Action history by user and role'), 1408, 358)] },
      { name: L('Recorrido guiado: globos y video', 'Guided tour: tooltips and video'), text: L('Globos para el primer ingreso y un modal con video en preguntas frecuentes.', 'Tooltips on first visit and a video modal in the FAQ.'), images: [screen('negocio-globo', L('Globo del recorrido guiado sobre el panel', 'Guided tour tooltip over the panel'), 1920, 1000), screen('negocio-modal', L('Modal de ayuda con lista de pasos y video', 'Help modal with a step list and video'), 1920, 1000)] },
    ],
  },

  bolson: {
    tag: L('Aumento de bolsón', 'Bolsón increase'),
    title: L('Aumento de bolsón: el flujo completo', 'Bolsón increase: the full flow'),
    line: L('Tres roles, cuatro etapas y 45 pantallas, con sus caminos alternos y de error.', 'Three roles, four stages and 45 screens, with alternate and error paths.'),
    stages: [
      { role: L('Coordinador', 'Coordinator'), text: L('Solicita el aumento', 'Requests the increase'), image: screen('bolson-1-solicitud', L('El coordinador solicita el aumento', 'The coordinator requests the increase')) },
      { role: L('Analista', 'Analyst'), text: L('Genera el pagaré', 'Generates the promissory note'), image: screen('bolson-2-pagare', L('El analista genera el pagaré', 'The analyst generates the promissory note')) },
      { role: L('Coordinador', 'Coordinator'), text: L('Carga el pagaré firmado', 'Uploads the signed note'), image: screen('bolson-3-firma', L('El coordinador carga el pagaré firmado', 'The coordinator uploads the signed note')) },
      { role: L('Supervisor', 'Supervisor'), text: L('Valida y aprueba', 'Validates and approves'), image: screen('bolson-4-aprobado', L('El supervisor confirma el aumento', 'The supervisor confirms the increase')) },
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
    line: L('Desliza entre la Fase 1 y la Fase 2. Validado también en piloto y QA.', 'Slide between Phase 1 and Phase 2. Also validated in a field pilot and QA.'),
    before: L('Fase 1', 'Phase 1'),
    after: L('Fase 2', 'Phase 2'),
    tabs: [
      { name: L('Sobrante y faltante', 'Overage and shortage'), before: screen('f1-sobrante', L('Fase 1: tabla sin columna de estatus', 'Phase 1: table with no status column'), 1946, 1132), after: screen('f2-sobrante', L('Fase 2: tabla con columna de estatus al inicio', 'Phase 2: table with a status column first'), 1946, 1132) },
      { name: L('Confronta de bancos', 'Bank reconciliation'), before: screen('f1-confronta', L('Fase 1: la columna se llamaba bolsón', 'Phase 1: the column was called bolsón'), 1946, 1132), after: screen('f2-confronta', L('Fase 2: la columna pasa a cuenta corriente', 'Phase 2: the column becomes current account'), 1946, 1132) },
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
