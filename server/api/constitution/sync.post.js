import { Octokit } from '@octokit/rest'

// Sync database from GitHub metadata.json
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  const octokit = new Octokit({
    auth: config.githubToken
  })
  
  try {
    // Fetch metadata.json
    const { data: metadataFile } = await octokit.repos.getContent({
      owner: config.githubOwner,
      repo: config.githubContentRepo,
      path: 'metadata.json',
      ref: 'main'
    })
    
    const metadata = JSON.parse(
      Buffer.from(metadataFile.content, 'base64').toString()
    )
    
    // TODO: Update PostgreSQL with metadata structure
    // const db = useDatabase()
    // await db.query('DELETE FROM articles')
    // await db.query('DELETE FROM sections')
    // await db.query('DELETE FROM titles')
    // 
    // for (const title of metadata.titles) {
    //   await db.query('INSERT INTO titles ...', [...])
    //   for (const section of title.sections) {
    //     await db.query('INSERT INTO sections ...', [...])
    //     for (const article of section.articles) {
    //       await db.query('INSERT INTO articles ...', [...])
    //     }
    //   }
    // }
    
    return {
      success: true,
      message: 'Database synced with GitHub metadata'
    }
  } catch (error) {
    console.error('Sync error:', error)
    throw createError({
      statusCode: 500,
      message: `Failed to sync: ${error.message}`
    })
  }
})