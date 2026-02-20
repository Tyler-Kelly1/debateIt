<script setup lang="ts">

import {ref} from "vue";

const take = ref()

function handleChange(){
  take.value=
}

</script>

<template>

  <div class="main">

    What is your take?

    <div class="inputWrapper">
      <textarea
          maxlength="200"

      ></textarea>

    </div>
      {{take}}
  </div>
</template>

<style scoped>

.main{
  background: red;
  width: 50%;
  height: fit-content;
  margin: auto;
}

.inputWrapper{
  margin: auto;
  width: 90%;
  background: yellow;
  align-content: center;
}

.main textarea{
  resize: none;
  width: 90%;
  border: none;
}



</style>