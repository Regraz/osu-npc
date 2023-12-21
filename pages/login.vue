<script lang="ts" setup>
definePageMeta({
  layout: 'blank',
})

const { t } = useLocales()

useSeoMeta({
  title: t('general.signIn'),
})

const { expect } = useAuth()
onMounted(() => {
  nextTick(async () => {
    if (await expect(true)) {
      await navigateTo(origin ?? '/')
    }
  })
})
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <div class="card max-w-sm w-full bg-base-100 shadow-xl">
      <div class="card-body gap-4">
        <h2 class="card-title">
          {{ $t('general.signIn') }}
        </h2>
        <div class="card-actions">
          <LoginButton class="btn btn-block" />
        </div>
      </div>
    </div>
  </div>
</template>
