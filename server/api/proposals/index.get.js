export default defineEventHandler(async (event) => {
    // TODO: Get from database
    // const db = useDatabase()
    // const proposals = await db.query('SELECT * FROM proposals ORDER BY created_at DESC')
    
    // For now, return mock data
    return {
      success: true,
      proposals: [
        // {
        //   id: 1,
        //   branch_name: 'proposal/1733234567-add-privacy-rights',
        //   title: 'Add Digital Privacy Rights',
        //   description: 'Proposal to add comprehensive digital privacy protections',
        //   author_id: 1,
        //   status: 'open',
        //   created_at: '2024-12-09T10:00:00Z'
        // }
      ]
    }
  })