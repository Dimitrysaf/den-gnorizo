<script setup>
import { ref } from 'vue';

const issues = ref(null);
const prs = ref(null);
const discussions = ref(null);
const branches = ref(null);
const repoId = ref(null); // New ref for the repo ID

const fetchIssues = async () => {
  const response = await fetch('/api/github/issues');
  issues.value = await response.json();
};

const fetchPRs = async () => {
  const response = await fetch('/api/github/prs');
  prs.value = await response.json();
};

const fetchDiscussions = async () => {
  const response = await fetch('/api/github/discussions');
  discussions.value = await response.json();
};

const fetchBranches = async () => {
  const response = await fetch('/api/github/branches');
  branches.value = await response.json();
};

// New function to fetch the repo ID
const fetchRepoId = async () => {
  const response = await fetch('/api/github/repo-id');
  repoId.value = await response.json();
};
</script>

<template>
  <div class="container">
    <h1>GitHub API Dashboard</h1>
    <div class="buttons">
      <button @click="fetchRepoId">Fetch Repo ID</button> <!-- New Button -->
      <button @click="fetchIssues">Fetch Issues</button>
      <button @click="fetchPRs">Fetch PRs</button>
      <button @click="fetchDiscussions">Fetch Discussions</button>
      <button @click="fetchBranches">Fetch Branches</button>
    </div>
    <div class="results">
      <!-- New Result Card -->
      <div v-if="repoId" class="result-card">
        <h2>Repository ID</h2>
        <pre>{{ repoId }}</pre>
        <p>Please copy this ID and add it to your <code>.env</code> file as <code>GITHUB_REPO_ID</code>.</p>
      </div>
      <div v-if="issues" class="result-card">
        <h2>Issues</h2>
        <pre>{{ issues }}</pre>
      </div>
      <div v-if="prs" class="result-card">
        <h2>Pull Requests</h2>
        <pre>{{ prs }}</pre>
      </div>
      <div v-if="discussions" class="result-card">
        <h2>Discussions</h2>
        <pre>{{ discussions }}</pre>
      </div>
      <div v-if="branches" class="result-card">
        <h2>Branches</h2>
        <pre>{{ branches }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f7fafc;
}

h1 {
  text-align: center;
  color: #2d3748;
  margin-bottom: 40px;
}

.buttons {
  display: flex;
  justify-content: center;
  flex-wrap: wrap; /* Allow buttons to wrap on smaller screens */
  gap: 20px;
  margin-bottom: 40px;
}

button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background-color: #4299e1;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #3182ce;
}

.results {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.result-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #2d3748;
  margin-top: 0;
}

pre {
  background-color: #edf2f7;
  padding: 15px;
  border-radius: 4px;
  white-space: pre-wrap;
  word-wrap: break-word;
}

p {
  margin-top: 1rem;
  font-style: italic;
  color: #6a7f99;
}
</style>
