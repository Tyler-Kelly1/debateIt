<script setup lang="ts">
const props = defineProps<{
  name: string,
  color?: string
}>()
</script>

<template>
  <svg class="icon" :style="{ color: color }">
    <use :xlink:href="`/icons.svg#${name}`"></use>
  </svg>
</template>

<style scoped>
.icon {
  width: 1.5rem;
  height: 1.5rem;
  fill: currentColor;
}
</style>