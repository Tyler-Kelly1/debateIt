<script setup>
// 1. IMPORTING REQUISITES
import CommentsBox from "./homeComp/CommentComp/CommentsBox.vue";
import NewTake from "./homeComp/NewTakeArea/NewTake.vue";
import StatBox from "./homeComp/StatsComp/StatBox.vue";

// 'onMounted' is a Lifecycle Hook. It runs code as soon as the component appears on screen.
import { computed, ref, reactive, onMounted } from "vue";

// This is your connection to the outside world (the database)
import supabase from "../config/supabaseClient.js"

// 2. DATA STATE (The "Local Memory")
// We use 'reactive' so that when the database returns data, the UI updates instantly.
const agreeTakes = reactive({});
const disagreeTakes = reactive({});

// Stores the numerical statistics (e.g., total vote counts)
const statsData = reactive({
  "agree": null,
  "disagree": null
})

// Stores the main question/topic being debated
const debateTopic = reactive({
  "topic": null
})

// 3. DATABASE LOGIC (The "Async" Function)
// 'async' tells Vue this function will take time to finish (waiting for the internet).
async function updateData() {

  // We "await" the response from Supabase.
  // We are selecting everything (*) from Debates and the related 'Takes' table.
  let { data, error } = await supabase
      .from('Debates')
      .select(`
        *,
        Takes (
          Agree,
          message,
          likes,
          dislikes
        )
      `)

  // In this project, we assume there is only one active debate, so we grab the first entry [0].
  data = data[0]

  // Update our local topic with the string from the database
  debateTopic.topic = data.topic

  // 'takes' is a list of all posts attached to this debate
  const takes = data.Takes

  // We loop through every take we found in the database
  Object.entries(takes).forEach(([key, value]) => {

    // Unique ID generation: Combining timestamp and index key to prevent duplicates
    const id = Date.now().toString() + key;

    // Logic: Sort the data into the correct "Bucket" based on the 'Agree' boolean
    if (value.Agree) {
      // Map database fields (message, likes) to our local object format (content, votes)
      agreeTakes[id] = { id: id, content: value.message, votes: value.likes, lit: false }
    } else {
      disagreeTakes[id] = { id: id, content: value.message, votes: value.likes, lit: false }
    }
  })

  // Update the statistics display (StatBox)
  statsData.agree = data.agree
  statsData.disagree = data.disagree
}

/**
 * LIFECYCLE HOOK: onMounted
 * This is the trigger. As soon as the user opens the app,
 * we run 'updateData' to fetch the latest info from the database.
 */
onMounted(() => {
  updateData()
})

// 4. SUBMISSION LOGIC
function handleSubmitTake(data, side) {
  // NEXT STEP: You will need to write code here to 'INSERT' the new take
  // into Supabase so it stays there forever!
}
</script>

<template>
  <div class="home">
    <StatBox :disagree-votes="statsData.disagree" :agree-votes="statsData.agree" />

    <NewTake @submitTake="handleSubmitTake" :debate-topic="debateTopic.topic"></NewTake>

    <CommentsBox
        :agreedComments="agreeTakes"
        :disagreedComments="disagreeTakes"
    ></CommentsBox>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  border: 1px solid yellow;
  width: 100%;
  height: 100vh;
}
</style>