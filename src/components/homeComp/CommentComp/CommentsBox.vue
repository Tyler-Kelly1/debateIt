<script setup lang="ts">
import { onMounted, ref, computed, defineProps } from "vue";
import Comment from "./Comment.vue";

// 1. DATA BLUEPRINT (TypeScript Interface)
// This describes exactly what a Comment object should look like.
interface CommentData {
  id: string;
  content: string;
  votes: number;
  lit?: boolean; // The '?' means this property is optional
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

const sortedAgree = computed(() => {
  const displayedAgreed = [];

  // Convert our Object dictionary from the parent into an Array so we can sort it.
  for (const [key, value] of Object.entries(props.agreedComments)) {
    displayedAgreed.push(value);
  }

  // Sort: Highest votes at the top (b.votes - a.votes)
  return displayedAgreed.sort((a, b) => b.votes - a.votes);
});

const sortedDisagree = computed(() => {
  const displayedDisagreed = [];
  for (const [key, value] of Object.entries(props.disagreedComments)) {
    displayedDisagreed.push(value);
  }
  return displayedDisagreed.sort((a, b) => b.votes - a.votes);
});

// 4. EMITS (Sending Signals Up)
// This allows this component to tell the Parent that a "Fire" count has changed globally.
const emit = defineEmits<{
  (e: 'updateFireCount', amount: number): void
}>()

// 5. THE VOTE LOGIC
/**
 * Logic for when a user clicks the fire/vote button.
 * @param id - The unique ID of the comment
 * @param isAgree - Which column are we in?
 */
function handleVote(id: string, isAgree: boolean) {
  // Use the computed property to find the specific comment
  const selectedComments = isAgree ? sortedAgree : sortedDisagree;

  // .value is needed because computed properties are reactive wrappers
  const comment = selectedComments.value.find(c => c.id === id);

  if (comment) {
    // If it's not "lit" (not voted for yet)
    if (!comment.lit) {
      comment.votes += 1;
      comment.lit = true;
      emit("updateFireCount", 1); // Tell parent to increase global fire count
    } else {
      // If user clicks again, "un-vote" it
      comment.votes -= 1;
      comment.lit = false;
      emit("updateFireCount", -1); // Tell parent to decrease global fire count
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="col agreeCol">
      <div v-for="comment in sortedAgree" :key="comment.id">
        <Comment
            :id="comment.id"
            :content="comment.content"
            :votes="comment.votes"
            :lit="comment.lit"
            v-on:updateFire="handleVote(comment.id, true)"
        />
      </div>
    </div>

    <div class="col disagreeCol">
      <div v-for="comment in sortedDisagree" :key="comment.id">
        <Comment
            :id="comment.id"
            :content="comment.content"
            :votes="comment.votes"
            :lit="comment.lit"
            v-on:updateFire="handleVote(comment.id, false)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  border: 2px solid #00d9ff;
  width: 95%;
  height: fit-content;
  margin: auto;
  padding: 3px;
}

.col {
  width: 100%;
  max-height: 50vh;
  overflow-y: scroll; /* Allows scrolling if there are many comments */
  overflow-x: hidden;
}

/* Specific border colors to differentiate the "Sides" of the social debate */
.agreeCol { border: 2px solid #00ff19; }
.disagreeCol { border: 2px solid #ff0000; }
</style>