import { Octokit } from '@octokit/rest'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  const octokit = new Octokit({
    auth: config.githubToken
  })
  
  try {
    const { data: branches } = await octokit.repos.listBranches({
      owner: config.githubOwner,
      repo: config.githubContentRepo,
      per_page: 100
    })
    
    return {
      success: true,
      branches: branches.map(b => ({
        name: b.name,
        sha: b.commit.sha,
        protected: b.protected
      }))
    }
  } catch (error) {
    console.error('Branches fetch error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch branches'
    })
  }
})