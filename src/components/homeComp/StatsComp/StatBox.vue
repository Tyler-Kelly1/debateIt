<script setup lang="ts">

import {computed} from "vue";

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

const stats = computed(() => {
  return {
    totalVotes: (props.agreeVotes + props.disagreeVotes),
    disagreePercentage: (100 * (props.disagreeVotes / (props.agreeVotes + props.disagreeVotes))).toFixed(2),
    agreePercentage: (100 * (props.agreeVotes / (props.agreeVotes + props.disagreeVotes))).toFixed(2),
  }
})

</script>

<template>
  <div class=statContainer>

    Disagree: {{stats.disagreePercentage}}%
    Agree: {{stats.agreePercentage}}%
    Total Takes: {{stats.totalVotes}}

  </div>
</template>

<style scoped>

.statContainer {
  background-color: rosybrown;
  margin: auto;
}

</style>