<script setup lang="ts">
import { onMounted, ref, computed, defineProps } from "vue";
import Take from "./Take.vue";

type FormattedTake = {
  take_id: string;
  message: string;
  user_id?: string|null;
  topic: string;
  side: boolean;
}


// 2. PROPS (Incoming Data)
// These are the "inputs" passed down from the Parent (HomeView).
const props = defineProps({
  agreedComments: {
    default: () => [],
    required: true
  },
  disagreedComments: {
    default: () => [],
    required: true
  }
});

// 3. COMPUTED PROPERTIES (Automatic Transformers)
// In Vue, 'computed' is a reactive variable that "derives" its value from other data.
// If the votes change, these functions automatically re-run to re-sort the list.

const sortingFilter = ref("likes")

const sortedAgree = computed(() => {

  const displayedAgreed = [];

  // Convert our Object dictionary from the parent into an Array so we can sort it.
  for (const [key, value] of Object.entries(props.agreedComments)) {
    displayedAgreed.push(value);
  }

  // Sort: Highest votes at the top (b.votes - a.votes)
  if(sortingFilter.value === "likes") {
    return displayedAgreed.sort((a, b) => b.likes - a.likes);
  }
  else if (sortingFilter.value === "dislikes") {
    return displayedAgreed.sort((a, b) => b.dislikes - a.dislikes);
  }

});

const sortedDisagree = computed(() => {

  const displayedDisagreed = [];
  for (const [key, value] of Object.entries(props.disagreedComments)) {
    displayedDisagreed.push(value);
  }

  // Sort: Highest votes at the top (b.votes - a.votes)
  if(sortingFilter.value === "likes") {
    return displayedDisagreed.sort((a, b) => b.likes - a.likes);
  }
  else if (sortingFilter.value === "dislikes") {
    return displayedDisagreed.sort((a, b) => b.dislikes - a.dislikes);
  }

});

// 4. EMITS (Sending Signals Up)
// This allows this component to tell the Parent that a "Fire" count has changed globally.
const emit = defineEmits<{
  (e: 'newReaction',  take_id:number, command: string): void
}>()

function handleNewReaction(reaction:any, take_id: number) {
  emit("newReaction", {type:reaction.type, takeSide:reaction.takeSide, take_id:take_id})
}

function updateSortingFilter(filter){
  if(filter === "likes"){
    sortingFilter.value = "likes";
  }
  else{
    sortingFilter.value = "dislikes";
  }
}

</script>

<template>
  <div class="filterBar">

    <div @click="updateSortingFilter('likes')">
      ^
    </div>
    <div @click="updateSortingFilter('dislikes')"
    >
      V
    </div>

  </div>

  <div class="container">
    <div class="col agreeCol">
      <div v-for="take in sortedAgree" :key="take.take_id">
        <Take
            :take_id = "take.take_id"
            :message= "take.message"
            :user_id= "take.user_id"
            :side = "take.side"
            :reactions= "take.reactions"
            :likes = "take.likes"
            :dislikes = "take.dislikes"
            @newReaction = "(reaction) => handleNewReaction(reaction, take.take_id)"
        />
      </div>
    </div>

    <div class="col disagreeCol">
      <div v-for="take in sortedDisagree" :key="take.take_id">
        <Take
            :take_id = "take.take_id"
            :message = "take.message"
            :user_id= "take.user_id"
            :side = "take.side"
            :reactions= "take.reactions"
            :likes = "take.likes"
            :dislikes = "take.dislikes"
            @newReaction = "(reaction) => handleNewReaction(reaction, take.take_id)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  border: 2px solid #00d9ff;
  backgroud: #f3f3f3;
  width: min(1240px, 92vw);
  height: fit-content;
  margin: auto;
  overflow: hidden;
  padding: 3px;
}

.filterBar {
  display: flex;
  margin: auto;
}

.col {
  width: 100%;
  max-height: 50vh;
  overflow-y: scroll; /* Allows scrolling if there are many comments */
  overflow-x: hidden;
}

.header {
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 600;
  border-bottom: 1px solid #cfcfcf;
}

.agreeHeader{
  background: #cfead5;
  color: #006c2f
}

.disagreeHeader{
  background: #efd2d2;
  color: #a30000;
}


/* Specific border colors to differentiate the "Sides" of the social debate */
.agreeCol { border: 2px solid #00ff19; }
.disagreeCol { border: 2px solid #ff0000; }
</style>