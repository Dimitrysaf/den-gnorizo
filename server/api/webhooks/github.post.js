import crypto from 'crypto'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const signature = getHeader(event, 'x-hub-signature-256')
  
  // TODO: Verify webhook signature for security
  // const secret = config.githubWebhookSecret
  // const hmac = crypto.createHmac('sha256', secret)
  // const digest = 'sha256=' + hmac.update(JSON.stringify(body)).digest('hex')
  // if (signature !== digest) {
  //   throw createError({ statusCode: 401, message: 'Invalid signature' })
  // }
  
  console.log('GitHub webhook received:', body.action, body.ref)
  
  // If main branch was pushed, sync database
  if (body.ref === 'refs/heads/main' && body.pusher) {
    console.log('Main branch updated, triggering sync...')
    
    // Trigger sync in background
    // await $fetch('/api/constitution/sync', { method: 'POST' })
  }
  
  return { received: true }
})