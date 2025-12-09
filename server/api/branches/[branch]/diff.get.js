import { Octokit } from '@octokit/rest'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const branchName = event.context.params.branch
  const query = getQuery(event)
  const baseBranch = query.base || 'main'
  
  const octokit = new Octokit({
    auth: config.githubToken
  })
  
  try {
    const { data: comparison } = await octokit.repos.compareCommits({
      owner: config.githubOwner,
      repo: config.githubContentRepo,
      base: baseBranch,
      head: branchName
    })
    
    return {
      success: true,
      diff: {
        ahead_by: comparison.ahead_by,
        behind_by: comparison.behind_by,
        status: comparison.status,
        files: comparison.files.map(f => ({
          filename: f.filename,
          status: f.status, // 'added', 'removed', 'modified'
          additions: f.additions,
          deletions: f.deletions,
          changes: f.changes,
          patch: f.patch // The actual diff
        }))
      }
    }
  } catch (error) {
    console.error('Diff fetch error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch diff'
    })
  }
})