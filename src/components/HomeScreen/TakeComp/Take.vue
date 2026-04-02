<script setup lang="js">


//Props of the comment comp
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
    type: []
  }

})

const emit = defineEmits(["newReaction"])

//Reaction handler
function handleReaction(status){

  emit("newReaction", {type: status, takeSide: props.side})

}

</script>

<template>
  <div class="bg-white border-2 border-on-background p-4 flex flex-col gap-1.5">
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
    </div>

    <
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


.filled-icon-disagree{
  font-variation-settings: 'FILL' 1, 'wght' 200, 'GRAD' 0, 'opsz' 2;
  color: darkred;
  font-size: 0.8rem;
}



</style>