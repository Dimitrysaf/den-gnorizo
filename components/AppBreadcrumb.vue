<script setup lang="ts">


interface BreadcrumbItem {
  label: string;
  to?: string;
}

const props = defineProps<{
  items: BreadcrumbItem[];
}>();
</script>

<template>
  <nav aria-label="Breadcrumb" class="flex items-center text-sm text-muted-foreground mb-4">
    <template v-for="(item, index) in items" :key="index">
      <span v-if="index > 0" class="mx-2 text-muted-foreground/60">/</span>
      
      <NuxtLink 
        v-if="item.to && index < items.length - 1" 
        :to="item.to" 
        class="hover:text-foreground transition-colors"
      >
        {{ item.label }}
      </NuxtLink>
      
      <span 
        v-else 
        class="font-medium text-foreground"
        :class="{ 'text-muted-foreground': index < items.length - 1 }"
      >
        {{ item.label }}
      </span>
    </template>
  </nav>
</template>
