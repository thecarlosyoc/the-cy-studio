-- Case study: nuevas secciones Reto y Estado, textos anonimizados, slugs cortos
-- en inglés, y ajuste del copy de /about. Slugs viejos -> ver
-- server/middleware/legacy-slugs.ts (redirección 301).

alter table work_items
  add column challenge_es text not null default '',
  add column challenge_en text not null default '',
  add column status_es text not null default '',
  add column status_en text not null default '';

-- 1. Huella de carbono
update work_items set
  slug = 'carbon-footprint',
  context_es = $$Gran parte de la población, incluidos los propios colaboradores, no conoce el concepto de huella de carbono. La financiera necesitaba medir su impacto completo y apoyar su iniciativa de reducción de papel con una herramienta que educara antes de pedir datos.$$,
  context_en = $$Much of the population, including the institution's own staff, wasn't familiar with the idea of a carbon footprint. The financial institution needed to measure its full impact and support its paper-reduction initiative with a tool that educated before it asked for data.$$,
  challenge_es = $$Lograr que quien llena el formulario entienda lo que está midiendo. La respuesta fue un personaje-guía que acompaña todo el recorrido y explica cada concepto cuando aparece.$$,
  challenge_en = $$Making sure whoever fills in the form understands what's being measured. The answer was a guide character who walks through the whole flow and explains each concept as it appears.$$,
  long_description_es = $$Mi enfoque abarcó la arquitectura de información completa: del diagnóstico y el perfil de usuario a los componentes dinámicos del formulario, construidos sobre una matriz validada por el ente especializado, y el panel de recomendaciones.$$,
  long_description_en = $$My focus covered the full information architecture: from diagnosis and user persona to the form's dynamic components, built on a matrix validated by the specialized entity, and the recommendations dashboard.$$,
  status_es = 'En desarrollo. Las primeras versiones están por salir.',
  status_en = 'In development. First versions are about to ship.',
  tools = array_replace(tools, 'Lottie', 'Lottie Files')
where slug = 'Huella de carbono';

-- 2. CRM
update work_items set
  slug = 'crm',
  challenge_es = 'Reunir en un solo lugar todo el historial de seguimiento de cada cliente: la vista 360.',
  challenge_en = 'Bringing every client''s full follow-up history into one place: the 360 view.',
  long_description_es = $$Los componentes de esa vista se adaptaron en cada iteración. El alcance incluyó también el flujo de captura de leads en sucursal (documento de identidad, teléfono, pre-registro), nuevos componentes para el sistema de diseño y soporte en QA.$$,
  long_description_en = $$The components of that view were refined with each iteration. The scope also covered the branch lead-capture flow (ID, phone, pre-registration), new design system components, and QA support.$$,
  status_es = 'En desarrollo. Las primeras versiones están por salir.',
  status_en = 'In development. First versions are about to ship.'
where slug = 'CRM para la gestión global de clientes';

-- 3. Plataforma de crecimiento y bienestar
update work_items set
  slug = 'employee-wellbeing',
  context_es = $$Antes, el seguimiento de datos de colaboradores (educación, vivienda, metas personales, bienestar) vivía en hojas de cálculo dispersas, sin una forma estructurada de entenderlos ni de dar seguimiento a su bienestar físico y profesional.$$,
  context_en = $$Before, employee data (education, housing, personal goals, wellness) lived in scattered spreadsheets, with no structured way to understand it or track physical and professional wellbeing.$$,
  challenge_es = 'Traducir en decisiones concretas, primero, lo que necesitan los colaboradores al compartir información sensible y, segundo, cómo necesita ver el panel el personal médico.',
  challenge_en = 'Turning two things into concrete decisions: what employees need when sharing sensitive information, and how medical staff need to see the dashboard.',
  long_description_es = 'Mi enfoque se centró en las micro-interacciones y en varios de los componentes visuales más relevantes del ecosistema, junto con la co-creación del sistema de diseño y del módulo de administración para personal médico.',
  long_description_en = 'My focus centered on micro-interactions and several of the ecosystem''s most relevant visual components, alongside co-creating the design system and the admin module for medical staff.',
  status_es = 'En desarrollo. Las primeras versiones están por salir.',
  status_en = 'In development. First versions are about to ship.'
where slug = 'Plataforma de seguimiento del crecimiento de los colaboradores';

-- 4. App de riesgo
update work_items set
  slug = 'field-risk',
  challenge_es = 'Equilibrar navegación, usabilidad y accesibilidad en un sistema donde cada evento, aunque se resolviera en el sistema de fondo, exigía la misma profundidad visual e interactiva.',
  challenge_en = 'Balancing navigation, usability and accessibility in a system where every event, even when resolved behind the scenes, needed the same depth of visual and interaction design.',
  long_description_es = 'El diseño cubrió la aplicación completa, con énfasis en traducir lógica de negocio compleja en flujos claros y en proponer funcionalidades que terminaron integrándose a la arquitectura del producto.',
  long_description_en = 'The design covered the whole application, with emphasis on turning complex business logic into clear flows and proposing functionality that ended up in the product''s architecture.',
  status_es = 'En desarrollo. Las primeras versiones están por salir.',
  status_en = 'In development. First versions are about to ship.'
where slug = 'App de gestión de riesgo para coordinadores de campo';

-- 5. Pagos y créditos
update work_items set
  slug = 'payments-credits',
  context_es = $$Los pagos de servicios (energía, teléfono) vivían en una plataforma externa, sin panel de métricas. Las entidades que gestionaban créditos no tenían un sistema para hacerlo, ni la financiera una forma de darles seguimiento.$$,
  context_en = $$Service payments (electricity, phone) lived on an external platform with no metrics dashboard. The organizations managing these credits had no system to do it, and the financial institution had no way to track them.$$,
  challenge_es = 'Migrar formularios que vivían en hojas de cálculo a tablas con máscaras de scroll, depurando y priorizando la información clave.',
  challenge_en = 'Migrating forms that lived in spreadsheets to tables with scroll masks, cleaning up and prioritizing the key information.',
  long_description_es = 'El trabajo se desarrolló en ciclos cortos dentro de un equipo multidisciplinario, con foco en componentes del sistema de diseño, el panel mobile y desktop y los módulos de contabilidad.',
  long_description_en = 'The work ran in short cycles within a multidisciplinary team, focused on design system components, the mobile and desktop dashboard, and the accounting modules.',
  status_es = 'Lanzado en 2025, hoy es la plataforma principal para gestionar esos créditos.',
  status_en = 'Launched in 2025, it''s now the primary platform for managing those credits.',
  tools = array_replace(tools, 'Figjam', 'FigJam')
where slug = 'Sistema para gestión de pagos y créditos.';

-- /about: "Quién soy" (quitar "apasionado" y el párrafo que repite el hero)
update about_sections set paragraphs = $$[
  {"en":"I'm Carlos Yoc, a UX/UI designer focused on digital product, branding, and front-end development for 8 years.","es":"Soy Carlos Yoc, diseñador UX/UI enfocado en producto digital, marca y desarrollo front-end desde hace 8 años."},
  {"en":"From the start I wanted to understand the whole craft, not stop at the interface. I went through digital marketing, then product design, and along the way learned to implement what I design with clean, responsive code. Each stage taught me a part of the same problem.","es":"Desde el inicio quise entender el oficio completo, no quedarme solo en la interfaz. Pasé por marketing digital, después por diseño de producto, y en el camino aprendí a implementar lo que diseño con código limpio y responsivo. Cada etapa me enseñó una parte del mismo problema."},
  {"en":"Today I design digital experiences at a financial institution, and in parallel I take freelance projects where I can build systems end to end.","es":"Hoy diseño experiencias digitales en una financiera, y en paralelo tomo proyectos freelance donde puedo construir sistemas de principio a fin."}
]$$::jsonb where id = '02539287-b67d-43ac-acce-fedf46b37b9b';
