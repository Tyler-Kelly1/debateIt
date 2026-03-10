<script setup>
// 1. IMPORTING REQUISITES
import CommentsBox from "./homeComp/CommentComp/CommentsBox.vue";
import NewTake from "./homeComp/NewTakeArea/NewTake.vue";
import StatBox from "./homeComp/StatsComp/StatBox.vue";
import AuthGate from "./AuthGate.vue"

// 'onMounted' is a Lifecycle Hook. It runs code as soon as the component appears on screen.
import {computed, onMounted, reactive, ref} from "vue";

// This is your connection to the outside world (the database)
import supabase from "../config/supabaseClient.js"
import ChooseSideScreen from "./ChooseSidePage/ChooseSideScreen.vue"
import newTake from "./homeComp/NewTakeArea/NewTake.vue"



// 2. DATA STATE (The "Local Memory")
// We use 'reactive' so that when the database returns data, the UI updates instantly.
const agreeTakes = reactive({});
const disagreeTakes = reactive({});

const userSide = ref(sessionStorage.getItem("side"));
const session = ref(null)
const userID = ref(null);

// Stores the numerical statistics (e.g., total vote counts)
const statsData = computed(() => {

  // If the takes arent loaded from the db yet
  if(agreeTakes.length === 0 || disagreeTakes.length === 0) {

    return {
      agree:0,
      disagree:0
    }

  }

  //else or otherwise
  return {
    agree: Object.keys(agreeTakes).length,
    disagree: Object.keys(disagreeTakes).length
  }

})

// Stores the main question/topic being debated
const debateTopic = reactive({
  "topic": "Loading..."
})

function handleSideChosen(){
  // 1. Get the value from storage (make sure you use the same one: session vs local)
  // 2. Update the reactive ref. This is the "Trigger" for v-if/v-else
  userSide.value = sessionStorage.getItem("side");


}

// 3. DATABASE LOGIC (The "Async" Function)
// 'async' tells Vue this function will take time to finish (waiting for the internet).
async function updateData() {

  // We "await" the response from Supabase.
  // We are selecting everything (*) from Debates and the related 'Takes' table.
  let {data, error} = await supabase
      .from('Debates')
      .select(`
        *,
        Takes (
          Agree,
          message,
          take_id
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
    const id = value.take_id

    // Logic: Sort the data into the correct "Bucket" based on the 'Agree' boolean
    if (value.Agree) {
      // Map database fields (message, likes) to our local object format (content, votes)
      agreeTakes[id] = { id: id, content: value.message }
    } else {
      disagreeTakes[id] = { id: id, content: value.message}
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
// Inside your <script setup> in Home.vue

onMounted(async () => {

  // 1. Check if a user is already logged in from a previous visit
  const {data} = await supabase.auth.getSession()
  session.value = data.session

  supabase.auth.onAuthStateChange((_event, _session) => {
    session.value = _session
    userID.value = session.value.user.id

    // If they log out, you might want to clear your 'userSide' ref too!
    if (!_session) userSide.value = null
  })

  // 1. Initial load of existing data
  await updateData();

  // 2. Set up the Realtime Listener
  const takesSubscription = supabase

      .channel('table-db-changes') // Name the channel whatever you like

      .on(
          'postgres_changes',
          {
            event: '*',    // listen for any change
            schema: 'public',
            table: 'Takes'      // The table to watch
          },
          (payload) => {
            // This 'payload' is the new row sent from the database!
            const newRow = payload.new;
            console.log('Change received from DB!', newRow);

            // Map the DB columns to your local reactive object format
            const formattedTake = {
              id: newRow.take_id,
              side: newRow.Agree,
              content: newRow.message,
            };

            // Inject into the correct "bucket" based on the 'Agree' boolean
            if (formattedTake.side) {
              agreeTakes[newRow.take_id] = formattedTake;
            } else {
              disagreeTakes[newRow.take_id] = formattedTake;
            }
          }
      )
      .subscribe();
});

// 4. SUBMISSION LOGIC
async function handleSubmitTake(newTake) {

  // Freaking love this line of code so elegant
  const usersSelectedSide = userSide.value === "true";

  console.log(newTake)
    const { data, error } = await supabase
      .from('Takes')
      .insert([
        { message: newTake.content, topic: debateTopic.topic, likes:0, dislikes:0, Agree: usersSelectedSide },
      ])
      .select()

}

async function handleCommentVoteUpdate(comment_id, command) {

  console.log(userID)
  const { data, error } = await supabase
      .from('Reactions')
      .insert([
        {user_id: userID.value, take_id: comment_id, type:"like"}
      ])
      .select()

  console.log(error)

}

</script>

<template>

  <div v-if = "session === null">
    <AuthGate></AuthGate>
  </div>
  <div v-else-if= "userSide !== null " class="home">
    <StatBox :disagree-votes="statsData.disagree" :agree-votes="statsData.agree" />

    <NewTake @submitTake="handleSubmitTake"
             :debateTopic="debateTopic.topic"
             :userSide="userSide"
    ></NewTake>

    <CommentsBox
        :agreedComments="agreeTakes"
        :disagreedComments="disagreeTakes"
        @updateTakeVote="handleCommentVoteUpdate"
    ></CommentsBox>
  </div>

  <div class="chooseSide" v-else>

    <ChooseSideScreen
        :debateTopic= "debateTopic.topic"
        @updateScreen = "handleSideChosen"
    ></ChooseSideScreen>

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

.chooseSide{
  display: flex;
  flex-direction: column;
  border: 1px solid yellow;
  width: 100%;
  height: 100vh;
}

</style>