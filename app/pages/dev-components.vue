<!-- pages/dev-components.vue -->

<template>
  <div class="min-h-screen bg-paper p-10 space-y-8">
    <h1 class="font-display text-2xl text-ink">Component Playground</h1>

    <section>
      <h2 class="font-mono text-sm text-ink-soft mb-2">Core/Dot</h2>
      <CoreDot />
    </section>

    <section>
      <h2 class="font-mono text-sm text-ink-soft mb-2">Core/Control</h2>
      <div class="flex gap-3">
        <CoreControl variant="soft">Escribe aquí</CoreControl>
        <CoreControl variant="solid">Escribe aquí</CoreControl>
        <CoreControl variant="outline">Escribe aquí</CoreControl>
        <CoreControl variant="link">Escribe aquí</CoreControl>
      </div>
    </section>

    <section>
      <h2 class="font-mono text-sm text-ink-soft mb-2">Brand/Logo</h2>
      <BrandLogo class="h-6 w-auto text-ink" />
    </section>

  </div>
</template>