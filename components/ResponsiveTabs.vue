<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, computed } from 'vue';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TabItem {
  id: string;
  label: string;
  icon?: string;
}

const props = defineProps<{
  modelValue: string;
  items: TabItem[];
}>();

const emit = defineEmits(['update:modelValue']);

const containerRef = ref<HTMLElement | null>(null);
const visibleItems = ref<TabItem[]>([]);
const overflowItems = ref<TabItem[]>([]);

const calculateLayout = async () => {
  if (!containerRef.value) return;

  // Reset to full visibility to measure
  visibleItems.value = props.items;
  overflowItems.value = [];
  
  await nextTick();

  const containerWidth = containerRef.value.offsetWidth;
  const children = Array.from(containerRef.value.children) as HTMLElement[];
  
  // Reserve space for the "More" button (approx 80px)
  const moreButtonWidth = 80;
  let currentWidth = 0;
  let cutOffIndex = props.items.length;

  for (let i = 0; i < children.length; i++) {
    const childWidth = children[i].offsetWidth + 16; // 16px for gap
    if (currentWidth + childWidth > containerWidth - moreButtonWidth) {
      cutOffIndex = i;
      break;
    }
    currentWidth += childWidth;
  }

  // If we need to hide items, update the arrays
  if (cutOffIndex < props.items.length) {
    visibleItems.value = props.items.slice(0, cutOffIndex);
    overflowItems.value = props.items.slice(cutOffIndex);
  }
};

let resizeObserver: ResizeObserver;

onMounted(() => {
  calculateLayout();
  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => {
        // Debounce slightly or just run
        calculateLayout();
    });
    resizeObserver.observe(containerRef.value);
  }
  window.addEventListener('resize', calculateLayout);
});

onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect();
  window.removeEventListener('resize', calculateLayout);
});

const selectTab = (id: string) => {
  emit('update:modelValue', id);
};
</script>

<template>
  <div ref="containerRef" class="w-full flex items-center border-b border-border bg-background">
    <div class="flex flex-1 items-center gap-4 overflow-hidden">
        <Button
        v-for="item in visibleItems"
        :key="item.id"
        variant="ghost"
        :class="[
            'rounded-none h-12 border-b-2 border-transparent px-4 py-2 font-serif text-sm font-medium transition-colors hover:text-primary',
            modelValue === item.id ? 'border-primary text-primary' : 'text-muted-foreground'
        ]"
        @click="selectTab(item.id)"
        >
        <span v-if="item.icon" class="material-symbols-outlined mr-2 text-[20px]">{{ item.icon }}</span>
        {{ item.label }}
        </Button>
    </div>

    <DropdownMenu v-if="overflowItems.length > 0">
      <DropdownMenuTrigger as-child>
        <Button variant="ghost" class="rounded-none h-12 px-4 font-serif text-sm text-muted-foreground">
          More <span class="material-symbols-outlined ml-1 text-[16px]">expand_more</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" class="w-48 rounded-none">
        <DropdownMenuItem
          v-for="item in overflowItems"
          :key="item.id"
          class="font-serif cursor-pointer"
          @click="selectTab(item.id)"
        >
          <span v-if="item.icon" class="material-symbols-outlined mr-2 text-[18px]">{{ item.icon }}</span>
          {{ item.label }}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
