<template>
  <NuxtLink
    target="_blank"
    to="/api/session/oauth2/osu"
  >
    <Icon name="simple-icons:osu" size="20" class="mr-2" />
    <span class="flex-1">
      {{ $t('general.signWith', ['osu!']) }}
    </span>
  </NuxtLink>
</template>
