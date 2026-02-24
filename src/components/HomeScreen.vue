<script setup>
// 1. IMPORTING REQUISITES
// We import child components to use them in our HTML (template)
import CommentsBox from "./homeComp/CommentComp/CommentsBox.vue";
import NewTake from "./homeComp/NewTakeArea/NewTake.vue";

// 'computed', 'ref', and 'reactive' are Vue's "Reactivity" tools.
// Even if not all are used yet, they are the building blocks for dynamic data.
import { computed, ref, reactive } from "vue";

// 2. DATA STATE (The "Source of Truth")
// 'reactive' is used for objects or arrays.
// When these values change, Vue automatically updates the UI.
const testData1 = reactive({
  "1": { id: "1", content: "Hello", votes: 2, lit: false },
  "2": { id: "2", content: "World", votes: 0, lit: false }
});

const testData2 = reactive({
  "1": { id: "1", content: "Hello", votes: 1, lit: false },
  "2": { id: "2", content: "World", votes: 0, lit: false },
  "3": { id: "3", content: "World", votes: 3, lit: false },
  "4": { id: "4", content: "ME", votes: 2, lit: false },
  "5": { id: "5", content: "or ME!", votes: 2, lit: false },
});


// 3. LOGIC & METHODS
// This function is a placeholder for future API calls to a database.
function handleCommentUpdates() {
  // Logic for syncing comments would go here
}

/**
 * Handles receiving a new "Take" (post) from the child component.
 * @param data - The post object
 * @param side - A boolean or value determining which list to add to
 */
function handleSubmitTake(data, side) {
  // Logic: If 'side' is truthy, update the first list, otherwise the second.
  // Because testData1/2 are 'reactive', adding a key here updates the screen instantly.
  if (side) {
    testData1[data.id] = data;
  } else {
    testData2[data.id] = data;
  }
}
</script>

<template>
  <div class="home">

    <NewTake @submitTake="handleSubmitTake"></NewTake>

    <CommentsBox
        :agreedComments="testData1"
        :disagreedComments="testData2"
    ></CommentsBox>
  </div>
</template>

<style scoped>
/* 'scoped' means these styles ONLY apply to this component and won't leak out */
.home {
  display: flex;
  flex-direction: column;
  border: 1px solid yellow;
  width: 100%;
  height: 100vh; /* Takes up full viewport height */
}
</style>