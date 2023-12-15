export default defineNuxtRouteMiddleware(() => {
  if (process.client) {
    const { refresh, auth } = useAuthWritable()
    if (auth.value.state === 'pending') {
      refresh()
    }
  }
})
