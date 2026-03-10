<script setup lang="ts">
import { onMounted, ref, computed, defineProps } from "vue";
import Comment from "./Comment.vue";

// 1. DATA BLUEPRINT (TypeScript Interface)
// This describes exactly what a Comment object should look like.
interface CommentData {
  id: string;
  content: string;
  votes: number;
  likes: number;
  dislikes: number;
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
  (e: 'updateTakeVote',  take_id:number, command: string): void
}>()

function handleTakeRating(command: string, take_id: number) {
  emit("updateTakeVote", take_id, command)
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
      <div v-for="comment in sortedAgree" :key="comment.id">
        <Comment
            :id="comment.id"
            :content="comment.content"
            :likes="comment.likes"
            :dislikes="comment.dislikes"
            @takeRating = "(command) => handleTakeRating(command, comment.id)"
        />
      </div>
    </div>

    <div class="col disagreeCol">
      <div v-for="comment in sortedDisagree" :key="comment.id">
        <Comment
            :id="comment.id"
            :content="comment.content"
            :likes="comment.likes"
            :dislikes="comment.dislikes"
            @takeRating = "(command) => handleTakeRating(command, comment.id)"
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

/* Specific border colors to differentiate the "Sides" of the social debate */
.agreeCol { border: 2px solid #00ff19; }
.disagreeCol { border: 2px solid #ff0000; }
</style>