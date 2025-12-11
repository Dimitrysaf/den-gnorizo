<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { ref } from 'vue'

const emit = defineEmits<{
  refresh: []
}>()

const isRefreshing = ref(false)
const lastClickTime = ref(0)
const currentDelay = ref(0)

const refreshContent = async () => {
  const now = Date.now()
  const timeSinceLastClick = now - lastClickTime.value
  
  // If clicked within 3 seconds, add 1 second delay
  if (timeSinceLastClick < 3000 && lastClickTime.value > 0) {
    currentDelay.value += 1000
  } else {
    // Reset delay if more than 3 seconds have passed
    currentDelay.value = 0
  }
  
  lastClickTime.value = now
  
  // Apply delay if any
  if (currentDelay.value > 0) {
    isRefreshing.value = true
    await new Promise(resolve => setTimeout(resolve, currentDelay.value))
  }
  
  isRefreshing.value = true
  
  try {
    // Emit refresh event to parent
    emit('refresh')
    
    // Keep showing refreshing state for a moment
    await new Promise(resolve => setTimeout(resolve, 500))
  } finally {
    isRefreshing.value = false
  }
}
</script>

<template>
  <Button 
    variant="outline" 
    size="sm" 
    class="font-serif print-hide"
    :disabled="isRefreshing"
    @click="refreshContent"
  >
    <span 
      class="material-symbols-sharp text-[18px] mr-2"
      :class="{ 'animate-spin': isRefreshing }"
    >
      refresh
    </span>
    {{ isRefreshing ? 'Ανανέωση...' : 'Ανανέωση' }}
  </Button>
</template>
