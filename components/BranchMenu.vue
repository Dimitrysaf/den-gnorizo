<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Branch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
}

import Skeleton from '@/components/ui/skeleton/Skeleton.vue';

const branches = ref<Branch[]>([]);
const selectedBranch = ref<string | null>(null);
const loading = ref(true);

const emit = defineEmits(['select']);

const fetchBranches = async () => {
    loading.value = true;
    try {
        const response = await fetch('/api/github/branches');
        if (response.ok) {
            branches.value = await response.json();
            if (branches.value.length > 0) {
                // Default to 'main' or the first one if not set
                const main = branches.value.find(b => b.name === 'main' || b.name === 'master');
                const defaultBranch = main ? main.name : branches.value[0].name;
                selectedBranch.value = defaultBranch;
                emit('select', defaultBranch);
            }
        }
    } catch (error) {
        console.error('Failed to fetch branches:', error);
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    fetchBranches();
});

const selectBranch = (branchName: string) => {
    selectedBranch.value = branchName;
    emit('select', branchName);
};
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child :disabled="loading">
      <Button variant="outline" size="sm" class="font-serif min-w-[140px]">
        <template v-if="loading">
            <Skeleton class="h-5 w-24" />
        </template>
        <template v-else>
            <span class="material-symbols-sharp mr-2 text-[18px]">account_tree</span>
            {{ selectedBranch || 'Branch' }}
            <span class="material-symbols-sharp ml-2 text-[18px]">expand_more</span>
        </template>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="max-h-[300px] overflow-y-auto">
      <DropdownMenuItem
        v-for="branch in branches"
        :key="branch.name"
        class="font-serif cursor-pointer justify-between"
        @click="selectBranch(branch.name)"
      >
        {{ branch.name }}
        <span v-if="selectedBranch === branch.name" class="material-symbols-sharp ml-2 text-[16px]">check</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
