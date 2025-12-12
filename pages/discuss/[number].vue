<script setup lang="ts">
import { useRoute } from 'vue-router';
import ReadingContainer from '@/components/ReadingContainer.vue';

const route = useRoute();
const number = route.params.number as string;

const { data, pending, error } = await useFetch(`/api/github/discussion/${number}`);

const discussion = computed(() => (data as any)?.value?.data?.repository?.discussion ?? null);
</script>

<template>
  <ReadingContainer>
    <div class="space-y-4">
      <NuxtLink to="/discuss" class="text-sm text-muted-foreground">← Επιστροφή στις συζητήσεις</NuxtLink>

      <div v-if="pending" class="text-sm text-muted-foreground">Φόρτωση…</div>
      <div v-else-if="error" class="text-sm text-destructive">Σφάλμα: {{ error.message || error }}</div>

      <div v-else-if="discussion">
        <h1 class="text-2xl font-serif font-semibold">{{ discussion.title }}</h1>
        <div class="text-sm text-muted-foreground">Author: {{ discussion.author?.login ?? '—' }} • {{ discussion.createdAt }}</div>

        <div class="mt-4 prose max-w-none">
          <div v-if="discussion.bodyHTML" v-html="discussion.bodyHTML"></div>
          <div v-else class="whitespace-pre-wrap">{{ discussion.body }}</div>
        </div>

        <div v-if="discussion.comments?.nodes?.length" class="mt-6">
          <h3 class="font-semibold">Σχόλια ({{ discussion.comments.totalCount }})</h3>
          <ul class="space-y-3 mt-3">
            <li v-for="c in discussion.comments.nodes" :key="c.id" class="p-3 border rounded bg-background">
              <div class="text-sm font-medium">{{ c.author?.login ?? '—' }}</div>
              <div class="mt-1" v-if="c.bodyHTML" v-html="c.bodyHTML"></div>
              <div v-else class="whitespace-pre-wrap">{{ c.body }}</div>
            </li>
          </ul>
        </div>
      </div>
      <div v-else class="text-sm text-muted-foreground">Συζήτηση δεν βρέθηκε.</div>
    </div>
  </ReadingContainer>
</template>
