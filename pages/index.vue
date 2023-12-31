<script lang="ts" setup>
const { t } = useLocales()

const {
  isVotingOpened,
  isSubmittingOpened,
  isRatingOpened,
  isResultOpened,
} = useRace()

const timeline = computed(() => [{
  content: t('home.contestState.preparation.name'),
  subContent: t('home.contestState.preparation.date'),
  btn: t('home.contestState.preparation.btn'),
  link: 'https://osu.ppy.sh/community/forums/topics/1854946?n=1',
  active: true,
}, {
  content: t('home.contestState.voting.name'),
  subContent: t('home.contestState.voting.date'),
  btn: t('home.contestState.voting.btn'),
  link: '/vote',
  active: isVotingOpened.value,
}, {
  content: t('home.contestState.submitting.name'),
  subContent: t('home.contestState.submitting.date'),
  btn: t('home.contestState.submitting.btn'),
  active: isSubmittingOpened.value,
}, {
  content: t('home.contestState.rating.name'),
  subContent: t('home.contestState.rating.date'),
  btn: t('home.contestState.rating.btn'),
  active: isRatingOpened.value,
}, {
  content: t('home.contestState.result.name'),
  subContent: t('home.contestState.result.date'),
  btn: t('home.contestState.result.btn'),
  active: isResultOpened.value,
}])

const btnData = computed(() => {
  let link = timeline.value[0].link
  let text = timeline.value[0].btn
  for (const item of timeline.value) {
    if (item.active) {
      link = item.link
      text = item.btn
    }
  }
  return { link, text }
})
</script>

<template>
  <div class="h-[25vh] max-h-24" />
  <div class="grid gap-24">
    <div class="hero">
      <div class="hero-content flex-col lg:flex-row-reverse mr-auto">
        <div>
          <h1 class="text-5xl font-bold">
            {{ $t('home.contestName') }}
          </h1>
          <p class="py-6">
            {{ $t('home.contestDescription') }}
          </p>
          <div class="grid sm:flex gap-2">
            <NuxtLink class="btn btn-primary" :href="btnData.link">
              {{ btnData.text }}
            </NuxtLink>
            <NuxtLink class="btn" href="https://osu.ppy.sh/community/forums/topics/1854946?n=1">
              {{ $t('home.viewContestBtn') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-center">
      <DaisyTimeLine
        :items="timeline"
      />
    </div>
  </div>
</template>
