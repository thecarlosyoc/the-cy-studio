<!-- app/components/case/Users.vue -->
<script setup lang="ts">
import type { paymentsScenes } from '#shared/data/casePaymentsScenes'

defineProps<{ users: typeof paymentsScenes.users }>()
const lang = useLang()
</script>

<template>
  <CaseScene id="case-users" :tag="users.tag[lang]" :title="users.title[lang]" :line="users.line[lang]">
    <div role="list" class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <CoreReveal v-for="r in users.roles" :key="r.name.es">
        <div role="listitem" class="flex h-full flex-col overflow-hidden rounded-2xl bg-white dark:bg-white/[.08]">
          <div class="bg-ink/5">
            <NuxtImg
              :src="r.image.src"
              :alt="r.image.alt[lang]"
              sizes="sm:100vw md:50vw lg:590px xl:590px xxl:590px"
              loading="lazy"
              format="webp"
              class="block aspect-video w-full object-cover object-top"
            />
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
