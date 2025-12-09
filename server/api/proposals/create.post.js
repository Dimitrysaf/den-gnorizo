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
  
  // TODO: Check if user is authenticated
  // const user = event.context.user
  // if (!user) {
  //   throw createError({ statusCode: 401, message: 'Unauthorized' })
  // }
  
  const octokit = new Octokit({ auth: config.githubToken })
  
  // Generate unique branch name
  const timestamp = Date.now()
  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const branchName = `proposal/${timestamp}-${slug}`
  
  try {
    // Get main branch SHA
    const { data: mainRef } = await octokit.git.getRef({
      owner: config.githubOwner,
      repo: config.githubContentRepo,
      ref: 'heads/main'
    })
    
    // Create new branch
    await octokit.git.createRef({
      owner: config.githubOwner,
      repo: config.githubContentRepo,
      ref: `refs/heads/${branchName}`,
      sha: mainRef.object.sha
    })
    
    // TODO: Save to database
    // const db = useDatabase()
    // const result = await db.query(
    //   'INSERT INTO proposals (branch_name, title, description, author_id, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    //   [branchName, title, description, user.id, 'open']
    // )
    
    return {
      success: true,
      branchName,
      message: 'Proposal created successfully',
      // proposal: result.rows[0]
    }
  } catch (error) {
    console.error('Proposal creation error:', error)
    throw createError({
      statusCode: 500,
      message: `Failed to create proposal: ${error.message}`
    })
  }
})