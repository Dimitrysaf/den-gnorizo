import { Octokit } from '@octokit/rest'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const branchName = event.context.params.branch
  const query = getQuery(event)
  const perPage = parseInt(query.perPage) || 20
  
  const octokit = new Octokit({
    auth: config.githubToken
  })
  
  try {
    const { data: commits } = await octokit.repos.listCommits({
      owner: config.githubOwner,
      repo: config.githubContentRepo,
      sha: branchName,
      per_page: perPage
    })
    
    return {
      success: true,
      commits: commits.map(c => ({
        sha: c.sha,
        message: c.commit.message,
        author: c.commit.author.name,
        date: c.commit.author.date,
        url: c.html_url
      }))
    }
  } catch (error) {
    console.error('Commits fetch error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch commits'
    })
  }
})