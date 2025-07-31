import 'vue-router'
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    guest?: boolean
    roles?: string[]
    permissions?: string[]
  }
}
