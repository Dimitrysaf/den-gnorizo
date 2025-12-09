import { Octokit } from '@octokit/rest'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const articleId = event.context.params.id
  const body = await readBody(event)
  const { content, branch, commitMessage } = body
  
  if (!branch || branch === 'main') {
    throw createError({
      statusCode: 400,
      message: 'Cannot edit main branch directly. Create a proposal first.'
    })
  }
  
  // TODO: Check if user is authenticated
  // const user = event.context.user
  
  const octokit = new Octokit({
    auth: config.githubToken
  })
  
  try {
    // Get article path from metadata
    const { data: metadataFile } = await octokit.repos.getContent({
      owner: config.githubOwner,
      repo: config.githubContentRepo,
      path: 'metadata.json',
      ref: branch
    })
    
    const metadata = JSON.parse(
      Buffer.from(metadataFile.content, 'base64').toString()
    )
    
    // Find article
    let articlePath = null
    for (const title of metadata.titles) {
      for (const section of title.sections) {
        const article = section.articles.find(a => a.id === articleId)
        if (article) {
          articlePath = `${section.path}/${article.file}`
          break
        }
      }
      if (articlePath) break
    }
    
    if (!articlePath) {
      throw createError({
        statusCode: 404,
        message: 'Article not found'
      })
    }
    
    // Get current file to get SHA
    const { data: currentFile } = await octokit.repos.getContent({
      owner: config.githubOwner,
      repo: config.githubContentRepo,
      path: articlePath,
      ref: branch
    })
    
    // Update file
    await octokit.repos.createOrUpdateFileContents({
      owner: config.githubOwner,
      repo: config.githubContentRepo,
      path: articlePath,
      message: commitMessage || `Update article: ${articleId}`,
      content: Buffer.from(content).toString('base64'),
      sha: currentFile.sha,
      branch: branch
    })
    
    return {
      success: true,
      message: 'Article updated successfully'
    }
  } catch (error) {
    console.error('Article update error:', error)
    throw createError({
      statusCode: 500,
      message: `Failed to update article: ${error.message}`
    })
  }
})