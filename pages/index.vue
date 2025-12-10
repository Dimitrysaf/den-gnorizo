<script setup lang="ts">
// index.vue - Home page
import BranchMenu from '@/components/BranchMenu.vue';
import { ref } from 'vue';
import ReadingContainer from '@/components/ReadingContainer.vue';

const latestCommit = ref<any>(null);
const selectedBranch = ref<string>('main');

const handleBranchSelect = async (branchName: string) => {
  selectedBranch.value = branchName;
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

const formatGreekRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Τώρα';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}λ πριν`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}ω πριν`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return 'Χθες';
  }
  
  if (diffInDays < 7) {
    return `${diffInDays}ημ πριν`;
  }

  return date.toLocaleDateString('el-GR');
};
</script>

<template>
  <ReadingContainer>
  <div class="space-y-4">
      <BranchMenu @select="handleBranchSelect" />
      
      <!-- Commit Info Bar -->
      <NuxtLink v-if="latestCommit" :to="`/commits?branch=${selectedBranch}`" class="flex items-center w-full gap-2 text-sm text-muted-foreground hover:bg-muted/50 p-2 -ml-2 rounded-md transition-colors block">
         <!-- User Name -->
        <span class="flex items-center gap-1 font-medium text-foreground">
          <span class="material-symbols-sharp text-[16px]">person</span>
          {{ latestCommit.commit.author.name }}
        </span>
        
        <!-- Commit Message -->
        <span class="truncate">{{ latestCommit.commit.message }}</span>

        <!-- Width Space/Flex -->
        <div class="flex-1"></div>

        <!-- Commit ID -->
        <span class="font-mono text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">
          {{ latestCommit.sha.substring(0, 7) }}
        </span>

        <!-- Date Committed -->
         <span class="text-base font-medium text-foreground">
          {{ formatGreekRelativeTime(latestCommit.commit.author.date) }}
        </span>
      </NuxtLink>
    <p class="text-muted-foreground">
      Εδώ είναι η αρχική σελίδα της Α' Συντακτικής Βουλής των Πολιτών.
    </p>
  </div>
  </ReadingContainer>
</template>
