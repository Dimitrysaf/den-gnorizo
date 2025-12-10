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

const branches = ref<Branch[]>([]);
const selectedBranch = ref<string | null>(null);

const emit = defineEmits(['select']);

const fetchBranches = async () => {
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
    <DropdownMenuTrigger as-child>
      <Button variant="outline" class="font-serif">
        <span class="material-symbols-sharp mr-2 text-[18px]">account_tree</span>
        {{ selectedBranch || 'Branch' }}
        <span class="material-symbols-sharp ml-2 text-[18px]">expand_more</span>
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
