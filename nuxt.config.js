export default defineNuxtConfig({
  devtools: { enabled: true },
  
  runtimeConfig: {
    // Private (server-side only)
    githubToken: process.env.GITHUB_TOKEN,
    githubOwner: process.env.GITHUB_OWNER,
    githubContentRepo: process.env.GITHUB_CONTENT_REPO,
    
    // Public (client-side)
    public: {
      apiBase: '/api'
    }
  },

  compatibilityDate: '2024-12-09'
})
