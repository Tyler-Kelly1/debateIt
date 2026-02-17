<script setup lang="ts">

//Props of the comment comp
defineProps({
  id:{
    type: String,
    required: true
  },
  content:{
    type:String,
    required: true
  }
})

</script>

<template>
  <div class="comment">
    <h4>ID: {{id}}</h4>
    <p>{{content}}</p>
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

</style>