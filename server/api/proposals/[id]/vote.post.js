import { Octokit } from '@octokit/rest'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const prNumber = parseInt(event.context.params.id)
  const body = await readBody(event)
  const { voteType, comment } = body
  
  if (!['approve', 'reject'].includes(voteType)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid vote type. Must be "approve" or "reject"'
    })
  }
  
  const octokit = new Octokit({ auth: config.githubToken })
  
  try {
    // Create a review on the PR
    await octokit.pulls.createReview({
      owner: config.githubOwner,
      repo: config.githubContentRepo,
      pull_number: prNumber,
      event: voteType === 'approve' ? 'APPROVE' : 'REQUEST_CHANGES',
      body: comment || (voteType === 'approve' 
        ? 'I approve this proposal ✓' 
        : 'I request changes to this proposal ✗')
    })
    
    return {
      success: true,
      message: 'Vote recorded successfully'
    }
  } catch (error) {
    console.error('Vote error:', error)
    throw createError({
      statusCode: 500,
      message: `Failed to vote: ${error.message}`
    })
  }
})