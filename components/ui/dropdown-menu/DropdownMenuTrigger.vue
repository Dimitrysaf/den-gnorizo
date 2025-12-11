<script setup lang="ts">
import type { DropdownMenuTriggerProps } from "reka-ui"
import { DropdownMenuTrigger, useForwardProps } from "reka-ui"
import { ref, onMounted, nextTick, provide } from "vue"

const props = defineProps<DropdownMenuTriggerProps>()

const forwardedProps = useForwardProps(props)

const triggerRef = ref<HTMLElement | null>(null)
const triggerWidth = ref<number>(0)

onMounted(() => {
  nextTick(() => {
    if (triggerRef.value) {
      triggerWidth.value = triggerRef.value.offsetWidth
    }
  })
})

// Provide the trigger width to the content component
provide('dropdownTriggerWidth', triggerWidth)

</script>

<template>
  <DropdownMenuTrigger ref="triggerRef" class="outline-none" v-bind="forwardedProps">
    <slot />
  </DropdownMenuTrigger>
</template>
