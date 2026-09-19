# Brief — Hero y sección About de inicio

Para: agente frontend-engineer
Proyecto: the-cy-studio (Nuxt 3 + Vue, Tailwind, Supabase)
Rutas afectadas: `/` (home) y el admin
Rama: `hero-home`

**Este documento reemplaza a `docs/briefs/hero-home.md` y a `docs/briefs/hero-retrato.md`.** Los dos anteriores quedaron desactualizados por cambios de concepto. Donde cualquiera de ellos contradiga a este, manda este. Bórralos o márcalos como superados al hacer merge.

Referencias visuales, en el archivo Portafolio, página Inicio:

| Pantalla | Sección | Frame |
|---|---|---|
| Hero desktop | PARA CLAUDE | `Hero concepto D — Editorial (Dark)` / `(Light)` |
| Hero mobile | PARA CLAUDE | `Hero inicio — Mobile (Dark)` / `(Light)` |
| Sección About | Inicio / About section | `Inicio / About section — Split v2 (Dark)` / `(Light)` |

---

## 1. Alcance

**Entra:**
- Hero de la home: de titular tipográfico a retrato a sangre con el nombre en tratamiento editorial.
- Sección About de la home: pasa a un split de foto y texto.
- Admin: un tercer slot de imagen. Hoy se administran dos fotos; ahora son tres.

**No entra:**
- El hero de `/about`. Se reestructura después, en su propia tarea.
- La sección de la home que ya tiene foto y no se toca.
- La limpieza de filas huérfanas de copy en la base de datos.
- El mobile de la sección About: todavía no existe el frame en Figma.

---

## 2. Qué se conserva del trabajo ya hecho en la rama

- Tokens de motion en `main.css` (`--ease-settle`, `--ease-enter`, `--dur-*`, `--stagger-line`, `--hero-min-h`, `--hero-scroll-range`).
- Sección anclada con `position: sticky` y la columna de contenido con `relative z-10 bg-paper` subiendo por encima.
- Mapeo de scroll con `animation-timeline: scroll(root)` y su fallback con la variable `--p`.
- Unidades en `svh` y la sonda oculta que las traduce a px.
- La eliminación de `history.scrollRestoration = 'manual'`.
- El puente sin `CoreReveal`, en su posición final desde el primer frame.

**Se descarta:** la división por líneas del titular con `Range.getClientRects` y todo el mecanismo que la acompañaba, incluido el `@media (scripting: enabled)`. Ya no hay titular de varias líneas.

---

## 3. Hero de la home

### 3.1 Composición desktop (1440 × 1024)

- **Retrato a sangre**, `object-fit: cover`, ocupa el frame completo.
- **Guarda del navbar:** degradado negro de `0.34` a `0` en los primeros 180px. No es un velo del color del tema: es una sombra neutra. Un velo ink sobre una foto oscura apaga el tercio superior; ya se probó y falla.
- **Scrim del nombre:** degradado ink desde `y 404`, alto 620px, con paradas `0` / `0.42` al 55% / `0.88` al final.
- **Rol:** Space Mono Regular 13px, tracking 8%, paper al 75%. `x 72`, `y 152`.
- **Nombre:** Space Grotesk Bold, paper, tracking −4.5%, interlineado 88%. 214px en el frame de referencia; en la web es fluido con `clamp()`, nunca fijo. `x 58`, 84px del borde inferior.
- **Metadata:** Space Mono Regular 13px, tracking 6%, interlineado 170%, paper al 66%, alineada a la derecha. 72px del borde derecho, 96px del inferior.

### 3.2 Composición mobile (440 × 956)

Mismo sistema, con dos diferencias obligatorias:

- **El nombre parte en dos líneas** ("Carlos" / "Yoc"), 88px de referencia, también fluido.
- **La metadata no va en el hero.** En 440px queda atrapada entre el nombre y el dock, y se lee como parte de la navegación. Baja a la sección siguiente.
- Guarda del navbar de 130px, scrim desde `y 356`.
- Rol a 11px, `x 24`, `y 96`.

### 3.3 Temas

**El navbar del hero usa siempre su variante sobre-imagen, en light y en dark.** Una foto a sangre es una superficie propia, no la superficie del tema; el cambio de tema arranca en la sección siguiente. Todo el texto del hero va en paper en ambos temas: no hay versión en ink.

Lo único que cambia entre temas es el tratamiento de la foto:

| | Dark | Light |
|---|---|---|
| exposición | −0.02 | +0.10 |
| contraste | +0.08 | +0.04 |
| saturación | 0 | +0.04 |
| altas luces | −0.05 | +0.06 |
| sombras | 0 | +0.08 |

Se resuelven con `filter` estático por tema. `filter` no se anima en ningún momento.

---

## 4. Sección About de la home

### 4.1 Composición desktop (1440 × 1024)

- **Corte vertical en 720**, la mitad exacta. Cae sobre una guía del sistema; cualquier otro valor se siente casi-pero-no.
- **Foto a la izquierda**, de 0 a 720, a sangre arriba, abajo e izquierda.
- **Columna de texto centrada en su mitad:** `x 820`, ancho 520. Eso deja 100px a cada lado dentro de la mitad derecha.
- **Bloque centrado verticalmente** como grupo: etiqueta + 40px + párrafo + 52px + botón.
- **Etiqueta:** Space Mono Regular 13px, tracking 8%, al 60% de opacidad.
- **Párrafo:** Space Grotesk 24px, interlineado 145%. "Soy Carlos Yoc." en Bold, el resto en Regular.
- **Botón:** el componente existente, en la variante del tema.
- **El navbar no forma parte de esta sección.** Es cromo de página.
- Texto en paper sobre ink en dark; en ink sobre paper en light.

### 4.2 Ajuste pendiente sobre la foto

En dark, la ventana de la foto es el punto más brillante de la pantalla y se lleva la mirada antes que el párrafo. Bajar altas luces, no exposición general.

---

## 5. Admin: tercer slot de imagen

Hoy el admin gestiona dos fotos. Pasan a ser tres, cada una con su propio slot identificable:

1. **Retrato del hero de la home.**
2. **Foto de la sección About de la home.** (nueva)
3. **Retrato de `/about`.**

Requisitos:

- Descubrir primero cómo están modeladas las dos actuales (tabla, bucket, claves) y **seguir esa convención**, no inventar una nueva.
- El tercer slot necesita su clave estable propia. Nada de índices posicionales: si mañana se reordena la home, las fotos no deben intercambiarse.
- Cada slot expone su `alt` editable. El retrato del hero es el LCP de la home y su `alt` no puede quedar vacío.
- Si el slot nuevo viene sin imagen, la sección renderiza sin romper el layout: no un hueco de alto cero ni un placeholder roto.
- Migración: las dos fotos existentes conservan sus valores. No se reasignan.

### Encuadre, importante

Como las fotos se cambian desde el admin, **el encuadre no puede depender del recorte de la imagen subida.** Cada slot define su propio `object-position` en CSS:

- Hero: alrededor de `50% 20%`. Sin esto, en pantallas altas el `cover` corta la coronilla; ya pasa en el frame de mobile.
- Sección About: el sujeto debe quedar descentrado hacia la izquierda para que el corte de 720 pase por el fondo y no por el hombro.

Documentar ambos valores junto al slot en el admin, para que al cambiar una foto se sepa a qué encuadre tiene que ajustarse.

---

## 6. Motion

Aplican los lineamientos de la Biblia de interfaces. Reglas duras, sin excepciones: solo `transform` y `opacity`; todo lo ligado a scroll es proporcional a la posición y reversible; transiciones interrumpibles; entradas 400–600ms y micro-interacciones 120–180ms; `prefers-reduced-motion` resuelve al estado final; `will-change` se retira al terminar; un solo momento orquestado por pantalla.

Referencia de comportamiento: la sección anclada de Apple, la misma que se tomó para `/about`.

### 6.1 Entrada del hero

Una secuencia, bajo 1 segundo:

1. **El retrato se asienta** de `scale(1.04)` a `1`, 600ms, `--ease-settle`. Sin fade desde negro: la foto ya está ahí.
2. **El nombre se revela por palabra** con máscara de recorte: cada palabra sube desde `translateY(0.32em)` a `0`, opacidad de `0` a `1`. 520ms por palabra, stagger 90ms, `--ease-enter`. Arranca 180ms después del retrato.
3. **Rol y metadata** entran solo con opacidad, 400ms, una vez arrancada la última palabra.
4. **Guarda y scrim** están en su estado final desde el primer frame.

El texto llega completo desde SSR. Sin JS, todo se ve en su posición final.

### 6.2 El relevo en scroll

Mientras el hero se va, el puente crece hasta ocupar su lugar. Son dos mitades del mismo gesto. Todo mapeado sobre los primeros 60svh:

| Progreso | Retrato | Nombre | Rol y metadata | Puente |
|---|---|---|---|---|
| 0% | `scale(1)`, `translateY(0)` | `translateY(0)`, `opacity 1` | `opacity 1` | escala base |
| 45% | — | — | `opacity 0` | — |
| 100% | `scale(1.06)`, `translateY(-3%)` | `translateY(-14%)`, `opacity 0` | `opacity 0` | escala del nombre |

Dos detalles que hacen la diferencia:

- **Paralaje.** El nombre sube más rápido que el retrato. Esa diferencia de velocidad es la profundidad, y sale gratis porque las dos son `translateY`.
- **El puente crece con `transform: scale`, nunca animando `font-size`.** Animar el tamaño de fuente dispara layout en cada frame y ahí se pierde el 60fps. La escala final topa en el tamaño del nombre, no lo supera.

Nada de scroll-jacking: el scroll nativo manda y solo se mapean valores sobre él.

### 6.3 Sección About

Un solo gesto, discreto, al entrar en viewport:

- La foto se asienta de `scale(1.03)` a `1`, 600ms, `--ease-settle`.
- La columna de texto entra como bloque único con opacidad y `translateY(12px)`, 500ms, `--ease-enter`, 120ms después de la foto.
- No se animan por separado la etiqueta, el párrafo y el botón. Un fade-up por elemento en cada sección es el patrón genérico que ya estamos evitando en el resto del sitio.

### 6.4 Reduced motion

- Sin asentamiento de escala, sin recorte por palabra, sin paralaje, en ninguna de las dos secciones.
- Todo aparece en su estado final; se permite un fade de 200ms.
- El puente se queda en su tamaño grande, sin crecer.

---

## 7. Decisiones abiertas

No las resuelve el agente:

1. **El azul del retrato del hero contra el cobalt del punto del navbar.** Se ven en la misma franja, son casi el mismo azul pero no idéntico, y leen como error de color. Salidas: desaturar el retrato, o cambiar el color del punto solo en este hero. La sección About ya no tiene este problema: su foto es cálida.
2. **El borde inferior del hero en light.** Termina en foto oscura y la sección siguiente es paper. Falta definir si el corte es duro o si el scrim resuelve la transición.
3. **Mobile de la sección About.** Sin frame en Figma todavía.

---

## 8. Accesibilidad y rendimiento

- El nombre del hero es el `<h1>` de la home. El rol, la metadata y la etiqueta de la sección About no son encabezados.
- El retrato del hero es el LCP: precargarlo, servirlo en AVIF/WebP con `srcset`, reservar su caja para no regresar CLS.
- Las tres fotos vienen del admin, así que hay que manejar dimensiones variables sin romper el layout.
- Contraste mínimo 4.5:1 en rol y metadata sobre la foto, verificado con la imagen real y en ambos temas.
- 60fps sostenidos durante el scroll del hero en un equipo de gama media, sin capas de layout en el trace.

---

## 9. Criterios de aceptación

- [ ] El navbar se lee completo en light y en dark, sobre la foto del hero.
- [ ] El tercio superior del hero no queda apagado en ninguno de los dos temas.
- [ ] En mobile, el nombre parte en dos líneas y la metadata no aparece en el hero.
- [ ] Al subir el scroll, hero y puente regresan a su estado inicial de forma exacta y continua.
- [ ] El puente nunca supera el tamaño del nombre.
- [ ] El corte de la sección About cae exactamente en 720 y la columna queda centrada en su mitad.
- [ ] Los tres slots de imagen se editan por separado desde el admin y conservan su identidad al reordenar la home.
- [ ] Cambiar una foto desde el admin no descuadra el encuadre: el `object-position` de cada slot manda.
- [ ] Con `prefers-reduced-motion` no hay escala, recorte ni paralaje.
- [ ] Sin JavaScript, el hero y la sección About se ven completos y legibles.
- [ ] Ninguna foto anima `filter` en ningún estado.
- [ ] No se agregaron colores, tamaños ni duraciones fuera de los tokens.
