<script setup>
import CommentsBox from "./homeComp/CommentComp/CommentsBox.vue";
</script>

<template>

  <div class="home">
    <CommentsBox></CommentsBox>
  </div>


</template>

<style scoped>


.home{
  display: flex;
  border: 1px solid yellow;
  width: 100%;
  height: 100vh;
}

</style>