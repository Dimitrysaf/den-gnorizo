<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NuxtLink } from '#components';

interface TabItem {
  id: string;
  label: string;
  icon?: string;
  to?: string; // Optional URL for navigation
}

const props = defineProps<{
  modelValue: string;
  items: TabItem[];
}>();

const emit = defineEmits(['update:modelValue']);

const containerRef = ref<HTMLElement | null>(null);
const measureRef = ref<HTMLElement | null>(null);
const visibleItems = ref<TabItem[]>([]);
const overflowItems = ref<TabItem[]>([]);

const calculateLayout = () => {
  if (!containerRef.value || !measureRef.value) return;

  const containerWidth = containerRef.value.offsetWidth;
  // Get all widths from the hidden measurement container
  const measuredChildren = Array.from(measureRef.value.children) as HTMLElement[];
  
  // Reserve space for the "More" button (approx 48px for icon button)
  const moreButtonWidth = 48;
  let currentWidth = 0;
  let cutOffIndex = props.items.length;

  for (let i = 0; i < measuredChildren.length; i++) {
    // Add gap (4px/1rem approx) + child width
    const childWidth = measuredChildren[i].offsetWidth + 8; // small gap safety
    
    // If adding this child EXCEEDS the available width...
    // We check if it fits WITHOUT the more button (if it's the last one) - tricky.
    // simpler: if current + child > container - more, we stop.
    
    if (currentWidth + childWidth > containerWidth - (i < props.items.length - 1 ? moreButtonWidth : 0)) {
      cutOffIndex = i;
      break;
    }
    currentWidth += childWidth;
  }

  // Update visible arrays
  visibleItems.value = props.items.slice(0, cutOffIndex);
  overflowItems.value = props.items.slice(cutOffIndex);
};

let resizeObserver: ResizeObserver;

onMounted(async () => {
  // Wait for initial render of measurement container
  await nextTick();
  calculateLayout();
  
  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(calculateLayout);
    });
    resizeObserver.observe(containerRef.value);
  }
  window.addEventListener('resize', calculateLayout);
});

onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect();
  window.removeEventListener('resize', calculateLayout);
});

// Re-calculate if items change
watch(() => props.items, async () => {
    await nextTick();
    calculateLayout();
}, { deep: true });

const selectTab = (id: string, to?: string) => {
  emit('update:modelValue', id);
  // Optional: navigation is handled by NuxtLink if 'to' is present, 
  // but we can also manually navigate if needed. 
  // For now, relies on NuxtLink or click actions.
};
</script>

<template>
  <!-- Main Container -->
  <div ref="containerRef" class="w-full flex items-end pt-2 px-2 gap-1 relative">
    
    <!-- Visible Items -->
    <div class="flex flex-1 items-end overflow-hidden h-10">
        <Button
        v-for="item in visibleItems"
        :key="item.id"
        variant="ghost"
        :as="item.to ? NuxtLink : 'button'"
        :to="item.to"
        :class="[
            'group rounded-t-sm rounded-b-none h-10 px-4 py-2 font-serif text-sm font-medium transition-all border border-transparent whitespace-nowrap',
            modelValue === item.id 
              ? 'bg-background text-foreground border-border border-b-background shadow-sm relative z-10 top-[1px] hover:bg-background focus:bg-background active:bg-background' 
              : 'text-muted-foreground [@media(hover:hover)]:hover:text-foreground mb-[1px] hover:bg-transparent focus:bg-transparent active:bg-transparent'
        ]"
        @click="selectTab(item.id, item.to)"
        >
        <span 
          v-if="item.icon" 
          class="material-symbols-sharp mr-2 text-[18px]"
          :class="modelValue === item.id ? 'material-fill-1' : 'material-fill-0'"
        >
          {{ item.icon }}
        </span>
        <span :class="{ '[@media(hover:hover)]:group-hover:underline': modelValue !== item.id }">{{ item.label }}</span>
        </Button>
    </div>

    <!-- Overflow Menu -->
    <DropdownMenu v-if="overflowItems.length > 0">
      <DropdownMenuTrigger as-child>
        <Button variant="ghost" class="rounded-none h-10 px-3 font-serif text-sm text-muted-foreground hover:bg-muted mb-[1px]">
          <span class="material-symbols-sharp text-[20px]">more_horiz</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" class="w-48 rounded-none">
        <DropdownMenuItem
          v-for="item in overflowItems"
          :key="item.id"
          class="font-serif cursor-pointer"
          :as="item.to ? NuxtLink : 'div'"
          :to="item.to"
          @click="selectTab(item.id, item.to)"
        >
          <span 
            v-if="item.icon" 
            class="material-symbols-sharp mr-2 text-[18px]"
            :class="modelValue === item.id ? 'material-fill-1' : 'material-fill-0'"
          >
            {{ item.icon }}
          </span>
          {{ item.label }}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <!-- HIDDEN MEASUREMENT CONTAINER -->
    <!-- Mimics the styles of the visible items exactly but rendered off-screen -->
    <div ref="measureRef" class="absolute top-0 left-0 w-0 h-0 overflow-hidden opacity-0 pointer-events-none flex items-end invisible">
       <div 
        v-for="item in items" 
        :key="item.id"
        class="h-10 px-4 py-2 font-serif text-sm font-medium border border-transparent whitespace-nowrap"
       >
        <span v-if="item.icon" class="material-symbols-sharp mr-2 text-[18px] inline-block align-text-bottom">{{ item.icon }}</span>
        {{ item.label }}
       </div>
    </div>

  </div>
</template>

