<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import ReadingContainer from '@/components/ReadingContainer.vue';

const route = useRoute();
const branch = ref(route.query.branch || 'main');
const file = ref(route.query.file || '');
const commits = ref<any[]>([]);
const loading = ref(false);

const breadcrumbItems = [
  { label: 'Αρχική', to: '/' },
  { label: 'Ιστορικό Αλλαγών' }
];

const fetchCommits = async () => {
  loading.value = true;
  try {
    let url = `/api/github/commits?sha=${branch.value}&limit=30`;
    if (file.value) {
      url += `&path=${file.value}`;
    }
    const response = await fetch(url);
    if (response.ok) {
      commits.value = await response.json();
    }
  } catch (error) {
    console.error('Failed to fetch commits:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchCommits();
});

const formatGreekRelativeTime = (dateString: string) => {
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
};
</script>

<template>
  <ReadingContainer>
    <div class="space-y-6">
      <AppBreadcrumb :items="breadcrumbItems" />
      <div class="flex items-center justify-between">
        <div class="space-y-1">
          <h2 class="text-2xl font-serif font-semibold">Ιστορικό Αλλαγών</h2>
          <p v-if="file" class="text-sm text-muted-foreground font-serif">
            Φιλτράρισμα για: <span class="font-mono text-foreground">{{ file }}</span>
          </p>
        </div>
        <span class="text-muted-foreground text-sm font-mono bg-muted px-2 py-1 rounded">
            {{ branch }}
        </span>
      </div>

      <div v-if="loading" class="space-y-4">
        <div v-for="i in 5" :key="i" class="block p-4 rounded-lg border bg-card">
            <div class="flex items-start justify-between gap-4">
                <div class="space-y-2 flex-1">
                    <Skeleton class="h-5 w-3/4" />
                    <div class="flex items-center gap-2">
                        <Skeleton class="h-4 w-32" />
                        <Skeleton class="h-4 w-24" />
                    </div>
                </div>
                <Skeleton class="h-5 w-16" />
            </div>
        </div>
      </div>

      <div v-else class="space-y-4">
        <NuxtLink 
            v-for="commit in commits" 
            :key="commit.sha" 
            :to="`/commits/${commit.sha}`"
            class="block p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
        >
            <div class="flex items-start justify-between gap-4">
                <div class="space-y-1">
                    <div class="font-medium text-foreground">
                        {{ commit.commit.message.split('\n')[0] }}
                    </div>
                    <div class="flex items-center gap-2 text-sm text-muted-foreground">
                        <span class="flex items-center gap-1">
                            <span class="material-symbols-sharp text-[16px]">person</span>
                            {{ commit.commit.author.name }}
                        </span>
                        <span>•</span>
                        <span>{{ formatGreekRelativeTime(commit.commit.author.date) }}</span>
                    </div>
                </div>
                <div class="font-mono text-xs bg-muted px-2 py-1 rounded text-foreground">
                    {{ commit.sha.substring(0, 7) }}
                </div>
            </div>
        </NuxtLink>
      </div>
    </div>
  </ReadingContainer>
</template>
