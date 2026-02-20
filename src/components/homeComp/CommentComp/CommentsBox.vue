<script setup lang="ts">

import {onMounted, ref, Ref, computed} from "vue";
import Comment from "./Comment.vue"

interface CommentData{
  id: string;
  content: string;
  votes: number;
  lit?: boolean;
}

//Testing Data API function will go here in the future
const agreeComments:Ref<any> = ref<CommentData[]>([
    {id:"1", content:"hello world this is a very long comment full of nonsense", votes:2, lit:false},
    {id:"2", content:"hello world", votes:0, lit:false},
    {id:"3", content:"hello world", votes:8, lit:false}
]);

const disagreeComments:Ref<any> = ref<CommentData[]>([
  {id:"1", content:"hello world this is a very long comment full of nonsense", votes:2, lit:false},
  {id:"2", content:"hello world", votes:0, lit:false},
  {id:"3", content:"hello world", votes:8, lit:false},
  {id:"4", content:"hello world tester", votes:8, lit:false}
]);

// 2. Use Computed properties to handle the "Greatest to Least" sorting
// This automatically updates whenever a 'votes' value changes

const sortedAgree = computed(() => {
  //Specifices what to sort by
  //ie the sorting function
  return agreeComments.value.sort((a,b)=> b.votes - a.votes);
});

const sortedDisagree = computed(() => {
  return disagreeComments.value.sort((a,b)=> b.votes - a.votes);
});


// 3. Handling the vote update (handleFire)
function handleVote(id: string, isAgree: boolean) {

  //If the agree flag is true select the agreeing comments
  const selectedComments = isAgree ? agreeComments.value : disagreeComments.value;

  const comment = selectedComments.find(c => c.id === id);

  if (!comment.lit) {
    comment.votes += 1;
    comment.lit = true;
    // Vue detects the change, Computed re-sorts, UI updates instantly.
  }else{
    comment.votes -= 1;
    comment.lit = false;
  }
}

//Load data on page reload only
onMounted(() => {
  console.log(agreeComments)
})

</script>

<template>
  <div class="container">
    <div class="agreeCol">
      <div v-for="comment in sortedAgree">
        <Comment
            :key="comment.id"
            :id="comment.id"
            :content="comment.content"
            :votes="comment.votes"
            :lit="comment.lit"
            v-on:updateFire="handleVote(comment.id,true)"
        >
        </Comment>
      </div>
    </div>

    <div class="disagreeCol">
      <div v-for="comment in sortedDisagree">
        <Comment
            :key="comment.id"
            :id="comment.id"
            :content="comment.content"
            :votes="comment.votes"
            :lit="comment.lit"
            v-on:updateFire="handleVote(comment.id,false)"
        >
        </Comment>
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