// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],

  runtimeConfig: {
    githubToken: process.env.GITHUB_TOKEN,
    githubOwner: process.env.GITHUB_OWNER,
    githubRepo: process.env.GITHUB_CONTENT_REPO,
    githubRepoId: process.env.GITHUB_REPO_ID,
    public: {
      apiBase: '/api'
    }
  },

  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@nuxtjs/google-fonts'
  ],
  googleFonts: {
    families: {
      'Playfair Display': [400, 700],
      'Merriweather': [300, 400, 700],
      'Material Symbols Sharp': true,
    }
  },
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
})