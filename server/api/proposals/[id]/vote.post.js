export default defineEventHandler(async (event) => {
    const proposalId = event.context.params.id
    const body = await readBody(event)
    const { voteType } = body // 'approve' or 'reject'
    
    if (!['approve', 'reject'].includes(voteType)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid vote type. Must be "approve" or "reject"'
      })
    }
    
    // TODO: Check if user is authenticated
    // const user = event.context.user
    
    // TODO: Save vote to database
    // const db = useDatabase()
    // await db.query(
    //   'INSERT INTO votes (proposal_id, user_id, vote_type) VALUES ($1, $2, $3) ON CONFLICT (proposal_id, user_id) DO UPDATE SET vote_type = $3',
    //   [proposalId, user.id, voteType]
    // )
    
    return {
      success: true,
      message: 'Vote recorded'
    }
  })