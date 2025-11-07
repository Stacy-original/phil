// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode'],
  app: {
    head: {
      title: 'KASYAK WEB',
      link: [
        // { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },,
        { rel: 'icon', type: 'image/png', href: '/faviconnew.png'}
      ],
    },
  },
})