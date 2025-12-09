import { Octokit } from '@octokit/rest'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const proposalId = event.context.params.id
  
  // TODO: Get from database
  // const db = useDatabase()
  // const proposal = await db.query('SELECT * FROM proposals WHERE id = $1', [proposalId])
  
  // For now, return mock data
  const proposal = {
    id: proposalId,
    branch_name: `proposal/${proposalId}-example`,
    title: 'Example Proposal',
    description: 'This is an example proposal',
    status: 'open',
    created_at: '2024-12-09T10:00:00Z'
  }
  
  // Fetch branch info from GitHub
  const octokit = new Octokit({
    auth: config.githubToken
  })
  
  try {
    const { data: branch } = await octokit.repos.getBranch({
      owner: config.githubOwner,
      repo: config.githubContentRepo,
      branch: proposal.branch_name
    })
    
    proposal.lastCommit = {
      sha: branch.commit.sha,
      message: branch.commit.commit.message,
      author: branch.commit.commit.author.name,
      date: branch.commit.commit.author.date
    }
    
    return {
      success: true,
      proposal
    }
  } catch (error) {
    console.error('Proposal fetch error:', error)
    throw createError({
      statusCode: 404,
      message: 'Proposal not found'
    })
  }
})