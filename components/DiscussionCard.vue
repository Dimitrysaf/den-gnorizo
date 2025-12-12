<template>
  <NuxtLink :to="`/discuss/${discussion.number}`" class="block p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors no-underline">
    <div class="flex items-start justify-between gap-4">
      <div class="space-y-1 flex-1">
        <div class="font-medium text-foreground">{{ discussion.title }}</div>

        <div class="flex items-center gap-2 text-sm text-muted-foreground">
          <span class="flex items-center gap-1">
            <span class="material-symbols-sharp text-[16px]">person</span>
            {{ discussion.author?.login || '—' }}
          </span>
          <span>•</span>
          <span>{{ relativeTime(discussion.createdAt) }}</span>
        </div>
      </div>
      <div class="font-mono text-xs bg-muted px-2 py-1 rounded text-foreground">
        {{ discussion.number ?? (discussion.id || '').toString().slice(0,7) }}
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{ discussion: any }>();

function relativeTime(dateString: string | undefined) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return 'Τώρα';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}λ πριν`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}ω πριν`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Χθες';
  if (diffInDays < 7) return `${diffInDays}ημ πριν`;
  return date.toLocaleDateString('el-GR');
}
</script>

<style scoped>
.prose img { max-width: 100%; }
</style>
