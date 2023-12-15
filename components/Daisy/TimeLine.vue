<script setup lang="ts">
defineProps<{
  items: TimelineItem[]
}>()

interface TimelineItem {
  content: string
  subContent?: string
  link?: string
  icon?: string
  color?: string
  active?: boolean
}
</script>

<template>
  <ul class="timeline timeline-vertical md:timeline-horizontal">
    <li v-for="item, index in items" :key="index">
      <hr v-if="index !== 0" :class="item.active && 'bg-primary'">
      <NuxtLink
        v-if="item.link"
        :href="item.link"
        target="_blank"
        class="timeline-box mx-2"
        :class="{
          'bg-primary text-primary-content': item.active,
          'timeline-start': index % 2 === 0,
          'timeline-end': index % 2 === 1,
        }"
      >
        {{ item.content }}
      </NuxtLink>
      <div
        v-else
        class="timeline-box mx-2"
        :class="{
          'border-primary': item.active,
          'timeline-start': index % 2 === 0,
          'timeline-end': index % 2 === 1,
        }"
      >
        {{ item.content }}
      </div>
      <div
        class="timeline-middle"
        :class="item.active && 'text-primary'"
      >
        <Icon
          :name="item.icon ?? (item.active ? 'material-symbols:check-circle' : 'material-symbols:flag-circle-rounded')"
          class="w-5 h-5" size="20"
        />
      </div>
      <div
        v-if="item.subContent"
        class="timeline-info opacity-50"
        :class="{
          'timeline-start': index % 2 === 1,
          'timeline-end': index % 2 === 0,
        }"
      >
        {{ item.subContent }}
      </div>
      <hr v-if="index + 1 !== items.length" :class="item.active && 'bg-primary'">
    </li>
  </ul>
</template>
