<template>
  <!-- 
    Optimized for reading:
    - max-w-[75ch]: Limits width to ~75 characters for optimal eye-tracking.
    - ml-0: Strictly left-aligned (default, but explicit).
  -->
  <div class="w-full max-w-[75ch] ml-0">
    <slot />
  </div>
</template>
