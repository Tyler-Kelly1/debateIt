<script setup lang="js">


//Props of the comment comp
import {computed, ref} from "vue";
import {TakeServices} from "../../../../Services/takesService.ts";

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


if(props.replies[0]){
  repliesLocal.value = props.replies;
}
else{
  repliesLocal.value = [];
}


//Reaction handler
function handleReaction(status){

  emit("newReaction", {type: status, takeSide: props.side})

}

function handleNewReply(){

  //check for valid first
  if(!newReply.value){
    return
  }


  const result = TakeServices.submitNewReply(
      newReply.value,
      props.user_id,
      props.take_id
  )

  //Optimistically UI add the reply immediately
  if(result){

    repliesLocal.value.push({take_id:props.take_id, message:newReply.value})
    newReply.value = ""

  }



}

</script>

<template>
  <div class="bg-white border-2 border-on-background p-4 flex flex-col gap-1.5 text-[10px] font-medium leading-tight tracking-tight">

    <div class="flex justify-between items-center">
      <span class="text-[6px] font-bold tracking-widest text-on-surface-variant">Post:{{take_id}}</span>
    </div>

    <p class="text-[13px] font-medium leading-tight tracking-tight">
      {{message}}
    </p>

    <div class="flex gap-2 pt-2 border-t border-surface-container text-[0.8rem]">

      <button @click="handleReaction('Like')"
              :class="userReaction === 'Like' ? 'filled-icon-agree' : 'unfilled-icon'"
              class="flex items-center gap-0.5">
        <span  class="material-symbols-outlined">thumb_up</span> <span>{{likes}}</span>
      </button>

      <button @click="handleReaction('Dislike')"
              class="flex items-center gap-0.5 text-[0.2rem]"
              :class="userReaction === 'Dislike' ? 'filled-icon-disagree' : 'unfilled-icon'"
      >
        <span class="material-symbols-outlined">thumb_down</span> {{dislikes}}
      </button>

      <button @click="()=>{showReplies = !showReplies}"
              class="flex items-center gap-0.5 text-[0.2rem]"
              :class="showReplies ? 'filled-icon-neutral' : 'unfilled-icon'"
      >
        <span class="material-symbols-outlined">message</span> {{replyCount}}
      </button>


    </div>


    <div v-if="showReplies">

      <form class="border-1 mb-3 mt-2" @submit.prevent="handleNewReply">

        <div>
          <textarea v-model="newReply" class=" m-2 p-0.5 w-80 border-b-1 text-[12px]" maxlength="200" placeholder="Enter your opinion here..."/>
        </div>

        <button type="submit"
                class="flex items-center gap-0.5 text-[0.2rem]"
                :class="showReplies ? 'filled-icon-neutral' : 'unfilled-icon'"
        >

          <span class="material-symbols-outlined">send</span>

        </button>


      </form>

      <div v-for="reply in repliesLocal" :key="reply.user_id">

        <div class="bg-white border-1 p-2 flex text-balance break-words flex-col">

          <span class="text-[10px] border-b-1 mb-2 border-black">{{user_id}}</span>

          <p class="text-[10px] font-medium leading-tight tracking-tight gap-0.5 ">
            {{reply.message}}
          </p>

        </div>

      </div>


    </div>



  </div>
</template>

<style scoped>

.unfilled-icon {
  font-variation-settings: 'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 2;
  font-size: 0.8rem;
}

.filled-icon-agree{
  font-variation-settings: 'FILL' 1, 'wght' 200, 'GRAD' 0, 'opsz' 2;
  color: darkblue;
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




</style>