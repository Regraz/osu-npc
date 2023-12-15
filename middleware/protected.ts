export default defineNuxtRouteMiddleware(async (to) => {
  const { expect } = useAuth()
  const notAuthenticated = await expect(false)
  if (notAuthenticated) {
    return navigateTo({
      name: 'login',
      query: {
        origin: to.fullPath === '/' ? undefined : to.fullPath,
      },
    })
  }
})
