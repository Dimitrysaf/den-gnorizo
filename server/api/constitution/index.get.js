import { Octokit } from '@octokit/rest'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const branch = query.branch || 'main'
  
  const octokit = new Octokit({
    auth: config.githubToken
  })
  
  try {
    // Fetch metadata.json
    const { data: metadataFile } = await octokit.repos.getContent({
      owner: config.githubOwner,
      repo: config.githubContentRepo,
      path: 'metadata.json',
      ref: branch
    })
    
    if (!metadataFile.content) {
      throw new Error('Invalid metadata response')
    }
    
    const metadata = JSON.parse(
      Buffer.from(metadataFile.content, 'base64').toString()
    )
    
    // Fetch all article contents
    for (const title of metadata.titles) {
      for (const section of title.sections) {
        for (const article of section.articles) {
          const articlePath = `${section.path}/${article.file}`
          
          try {
            const { data: articleFile } = await octokit.repos.getContent({
              owner: config.githubOwner,
              repo: config.githubContentRepo,
              path: articlePath,
              ref: branch
            })
            
            if (articleFile.content) {
              article.content = Buffer.from(
                articleFile.content,
                'base64'
              ).toString()
              article.sha = articleFile.sha // Needed for updates
            }
          } catch (error) {
            console.error(`Failed to fetch article: ${articlePath}`, error)
            article.content = null
          }
        }
      }
    }
    
    return {
      success: true,
      branch,
      metadata
    }
  } catch (error) {
    console.error('Constitution fetch error:', error)
    throw createError({
      statusCode: 500,
      message: `Failed to fetch constitution: ${error.message}`
    })
  }
})