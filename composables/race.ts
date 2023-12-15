const allowRaceState = ['preparation', 'voting', 'submitting', 'rating', 'result'] as const
type RaceState = typeof allowRaceState[number]

export function useRace() {
  const runtimeConfig = useRuntimeConfig()

  const raceState = computed<RaceState>(
    () => allowRaceState.includes(
      runtimeConfig.public.raceState as RaceState,
    )
      ? runtimeConfig.public.raceState as RaceState
      : 'preparation',
  )

  const isResultOpened = computed(() => raceState.value === 'result')
  const isRatingOpened = computed(() => isResultOpened.value || raceState.value === 'rating')
  const isSubmittingOpened = computed(() => isRatingOpened.value || raceState.value === 'submitting')
  const isVotingOpened = computed(() => isSubmittingOpened.value || raceState.value === 'voting')

  return { raceState, isResultOpened, isRatingOpened, isSubmittingOpened, isVotingOpened }
}
