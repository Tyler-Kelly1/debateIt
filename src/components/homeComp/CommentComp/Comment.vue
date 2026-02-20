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
  votes:{
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
  (e: 'updateFire', status: boolean): void
}>()

//2. Function to determine when fire lit
function lightFire(){

  if(!props.lit){
    emit("updateFire",true);
  }
  else{
    emit("updateFire",false);
  }

}


</script>

<template>
  <div class="comment">
    <h4>ID: {{id}}</h4>
    <p>{{content}}</p>
    <div
        class = "vote-box"
        :class= "{'is-lit': props.lit}"
         @click="lightFire"
    >{{votes}} ^</div>
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
  }

  .vote-box.is-lit {
    background: burlywood;
  }

</style>