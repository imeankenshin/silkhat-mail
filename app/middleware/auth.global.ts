declare module '#app' {
  interface PageMeta {
    auth?: boolean
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    auth?: boolean
  }
}

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.meta.auth) return
  const { data: session } = await authClient.useSession(useFetch)

  if (!session.value) {
    return navigateTo('/')
  }
})
