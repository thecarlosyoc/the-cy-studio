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
    // The role shown is the work item's own (`work_items.role`), the same list as /work/payments-credits,
    // so the two pages cannot differ. This line only stands in if the item fails to load.
    role: L('Diseñador UX/UI', 'UX/UI Designer'),
    facts: [
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
    context: L(
      'La red de negocios afiliados de una financiera procesa pagos de servicios, remesas, servicios municipales, telefonía y ventas por catálogo.',
      "A financial institution's network of affiliated businesses processes utility payments, remittances, municipal services, telecom and catalog sales.",
    ),
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
      { name: L('Administración', 'Administration'), pain: L('Antes: operación manual, sin seguimiento central.', 'Before: manual operation, no central tracking.'), image: focus(screen('admin', L('Panel de administración de la red', 'Network administration dashboard')), 46, 0, 1.33) },
      { name: L('Coordinación', 'Coordination'), pain: L('Antes: papel y visitas repetidas, sin trazabilidad.', 'Before: paper and repeat visits, no traceability.'), image: focus(screen('bolson-1-solicitud', L('Vista del coordinador sobre un negocio afiliado', "Coordinator's view of an affiliated business")), 50, 50, 1.6) },
      { name: L('Negocio afiliado', 'Affiliated business'), pain: L('Antes: apertura lenta y gestiones sin seguimiento.', 'Before: slow opening and untracked requests.'), image: focus(screen('negocio-globo', L('Panel del negocio afiliado', 'Affiliated business panel'), 1920, 1000), 100, 18, 1.6) },
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
      { name: L('Diseño UX/UI · mi rol', 'UX/UI design · my role'), text: L('Tablas e interacciones, vouchers, ayuda, aumento de bolsón, componentes del sistema de diseño y componentes para ambos dashboards.', 'Tables and interactions, vouchers, help, the bolsón increase, design system components and components for both dashboards.'), mine: true },
      { name: L('Área contable', 'Accounting team'), text: L('Datos críticos y validación sobre el prototipo.', 'Critical data and validation on the prototype.'), mine: false },
      { name: L('Jefaturas de UX, CX y UI', 'UX, CX and UI leads'), text: L('Lineamientos, QA interno y aprobación final.', 'Guidelines, internal QA and final approval.'), mine: false },
    ],
    teamNote: L('Equipo: +5 diseñadores y +8 programadores', 'Team: 5+ designers and 8+ developers'),
  },

  // Opener of the product part: a dark band with the accounting screen under one line. Not pinned
  // (Carlos, 2026-11-25): the page keeps its pinned scenes for the table and the dashboards.
  threshold: {
    image: screen('f2-sobrante', L('Tabla contable de sobrante y faltante', 'Accounting overage and shortage table'), 1920, 1117),
    line: L('Contabilidad opera y concilia cada movimiento *sin hojas de cálculo*.', 'Accounting runs and reconciles every transaction *without spreadsheets*.'),
  },

  // The six steps of the accounting flow (overview, operation table, new operation, row detail, reversal,
  // history) grouped in four stops, each one with the design decision behind it.
  operate: {
    tag: L('Arquitectura y decisiones', 'Architecture and decisions'),
    title: L('Operar y conciliar: cada paso, una decisión', 'Run and reconcile: each step, one decision'),
    // Step 1 is the table itself: the summary cards, then three fixed columns with the rest sliding behind
    // them through the three real scroll states of the capture.
    table: {
      cards: screen('resumen-tarjetas', L('Resumen general con los totales del periodo', 'Overview with the totals of the period'), 2816, 291),
      fixed: screen('tabla-fija', L('Columnas fijas: usuario, bolsón y negocio afiliado', 'Fixed columns: user, bolsón and affiliated business'), 1383, 424),
      states: [
        screen('tabla-cols-1', L('Al inicio: saldo inicial, operatoria, confronta de bancos y pago manual', 'At the start: opening balance, operations, bank reconciliation and manual payment'), 1390, 424),
        screen('tabla-cols-2', L('A la mitad: recolección, ajustes manuales y sobrante o faltante', 'Midway: collection, manual adjustments and overage or shortage'), 1390, 424),
        screen('tabla-cols-3', L('Al final: reintegro, reversas, negocio en castigo y total', 'At the end: refunds, reversals, penalized business and total'), 1390, 424),
      ],
      // Without the pinned scene (phone, reduced motion) the same three states, stacked in one capture.
      still: screen('decision-01-columnas', L('La tabla al inicio, a mitad y al final del desplazamiento, con tres columnas fijas', 'The table at the start, middle and end of the scroll, with three fixed columns'), 2816, 1745),
    },
    steps: [
      { name: L('Resumen general', 'Overview'), decision: L('Tres columnas fijas', 'Three fixed columns'), text: L('Usuario, bolsón y negocio afiliado quedan a la vista mientras la tabla se desplaza.', 'User, bolsón and affiliated business stay in view while the table scrolls.'), images: [] as SceneImage[] },
      { name: L('Tabla y detalle', 'Table and detail'), decision: L('El detalle, en la fila', 'Detail in the row'), text: L('La fila se expande con hora, monto, usuario operativo, observación y voucher.', 'The row expands with time, amount, operator, note and voucher.'), images: [box(screen('decision-02-fila', L('Fila expandida con el detalle', 'Expanded row with the detail'), 2816, 1152), 100, 100)] },
      { name: L('Nueva operación y reversa', 'New operation and reversal'), decision: L('Capturar sin perder el comprobante', 'Capture without losing the receipt'), text: L('Sobrante y faltante en pestañas, con el comprobante siempre visible.', 'Overage and shortage in tabs, with the receipt always visible.'), images: [box(screen('decision-03-comprobante', L('Ventana de sobrante y faltante con el comprobante', 'Overage and shortage dialog with the receipt'), 2816, 2138), 58, 100), box(screen('flujo-5-reversa', L('Ventana para reversar una operación', 'Dialog to reverse an operation'), 1280, 1172), 38, 82)] },
      { name: L('Historial', 'History'), decision: L('El historial, en componentes', 'Componentized history'), text: L('Vistas del historial armadas con componentes para crecer con consistencia.', 'History views built from components to grow consistently.'), images: [box(screen('decision-04-historial', L('Historial de acciones por usuario y rol', 'Action history by user and role'), 2816, 668), 100, 100)] },
    ],
  },

  // Fifth decision, on its own: it belongs to the affiliated business, not to the accounting flow.
  tour: {
    tag: L('Ayuda', 'Help'),
    title: L('Recorrido guiado: globos y video', 'Guided tour: tooltips and video'),
    line: L('Globos para el primer ingreso y un modal con video en preguntas frecuentes.', 'Tooltips on first visit and a video modal in the FAQ.'),
    images: [
      focus(screen('negocio-globo', L('Globo del recorrido guiado sobre el panel', 'Guided tour tooltip over the panel'), 1920, 1000), 100, 18, 1.6),
      focus(screen('negocio-modal', L('Modal de ayuda con lista de pasos y video', 'Help modal with a step list and video'), 1920, 1000), 50, 50, 1.2),
    ],
  },

  bolson: {
    tag: L('Aumento de bolsón', 'Bolsón increase'),
    title: L('Aumento de bolsón: el flujo completo', 'Bolsón increase: the full flow'),
    line: L('Tres roles, cuatro etapas y 45 pantallas, con sus caminos alternos y de error.', 'Three roles, four stages and 45 screens, with alternate and error paths.'),
    // Square cards, four in a row: 1.4 holds the 720 px dialog at about 93 % of the card's width.
    stages: [
      { role: L('Coordinador', 'Coordinator'), text: L('Solicita el aumento', 'Requests the increase'), image: focus(screen('bolson-1-solicitud', L('El coordinador solicita el aumento', 'The coordinator requests the increase')), 50, 50, 1.4) },
      { role: L('Analista', 'Analyst'), text: L('Genera el pagaré', 'Generates the promissory note'), image: focus(screen('bolson-2-pagare', L('El analista genera el pagaré', 'The analyst generates the promissory note')), 50, 50, 1.4) },
      { role: L('Coordinador', 'Coordinator'), text: L('Carga el pagaré firmado', 'Uploads the signed note'), image: focus(screen('bolson-3-firma', L('El coordinador carga el pagaré firmado', 'The coordinator uploads the signed note')), 50, 50, 1.4) },
      { role: L('Supervisor', 'Supervisor'), text: L('Valida y aprueba', 'Validates and approves'), image: focus(screen('bolson-4-aprobado', L('El supervisor confirma el aumento', 'The supervisor confirms the increase')), 50, 46, 1.4) },
    ],
    paths: [
      { kind: L('Camino alterno', 'Alternate path'), text: L('El analista devuelve el monto con su motivo.', 'The analyst returns the amount with a reason.'), image: screen('bolson-alt-modal', L('Modal: el analista devuelve el monto con su motivo', 'Modal: the analyst returns the amount with a reason'), 720, 709) },
      { kind: L('Camino de error', 'Error path'), text: L('Un monto no permitido no pasa.', 'An amount out of range is blocked.'), image: screen('bolson-neg-modal', L('Modal: aviso de monto no permitido', 'Modal: amount out of range warning'), 720, 409) },
    ],
    rules: [
      L('Una solicitud abierta por negocio', 'One open request per business'),
      L('Toda devolución lleva motivo', 'Every return carries a reason'),
      L('El monto aprobado queda bloqueado', 'The approved amount is locked'),
    ],
    count: L('45 pantallas · 20 principales · 19 alternas · 6 de error', '45 screens · 20 main · 19 alternate · 6 error'),
  },

  // Design system: four component groups (2816 px captures, shown at most 1408 CSS px wide) and the
  // dashboard components in each panel on a laptop and a phone. The 1125 px mobile captures are 3x of 375
  // and very tall, so they are held on the top of the phone screen.
  system: {
    tag: L('Sistema de diseño', 'Design system'),
    title: L('Cuatro grupos de componentes del sistema', 'Four component groups in the system'),
    line: L(
      'Tablas, modales, tooltips y tarjetas, más componentes para los paneles de administración y del negocio afiliado.',
      'Tables, modals, tooltips and cards, plus components for the administration and affiliated business panels.',
    ),
    // Each sheet whole inside one 16:10 box: under 1 the sheet shrinks onto a mat of its own colour (`mat`)
    // instead of losing an edge.
    groups: [
      { name: L('Tablas y grids', 'Tables and grids'), text: L('Barra de acciones, celdas, etiquetas de estado, paginación y estado vacío de la tabla de datos.', 'Action bar, cells, status tags, pagination and the empty state of the data table.'), image: focus(screen('ds-tablas', L('Componentes de la tabla de datos: barra de acciones, celdas en dos tamaños, etiquetas de estado, paginación y estado vacío', 'Data table components: action bar, cells in two sizes, status tags, pagination and empty state'), 2816, 1611), 50, 50, 0.94), mat: '#f5f5f5' },
      { name: L('Modales y overlays', 'Modals and overlays'), text: L('Panel de notificaciones por prioridad y modal con listado.', 'Notification panel by priority and a list modal.'), image: focus(screen('ds-modales', L('Panel de notificaciones en dos variantes y modal con listado en dos variantes', 'Notification panel in two variants and list modal in two variants'), 2816, 1413), 50, 50, 0.8), mat: '#fafafc' },
      { name: L('Tooltips y stepper', 'Tooltips and stepper'), text: L('Tooltip en doce posiciones y steppers horizontal y vertical, con sus estados.', 'Tooltip in twelve positions and horizontal and vertical steppers, with their states.'), image: focus(screen('ds-tooltips', L('Tooltip en doce posiciones y steppers horizontal y vertical con sus estados', 'Tooltip in twelve positions and horizontal and vertical steppers with their states'), 2816, 1634), 50, 50, 0.95), mat: '#f5f5f5' },
      { name: L('Tarjetas y KPIs', 'Cards and KPIs'), text: L('Tarjetas de resumen, el componente principal de bolsón, heatmaps, donas y la gráfica de transacciones con scroll horizontal.', 'Summary cards, the main bolsón component, heatmaps, donuts and the transactions chart with horizontal scroll.'), image: focus(screen('ds-tarjetas', L('Tarjetas de resumen en estado normal, hover y deshabilitado, tarjeta de bolsón con anillo, heatmap, dona y gráfica de transacciones', 'Summary cards in default, hover and disabled states, the bolsón card with its ring, heatmap, donut and transactions chart'), 2816, 2093), 50, 50, 0.84), mat: '#fafafc' },
    ],
    dashboards: {
      title: L('Componentes en ambos dashboards', 'Components across both dashboards'),
      line: L(
        'Componentes construidos para el panel de administración y el panel del negocio afiliado, en móvil y escritorio.',
        'Components built for the administration panel and the affiliated business panel, on mobile and desktop.',
      ),
      // One stage, two states: while the page scrolls, the screens of the active state scroll their own
      // content; at the middle of the hold the stage swaps to the next state. Full-height captures, sizes in px
      // of the capture itself. Desktop: `sidebar` width and `header` height stay fixed while the rest scrolls.
      // Phone: `status` bar height stays fixed; `skip` rows (the browser bar) never show, the app starts there.
      states: [
        {
          label: L('Admin', 'Admin'),
          caption: L('Panel de administración', 'Administration panel'),
          desktop: { ...screen('dash-admin-escritorio', L('Panel de administración en escritorio: indicadores y gráficas de la red', 'Administration panel on desktop: network indicators and charts'), 2880, 3288), sidebar: 420, header: 96 },
          mobile: { ...screen('dash-admin-movil', L('Panel de administración en móvil: indicadores en tiempo real y gráficas de transacciones', 'Administration panel on mobile: real-time indicators and transaction charts'), 1125, 10422), status: 112, skip: 236 },
        },
        {
          label: L('Cliente', 'Client'),
          caption: L('Panel del negocio afiliado', 'Affiliated business panel'),
          desktop: { ...screen('dash-negocio-escritorio', L('Panel del negocio afiliado en escritorio: bolsón, próximo pago y rendimiento', 'Affiliated business panel on desktop: bolsón, next payment and performance'), 2880, 2040), sidebar: 420, header: 96 },
          mobile: { ...screen('dash-negocio-movil', L('Panel del negocio afiliado en móvil: bolsón disponible y días para el próximo pago', 'Affiliated business panel on mobile: available bolsón and days to the next payment'), 1125, 3984), status: 112, skip: 236 },
        },
      ],
    },
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
    title: L('Cuatro aprendizajes', 'Four takeaways'),
    learnings: [
      L('Depurar los datos con operación antes de diseñar tablas.', 'Clean the data with operations before designing tables.'),
      L('Componentizar las vistas secundarias desde el inicio.', 'Componentize secondary views from the start.'),
      L('Hacer responsive las variables de los componentes: una gráfica con mucha información lleva scroll interno.', 'Make component variables responsive: a chart with a lot of data gets its own inner scroll.'),
      L('Hablar directo con los stakeholders de otros departamentos. Fue el primer proyecto con ese papel, y abrió la puerta a liderar los siguientes.', 'Talk directly with stakeholders from other departments. It was the first project in that role, and it opened the door to leading the next ones.'),
    ],
    next: L('Siguiente caso', 'Next case'),
  },
} as const
