<script setup lang="ts">

import {ref, computed, watch} from 'vue'

//Props of the comment comp
const props = defineProps({
  id:{
    type: String,
    required: true
  },
  content:{
    type:String,
    required: true
  },
  likes:{
    type:Number,
    default:0,
    required:true
  },
  dislikes:{
    type:Number,
    default:0,
    required:true
  },
  lit:{
    type:Boolean,
    default:false,
    required:false
  }
})

// 1. Define the events this child can trigger
const emit = defineEmits<{
  (e: 'takeRating', command:string): void
}>()

const reactionStatus = ref(null)

//2. Function to determine when fire lit
function handleTakeRating(status: boolean): void{


  if(reactionStatus.value === true && status){
    reactionStatus.value = null;
    emit("takeRating", "remove_rating")
    return
  }

  if(reactionStatus.value === false && !status){
    reactionStatus.value = null;
    emit("takeRating", "remove_rating")
    return
  }

  if(status){
    emit("takeRating", "add_like")
  }
  else{
    emit("takeRating", "add_dislike")
  }
  
  reactionStatus.value = status

}

</script>

<template>
  <div class="comment">
    <h4>ID: {{id}}</h4>
    <p>{{content}}</p>
    <div
        class = "vote-box"
    >
      <div
          :class="reactionStatus === null ? 'like-box' : reactionStatus ? 'like-box-lit' : 'like-box' "
          @click="handleTakeRating(true)"
      >
        ^ {{props.likes}}
      </div>

      <div
          :class="reactionStatus === null ? 'dislike-box' : !reactionStatus ? 'dislike-box-lit' : 'dislike-box' "
          @click="handleTakeRating(false)"
      >
        v {{props.dislikes}}
      </div>

    </div>
  </div>
</template>

<style scoped>

.comment{
  display: block;
  border: 1px solid #ccc;
}

.comment h4{
  font-size: 0.5rem;
  margin-top: 0.1rem;
  margin-bottom: 0.1rem;
  border: #00d9ff solid 1px;
}

.comment p{
  margin-top: 0;
  margin-bottom: 0.2rem;
}

.vote-box {
  margin-left: auto;
  width: fit-content;
  padding: 4px 8px;
  cursor: pointer;
  transition: background 0.3s ease;
  background: #ff0000; /* Default (Unlit) */
  display: flex;
}

.like-box{
  background-color: green;
}

.dislike-box{
  background-color: darkred;
}

.like-box-lit{
  background-color: lightgreen;
}

.dislike-box-lit{
  background-color: lightcoral;
}


</style>