<script setup lang="ts">
import { computed } from "vue";

// 1. PROPS (The Inputs)
// These are the numbers passed down from the Home component.
// They represent the "Raw Data" from your Supabase 'Debates' table.
const props = defineProps({
  agreeVotes: {
    default: 0,
    type: Number,
    required: true,
  },
  disagreeVotes: {
    default: 0,
    type: Number,
    required: true,
  }
})

// 2. COMPUTED PROPERTIES (The "Brain")
// A computed property is perfect here because it "watches" agreeVotes and disagreeVotes.
// If either number changes, these calculations re-run automatically.
const stats = computed(() => {
  // We calculate the sum first
  const total = props.agreeVotes + props.disagreeVotes;

  return {
    totalVotes: total,
    // (Part / Total) * 100 gives us the percentage.
    // .toFixed(2) ensures we don't see 10 decimal places (e.g., 33.33%).
    disagreePercentage: (100 * (props.disagreeVotes / total)).toFixed(2),
    agreePercentage: (100 * (props.agreeVotes / total)).toFixed(2),
  }
})
</script>

<template>
  <div
      class="statContainer"
      v-if="props.agreeVotes"
  >
    Disagree: {{ stats.disagreePercentage }}%
    Agree: {{ stats.agreePercentage }}%
    Total Takes: {{ stats.totalVotes }}
  </div>

  <div class="statContainer" v-else>
    Loading Stats...
  </div>
</template>

<style scoped>
.statContainer {
  background-color: rosybrown;
  margin: auto;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  width: 90%;
}
</style>