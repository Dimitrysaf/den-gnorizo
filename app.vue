<script setup>
  import { ref } from 'vue'
  
  const loading = ref(false)
  const result = ref(null)
  const error = ref(null)
  const activeTab = ref('overview')
  
  // ============================================
  // BRANCHES
  // ============================================
  async function listBranches() {
    loading.value = true
    error.value = null
    result.value = null
    
    try {
      const response = await fetch('/api/branches')
      const text = await response.text()
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${text}`)
      }
      
      const data = JSON.parse(text)
      result.value = data
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }
  
  async function createTestBranch() {
    loading.value = true
    error.value = null
    result.value = null
    
    try {
      const response = await fetch('/api/branches/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `test-branch-${Date.now()}`
        })
      })
      
      const text = await response.text()
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${text}`)
      
      result.value = JSON.parse(text)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }
  
  // ============================================
  // PULL REQUESTS
  // ============================================
  async function listPullRequests() {
    loading.value = true
    error.value = null
    result.value = null
    
    try {
      const response = await fetch('/api/proposals')
      const text = await response.text()
      
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${text}`)
      
      result.value = JSON.parse(text)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }
  
  async function createTestPR() {
    loading.value = true
    error.value = null
    result.value = null
    
    try {
      const response = await fetch('/api/proposals/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Test PR - ${new Date().toLocaleString()}`,
          description: 'This is a test Pull Request created to verify API integration.\n\nIt includes a dummy commit to README.md.'
        })
      })
      
      const text = await response.text()
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${text}`)
      
      result.value = JSON.parse(text)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }
  
  // ============================================
  // ISSUES
  // ============================================
  async function listIssues() {
    loading.value = true
    error.value = null
    result.value = null
    
    try {
      const response = await fetch('/api/issues')
      const text = await response.text()
      
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${text}`)
      
      result.value = JSON.parse(text)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }
  
  async function createTestIssue() {
    loading.value = true
    error.value = null
    result.value = null
    
    try {
      const response = await fetch('/api/issues/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Test Issue - ${new Date().toLocaleString()}`,
          body: 'This is a test issue created to verify API integration.\n\n- [ ] Test checkbox\n- [ ] Another item'
        })
      })
      
      const text = await response.text()
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${text}`)
      
      result.value = JSON.parse(text)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }
  
  async function commentOnIssue() {
    loading.value = true
    error.value = null
    result.value = null
    
    try {
      const issueNumber = prompt('Enter issue number:')
      if (!issueNumber) return
      
      const response = await fetch('/api/issues/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issueNumber: parseInt(issueNumber),
          body: `Test comment posted at ${new Date().toLocaleString()}`
        })
      })
      
      const text = await response.text()
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${text}`)
      
      result.value = JSON.parse(text)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }
  
  // ============================================
  // DISCUSSIONS
  // ============================================
  async function listDiscussions() {
    loading.value = true
    error.value = null
    result.value = null
    
    try {
      const response = await fetch('/api/discussions')
      const text = await response.text()
      
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${text}`)
      
      result.value = JSON.parse(text)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }
  
  async function createTestDiscussion() {
    loading.value = true
    error.value = null
    result.value = null
    
    try {
      const response = await fetch('/api/discussions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Test Discussion - ${new Date().toLocaleString()}`,
          body: 'This is a test discussion created to verify API integration.',
          category: 'General'
        })
      })
      
      const text = await response.text()
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${text}`)
      
      result.value = JSON.parse(text)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }
  
  // ============================================
  // README EDIT
  // ============================================
  async function editReadme() {
    loading.value = true
    error.value = null
    result.value = null
    
    try {
      const response = await fetch('/api/files/edit-readme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `# App Content\n\nLast updated: ${new Date().toISOString()}\n\nThis is a test edit from the API.`,
          branch: 'main'
        })
      })
      
      const text = await response.text()
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${text}`)
      
      result.value = JSON.parse(text)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }
  </script>
  
  <template>
    <div class="container">
      <h1>🧪 GitHub API Testing Dashboard</h1>
      <p>Full READ/WRITE access to Branches, PRs, Issues, and Discussions</p>
      
      <!-- Tabs -->
      <div class="tabs">
        <button 
          @click="activeTab = 'overview'" 
          :class="{ active: activeTab === 'overview' }"
        >
          📊 Overview
        </button>
        <button 
          @click="activeTab = 'branches'" 
          :class="{ active: activeTab === 'branches' }"
        >
          🌿 Branches
        </button>
        <button 
          @click="activeTab = 'prs'" 
          :class="{ active: activeTab === 'prs' }"
        >
          🔀 Pull Requests
        </button>
        <button 
          @click="activeTab = 'issues'" 
          :class="{ active: activeTab === 'issues' }"
        >
          🐛 Issues
        </button>
        <button 
          @click="activeTab = 'discussions'" 
          :class="{ active: activeTab === 'discussions' }"
        >
          💬 Discussions
        </button>
        <button 
          @click="activeTab = 'files'" 
          :class="{ active: activeTab === 'files' }"
        >
          📝 Files
        </button>
      </div>
      
      <!-- Overview Tab -->
      <div v-if="activeTab === 'overview'" class="tab-content">
        <h2>Quick Actions</h2>
        <div class="buttons">
          <button @click="listBranches" :disabled="loading">🌿 List Branches</button>
          <button @click="listPullRequests" :disabled="loading">🔀 List PRs</button>
          <button @click="listIssues" :disabled="loading">🐛 List Issues</button>
          <button @click="listDiscussions" :disabled="loading">💬 List Discussions</button>
        </div>
      </div>
      
      <!-- Branches Tab -->
      <div v-if="activeTab === 'branches'" class="tab-content">
        <h2>Branches</h2>
        <div class="buttons">
          <button @click="listBranches" :disabled="loading">📋 List All Branches</button>
          <button @click="createTestBranch" :disabled="loading">➕ Create Test Branch</button>
        </div>
      </div>
      
      <!-- Pull Requests Tab -->
      <div v-if="activeTab === 'prs'" class="tab-content">
        <h2>Pull Requests</h2>
        <div class="buttons">
          <button @click="listPullRequests" :disabled="loading">📋 List All PRs</button>
          <button @click="createTestPR" :disabled="loading">➕ Create Test PR (with commit)</button>
        </div>
        <p class="note">Creating a PR will also create a branch and add a dummy commit to README.md</p>
      </div>
      
      <!-- Issues Tab -->
      <div v-if="activeTab === 'issues'" class="tab-content">
        <h2>Issues</h2>
        <div class="buttons">
          <button @click="listIssues" :disabled="loading">📋 List All Issues</button>
          <button @click="createTestIssue" :disabled="loading">➕ Create Test Issue</button>
          <button @click="commentOnIssue" :disabled="loading">💬 Add Comment to Issue</button>
        </div>
      </div>
      
      <!-- Discussions Tab -->
      <div v-if="activeTab === 'discussions'" class="tab-content">
        <h2>Discussions</h2>
        <div class="buttons">
          <button @click="listDiscussions" :disabled="loading">📋 List All Discussions</button>
          <button @click="createTestDiscussion" :disabled="loading">➕ Create Test Discussion</button>
        </div>
        <p class="note">Note: Discussions require GraphQL API and repo to have Discussions enabled</p>
      </div>
      
      <!-- Files Tab -->
      <div v-if="activeTab === 'files'" class="tab-content">
        <h2>File Operations</h2>
        <div class="buttons">
          <button @click="editReadme" :disabled="loading">📝 Edit README.md</button>
        </div>
      </div>
      
      <!-- Status Messages -->
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
  * {
    box-sizing: border-box;
  }
  
  .container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 40px 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: #1a202c;
    font-weight: 700;
  }
  
  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #2d3748;
  }
  
  p {
    color: #718096;
    margin-bottom: 2rem;
    font-size: 1.1rem;
  }
  
  .tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    border-bottom: 2px solid #e2e8f0;
    flex-wrap: wrap;
  }
  
  .tabs button {
    padding: 12px 20px;
    border: none;
    background: transparent;
    color: #718096;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.95rem;
    border-bottom: 3px solid transparent;
    transition: all 0.2s;
    margin-bottom: -2px;
  }
  
  .tabs button:hover {
    color: #667eea;
  }
  
  .tabs button.active {
    color: #667eea;
    border-bottom-color: #667eea;
  }
  
  .tab-content {
    animation: fadeIn 0.3s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;
  }
  
  button {
    padding: 14px 24px;
    font-size: 0.95rem;
    border: none;
    border-radius: 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    box-shadow: 0 4px 6px rgba(102, 126, 234, 0.2);
  }
  
  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }
  
  button:active:not(:disabled) {
    transform: translateY(0);
  }
  
  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  .note {
    font-size: 0.9rem;
    color: #a0aec0;
    font-style: italic;
    margin-top: -0.5rem;
  }
  
  .status {
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 1.5rem;
    font-weight: 500;
    animation: slideIn 0.3s ease;
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .status.loading {
    background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
    border: 2px solid #667eea;
    color: #5a67d8;
    font-size: 1.1rem;
  }
  
  .status.error {
    background: #fff5f5;
    border: 2px solid #fc8181;
    color: #c53030;
  }
  
  .result {
    background: linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%);
    border: 2px solid #48bb78;
    border-radius: 12px;
    padding: 24px;
    animation: slideIn 0.3s ease;
  }
  
  .result h2 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #22543d;
  }
  
  pre {
    background: white;
    padding: 20px;
    border-radius: 8px;
    overflow-x: auto;
    font-size: 0.85rem;
    line-height: 1.6;
    border: 1px solid #e2e8f0;
    color: #2d3748;
    font-family: 'Monaco', 'Courier New', monospace;
    max-height: 600px;
    overflow-y: auto;
  }
  
  .link {
    margin-top: 1.5rem;
  }
  
  .link a {
    display: inline-block;
    padding: 12px 24px;
    background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(72, 187, 120, 0.2);
  }
  
  .link a:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(72, 187, 120, 0.4);
  }
  
  .link a:active {
    transform: translateY(0);
  }
  </style>