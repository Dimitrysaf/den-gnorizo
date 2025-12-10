<script setup>
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import ResponsiveTabs from '@/components/ResponsiveTabs.vue';

const route = useRoute();

const tabs = [
  { id: 'index', label: 'Αρχική', icon: 'home', to: '/' },
  { id: 'discuss', label: 'Συζήτηση', icon: 'forum', to: '/discuss' },
  { id: 'issues', label: 'Προβλήματα', icon: 'bug_report', to: '/issues' },
  { id: 'ideas', label: 'Προτάσεις', icon: 'lightbulb', to: '/ideas' },
  { id: 'about', label: 'Σχετικά', icon: 'info', to: '/about' },
];

const activeTab = computed({
  get: () => {
    // Find matching tab based on current route path
    const match = tabs.find(t => t.to === route.path);
    return match ? match.id : 'index';
  },
  set: (val) => {
    // Setting activeTab is handled by navigation via NuxtLink in ResponsiveTabs
  }
});

</script>

<template>
  <div class="w-full font-serif">
    <div class="w-full bg-muted/20 shadow-[inset_0_-20px_30px_-20px_rgba(0,0,0,0.1)]">
        <div class="pt-6 px-6 pb-2">
            <h1 class="text-3xl font-serif font-bold text-foreground">A' Συντακτική Βουλή των Πολιτών</h1>
        </div>
        
        <div class="w-full">
        <ResponsiveTabs
            :model-value="activeTab"
            :items="tabs"
        />
        </div>
    </div>

    <!-- Content Area -->
    <div class="p-6 min-h-[200px]">
       <NuxtPage />
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles removed in favor of Tailwind CSS */
</style>
