export default defineNuxtRouteMiddleware(() => {
  const session = authClient.useSession()

  if (!session.value) {
    return navigateTo('/')
  }
})
