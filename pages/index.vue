<script setup lang="ts">
// index.vue - Home page
import BranchMenu from '@/components/BranchMenu.vue';
import { ref } from 'vue';

const latestCommit = ref<any>(null);

const handleBranchSelect = async (branchName: string) => {
  try {
    const response = await fetch(`/api/github/commits?sha=${branchName}`);
    if (response.ok) {
      const commits = await response.json();
      if (commits && commits.length > 0) {
        latestCommit.value = commits[0];
      }
    }
  } catch (error) {
    console.error('Failed to fetch commits:', error);
  }
};
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-4">
      <BranchMenu @select="handleBranchSelect" />
      
      <!-- Commit Info Bar -->
      <div v-if="latestCommit" class="flex items-center gap-2 text-sm text-muted-foreground border-l pl-4 h-6">
        <span class="font-mono text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">
          {{ latestCommit.sha.substring(0, 7) }}
        </span>
        <span class="flex items-center gap-1">
          <span class="material-symbols-sharp text-[16px]">person</span>
          {{ latestCommit.commit.author.name }}
        </span>
      </div>
    </div>
    <p class="text-muted-foreground">
      Εδώ είναι η αρχική σελίδα της Α' Συντακτικής Βουλής των Πολιτών.
    </p>
  </div>
</template>
