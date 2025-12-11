// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    }
  },

  runtimeConfig: {
    githubToken: process.env.GITHUB_TOKEN,
    githubOwner: process.env.GITHUB_OWNER,
    githubRepo: process.env.GITHUB_CONTENT_REPO,
    githubRepoId: process.env.GITHUB_REPO_ID,
    oauth: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      }
    },
    session: {
      password: process.env.NUXT_SESSION_PASSWORD || 'nuxt-auth-utils-session-password-32-chars-minimum'
    },
    public: {
      apiBase: '/api'
    }
  },

  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@nuxtjs/google-fonts',
    'nuxt-auth-utils'
  ],
  googleFonts: {
    families: {
      'Playfair Display': [400, 700],
      'Merriweather': [300, 400, 700],
      'Material Symbols Sharp': {
        wght: [400],
        opsz: [24],
        FILL: [0, 1]
      }
    }
  },
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
})