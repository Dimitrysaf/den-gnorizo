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

import ResponsiveTabs from '@/components/ResponsiveTabs.vue';
import { watch } from 'vue';

const activeTab = ref('');

const tabs = [
  { id: 'repo-id', label: 'Repository ID', icon: 'fingerprint' },
  { id: 'issues', label: 'Issues', icon: 'bug_report' },
  { id: 'prs', label: 'Pull Requests', icon: 'call_merge' },
  { id: 'discussions', label: 'Discussions', icon: 'forum' },
  { id: 'branches', label: 'Branches', icon: 'call_split' },
];

// Fetch data when tab changes if not already fetched
watch(activeTab, (newTab) => {
  if (newTab === 'repo-id' && !repoId.value) fetchRepoId();
  if (newTab === 'issues' && !issues.value) fetchIssues();
  if (newTab === 'prs' && !prs.value) fetchPRs();
  if (newTab === 'discussions' && !discussions.value) fetchDiscussions();
  if (newTab === 'branches' && !branches.value) fetchBranches();
});
</script>

<template>
  <div class="container mx-auto p-10 max-w-4xl font-serif">
    <h1 class="text-3xl font-serif text-center mb-10 text-foreground">GitHub API Dashboard</h1>
    
    <div class="mb-6">
      <ResponsiveTabs
        v-model="activeTab"
        :items="tabs"
      />
    </div>

    <!-- Content Area -->
    <div class="mt-6">
      <div v-if="activeTab === 'repo-id' && repoId" class="bg-card text-card-foreground border border-border p-6 shadow-none">
        <h2 class="text-xl font-serif mb-4">Repository ID</h2>
        <pre class="bg-muted p-4 border border-border text-sm overflow-x-auto">{{ repoId }}</pre>
        <p class="mt-4 text-muted-foreground italic text-sm">Please copy this ID and add it to your <code>.env</code> file as <code>GITHUB_REPO_ID</code>.</p>
      </div>

      <div v-else-if="activeTab === 'issues' && issues" class="bg-card text-card-foreground border border-border p-6 shadow-none">
        <h2 class="text-xl font-serif mb-4">Issues</h2>
        <pre class="bg-muted p-4 border border-border text-sm overflow-x-auto">{{ issues }}</pre>
      </div>

      <div v-else-if="activeTab === 'prs' && prs" class="bg-card text-card-foreground border border-border p-6 shadow-none">
        <h2 class="text-xl font-serif mb-4">Pull Requests</h2>
        <pre class="bg-muted p-4 border border-border text-sm overflow-x-auto">{{ prs }}</pre>
      </div>

      <div v-else-if="activeTab === 'discussions' && discussions" class="bg-card text-card-foreground border border-border p-6 shadow-none">
        <h2 class="text-xl font-serif mb-4">Discussions</h2>
        <pre class="bg-muted p-4 border border-border text-sm overflow-x-auto">{{ discussions }}</pre>
      </div>

      <div v-else-if="activeTab === 'branches' && branches" class="bg-card text-card-foreground border border-border p-6 shadow-none">
        <h2 class="text-xl font-serif mb-4">Branches</h2>
        <pre class="bg-muted p-4 border border-border text-sm overflow-x-auto">{{ branches }}</pre>
      </div>

      <div v-else class="text-center p-10 text-muted-foreground border border-border border-dashed">
        Select a tab to view content.
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles removed in favor of Tailwind CSS */
</style>
