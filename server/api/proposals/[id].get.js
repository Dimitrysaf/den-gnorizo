import { Octokit } from '@octokit/rest'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const prNumber = parseInt(event.context.params.id)
  
  const octokit = new Octokit({ auth: config.githubToken })
  
  try {
    // Get PR details
    const { data: pr } = await octokit.pulls.get({
      owner: config.githubOwner,
      repo: config.githubContentRepo,
      pull_number: prNumber
    })
    
    // Get reviews (votes)
    const { data: reviews } = await octokit.pulls.listReviews({
      owner: config.githubOwner,
      repo: config.githubContentRepo,
      pull_number: prNumber
    })
    
    // Count approvals and rejections
    const approvals = reviews.filter(r => r.state === 'APPROVED').length
    const rejections = reviews.filter(r => r.state === 'CHANGES_REQUESTED').length
    
    return {
      success: true,
      proposal: {
        id: pr.number,
        title: pr.title,
        description: pr.body,
        branch: pr.head.ref,
        status: pr.state,
        merged: pr.merged_at !== null,
        mergeable: pr.mergeable,
        author: {
          username: pr.user.login,
          avatar: pr.user.avatar_url,
          url: pr.user.html_url
        },
        createdAt: pr.created_at,
        updatedAt: pr.updated_at,
        mergedAt: pr.merged_at,
        url: pr.html_url,
        commentsCount: pr.comments,
        commits: pr.commits,
        additions: pr.additions,
        deletions: pr.deletions,
        changedFiles: pr.changed_files,
        votes: {
          approvals,
          rejections,
          total: reviews.length
        }
      }
    }
  } catch (error) {
    console.error('Proposal fetch error:', error)
    throw createError({
      statusCode: 404,
      message: 'Proposal not found'
    })
  }
})