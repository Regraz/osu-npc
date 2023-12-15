<script setup lang="ts">
const { toggleDark, darkBtnIcon } = useDarkMode()
</script>

<template>
  <button class="btn" @click="toggleDark">
    <slot :default-icon="darkBtnIcon">
      <Icon
        :name="darkBtnIcon"
        size="24"
      />
    </slot>
  </button>
</template>
