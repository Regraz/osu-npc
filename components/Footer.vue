<script setup lang="ts">
const { locale, locales, setLocale } = useLocales()
const langSelect = ref(null)
const keepShowLangSelectBox = ref(false)
onClickOutside(langSelect, () => keepShowLangSelectBox.value = false)
</script>

<template>
  <footer class="footer footer-center p-10 rounded">
    <div class="grid grid-flow-col gap-4">
      <div
        ref="langSelect" class="dropdown dropdown-top dropdown-hover" :class="{
          'dropdown-open': keepShowLangSelectBox,
        }"
      >
        <button class="clickable select-none py-2" @click="keepShowLangSelectBox = !keepShowLangSelectBox">
          <Icon name="mdi:translate" size="16" /> Language
        </button>
        <ul tabindex="0" class="dropdown-content menu menu-compact p-2 bg-base-100 shadow-2xl rounded-box w-44">
          <li v-for="available in locales" :key="available.code">
            <button :class="{ active: locale === available.code }" @click="setLocale(available.code)">
              <span class="mx-auto" v-text="available.name" />
            </button>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>
