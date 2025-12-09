import { Octokit } from '@octokit/rest'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const articleId = event.context.params.id
  const query = getQuery(event)
  const branch = query.branch || 'main'
  
  const octokit = new Octokit({
    auth: config.githubToken
  })
  
  try {
    // First, get metadata to find article path
    const { data: metadataFile } = await octokit.repos.getContent({
      owner: config.githubOwner,
      repo: config.githubContentRepo,
      path: 'metadata.json',
      ref: branch
    })
    
    const metadata = JSON.parse(
      Buffer.from(metadataFile.content, 'base64').toString()
    )
    
    // Find article by id
    let foundArticle = null
    let articlePath = null
    
    for (const title of metadata.titles) {
      for (const section of title.sections) {
        const article = section.articles.find(a => a.id === articleId)
        if (article) {
          foundArticle = article
          articlePath = `${section.path}/${article.file}`
          break
        }
      }
      if (foundArticle) break
    }
    
    if (!foundArticle) {
      throw createError({
        statusCode: 404,
        message: 'Article not found'
      })
    }
    
    // Fetch article content
    const { data: articleFile } = await octokit.repos.getContent({
      owner: config.githubOwner,
      repo: config.githubContentRepo,
      path: articlePath,
      ref: branch
    })
    
    return {
      success: true,
      article: {
        ...foundArticle,
        content: Buffer.from(articleFile.content, 'base64').toString(),
        sha: articleFile.sha,
        path: articlePath
      }
    }
  } catch (error) {
    console.error('Article fetch error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch article'
    })
  }
})