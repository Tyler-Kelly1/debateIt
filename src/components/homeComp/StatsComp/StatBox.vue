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

  <div class="statContainer">
    <div class="voteCircle agree">
      <div class="icon">👍</div>
      <div class="count">{{ agreeVotes }}</div>
    </div>

    <div class="voteCircle disagree">
      <div class="icon">👎</div>
      <div class="count">{{ disagreeVotes }}</div>
    </div>
  </div>
</template>

<style scoped>
.statContainer {
  display: flex;
  justify-content: center;
  gap: 34px;
  margin-top: 16px;
  margin-bottom: 40px;
}

.voteCircle {
  width: 146px;
  height: 146px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 10px 20px rgba(0,0,0,0.12);
}

.agree {
  background: #10c84f;
}

.disagree {
  background: #ff3131;
}

.icon {
  font-size: 52px;
  line-height: 1;
  margin-bottom: 8px;
}

.count {
  font-size: 24px;
  font-weight: 700;
}

</style>