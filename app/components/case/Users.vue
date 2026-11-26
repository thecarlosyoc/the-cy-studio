<!-- app/components/case/Users.vue -->
<script setup lang="ts">
import type { UsersScene } from '#shared/types/caseStudy'

// One card per role. A role with `persona` is a user persona: photo on one side, the card on the other
// (sides alternate from 768 px up), with name and age, two attributes, the quote, then need, pain and
// what changed. A role without it keeps the screen card, held on the piece that matters (`image.focus`).
defineProps<{ scene: UsersScene; no: string }>()
const lang = useLang()
const t = useT()
</script>

<template>
  <CaseScene id="case-users" :no="no" :tag="scene.tag[lang]" :title="scene.title[lang]" :line="scene.line[lang]">
    <div class="grid grid-cols-1 gap-6" :class="scene.roles.some(r => r.persona) ? 'md:gap-8' : 'md:grid-cols-2'">
      <CoreReveal v-for="(r, i) in scene.roles" :key="r.name.es" :style="{ transitionDelay: `${(i % 2) * 80}ms` }">
        <article
          v-if="r.persona"
          class="grid grid-cols-1 gap-4 md:gap-6"
          :class="i % 2 ? 'md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]' : 'md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]'"
        >
          <div class="aspect-square overflow-hidden rounded-2xl bg-ink/5 md:aspect-auto md:min-h-[360px]" :class="i % 2 ? 'md:order-2' : ''">
            <CaseShot :img="r.persona.photo" framed sizes="sm:100vw md:50vw lg:520px xl:520px xxl:520px" />
          </div>
          <div class="rounded-2xl bg-white p-6 md:p-8 dark:bg-white/[.08]">
            <p class="font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">{{ t('casePersona') }} {{ String(i + 1).padStart(2, '0') }} · {{ r.name[lang] }}</p>
            <h3 class="mt-2 font-display text-2xl font-bold text-ink md:text-3xl">{{ r.persona.who[lang] }}</h3>
            <dl class="mt-3 grid gap-1 text-base text-ink">
              <div><dt class="inline font-bold">{{ t('casePersonaContext') }}:</dt> <dd class="inline">{{ r.persona.context[lang] }}</dd></div>
              <div><dt class="inline font-bold">{{ t('casePersonaTasks') }}:</dt> <dd class="inline">{{ r.persona.tasks[lang] }}</dd></div>
            </dl>
            <figure class="mt-6">
              <figcaption class="font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">{{ t('casePersonaQuote') }}</figcaption>
              <blockquote class="mt-2 font-display text-xl font-medium leading-snug text-ink md:text-2xl">«{{ r.persona.quote[lang] }}»</blockquote>
            </figure>
            <dl class="mt-6 grid gap-5 border-t border-ink/10 pt-6 sm:grid-cols-3">
              <div>
                <dt class="font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">{{ t('casePersonaGoal') }}</dt>
                <dd class="mt-1 text-base text-ink">{{ r.persona.goal[lang] }}</dd>
              </div>
              <div>
                <dt class="font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">{{ t('casePersonaPain') }}</dt>
                <dd class="mt-1 text-base text-ink">{{ r.pain[lang] }}</dd>
              </div>
              <div>
                <dt class="font-mono text-[11px] uppercase tracking-[.16em] text-cobalt dark:text-ink-soft">{{ t('casePersonaChange') }}</dt>
                <dd class="mt-1 text-base text-ink">{{ r.persona.change[lang] }}</dd>
              </div>
            </dl>
          </div>
        </article>
        <div v-else class="flex h-full flex-col overflow-hidden rounded-2xl bg-white dark:bg-white/[.08]">
          <div class="aspect-[16/10] overflow-hidden bg-ink/5">
            <CaseShot :img="r.image" framed sizes="sm:160vw md:120vw lg:1200px xl:1200px xxl:1200px" />
          </div>
          <div class="p-6">
            <h3 class="font-display text-2xl font-bold text-ink">{{ r.name[lang] }}</h3>
            <p class="mt-2 text-base text-ink-soft">{{ r.pain[lang] }}</p>
          </div>
        </div>
      </CoreReveal>
    </div>
    <p v-if="scene.note" class="mt-6 max-w-[640px] text-[13px] leading-relaxed text-ink-soft">{{ scene.note[lang] }}</p>
  </CaseScene>
</template>
