<script setup>
  import { ref } from 'vue'
  
  const loading = ref(false)
  const result = ref(null)
  const error = ref(null)
  
  async function createTestProposal() {
    loading.value = true
    error.value = null
    result.value = null
    
    try {
      console.log('Making request to /api/proposals/create...')
      
      const response = await fetch('/api/proposals/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Test Proposal - Article on Digital Rights',
          description: 'This is a test proposal to add a new article about digital privacy rights.\n\nThis PR was created automatically to test the API.'
        })
      })
      
      console.log('Response status:', response.status, response.statusText)
      console.log('Response headers:', response.headers)
      
      const contentType = response.headers.get('content-type')
      console.log('Content-Type:', contentType)
      
      // Get the raw response text first
      const text = await response.text()
      console.log('Raw response:', text)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}\n\nResponse: ${text}`)
      }
      
      // Try to parse as JSON
      const data = JSON.parse(text)
      result.value = data
      console.log('Proposal created:', data)
    } catch (e) {
      error.value = e.message || 'Failed to create proposal'
      console.error('Full error:', e)
    } finally {
      loading.value = false
    }
  }
  
  async function testFetchConstitution() {
    loading.value = true
    error.value = null
    result.value = null
    
    try {
      console.log('Fetching constitution...')
      const response = await fetch('/api/constitution')
      
      console.log('Response status:', response.status)
      
      const text = await response.text()
      console.log('Raw response length:', text.length)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${text}`)
      }
      
      const data = JSON.parse(text)
      result.value = data
      console.log('Constitution fetched:', data)
    } catch (e) {
      error.value = e.message || 'Failed to fetch constitution'
      console.error('Error:', e)
    } finally {
      loading.value = false
    }
  }
  
  async function testListProposals() {
    loading.value = true
    error.value = null
    result.value = null
    
    try {
      console.log('Fetching proposals...')
      const response = await fetch('/api/proposals')
      
      console.log('Response status:', response.status)
      
      const text = await response.text()
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${text}`)
      }
      
      const data = JSON.parse(text)
      result.value = data
      console.log('Proposals fetched:', data)
    } catch (e) {
      error.value = e.message || 'Failed to fetch proposals'
      console.error('Error:', e)
    } finally {
      loading.value = false
    }
  }
  
  async function testServerStatus() {
    loading.value = true
    error.value = null
    result.value = null
    
    try {
      // Just test if server is responding
      const response = await fetch('/api/proposals')
      result.value = {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        contentType: response.headers.get('content-type')
      }
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }
  </script>
  
  <template>
    <div class="container">
      <h1>🧪 API Testing Dashboard</h1>
      <p>Test your GitHub API integration</p>
      
      <div class="buttons">
        <button @click="testServerStatus" :disabled="loading">
          🔍 Test Server
        </button>
        
        <button @click="testFetchConstitution" :disabled="loading">
          📖 Fetch Constitution
        </button>
        
        <button @click="testListProposals" :disabled="loading">
          📋 List Proposals
        </button>
        
        <button @click="createTestProposal" :disabled="loading">
          ✨ Create Test Proposal
        </button>
      </div>
      
      <div v-if="loading" class="status loading">
        ⏳ Loading...
      </div>
      
      <div v-if="error" class="status error">
        <strong>❌ Error:</strong>
        <pre style="white-space: pre-wrap; margin-top: 10px;">{{ error }}</pre>
      </div>
      
      <div v-if="result" class="result">
        <h2>✅ Success!</h2>
        <pre>{{ JSON.stringify(result, null, 2) }}</pre>
        
        <div v-if="result.url" class="link">
          <a :href="result.url" target="_blank">
            🔗 View on GitHub
          </a>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 20px;
    font-family: system-ui, -apple-system, sans-serif;
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: #1a202c;
  }
  
  p {
    color: #718096;
    margin-bottom: 2rem;
  }
  
  .buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 2rem;
  }
  
  button {
    padding: 12px 24px;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    background: #3182ce;
    color: white;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 500;
  }
  
  button:hover:not(:disabled) {
    background: #2c5aa0;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(49, 130, 206, 0.3);
  }
  
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .status {
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 1rem;
    font-weight: 500;
  }
  
  .status.loading {
    background: #bee3f8;
    color: #2c5aa0;
  }
  
  .status.error {
    background: #fed7d7;
    color: #c53030;
  }
  
  .result {
    background: #f7fafc;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    padding: 20px;
  }
  
  .result h2 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #48bb78;
  }
  
  pre {
    background: white;
    padding: 16px;
    border-radius: 6px;
    overflow-x: auto;
    font-size: 0.875rem;
    line-height: 1.5;
    border: 1px solid #e2e8f0;
  }
  
  .link {
    margin-top: 1rem;
  }
  
  .link a {
    display: inline-block;
    padding: 10px 20px;
    background: #48bb78;
    color: white;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 500;
    transition: all 0.2s;
  }
  
  .link a:hover {
    background: #38a169;
    transform: translateY(-2px);
  }
  </style>