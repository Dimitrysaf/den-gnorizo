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

const activeTab = ref('home');

const tabs = [
  { id: 'home', label: 'Αρχική', icon: 'home' },
  { id: 'discussions', label: 'Συζήτηση', icon: 'forum' },
  { id: 'issues', label: 'Προβλήματα', icon: 'bug_report' },
  { id: 'proposals', label: 'Προτάσεις', icon: 'lightbulb' },
  { id: 'about', label: 'Σχετικά', icon: 'info' },
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
  <div class="w-full font-serif">
    <div class="p-6 bg-background border-b border-border">
        <h1 class="text-3xl font-serif font-bold text-foreground">A' Συντακτική Βουλή των Πολιτών</h1>
    </div>
    
    <div class="w-full">
      <ResponsiveTabs
        v-model="activeTab"
        :items="tabs"
      />
    </div>

    <!-- Content Area -->
    <div class="p-6 min-h-[200px]">
       <!-- Content cleared as requested -->
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles removed in favor of Tailwind CSS */
</style>
