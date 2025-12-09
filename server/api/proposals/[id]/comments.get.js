export default defineEventHandler(async (event) => {
    const proposalId = event.context.params.id
    
    // TODO: Get from database
    // const db = useDatabase()
    // const comments = await db.query(
    //   'SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.proposal_id = $1 ORDER BY c.created_at ASC',
    //   [proposalId]
    // )
    
    return {
      success: true,
      comments: []
    }
  })