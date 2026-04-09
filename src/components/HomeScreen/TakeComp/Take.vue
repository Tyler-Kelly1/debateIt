<script setup lang="js">


//Props of the comment comp
import {computed, ref} from "vue";
import {TakeServices} from "../../../../Services/takesService.ts";
import { AllProfanity } from 'allprofanity';




const props = defineProps({

  take_id:{
    type: String,
    required: true
  },
  message:{
    type:String,
    required: true
  },
  user_id:{
    type:String,
    default:0,
    required:true
  },
  userReaction:{
    type: String,
    default: null,
    required: false
  },
  side:{
    type:Boolean,
    default:false
  },
  likes:{
    type:Number,
  },
  dislikes:{
    type:Number,
  },
  replies:{
    type: Array,
  }

})

const filter = new AllProfanity();

// Local mutable copies for optomistic UI
const usersReactionLocal = ref(props.userReaction)
const likesLocal = ref(props.likes)
const dislikesLocal = ref(props.dislikes)

const emit = defineEmits(["newReaction"])
const showReplies = ref(false)

const repliesLocal = ref()


const newReply = ref()

const replyCount = computed(() => {
  if(repliesLocal.value){
    return repliesLocal.value.length
  }
  return 0
})


if(props.replies && props.replies[0]){
  repliesLocal.value = props.replies;
}
else{
  repliesLocal.value = [];
}


//Reaction handler
function handleReaction(status){

  //Need some optamistic UI here

  //If like press
  if(status === "Like"){

    // If already pressed
    if(usersReactionLocal.value === "Like"){
      usersReactionLocal.value = ""
      likesLocal.value = likesLocal.value - 1;

    }
    else{

      //check for switched reaction

      if(usersReactionLocal.value === "Dislike"){
        dislikesLocal.value = dislikesLocal.value - 1;
      }


      usersReactionLocal.value = status;
      likesLocal.value = likesLocal.value + 1;
    }

  }

  //If Dislike press
  if(status === "Dislike"){

    // If already pressed
    if(usersReactionLocal.value === "Dislike"){
      usersReactionLocal.value = ""

      dislikesLocal.value = dislikesLocal.value - 1;

    }
    else{

      //check for switched reaction

      if(usersReactionLocal.value === "Like"){
        likesLocal.value = likesLocal.value - 1;
      }


      usersReactionLocal.value = status;
      dislikesLocal.value = dislikesLocal.value + 1;
    }

  }

  if(usersReactionLocal.value === "Dislike"){}

  emit("newReaction", {type: status, takeSide: props.side})

}

function handleNewReply(){

  //check for valid first
  if(!newReply.value){
    return
  }

  const sanitizedReply = filter.cleanWithPlaceholder(newReply.value, "[CENSORED]")


  const result = TakeServices.submitNewReply(
      sanitizedReply,
      props.user_id,
      props.take_id
  )

  //Optimistically UI add the reply immediately
  if(result){

    repliesLocal.value.push({take_id:props.take_id, message:sanitizedReply})
    newReply.value = ""

  }

}

</script>

<template>
  <div class="bg-white border-2 border-on-background p-4 mb-4 flex flex-col gap-1.5 text-[10px] font-medium leading-tight tracking-tight">
    <div class="flex justify-between items-center">
      <span class="text-[6px] font-bold tracking-widest text-on-surface-variant">
        Post:{{ take_id }}
      </span>
    </div>

    <p class="text-[13px] font-medium leading-tight tracking-tight">
      {{ message }}
    </p>

    <div class="flex gap-2 pt-2 border-t border-surface-container text-[0.8rem]">
      <button
          @click="handleReaction('Like')"
          :class="usersReactionLocal === 'Like' ? 'filled-icon-agree' : 'unfilled-icon'"
          class="flex items-center gap-0.5"
      >
        <span class="material-symbols-outlined">thumb_up</span>
        <span>{{ likesLocal }}</span>
      </button>

      <button
          @click="handleReaction('Dislike')"
          class="flex items-center gap-0.5 text-[0.2rem]"
          :class="usersReactionLocal === 'Dislike' ? 'filled-icon-disagree' : 'unfilled-icon'"
      >
        <span class="material-symbols-outlined">thumb_down</span>
        {{ dislikesLocal }}
      </button>

      <button
          @click="showReplies = !showReplies"
          class="flex items-center gap-0.5 text-[0.2rem]"
          :class="showReplies ? 'filled-icon-neutral' : 'unfilled-icon'"
      >
        <span class="material-symbols-outlined">message</span>
        {{ replyCount }}
      </button>
    </div>

    <Transition name="reply-panel">
      <div v-if="showReplies" class="replies-wrapper">
        <form class="border-1 mb-3 mt-2" @submit.prevent="handleNewReply">
          <div>
            <textarea
                v-model="newReply"
                class="m-2 p-0.5 resize-none h-fit w-fit border-b-1 text-[12px]"
                maxlength="200"
                placeholder="Enter your opinion here..."
            />
          </div>

          <button
              type="submit"
              class="flex items-center gap-0.5 text-[0.2rem]"
              :class="showReplies ? 'filled-icon-neutral' : 'unfilled-icon'"
          >
            <span class="material-symbols-outlined">send</span>
          </button>
        </form>

        <TransitionGroup name="reply-card" tag="div" class="flex flex-col gap-2">
          <div
              v-for="(reply, index) in repliesLocal"
              :key="reply.user_id + '-' + index"
              class="reply-card bg-white border-1 p-2 flex text-balance break-words flex-col"
              :style="{ transitionDelay: `${index * 70}ms` }"
          >
            <span class="text-[10px] border-b-1 mb-2 border-black">
              {{ user_id }}
            </span>

            <p class="text-[10px] font-medium leading-tight tracking-tight gap-0.5">
              {{ reply.message }}
            </p>
          </div>
        </TransitionGroup>
      </div>
    </Transition>
  </div>
</template>

<style scoped>

.unfilled-icon {
  font-variation-settings: 'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 2;
  font-size: 0.8rem;
}

.filled-icon-agree{
  font-variation-settings: 'FILL' 1, 'wght' 200, 'GRAD' 0, 'opsz' 2;
  color: darkgreen;
  font-size: 0.8rem;
}

.filled-icon-neutral{
  font-variation-settings: 'FILL' 1, 'wght' 200, 'GRAD' 0, 'opsz' 2;
  color: grey;
  font-size: 0.8rem;
}

.filled-icon-disagree{
  font-variation-settings: 'FILL' 1, 'wght' 200, 'GRAD' 0, 'opsz' 2;
  color: darkred;
  font-size: 0.8rem;
}

.replies-wrapper {
  overflow: hidden;
}

/* whole reply section opens and closes */
.reply-panel-enter-active,
.reply-panel-leave-active {
  transition: max-height 0.4s ease, opacity 0.3s ease;
}

.reply-panel-enter-from,
.reply-panel-leave-to {
  max-height: 0;
  opacity: 0;
}

.reply-panel-enter-to,
.reply-panel-leave-from {
  max-height: 600px;
  opacity: 1;
}

/* each reply card slides like stacked cards */
.reply-card-enter-active,
.reply-card-leave-active {
  transition: transform 0.35s ease, opacity 0.35s ease;
}

.reply-card-enter-from {
  opacity: 0;
  transform: translateY(-18px);
}

.reply-card-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.reply-card-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.reply-card-leave-to {
  opacity: 0;
  transform: translateY(-18px);
}

</style>