<script setup lang="ts">
import { ref, computed } from 'vue';
import ReadingContainer from '@/components/ReadingContainer.vue';
import DiscussionCard from '@/components/DiscussionCard.vue';

// Fetch discussions from server API
const { data, pending, error, refresh } = await useFetch('/api/github/discussions');

// Extract nodes from GraphQL response shape: data.value.data.repository.discussions.nodes
const discussions = computed(() => {
  return (
    (data as any)?.value?.data?.repository?.discussions?.nodes ?? []
  );
});

// Selected discussion for inline view
const selectedDiscussionId = ref<string | null>(null);
const selectedDiscussion = computed(() => {
  return discussions.value.find((d: any) => d.id === selectedDiscussionId.value) || null;
});

function toggleDiscussion(id: string) {
  selectedDiscussionId.value = selectedDiscussionId.value === id ? null : id;
}
</script>

<template>
  <ReadingContainer>
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-serif font-semibold">Συζήτηση</h2>
          <p class="text-muted-foreground">Χώρος για συζήτηση και ανταλλαγή απόψεων.</p>
        </div>
        <div>
          <!-- Create button removed per request -->
        </div>
      </div>

      <div v-if="pending" class="text-sm text-muted-foreground">Φόρτωση συζητήσεων…</div>
      <div v-else-if="error" class="text-sm text-destructive">Σφάλμα φόρτωσης: {{ error.message || error }}</div>

      <div v-else>
        <div v-if="discussions.length === 0" class="text-sm text-muted-foreground">Δεν βρέθηκαν συζητήσεις.</div>
        <div class="space-y-4">
          <DiscussionCard
            v-for="(d, idx) in discussions"
            :key="d.id || idx"
            :discussion="d"
          />
        </div>
      </div>

      
    </div>
  </ReadingContainer>
</template>
