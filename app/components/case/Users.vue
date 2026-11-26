<!-- app/components/case/Users.vue -->
<script setup lang="ts">
import type { UsersScene } from '#shared/types/caseStudy'

// Four roles, each card held on the piece of its screen that matters (`image.focus`).
defineProps<{ scene: UsersScene; no: string }>()
const lang = useLang()
</script>

<template>
  <CaseScene id="case-users" :no="no" :tag="scene.tag[lang]" :title="scene.title[lang]" :line="scene.line[lang]">
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <CoreReveal v-for="(r, i) in scene.roles" :key="r.name.es" :style="{ transitionDelay: `${(i % 2) * 80}ms` }">
        <div class="flex h-full flex-col overflow-hidden rounded-2xl bg-white dark:bg-white/[.08]">
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
  </CaseScene>
</template>
