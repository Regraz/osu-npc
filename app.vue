<script setup lang="ts">
const { t } = useLocales()
const router = useRouter()
const route = useRoute()
const toast = useToast()
const origin = route.query.origin?.toString()

const { load } = useAuthWritable()
const oauthChannel = useOAuthChannel()
watch(oauthChannel, (value) => {
  if (value?.state === 'success') {
    load(value.user)
    router.push(origin ?? '/')
    toast.add({
      title: t('general.signToast.success.title'),
      // description: `已登入 osu! 账号: ${value.user.name}`,
      description: t('general.signToast.success.description', {
        name: value.user.name,
      }),
      color: 'green',
      avatar: value.user.avatar
        ? {
            src: value.user.avatar,
          }
        : undefined,
    })
  }
  else if (value?.state === 'error') {
    toast.add({
      title: t('general.signToast.error.title'),
      description: t('general.signToast.error.description', {
        error: value.error,
      }),
      color: 'red',
    })
  }
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <UNotifications />
</template>

<style>
body {
  @apply overflow-y-scroll min-w-[380px] h-screen
}

body, html,
.bg-base {
  @apply bg-gray-50 dark:bg-gray-950
}
</style>
