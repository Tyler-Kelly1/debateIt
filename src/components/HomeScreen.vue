<script setup>
import CommentsBox from "./homeComp/CommentComp/CommentsBox.vue";
import NewTake from "./homeComp/NewTake.vue";
</script>

<template>

  <div class="home">
    <NewTake></NewTake>
    <CommentsBox></CommentsBox>
  </div>


</template>

<style scoped>


.home{
  display: flex;
  flex-direction: column;
  border: 1px solid yellow;
  width: 100%;
  height: 100vh;
}

</style>