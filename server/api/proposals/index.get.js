import { Octokit } from '@octokit/rest'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const state = query.state || 'open' // 'open', 'closed', 'all'
  
  const octokit = new Octokit({ auth: config.githubToken })
  
  try {
    const { data: prs } = await octokit.pulls.list({
      owner: config.githubOwner,
      repo: config.githubContentRepo,
      state: state,
      per_page: 50,
      sort: 'created',
      direction: 'desc'
    })
    
    return {
      success: true,
      proposals: prs.map(pr => ({
        id: pr.number,
        title: pr.title,
        description: pr.body,
        branch: pr.head.ref,
        status: pr.state,
        merged: pr.merged_at !== null,
        author: {
          username: pr.user.login,
          avatar: pr.user.avatar_url,
          url: pr.user.html_url
        },
        createdAt: pr.created_at,
        updatedAt: pr.updated_at,
        url: pr.html_url,
        commentsCount: pr.comments,
        reviewsCount: pr.requested_reviewers?.length || 0
      }))
    }
  } catch (error) {
    console.error('Proposals fetch error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch proposals'
    })
  }
})