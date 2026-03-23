<script setup>
// 1. IMPORTING REQUISITES
import TakesBox from "./CommentComp/TakesBox.vue";
import StatBox from "./StatsComp/StatBox.vue";
import CountDown from "./TimerComp/CountDown.vue"


// 'onMounted' is a Lifecycle Hook. It runs code as soon as the component appears on screen.
import {computed, onMounted, reactive, ref} from "vue";

//Services
import {AuthService} from "../../../Services/authService.ts";
import {TakeServices} from "../../../Services/takesService.ts";
import {ReactionService} from "../../../Services/reactionService.ts";


// 2. DATA STATE (The "Local Memory")
// We use 'reactive' so that when the database returns data, the UI updates instantly.
const agreeTakes = reactive({});
const disagreeTakes = reactive({});
const userID = ref("")

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

// 3. DATABASE LOGIC (The "Async" Function)
// 'async' tells Vue this function will take time to finish (waiting for the internet).
async function updateData() {

  // Load all takes, with reactions and the topic
  try {

   TakeServices.loadAllTakesAndTopic().then((takesAndTopic) => {

      // Update our local topic with the string from the database
      debateTopic.topic = takesAndTopic.topic

      // We loop through every take we found in the database
      Object.entries(takesAndTopic.takes).forEach(([key, newTake]) => {

        const likes = newTake.Reactions.filter((r) => r.type === 'Like').length
        const dislikes = newTake.Reactions.filter((r) => r.type === 'Dislike').length

        const formattedReactions = newTake.Reactions.reduce((acc, item) => {

          acc[item.user_id] = item.type;
          return acc;

        }, {})

        const formattedNewTake = {
              take_id: newTake.take_id,
              message: newTake.message,
              user_id: newTake.user_id,
              topic: newTake.topic,
              side: newTake.side,
              reactions: formattedReactions,
              likes: likes,
              dislikes: dislikes,
            }



            // Logic: Sort the data into the correct "Bucket" based on the 'Agree' boolean
            if (newTake.side) {
              agreeTakes[newTake.take_id] = formattedNewTake
            }

            else {
              disagreeTakes[newTake.take_id] = formattedNewTake

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

  //Login
  userID.value = await AuthService.getUserId();

  // 1. Initial load of existing data
  await updateData();

  const bucketTake = (newTake) => {

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

  const bucketReaction = (newReaction) => {

    const takeId = newReaction.take_id;
    const userId = newReaction.user_id;
    let newType = newReaction.type;

    // 1. Correctly locate the parent take from either bucket
    let parentTake = agreeTakes[takeId] || disagreeTakes[takeId];

    if (!parentTake) {
      console.warn("Reaction received for a take that isn't loaded yet.");
      return;
    }

    // 2. Check the existing state for THIS user on THIS take
    const existingType = parentTake.reactions[userId];

    // Check if the new reaction belongs to the current user


      if (existingType) {

        //Means remove the appropriate reaction
        if (newType === "None"){

          if(existingType === "Like"){
            parentTake.likes--;
          }
          else{
            parentTake.dislikes--;
          }

        }

        else if (newType === "Like" && existingType === "Dislike"){
          parentTake.likes++;
          parentTake.dislikes--;
        }

        else if(newType === "Dislike" && existingType ==="Like") {
          parentTake.dislikes++;
          parentTake.likes--;
        }

        else if(newType === "Like" && existingType === "None"){
          parentTake.likes++
        }

        else{
          parentTake.dislikes++;
        }


      } else {
        // SCENARIO: Brand New Reaction
        if (newType === "Like") {
          parentTake.likes++;
        } else {
          parentTake.dislikes++;
        }
      }



    // 3. Update the reaction map so the next trigger knows the "old" state
    parentTake.reactions[userId] = newType;

  };

  // 2. Set up the Realtime Listener for Takes
  TakeServices.subscribeToTakesUpdates(bucketTake)

  // 3. Set up the Realtime Listener for Reactions
  ReactionService.subscribeToReactionsUpdates(bucketReaction)

});


async function handleReaction(reaction) {

  //First unpack
  let reactionType = reaction.type;
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

    // check if the same as current, if so this means remove reaction
    let currentType = agreeTakes[take_id] || disagreeTakes[take_id];
    currentType = currentType.reactions[userID.value];

    if(reactionType === currentType){
      reactionType = "None"
    }

    await ReactionService.updateReaction({
      user_id: userID.value,
      take_id: take_id,
      type: reactionType
    })

  }
  else{

    await ReactionService.submitNewReaction({
      user_id: userID.value,
      take_id: take_id,
      type: reactionType
    })

  }

}

</script>

<template>

  <div class="w-full mt-2">
    <div class="flex flex-col">
      <span class="text-[10px] font-bold tracking-[0.3em]">Today's Question</span>
      <h2 class="text-3xl md:text-5xl font-black leading-[0.95] tracking-tighter uppercase pl-4 py-2">
        {{debateTopic.topic}}
      </h2>
    </div>
  </div>

  <CountDown></CountDown>

  <StatBox :disagree-votes="statsData.disagree" :agree-votes="statsData.agree" />

  <TakesBox
        :user_ID = userID
        :agreeTakes="agreeTakes"
        :disagreeTakes="disagreeTakes"
        @newReaction="handleReaction"
  ></TakesBox>


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