<script setup>
// 1. IMPORTING REQUISITES
import TakesBox from "./homeComp/CommentComp/TakesBox.vue";
import NewTake from "./homeComp/NewTakeArea/NewTake.vue";
import StatBox from "./homeComp/StatsComp/StatBox.vue";

// 'onMounted' is a Lifecycle Hook. It runs code as soon as the component appears on screen.
import {computed, onMounted, reactive, ref} from "vue";

// This is your connection to the outside world (the database)
import ChooseSideScreen from "./ChooseSidePage/ChooseSideScreen.vue"
import newTake from "./homeComp/NewTakeArea/NewTake.vue"

//Services
import {TakeServices} from "../../Services/takesService.ts";
import {ReactionService} from "../../Services/reactionService.ts";


// 2. DATA STATE (The "Local Memory")
// We use 'reactive' so that when the database returns data, the UI updates instantly.
const agreeTakes = reactive({});
const disagreeTakes = reactive({});

const userSide = ref(sessionStorage.getItem("side"));
const session = ref(null)
const userID = ref("14acdc55-e63d-441b-94a6-894930e1ff13")

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

  //Load all takes and the topic
  try {

   TakeServices.loadAllTakesAndTopic().then((takesAndTopic) => {

      // Update our local topic with the string from the database
      debateTopic.topic = takesAndTopic.topic

      // We loop through every take we found in the database
      Object.entries(takesAndTopic.takes).forEach(([key, newTake]) => {

            // Logic: Sort the data into the correct "Bucket" based on the 'Agree' boolean
            if (newTake.side) {

              // Map database fields (message, likes) to our local object format (content, votes)
              agreeTakes[newTake.take_id] = {
                take_id: newTake.take_id,
                message: newTake.message,
                user_id: newTake.user_id,
                topic: newTake.topic,
                side: newTake.side,
                reactions: {}
              }

            }

            else {
              disagreeTakes[newTake.take_id] = {

                take_id: newTake.take_id,
                message: newTake.message,
                user_id: newTake.user_id,
                topic: newTake.topic,
                side: newTake.side,
                reactions: {}

              }

            }

          }
      )
    })

  }

  catch(err) {
    console.log(err)
  }

}

/**
 * LIFECYCLE HOOK: onMounted
 * This is the trigger. As soon as the user opens the app,
 * we run 'updateData' to fetch the latest info from the database.
 */

onMounted(async () => {

  // 1. Initial load of existing data
  await updateData();

  const bucketTake = (newTake) => {
    console.log(newTake);

    //True Side is agree
    if(newTake.side){
      agreeTakes[newTake.take_id] = newTake

      // New take need to give it an empty set of reaction
      agreeTakes[newTake.take_id].reactions = {}
    }

    //False Side is disagree
    else{
      disagreeTakes[newTake.take_id] = newTake;
      disagreeTakes[newTake.take_id].reactions = {}
    }

  }

  // 2. Set up the Realtime Listener
  TakeServices.subscribeToTakesUpdates(bucketTake)


});

// 4. SUBMISSION LOGIC
async function handleSubmitTake(newTakeMessage) {

  // Freaking love this line of code so elegant
  const usersSelectedSide = userSide.value === "true";

  const dBFormattedTake = {

    message: newTakeMessage.message,
    user_id: userID.value,
    topic: debateTopic.topic,
    side: usersSelectedSide

  }

  // Error handling if failed to insert new take
  try{
    TakeServices.submitNewTake(dBFormattedTake)
  }
  catch(err){
    console.log(err)
  }

}

async function handleReaction(reaction) {

  //First unpack
  const reactionType = reaction.type;
  const takeSide = reaction.takeSide;
  const take_id = reaction.take_id;

  //Need to check if the reaction already exist

  let take;

  if(takeSide){
    take = agreeTakes[take_id];
  }
  else{
    take = disagreeTakes[take_id];
  }

  //if exist
  if(take.reactions[userID.value]) {

    await ReactionService.updateReaction({
      user_id: userID.value,
      take_id: take_id,
      type: reactionType
    }).then(
        take.reactions[userID.value] = reactionType
    )


  }
  else{

    await ReactionService.submitNewReaction({
      user_id: userID.value,
      take_id: take_id,
      type: reactionType
    }).then(
        take.reactions[userID.value] = reactionType
    )

  }










}

</script>

<template>

  <div v-if= "userSide !== null " class="home">
    <StatBox :disagree-votes="statsData.disagree" :agree-votes="statsData.agree" />

    <NewTake @submitTake="handleSubmitTake"
             :debateTopic="debateTopic.topic"
             :userSide="userSide"
    ></NewTake>

    <TakesBox
        :agreedComments="agreeTakes"
        :disagreedComments="disagreeTakes"
        @newReaction="handleReaction"
    ></TakesBox>
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