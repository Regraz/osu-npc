<script setup lang="ts">
import Blank from './blank.vue'
</script>

<template>
  <div class="flex flex-col items-center bg-base min-h-screen">
    <Navbar />
    <Blank class="overflow-x-hidden p-4 sm:p-8 xl:p-16">
      <slot />
    </Blank>
    <div class="flex-1" />
    <Footer />
  </div>
</template>
