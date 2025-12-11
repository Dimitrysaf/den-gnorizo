<script setup lang="ts">
import BranchMenu from '@/components/BranchMenu.vue';
import PrintButton from '@/components/PrintButton.vue';
import Skeleton from '@/components/ui/skeleton/Skeleton.vue';

interface ConstitutionMetadata {
  title: string
  lastUpdated: string
  structure: any[]
}

// Branch and commit info
const latestCommit = ref<any>(null);
const selectedBranch = ref<string>('main');
const loading = ref(true);

const handleBranchSelect = async (branchName: string) => {
  selectedBranch.value = branchName;
  loading.value = true;
  latestCommit.value = null;
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
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  handleBranchSelect('main');
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

// Constitution metadata
const { data: metadata, error: metadataError } = await useFetch<ConstitutionMetadata>('/api/github/metadata')
</script>

<template>
  <ReadingContainer>
    <div class="space-y-6">
      <!-- Branch Menu and Commit Info -->
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <BranchMenu @select="handleBranchSelect" />
          <PrintButton />
        </div>
        
        <!-- Commit Info Bar Skeleton -->
        <div v-if="loading" class="flex items-center w-full gap-2 h-9 p-2 -ml-2">
          <Skeleton class="h-5 w-32" />
          <Skeleton class="h-5 flex-1" />
          <Skeleton class="h-5 w-20" />
          <Skeleton class="h-5 w-24" />
        </div>

        <!-- Commit Info Bar -->
        <NuxtLink 
          v-else-if="latestCommit" 
          :to="`/commits?branch=${selectedBranch}`" 
          class="flex items-center w-full gap-2 text-sm text-muted-foreground hover:bg-muted/50 p-2 -ml-2 rounded-md transition-colors block"
        >
          <span class="flex items-center gap-1 font-medium text-foreground">
            <span class="material-symbols-sharp text-[16px]">person</span>
            {{ latestCommit.commit.author.name }}
          </span>
          
          <span class="truncate">{{ latestCommit.commit.message }}</span>
          
          <div class="flex-1"></div>
          
          <span class="font-mono text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">
            {{ latestCommit.sha.substring(0, 7) }}
          </span>
          
          <span class="text-base font-medium text-foreground">
            {{ formatGreekRelativeTime(latestCommit.commit.author.date) }}
          </span>
        </NuxtLink>
      </div>

      <!-- Constitution Title -->
      <div v-if="metadata" class="mb-8 mt-8">
        <h1 class="text-4xl font-serif font-bold text-foreground mb-2">
          {{ metadata.title }}
        </h1>
        <p class="text-sm text-muted-foreground font-serif">
          Τελευταία ενημέρωση δομής: {{ new Date(metadata.lastUpdated).toLocaleDateString('el-GR') }}
        </p>
      </div>

      <!-- Error State for metadata -->
      <div v-if="metadataError" class="bg-muted/20 border border-border rounded-sm p-6 font-serif">
        <p class="text-foreground font-semibold mb-2">Το Σύνταγμα δεν έχει δημοσιευτεί ακόμα</p>
        <p class="text-sm text-muted-foreground">
          Το αρχείο metadata.json δεν βρέθηκε στο αποθετήριο. Παρακαλώ δημιουργήστε το πρώτα.
        </p>
      </div>

      <!-- Loading State -->
      <div v-else-if="!metadata" class="text-muted-foreground font-serif">
        Φόρτωση Συντάγματος...
      </div>

      <!-- Constitution Content -->
      <div v-else class="constitution-content">
        <ConstitutionNode
          v-for="(node, index) in metadata.structure"
          :key="`root-${index}`"
          :node="node"
        />
      </div>
    </div>
  </ReadingContainer>
</template>
