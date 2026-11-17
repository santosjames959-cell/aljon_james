export default defineNuxtConfig({
  compatibilityDate: '2026-11-17',

  modules: [
    'vuetify-nuxt-module'
  ],

  vuetify: {
    moduleOptions: {
      /* options */
    },
    vuetifyOptions: {
      theme: {
        defaultTheme: 'light'
      }
    }
  }
})