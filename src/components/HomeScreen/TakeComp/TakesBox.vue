<script setup lang="js">
import { onMounted, ref, computed, defineProps } from "vue";
import Take from "./Take.vue";

// 2. PROPS (Incoming Data)
// These are the "inputs" passed down from the Parent (HomeView).
const props = defineProps({
  user_ID: String,
  agreeTakes: {
    default: () => [],
    required: true
  },
  disagreeTakes: {
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
  for (const [key, value] of Object.entries(props.agreeTakes)) {
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
  for (const [key, value] of Object.entries(props.disagreeTakes)) {
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
const emit = defineEmits(["newReaction"])

function handleNewReaction(reaction, take_id) {
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

function handleUserReactionCheck(takeId){

  let take = props.agreeTakes[takeId] || props.disagreeTakes[takeId];
  let takeReactions = take.reactions;


  if (takeReactions[props.user_ID] && takeReactions[props.user_ID] !== "None"){
    return takeReactions[props.user_ID];
  }

  return "None"

}
</script>

<template>
  <div class="bg-surface text-on-surface min-h-screen flex flex-col gap-2">

  <div class="filterBar">

    <div @click="updateSortingFilter('likes')">
      ^
    </div>
    <div @click="updateSortingFilter('dislikes')"
    >
      V
    </div>

  </div>
    <div class="board">
      <div class="boardHeader">
        <div class="header agreeHeader">Consensus</div>
        <div class="header disagreeHeader">Dissent</div>
      </div>

      <div class="boardBody">
        <div class="col agreeCol mb-6">
          <div v-if="sortedAgree.length">
            <Take
                v-for="take in sortedAgree"
                :key="take.take_id"
                :take_id="take.take_id"
                :message="take.message"
                :user_id="take.user_id"
                :side="take.side"
                :userReaction="handleUserReactionCheck(take.take_id)"
                :likes="take.likes"
                :dislikes="take.dislikes"
                :replies="take.replies"
                @newReaction="(reaction) => handleNewReaction(reaction, take.take_id)"
            />
          </div>

          <div v-else class="emptyState">No comments yet</div>

        </div>

        <div class="col disagreeCol">
          <div v-if="sortedDisagree.length">
            <Take
                v-for="take in sortedDisagree"
                :key="take.take_id"
                :take_id="take.take_id"
                :message="take.message"
                :user_id="take.user_id"
                :side="take.side"
                :userReaction="handleUserReactionCheck(take.take_id)"
                :likes="take.likes"
                :dislikes="take.dislikes"
                :replies="take.replies"
                @newReaction="(reaction) => handleNewReaction(reaction, take.take_id)"
            />
          </div>

          <div v-else class="emptyState">No comments yet</div>
        </div>
      </div>
    </div>

  </div>

</template>

<style scoped>
.board {
  width:100%;
  max-width: 1360px;
  margin: 0 auto;
  background: #f8f8f8;
  border-radius: 2px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.boardHeader {
  display: none;
  /*grid-template-columns: 1fr 1fr;*/
}

.boardBody {
  display:flex;
  flex-direction: column;
  /*grid-template-columns: 1fr 1fr;
  min-height: 620px;*/
}

.col {
  padding: 16px;
  display: flex;
  flex-direction: column;
  background: #f8f8f8;
}

.header {
  height: 92px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  border-bottom: 1px solid #d7d7d7;
}

.agreeHeader {
  background: #d8efdf;
  color: #006b33;
  border-right: 1px solid #d0d0d0;
}

.disagreeHeader {
  background: #f1d8d8;
  color: #a40000;
}

.agreeCol {
  border-right: 1px solid #d0d0d0;
}

.disagreeCol {
  border-bottom: none;
}

.col::before {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  padding: 14px 0;
  margin: -16px -16px 16px;
  border-bottom: 1px solid #d7d7d7;
}

.agreeCol::before {
  content: "Consensus";
  background: #d8efdf;
  color: #006b33;
}

.disagreeCol::before {
  content: "Dissent";
  background: #f1d8d8;
  color: #a40000;
}
.emptyState {
flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a0b8;
  font-size: 1.1rem;
  min-height: 140px;
}

.filterBar {
  display: flex;
  margin: auto;
}

/* Specific border colors to differentiate the "Sides" of the social debate */
.agreeCol { border: 2px solid black; }
.disagreeCol { border: 2px solid black; }
</style>