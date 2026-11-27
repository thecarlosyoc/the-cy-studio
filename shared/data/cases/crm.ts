// shared/data/cases/crm.ts
// Copy and media for the scene-based case page of /work/crm (ES + EN).
// Source of truth for the facts: the-cy-studio-core/proyectos/the-cy-studio/caso-crm.md (Borrador 2, answered by
// Carlos on 2026-11-26). Screens come from Figma wlRwRDEcIsMq4HYgytgo21, page «Portfolio · Boards»: cleaned
// duplicates, no real names, no employer or third-party brand. Screens drawn by another designer of the team
// (the Clientes list, Clientes sin productos) are never shown here.
import type { CaseStudy, SceneImage } from '#shared/types/caseStudy'
import type { LocalizedText } from '#shared/types/content'

const L = (es: string, en: string): LocalizedText => ({ es, en })
const IMG = (name: string) => `/images/work/crm/${name}.webp`

const screen = (name: string, alt: LocalizedText, width = 3840, height = 2160): SceneImage => ({ src: IMG(name), alt, width, height })
const focus = (img: SceneImage, x: number, y: number, zoom: number): SceneImage => ({ ...img, focus: [x, y, zoom] })
const box = (img: SceneImage, w: number, h: number): SceneImage => ({ ...img, box: [w, h] })

// Shared screens, used by more than one scene.
const infoGeneral = screen('info-general', L('Vista 360 del cliente: información general con perfil, créditos vigentes y contactabilidad', "Client 360 view: general information with profile, active credits and contact details"), 3840, 2992)
const infoAntes = screen('info-general-antes', L('Versión anterior de la información general del cliente', "Earlier version of the client's general information"), 3840, 2352)
const infoDespues = screen('info-general-despues', L('Versión final de la información general del cliente', "Final version of the client's general information"), 3840, 2352)
const pipeline = screen('pipeline', L('Pipeline de oportunidades en columnas: contactado, interesado, en espera, aprobado y rechazado', 'Opportunities pipeline in columns: contacted, interested, on hold, approved and rejected'))

export const crmCase: CaseStudy = {
  slug: 'crm',
  footnote: L('Pantallas reales con datos anonimizados.', 'Real screens with anonymized data.'),

  hero: {
    tag: L('Caso de estudio · Producto digital', 'Case study · Digital product'),
    title: L('CRM de gestión de clientes', 'Customer management CRM'),
    line: L(
      'Reúne en una vista 360 el historial, los productos y el seguimiento de cada cliente.',
      "Brings each client's history, products and follow-up together in a 360 view.",
    ),
    // The role shown is the work item's own (`work_items.role`); this line only stands in if it fails to load.
    role: L('Diseñador UX/UI', 'UX/UI Designer'),
    facts: [
      { label: L('Equipo', 'Team'), value: L('3 diseñadores · CX · PO · TI', '3 designers · CX · PO · IT') },
      { label: L('Periodo', 'Period'), value: L('2025–2026 · en desarrollo', '2025–2026 · in development') },
      { label: L('Plataforma', 'Platform'), value: L('Web, escritorio y móvil', 'Web, desktop and mobile') },
    ],
    statsNote: L('Diseñado para la cartera de una financiera de microcrédito.', "Designed for a microcredit lender's client portfolio."),
    stats: [
      { value: '+500,000', label: L('clientes activos en la cartera', 'active clients in the portfolio') },
      { value: '4', label: L('pestañas en la vista 360', 'tabs in the 360 view') },
      { value: '3', label: L('breakpoints, en claro y oscuro', 'breakpoints, in light and dark') },
      { value: '4', label: L('versiones del pipeline, una por rol', 'pipeline versions, one per role') },
    ],
    poster: screen('hero-poster', L('Pantallas del CRM en movimiento sobre fondo cobalto', 'CRM screens in motion on a cobalt background'), 1920, 1080),
    video: '/videos/work/crm/hero.mp4',
  },

  scenes: [
    {
      kind: 'discovery',
      tag: L('El problema', 'The problem'),
      title: L('Cinco hallazgos antes de diseñar', 'Five findings before designing'),
      context: L(
        'Una financiera de microcrédito no tenía un CRM para dar seguimiento a sus clientes ni para trazar sus productos.',
        'A microcredit lender had no CRM to follow up on its clients or to trace their products.',
      ),
      line: L(
        'Entrevistas con todos los roles, con sesiones en sucursal, con el call center y con el Product Owner.',
        'Interviews with every role, including sessions at a branch, with the call center and with the Product Owner.',
      ),
      findings: [
        L('Los datos del cliente vivían en varios sistemas y hojas.', 'Client data lived across several systems and spreadsheets.'),
        L('El asesor no veía productos ni pagos en un solo lugar.', 'Advisors could not see products and payments in one place.'),
        L('Llamadas, visitas y mensajes no quedaban registrados.', 'Calls, visits and messages left no record.'),
        L('Los prospectos se anotaban en papel o en Excel.', 'Prospects were written down on paper or in Excel.'),
        L('Los supervisores no veían el avance de su equipo.', "Supervisors could not see their team's progress."),
      ],
    },

    {
      kind: 'process',
      tag: L('Cómo se hizo', 'How it was made'),
      title: L('Diseñado con sucursal, call center y CX', 'Designed with the branch, the call center and CX'),
      stages: [
        { name: L('Descubrimiento', 'Discovery'), text: L('Entrevistas en sucursal, en el call center y con el PO.', 'Interviews at a branch, in the call center and with the PO.') },
        { name: L('Definición', 'Definition'), text: L('Vista 360, roles y niveles de navegación.', '360 view, roles and navigation levels.') },
        { name: L('Diseño', 'Design'), text: L('Escritorio y móvil, en claro y oscuro.', 'Desktop and mobile, in light and dark.') },
        { name: L('Validación', 'Validation'), text: L('Iteraciones validadas por la jefatura de CX.', 'Iterations validated by the CX lead.') },
        { name: L('Entrega', 'Delivery'), text: L('QA y pixel perfect con el equipo de TI.', 'QA and pixel-perfect passes with the IT team.') },
      ],
      team: [
        { name: L('Diseño UX/UI · mi rol', 'UX/UI design · my role'), text: L('La vista 360 completa, el flujo de cliente nuevo en sucursal, el pipeline de oportunidades y componentes que pasaron al sistema de diseño de la organización.', "The whole 360 view, the new client flow at the branch, the opportunities pipeline and components that moved into the organization's design system."), mine: true },
        { name: L('Jefatura de CX', 'CX lead'), text: L('Pidió y validó las iteraciones de la vista 360.', 'Requested and validated the 360 view iterations.'), mine: false },
        { name: L('Equipo de TI', 'IT team'), text: L('Desarrollo, QA y ajustes de pixel perfect.', 'Development, QA and pixel-perfect adjustments.'), mine: false },
      ],
      teamNote: L('Equipo: 3 diseñadores, jefatura de CX, Product Owner y equipo de TI', 'Team: 3 designers, a CX lead, a Product Owner and the IT team'),
    },

    // User personas, one per role that serves the client (Admin left out to keep four, Carlos 2026-11-26).
    // Name, age and photo are an illustrative archetype (photos generated with Gemini, no real person); what each
    // one thinks, needs and lacks comes from the interviews (case draft in the core). The same four live in the
    // FigJam board «CRM · Personas y mapas», section «User personas». `image` is required by the block but not
    // shown in persona mode.
    {
      kind: 'users',
      tag: L('User personas', 'User personas'),
      title: L('Cuatro personas, una misma cartera', 'Four personas, one client portfolio'),
      line: L('Una persona por cada rol que atiende al cliente.', 'One persona for each role that serves the client.'),
      roles: [
        {
          name: L('Asesor de sucursal', 'Branch advisor'),
          persona: {
            who: L('Mariela · 31 años', 'Mariela · 31'),
            photo: screen('persona-mariela-oficina', L('Mariela atiende a un cliente en su escritorio de la sucursal', 'Mariela serves a client at her desk in the branch'), 1024, 1024),
            context: L('Sucursal, en escritorio.', 'Branch office, on desktop.'),
            tasks: L('Flujo de cliente nuevo, vista 360 y agenda.', 'New client flow, 360 view and agenda.'),
            quote: L('Lo anoto en papel y no sé si ya tiene productos con nosotros.', "I write it down on paper and I don't know if they already have products with us."),
            goal: L('Saber al instante si quien llega ya es cliente y registrar su interés sin fricción.', 'Know at once whether the person in front of her is already a client, and log their interest without friction.'),
            change: L('El DPI identifica al cliente al instante; formulario único, modal de prospecto y agenda en un solo flujo.', 'The national ID (DPI) identifies the client at once; a single form, a prospect dialog and the agenda in one flow.'),
          },
          pain: L('Prospectos en papel o Excel, sin trazabilidad.', 'Prospects on paper or in Excel, with no traceability.'),
          image: infoGeneral,
        },
        {
          name: L('Agente de campo', 'Field agent'),
          persona: {
            who: L('Diego · 27 años', 'Diego · 27'),
            photo: screen('persona-diego-moto', L('Diego revisa su teléfono junto a su moto en el centro de un municipio antes de una visita', 'Diego checks his phone beside his motorcycle in a town center before a visit'), 1024, 1024),
            context: L('En campo, desde el móvil.', 'In the field, on his phone.'),
            tasks: L('Vista 360 en móvil, oportunidades y visitas.', '360 view on mobile, opportunities and visits.'),
            quote: L('Llego a la visita sin saber cómo va su crédito, y si no lo encuentro nadie se entera.', "I show up to a visit without knowing how their credit is going, and if they're not home nobody finds out."),
            goal: L('Consultar historial, ubicación y estado de crédito antes y durante cada visita.', 'Check history, location and credit status before and during every visit.'),
            change: L('Lleva en el teléfono la vista 360, la ruta de desarrollo, la ubicación y sus oportunidades por campaña.', 'Carries the 360 view, the development path, the location and his opportunities by campaign on his phone.'),
          },
          pain: L('Visitas sin historial ni registro de visitas fallidas.', 'Visits with no history and no record of missed visits.'),
          image: infoGeneral,
        },
        {
          name: L('Agente central', 'Central agent'),
          persona: {
            who: L('Sofía · 24 años', 'Sofía · 24'),
            photo: screen('persona-sofia-camisa', L('Sofía toma notas con su diadema puesta en el call center', 'Sofía takes notes with her headset on in the call center'), 1024, 1024),
            context: L('Call center, en escritorio.', 'Call center, on desktop.'),
            tasks: L('Marcadores de llamada, SMS, correo y WhatsApp; actividades y oportunidades.', 'Call, SMS, e-mail and WhatsApp markers; activities and opportunities.'),
            quote: L('Llamo desde un sistema y anoto en otro; cuando vuelvo a llamar no sé qué le dijeron.', "I call from one system and take notes in another; when I call back I don't know what they were told."),
            goal: L('Contactar clientes y registrar cada gestión sin cambiar de herramienta.', 'Contact clients and log every action without switching tools.'),
            change: L('Contacta desde el CRM y cada interacción queda en Actividades.', 'She contacts clients from the CRM and every interaction is logged in Activities.'),
          },
          pain: L('Llamadas en otro sistema, sin rastro de contactos previos.', 'Calls in a separate system, with no trace of earlier contacts.'),
          image: infoGeneral,
        },
        {
          name: L('Supervisor', 'Supervisor'),
          persona: {
            who: L('Héctor · 41 años', 'Héctor · 41'),
            photo: screen('persona-hector-central', L('Héctor revisa su laptop en las oficinas centrales', 'Héctor reviews his laptop at the head office'), 1024, 1024),
            context: L('Oficinas centrales, en escritorio.', 'Head office, on desktop.'),
            tasks: L('Pipelines por región y sucursal, campañas, reportes y KPIs.', 'Pipelines by region and branch, campaigns, reports and KPIs.'),
            quote: L('No veo en un solo lugar cómo avanzan mis asesores ni cuánto tiempo están conectados.', "I can't see in one place how my advisors are doing or how long they're logged in."),
            goal: L('Ver en tiempo real el embudo comercial y el desempeño de su equipo.', "See the sales funnel and his team's performance in real time."),
            change: L('Monitorea el pipeline, las campañas y los KPIs de su región en un solo panel.', "He follows his region's pipeline, campaigns and KPIs in one panel."),
          },
          pain: L('Sin visibilidad del avance de su equipo.', "No view of his team's progress."),
          image: pipeline,
        },
      ],
      note: L(
        'Personas arquetipo: nombre, edad y foto (generada con IA) son ilustrativos. Lo que piensan, necesitan y les duele sale de las entrevistas en sucursal, con el call center y con el Product Owner.',
        'Archetype personas: name, age and photo (AI-generated) are illustrative. What they think, need and struggle with comes from the interviews at a branch, with the call center and with the Product Owner.',
      ),
    },

    // The FigJam maps («CRM · Personas y mapas»): module map by role and three user flows, one export per language.
    {
      kind: 'maps',
      tag: L('Mapas', 'Maps'),
      title: L('Módulos por rol y tres flujos', 'Modules by role and three flows'),
      line: L('El mapa de módulos por rol y los tres flujos que ordenaron el diseño.', 'The module map by role and the three flows that shaped the design.'),
      maps: [
        {
          name: L('Mapa de módulos por rol', 'Module map by role'),
          text: L('Un solo CRM con menú lateral; por rol cambian los módulos y los filtros.', 'One CRM with a side menu; modules and filters change by role.'),
          image: {
            es: screen('mapa-modulos-es', L('Mapa de módulos: inicio de sesión, menú lateral, clientes, vista 360 con sus cuatro pestañas y acceso por rol', 'Module map: sign-in, side menu, clients, the 360 view with its four tabs and access by role'), 2962, 3120),
            en: screen('mapa-modulos-en', L('Mapa de módulos: inicio de sesión, menú lateral, clientes, vista 360 con sus cuatro pestañas y acceso por rol', 'Module map: sign-in, side menu, clients, the 360 view with its four tabs and access by role'), 2962, 3120),
          },
        },
        {
          name: L('Cliente nuevo en sucursal', 'New client at the branch'),
          text: L('El DPI abre el flujo; si la persona ya es cliente, lleva a su vista 360.', "The national ID opens the flow; if the person is already a client, it leads to their 360 view."),
          image: {
            es: screen('mapa-sucursal-es', L('Flujo de cliente nuevo en sucursal con sus caminos alternos y de error', 'New client flow at the branch with its alternate and error paths'), 3180, 1020),
            en: screen('mapa-sucursal-en', L('Flujo de cliente nuevo en sucursal con sus caminos alternos y de error', 'New client flow at the branch with its alternate and error paths'), 3180, 1020),
          },
        },
        {
          name: L('Contacto y seguimiento', 'Contact and follow-up'),
          text: L('Llamada, SMS, correo o WhatsApp; cada contacto queda en Actividades.', 'Call, SMS, e-mail or WhatsApp; every contact is logged in Activities.'),
          image: {
            es: screen('mapa-contacto-es', L('Flujo de contacto por canal hasta el registro en Actividades', 'Contact flow by channel up to the record in Activities'), 3000, 1440),
            en: screen('mapa-contacto-en', L('Flujo de contacto por canal hasta el registro en Actividades', 'Contact flow by channel up to the record in Activities'), 3000, 1440),
          },
        },
        {
          name: L('Oportunidades', 'Opportunities'),
          text: L('Cuatro etapas con salida a Rechazado y filtros por rol.', 'Four stages with an exit to Rejected and filters by role.'),
          image: {
            es: screen('mapa-oportunidades-es', L('Flujo de oportunidades: contactado, interesado, en espera y aprobado, con salida a rechazado', 'Opportunities flow: contacted, interested, on hold and approved, with an exit to rejected'), 2875, 1613),
            en: screen('mapa-oportunidades-en', L('Flujo de oportunidades: contactado, interesado, en espera y aprobado, con salida a rechazado', 'Opportunities flow: contacted, interested, on hold and approved, with an exit to rejected'), 2875, 1613),
          },
        },
      ],
      note: L('Diagramas redibujados en FigJam para este portafolio; reflejan el proyecto real.', 'Diagrams redrawn in FigJam for this portfolio; they reflect the real project.'),
    },

    {
      kind: 'threshold',
      image: infoGeneral,
      line: L('Todo el cliente *en una sola vista*.', 'The whole client *in one view*.'),
    },

    // The four steps of the new client flow at the branch, each with the decision behind it.
    {
      kind: 'decisions',
      tag: L('Arquitectura y decisiones', 'Architecture and decisions'),
      title: L('Cliente nuevo en sucursal: cada paso, una decisión', 'New client at the branch: each step, one decision'),
      steps: [
        {
          name: L('Ingreso de DPI', 'National ID entry'),
          decision: L('Empezar por el DPI', 'Start with the ID'),
          text: L('El sistema sabe al instante si la persona ya es cliente y abre su vista 360 en vez de duplicarla.', 'The system knows at once whether the person is already a client and opens their 360 view instead of a duplicate.'),
          images: [box(screen('lead-dpi', L('Registro de clientes: el asesor ingresa el DPI para continuar', 'Client registration: the advisor enters the national ID to continue'), 1680, 1120), 80, 100)],
        },
        {
          name: L('Formulario único', 'Single form'),
          decision: L('Todo en un formulario', 'Everything in one form'),
          text: L('Teléfono, correo, cómo conoció a la financiera y entrega de volante, en una sola pantalla.', 'Phone, e-mail, how they heard of the lender and flyer delivery, on one screen.'),
          images: [box(screen('lead-perfil', L('Formulario único: datos personales, contacto y cómo conoció a la financiera', 'Single form: personal details, contact and how they heard of the lender'), 2336, 1648), 100, 100)],
        },
        {
          name: L('Productos y prospecto', 'Products and prospect'),
          decision: L('Cotizar sin salir del catálogo', 'Quote without leaving the catalog'),
          text: L('Un filtro de rango, y el monto y el plazo se cotizan sobre la misma lista de productos.', 'A range filter, and the amount and term are quoted on the product list itself.'),
          images: [box(screen('lead-modal', L('Producto escogido con el monto y el plazo a cotizar, bajo el filtro de rango', 'Chosen product with the amount and term to quote, under the range filter'), 2336, 1400), 100, 100)],
        },
        {
          name: L('Agenda y cliente nuevo', 'Agenda and new client'),
          decision: L('Ningún prospecto sin seguimiento', 'No prospect without a follow-up'),
          text: L('Agenda y notas antes de cerrar; después pasaron al menú lateral para abrirlas desde cualquier pantalla.', 'Agenda and notes before closing; later they moved to the side menu, one click away from any screen.'),
          images: [
            box(screen('lead-agenda', L('Agenda y notas para programar el siguiente contacto', 'Agenda and notes to schedule the next contact'), 1984, 928), 62, 100),
            box(screen('lead-cliente-nuevo', L('Resumen del prospecto con la razón de interés y el producto cotizado', 'Prospect summary with the reason for the visit and the quoted product'), 1142, 1632), 30, 90),
          ],
        },
      ],
    },

    {
      kind: 'pair',
      tag: L('Seguimiento', 'Follow-up'),
      title: L('Actividades y ruta de desarrollo', 'Activities and development path'),
      line: L(
        'Actividades reúne llamadas, visitas y mensajes; la grabación, la transcripción y el resumen con IA fueron una propuesta de integración del equipo de diseño. La ruta de desarrollo muestra los ejes social y financiero del cliente.',
        "Activities brings calls, visits and messages together; recording, transcription and the AI summary were an integration proposed by the design team. The development path shows the client's social and financial axes.",
      ),
      images: [
        focus(screen('actividades', L('Actividades: llamada con grabación, transcripción y resumen con IA en la línea de tiempo', 'Activities: a call with recording, transcription and AI summary on the timeline')), 100, 55, 1.4),
        focus(screen('ruta', L('Ruta de desarrollo con los ejes social y financiero del cliente', "Development path with the client's social and financial axes")), 50, 50, 1.2),
      ],
    },

    {
      kind: 'flow',
      tag: L('Oportunidades', 'Opportunities'),
      title: L('Pipeline de oportunidades por rol', 'Opportunities pipeline by role'),
      line: L('Una misma pantalla para cuatro roles: cambian los filtros y los permisos.', 'One screen for four roles: filters and permissions change.'),
      stages: [
        { role: L('Agente de campo', 'Field agent'), text: L('Filtra por campaña y temporalidad', 'Filters by campaign and period'), image: focus(screen('pipeline-campo', L('Pipeline del agente de campo, con filtros de campaña y temporalidad', "The field agent's pipeline, with campaign and period filters")), 23, 36, 1.4) },
        { role: L('Agente central', 'Central agent'), text: L('Suma el filtro de sucursal', 'Adds the branch filter'), image: focus(screen('pipeline-central', L('Pipeline del agente central, con filtro de sucursal', "The central agent's pipeline, with a branch filter")), 23, 36, 1.4) },
        { role: L('Supervisor', 'Supervisor'), text: L('Suma región y sucursal', 'Adds region and branch'), image: focus(screen('pipeline-supervisor', L('Pipeline del supervisor, con filtros de región y sucursal', "The supervisor's pipeline, with region and branch filters")), 23, 36, 1.4) },
        { role: L('Admin', 'Admin'), text: L('Suma el filtro de supervisor', 'Adds the supervisor filter'), image: focus(screen('pipeline-admin', L('Pipeline del administrador, con filtro de supervisor', "The administrator's pipeline, with a supervisor filter")), 77, 36, 1.4) },
      ],
      pathsTitle: L('Otra vista', 'Another view'),
      paths: [
        { kind: L('Vista de lista', 'List view'), text: L('Las mismas oportunidades en una tabla, con su valor y su probabilidad de éxito.', 'The same opportunities in a table, with their value and probability of success.'), image: screen('pipeline-detalle', L('Vista de lista: filtros, total de ventas y ventas esperadas, y la tabla con valor y probabilidad de éxito', 'List view: filters, sales total and expected sales, and the table with value and probability of success'), 1872, 1080) },
      ],
      rules: [
        L('Por rol cambian filtros y permisos, no la pantalla', 'Filters and permissions change by role, not the screen'),
        L('Cada oportunidad avanza por cuatro etapas', 'Every opportunity moves through four stages'),
        L('El detalle se agrupa por semana de cierre', 'The detail view groups by closing week'),
      ],
      count: L('4 versiones por rol · 4 etapas y una salida', '4 role versions · 4 stages and one exit'),
    },

    {
      kind: 'validation',
      tag: L('Validación', 'Validation'),
      title: L('La jefatura de CX validó cada iteración', 'The CX lead validated each iteration'),
      line: L('Información general, antes y después: menos ruido y el crédito a la vista.', 'General information, before and after: less noise and credit in view.'),
      before: L('Antes', 'Before'),
      after: L('Después', 'After'),
      tabs: [
        { name: L('Encabezado y contacto', 'Header and contact'), before: focus(infoAntes, 0, 0, 1.6), after: focus(infoDespues, 0, 0, 1.6) },
        { name: L('Créditos vigentes', 'Active credits'), before: focus(infoAntes, 50, 100, 1.6), after: focus(infoDespues, 50, 100, 1.6) },
      ],
    },

    {
      kind: 'system',
      tag: L('Sistema de diseño', 'Design system'),
      title: L('Componentes que pasaron al sistema de la organización', "Components that moved into the organization's system"),
      line: L(
        'Nacieron para la densidad del CRM, con variables en claro y oscuro y tres breakpoints.',
        "Born for the CRM's density, with light and dark variables and three breakpoints.",
      ),
      groups: [
        { name: L('Data grid', 'Data grid'), text: L('Filas con estado, avatar, montos, acciones de contacto y audio de la llamada.', 'Rows with status, avatar, amounts, contact actions and call audio.'), image: focus(screen('ds-grids', L('Data grid: menú de estados, filas con montos, etiquetas, acciones de contacto y reproductor de audio', 'Data grid: status menu, rows with amounts, tags, contact actions and an audio player'), 2816, 1760), 50, 50, 1), mat: '#ebebeb' },
        { name: L('Filtro de rango y formulario', 'Range filter and form'), text: L('El filtro de rango con dos controles y el panel «Sobre el cliente» del formulario único.', "The two-handle range filter and the «About the client» panel of the single form."), image: focus(screen('ds-formularios', L('Filtros de rango en sus estados y el panel Sobre el cliente, cerrado y abierto', 'Range filters in their states and the About the client panel, closed and open'), 2816, 1760), 50, 50, 1), mat: '#ebebeb' },
        { name: L('Agenda y notas', 'Agenda and notes'), text: L('Calendario con su evento, razón de interés, agenda y notas.', 'Calendar with its event, reason for the visit, agenda and notes.'), image: focus(screen('ds-agenda', L('Calendario con formulario de evento, razón de interés, agenda y notas', 'Calendar with an event form, reason for the visit, agenda and notes'), 2816, 1760), 50, 50, 1), mat: '#ebebeb' },
        { name: L('Etiquetas, toggles y tooltips', 'Tags, toggles and tooltips'), text: L('Estados y etiquetas, toggles, tooltips y las tarjetas de experiencia del cliente.', 'Status tags, toggles, tooltips and the customer experience cards.'), image: focus(screen('ds-tarjetas', L('Etiquetas de estado, toggles, tooltips y tarjetas de NPS, CES y CSAT', 'Status tags, toggles, tooltips and NPS, CES and CSAT cards'), 2816, 1760), 50, 50, 1), mat: '#ebebeb' },
      ],
      dashboards: {
        title: L('La vista 360 en claro y oscuro', 'The 360 view in light and dark'),
        line: L('Las mismas pantallas en escritorio y móvil, en los dos temas.', 'The same screens on desktop and mobile, in both themes.'),
        states: [
          {
            label: L('Claro', 'Light'),
            caption: L('Tema claro', 'Light theme'),
            desktop: { ...screen('dash-claro-escritorio', L('Vista 360 en escritorio, tema claro', '360 view on desktop, light theme'), 2880, 2244), sidebar: 132, header: 120 },
            mobile: { ...screen('dash-claro-movil', L('Vista 360 en móvil, tema claro', '360 view on mobile, light theme'), 1242, 11976), status: 144, skip: 0 },
          },
          {
            label: L('Oscuro', 'Dark'),
            caption: L('Tema oscuro', 'Dark theme'),
            desktop: { ...screen('dash-oscuro-escritorio', L('Vista 360 en escritorio, tema oscuro', '360 view on desktop, dark theme'), 2880, 2244), sidebar: 132, header: 120 },
            mobile: { ...screen('dash-oscuro-movil', L('Vista 360 en móvil, tema oscuro', '360 view on mobile, dark theme'), 1242, 11976), status: 144, skip: 0 },
          },
        ],
      },
    },
  ],

  close: {
    tag: L('Aprendizajes', 'Takeaways'),
    title: L('Cuatro aprendizajes', 'Four takeaways'),
    learnings: [
      L('Diseñar los componentes para claro, oscuro y tres breakpoints desde el inicio: así pasaron directo al sistema de la organización.', "Design components for light, dark and three breakpoints from the start: that is how they moved straight into the organization's system."),
      L('Un mismo sistema sirve a varios roles: por rol cambian los filtros y los permisos, no las pantallas.', 'One system serves several roles: filters and permissions change by role, not the screens.'),
      L('Los datos sensibles, como el DPI y el crédito, piden jerarquía clara y control de quién los ve.', 'Sensitive data, such as the national ID and credit details, needs clear hierarchy and control over who sees it.'),
      L('Con varios diseñadores en un archivo, marcar qué versión queda evita confusiones con desarrollo y QA.', 'With several designers in one file, marking which version stays avoids confusion with development and QA.'),
    ],
    next: L('Siguiente caso', 'Next case'),
  },
}
