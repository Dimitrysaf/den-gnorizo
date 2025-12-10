<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ReadingContainer from '@/components/ReadingContainer.vue';

const route = useRoute();
const sha = route.params.sha as string;
const commit = ref<any>(null);
const loading = ref(true);

const fetchCommit = async () => {
  loading.value = true;
  try {
    const response = await fetch(`/api/github/commit/${sha}`);
    if (response.ok) {
      commit.value = await response.json();
    }
  } catch (error) {
    console.error('Failed to fetch commit:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchCommit();
});

const formatGreekRelativeTime = (dateString: string) => {
    // Reusing the logic (ideally this should be a composable/util)
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
};
</script>

<template>
  <ReadingContainer>
    <div class="space-y-6">
      <!-- Header -->
      <div v-if="loading" class="text-center py-8 text-muted-foreground">
        Φόρτωση λεπτομερειών...
      </div>

      <div v-else-if="commit" class="space-y-8">
        <div class="space-y-4 border-b pb-6">
            <h1 class="text-2xl font-serif font-semibold">{{ commit.commit.message.split('\n')[0] }}</h1>
            <div class="flex items-center gap-4 text-sm text-muted-foreground">
                <span class="flex items-center gap-1 font-medium text-foreground">
                    <span class="material-symbols-sharp text-[18px]">person</span>
                    {{ commit.commit.author.name }}
                </span>
                <span>•</span>
                <span>{{ formatGreekRelativeTime(commit.commit.author.date) }}</span>
                <span>•</span>
                <span class="font-mono bg-muted px-2 py-1 rounded text-xs select-all">{{ commit.sha }}</span>
            </div>
            <pre v-if="commit.commit.message.split('\n').slice(1).join('\n').trim()" class="text-sm text-muted-foreground bg-muted/30 p-4 rounded whitespace-pre-wrap font-sans">{{ commit.commit.message.split('\n').slice(1).join('\n').trim() }}</pre>
        </div>

        <!-- File Changes -->
        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold">{{ commit.files.length }} αρχεία άλλαξαν</h3>
                <div class="text-sm text-muted-foreground">
                    <span class="text-green-600 font-medium">+{{ commit.stats.additions }}</span>
                    <span class="text-red-600 font-medium ml-2">-{{ commit.stats.deletions }}</span>
                </div>
            </div>

            <div v-for="file in commit.files" :key="file.filename" class="border rounded-lg overflow-hidden bg-card">
                <div class="bg-muted/40 px-4 py-2 border-b flex items-center justify-between text-sm">
                    <div class="font-mono">{{ file.filename }}</div>
                    <div class="text-xs text-muted-foreground">
                        <span class="text-green-600">+{{ file.additions }}</span>
                        <span class="text-red-600 ml-1">-{{ file.deletions }}</span>
                    </div>
                </div>
                <!-- Simple Diff View -->
                <div class="overflow-x-auto text-xs font-mono p-0">
                    <pre v-if="file.patch" class="p-4 leading-relaxed">{{ file.patch }}</pre>
                    <div v-else class="p-4 text-muted-foreground italic">
                        Binary file or too large/renamed/deleted without patch.
                    </div>
                </div>
            </div>
        </div>
      </div>
      
      <div v-else class="text-center py-8 text-red-500">
        Το commit δεν βρέθηκε.
      </div>
    </div>
  </ReadingContainer>
</template>
