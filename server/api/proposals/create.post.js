import { Octokit } from '@octokit/rest'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const { title, description } = body
  
  if (!title) {
    throw createError({
      statusCode: 400,
      message: 'Title is required'
    })
  }
  
  const octokit = new Octokit({ auth: config.githubToken })
  
  // Generate branch name
  const timestamp = Date.now()
  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const branchName = `proposal/${timestamp}-${slug}`
  
  try {
    // 1. Get main branch SHA
    const { data: mainRef } = await octokit.git.getRef({
      owner: config.githubOwner,
      repo: config.githubContentRepo,
      ref: 'heads/main'
    })
    
    // 2. Create new branch
    await octokit.git.createRef({
      owner: config.githubOwner,
      repo: config.githubContentRepo,
      ref: `refs/heads/${branchName}`,
      sha: mainRef.object.sha
    })
    
    // 3. Create Pull Request (this is the proposal!)
    const { data: pr } = await octokit.pulls.create({
      owner: config.githubOwner,
      repo: config.githubContentRepo,
      title: title,
      head: branchName,
      base: 'main',
      body: description || 'Constitutional proposal',
      draft: false
    })
    
    return {
      success: true,
      proposalId: pr.number,
      branchName,
      url: pr.html_url,
      message: 'Proposal created successfully'
    }
  } catch (error) {
    console.error('Proposal creation error:', error)
    throw createError({
      statusCode: 500,
      message: `Failed to create proposal: ${error.message}`
    })
  }
})