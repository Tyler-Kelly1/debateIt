<script setup lang="js">
import { computed } from "vue";

// 1. PROPS (The Inputs)
// These are the numbers passed down from the Home component.
// They represent the "Raw Data" from Supabase 'Debates' table.
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
    disagreePercentage: (100 * (props.disagreeVotes / total)).toFixed(1),
    agreePercentage: (100 * (props.agreeVotes / total)).toFixed(1),
  }
})
</script>

<template>

  <!-- CONSENSUS BAR SECTION -->
  <div class="w-full bg-surface-container-low p-6 border-2 border-on-background kinetic-shadow">
    <div class="flex justify-between items-end mb-4">
      <div class="flex flex-col">
        <span class="text-4xl text-primary font-black leading-none">{{stats.agreePercentage}}%</span>
        <span class="text-[10px] font-bold tracking-widest uppercase text-blue-900">Consensus</span>
      </div>
      <div class="flex flex-col items-center">
        <span class="text-xl font-bold font-headline">{{stats.totalVotes}}</span>
        <span class="text-[8px] font-bold tracking-tighter uppercase opacity-50">Total_Votes_Cast</span>
      </div>
      <div class="flex flex-col items-end">
        <span class="text-4xl text-disagree font-black leading-none text-tertiary">{{stats.disagreePercentage}}%</span>
        <span class="text-[10px] text-red-900 font-bold tracking-widest uppercase text-tertiary">Dissent</span>
      </div>
    </div>
    <div class="w-full h-12 flex border-2 border-on-background overflow-hidden">
      <div class="h-full bg-blue-700" :style="{width: stats.agreePercentage + '%'}"></div>
      <div class="h-full bg-red-500" :style="{width: stats.disagreePercentage + '%'}"></div>
    </div>
  </div>

  <div class=statContainer>

    Disagree: {{stats.disagreePercentage}}%
    Agree: {{stats.agreePercentage}}%
    Total Takes: {{stats.totalVotes}}

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
  gap: 28px;
  margin-top: 18px;
  margin-bottom: 36px;

  background-color: black;


}

.voteCircle {
  width: 152px;
  height: 152px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 10px 20px rgba(0,0,0,0.12);
  border: 6px, solid rgba(255, 255, 255, 0.45);
}

.agree {
  background: #06b63f;
}

.disagree {
  background: #ff2d34;
}

.icon {
  font-size: 3.4rem;
  line-height: 1;
  margin-bottom: 8px;
}

.count {
  font-size: 2rem;
  font-weight: 700;
}

</style>