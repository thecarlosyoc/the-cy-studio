# Brief — Hero de inicio, the CY studio

Para: agente frontend-engineer
Proyecto: the-cy-studio (Nuxt 3 + Vue, Tailwind, Supabase)
Ruta afectada: `/` (home)

---

## 1. Por qué se hace este cambio

Hoy la home abre con un hero de portada ("DISEÑO QUE RESPIRA") y, dos secciones después, aparece la declaración de posición real del estudio. Son dos aperturas compitiendo y la más débil va primero. Además, el titular usa cobalt como la mitad de la frase, lo que contradice la regla del sistema: cobalt es acento estricto, nunca cuerpo ni masa tipográfica.

El objetivo es que la home tenga **una sola apertura**, que esa apertura sea la declaración de posición, y que la idea de "respirar" pase de ser una palabra escrita a ser el comportamiento del hero.

---

## 2. Alcance

**Se elimina**
- El bloque de portada con el titular `DISEÑO QUE / RESPIRA`.
- La palabra en cobalt dentro del titular.
- El indicador `SCROLL ↓` de la home (se mantiene el de `/about`, que responde a otra estructura).
- La rejilla de líneas verticales de fondo del hero actual.
- La sección posterior que hoy contiene la línea "Diseño productos y marcas…" queda vacía de ese texto: ese texto sube al hero. No se duplica.

**Se conserva**
- Navbar tal cual, incluido el punto cobalt de 8px entre "Sobre mí" y "Trabajo".
- La línea puente "Así se ve en proyectos concretos." como entrada a la sección de trabajo.
- Todo lo que viene después del hero, sin cambios.

**No hacer**
- No introducir un nuevo tipo de componente. El hero se arma con lo que ya existe en el sistema.
- No agregar imagen, retrato ni video en el hero.

---

## 3. Contenido final

**Titular (ES)**
> Diseño productos y marcas donde el detalle decide cómo se usan y cómo se recuerdan.

**Titular (EN)**
> I design products and brands where the detail decides how they are used and how they are remembered.

> Nota: la versión EN es una traducción de trabajo. Confirmarla con el agente de copy antes de publicar; el resto del brief no depende de ella.

**Metadata (ES)**
`Carlos Yoc — Marca y UX/UI`
`Guatemala, trabajando globalmente`

**Metadata (EN)**
`Carlos Yoc — Brand & UX/UI`
`Guatemala, working globally`

La línea "Estudio con sede en Guatemala / Trabajando globalmente" que hoy vive suelta debajo del hero se absorbe aquí y desaparece de su posición actual.

---

## 4. Estructura y layout

```
┌──────────────────────────────────────────────┐
│  navbar (sin cambios)                        │
│                                              │
│                                              │
│  Diseño productos y marcas donde el          │
│  detalle decide cómo se usan y cómo          │
│  se recuerdan.                               │
│                                              │
│  Carlos Yoc — Marca y UX/UI                  │
│  Guatemala, trabajando globalmente           │
│                                              │
│  ┌────────────────────────────────────────┐  │  ← borde del viewport
│  │  primer proyecto asomando (~12vh)      │  │
└──┴────────────────────────────────────────┴──┘
```

- Alineación izquierda, en la misma columna que usa el resto de la home. Sin centrado.
- El titular ocupa como máximo 3 líneas en desktop. Medida máxima: 18 palabras por línea es demasiado; apuntar a que cada línea quede entre 34 y 44 caracteres.
- La metadata va abajo del titular, no a un costado, separada por un salto de espacio mayor que el interlineado del titular.
- El hero **no ocupa 100vh cerrado**. Ocupa `min-height: 88vh` para que el borde superior de la primera tarjeta de trabajo quede visible sin scroll. Ese asomo es el que invita a bajar; por eso se elimina el `SCROLL ↓`.

---

## 5. Tokens

Usar exclusivamente los tokens ya definidos. Si algo no existe, se crea como token, no como valor suelto en el componente.

**Color**
- Fondo: `ink` (#12110E) en dark, `paper` (#F1EFEA) en light.
- Titular: `paper` en dark, `ink` en light. Un solo color, sin excepciones.
- Metadata: `ink-soft` (#43413B) o su equivalente en dark.
- `cobalt` (#1E2BE0): **no aparece en este hero**. Solo sigue existiendo en el punto del navbar y en los anillos de foco.

**Tipografía**
- Titular: Space Grotesk, el peso de display que ya usa el sistema. Tracking ligeramente negativo en tamaños grandes (−0.02em aprox.), interlineado entre 0.95 y 1.02.
- Metadata: Space Mono, tamaño pequeño, en el mismo tratamiento que ya se usa en el sitio.
- Escala del titular: fluida con `clamp()`, del tamaño mobile actual hasta el tamaño display en desktop. No usar breakpoints escalonados para el tamaño de fuente.

---

## 6. Motion

Esta es la parte donde el hero tiene que ganarse la frase que estamos quitando. Aplican los lineamientos de la Biblia de interfaces; abajo se listan las reglas duras y las referencias.

### 6.1 Reglas que no se negocian (Biblia)

1. Animar **solo `transform` y `opacity`**. Nada que dispare layout o paint.
2. Toda animación ligada a scroll debe ser **reversible y proporcional a la posición de scroll**, no un trigger con duración fija. Si el usuario sube, el hero vuelve exactamente por donde vino.
3. Toda transición de estado (hover, foco) es **interrumpible**. Nada se "termina de reproducir" contra la intención del usuario.
4. Easing con intención: entradas con curva de salida (desacelera al final), nunca `linear` salvo en lo continuo.
5. Duraciones: micro-interacción 120–180ms, entrada 400–600ms. Nada por encima de 800ms.
6. `prefers-reduced-motion: reduce` resuelve todo al estado final, sin desplazamiento.
7. `will-change` se aplica al inicio de la animación y se retira al terminar. No se deja puesto.
8. Un solo momento orquestado. Nada de fade-up en cada elemento por separado.

### 6.2 Referencia Apple

El comportamiento buscado es el mismo que ya tomamos para `/about`:

- **Sección anclada (pinned)**: el hero se mantiene fijo mientras el contenido siguiente avanza sobre él. La transición ocurre *dentro* del scroll, no entre pantallas.
- **Curvas largas y suaves**, sin rebote. Referencia de easing: `cubic-bezier(0.28, 0.11, 0.32, 1)` para el asentamiento, `cubic-bezier(0.22, 1, 0.36, 1)` para las entradas.
- **Escala contenida**: los cambios de escala se quedan en rangos de 4–6%, nunca dramáticos.
- **La tipografía es el sujeto de la animación**, no un contenedor que se mueve.

### 6.3 Entrada (al cargar)

Una sola secuencia, bajo 1 segundo en total:

1. Esperar `document.fonts.ready` con un tope de 200ms para no bloquear el primer render. Precargar Space Grotesk para evitar el salto de fuente.
2. El titular se revela **por línea**, con máscara de recorte (`overflow: hidden` en un wrapper por línea): la línea sube desde `translateY(0.4em)` a `0` con `opacity 0 → 1`.
3. Duración por línea: 560ms. Stagger entre líneas: 70ms. Easing: `cubic-bezier(0.22, 1, 0.36, 1)`.
4. La metadata entra 140ms después de que arranca la última línea, solo con opacidad, 400ms.
5. El asomo de la primera tarjeta de trabajo ya está en su posición final desde el primer frame. No entra animado.

Nada más se anima en la carga.

### 6.4 Respiración en scroll

Este es el reemplazo de la palabra "respira". Todo ligado a la posición de scroll, mapeado sobre los primeros **60vh**:

| Progreso | Titular | Metadata |
|---|---|---|
| 0% | `scale(1)`, `opacity 1`, `translateY(0)` | `opacity 1` |
| 100% | `scale(0.96)`, `opacity 0`, `translateY(-4%)` | `opacity 0` (sale antes, a 45%) |

- El hero usa `position: sticky` mientras la sección de trabajo sube sobre él, cubriéndolo. El contenido siguiente pasa por encima; el hero no se desplaza hacia arriba por su cuenta.
- Implementar con **scroll-driven animations de CSS** (`animation-timeline: view()` / `scroll()`) donde haya soporte. Fallback: `IntersectionObserver` para activar/desactivar y un handler de scroll con `requestAnimationFrame`, sin leer layout dentro del loop (cachear medidas en `resize`).
- Cero `scroll-jacking`. El scroll nativo del navegador manda; solo se mapean valores sobre él.

### 6.5 Reduced motion

Con `prefers-reduced-motion: reduce`:
- El titular y la metadata aparecen en su estado final, sin recorte ni desplazamiento. Se permite un fade de 200ms.
- Se desactiva por completo el mapeo de scroll: el hero se comporta como un bloque estático y la sección siguiente lo cubre sin transformaciones.

---

## 7. Responsive

- Breakpoint: `md` en 768px, como en el resto del proyecto.
- Mobile (frame de referencia 440×956): el titular baja a 4 o 5 líneas, `min-height` del hero a `82vh`, y el asomo de la tarjeta se reduce a ~8vh. La secuencia de entrada se mantiene idéntica pero con stagger de 50ms.
- Comprobar que en pantallas cortas (por ejemplo 812px de alto) el titular completo siga entrando sin scroll.

---

## 8. Accesibilidad y rendimiento

- El titular es el único `<h1>` de la página.
- El texto debe estar en el DOM completo desde el SSR. El recorte por línea se aplica sobre texto ya presente, nunca inyectado por JS: si el JS falla, el hero se ve completo y legible.
- Foco visible con el anillo cobalt existente en cualquier elemento interactivo.
- Objetivo 60fps sostenido durante el scroll del hero en un dispositivo de gama media. Verificar en el panel de rendimiento que no aparezcan capas de layout durante la animación.
- Sin regresión en CLS: reservar la altura del titular antes de que carguen las fuentes.

---

## 9. Criterios de aceptación

- [ ] La home tiene una sola declaración de posición y aparece en el hero.
- [ ] La frase "Diseño que respira" no existe en la home.
- [ ] Cobalt no aparece en ningún texto del hero.
- [ ] El primer proyecto es visible parcialmente sin hacer scroll, en desktop y mobile.
- [ ] Al subir el scroll, el hero regresa a su estado inicial de forma exacta y continua.
- [ ] Con `prefers-reduced-motion` activo no hay ningún desplazamiento.
- [ ] Con JavaScript deshabilitado, el hero se lee completo.
- [ ] Ambos idiomas (ES/EN) respetan el máximo de 3 líneas en desktop.
- [ ] No se agregaron valores de color, tamaño o duración fuera de los tokens.

---

## 10. Pendiente aparte (no incluir en este PR)

"Diseño que respira" se reubica como firma, en el footer o como cierre de `/about`. Se define en una tarea separada.
