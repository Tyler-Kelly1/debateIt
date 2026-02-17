<script setup lang="ts">

import {onMounted, ref} from "vue";
import Comment from "./Comment.vue"

interface commentData{
  id: string;
  content: string;
}

//Testing Data API function will go here in the future
const testAgreeComments = [{id:"1", content:"hello world this is a very long comment full of nonsense"},{id:"2", content:"hello world"},{id:"3", content:"hello world"}];
const agreeComments = ref(new Map())

const testDisagreeComments = [{id:"1", content:"hello world this is a very long comment full of nonsense"},{id:"2", content:"I HATE THIS!"},{id:"3", content:"hello world"}];
const disagreeComments = ref(new Map())

function loadComments(commentData, commentRef): void {
  commentData.forEach(comment => {
    commentRef.value.set(comment.id, comment.content)
  })
}


//Load data on page reload only
onMounted(() => {
  loadComments(testAgreeComments,agreeComments)
  loadComments(testDisagreeComments,disagreeComments)

  console.log(agreeComments)
})

</script>

<template>
  <div class="container">
    <div class="agreeCol">
      <div v-for="comment in agreeComments">
        <Comment :id="comment[0]" :content="comment[1]"></Comment>
      </div>
    </div>

    <div class="disagreeCol">
      <div v-for="comment in disagreeComments">
        <Comment :id="comment[0]" :content="comment[1]"></Comment>
      </div>
    </div>

  </div>
</template>

<style scoped>

  .container{
    display: flex;
    border:2px solid #00d9ff;
    width:95%;
    height:fit-content;
    margin:auto;
    padding:3px;
  }

  .agreeCol{
    border:2px solid #00ff19;
    height:fit-content;
    width:100%;
  }

  .disagreeCol{
    border:2px solid #ff0000;
    width:100%;
  }

</style>