import { Octokit } from '@octokit/rest'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const prNumber = parseInt(event.context.params.id)
  
  const octokit = new Octokit({ auth: config.githubToken })
  
  try {
    // Get PR comments
    const { data: comments } = await octokit.issues.listComments({
      owner: config.githubOwner,
      repo: config.githubContentRepo,
      issue_number: prNumber,
      per_page: 100
    })
    
    // Get PR reviews (these include vote comments)
    const { data: reviews } = await octokit.pulls.listReviews({
      owner: config.githubOwner,
      repo: config.githubContentRepo,
      pull_number: prNumber
    })
    
    return {
      success: true,
      comments: comments.map(c => ({
        id: c.id,
        type: 'comment',
        author: {
          username: c.user.login,
          avatar: c.user.avatar_url,
          url: c.user.html_url
        },
        content: c.body,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
        url: c.html_url
      })),
      reviews: reviews.map(r => ({
        id: r.id,
        type: 'review',
        author: {
          username: r.user.login,
          avatar: r.user.avatar_url,
          url: r.user.html_url
        },
        state: r.state, // 'APPROVED', 'CHANGES_REQUESTED', 'COMMENTED'
        content: r.body,
        createdAt: r.submitted_at,
        url: r.html_url
      }))
    }
  } catch (error) {
    console.error('Comments fetch error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch comments'
    })
  }
})