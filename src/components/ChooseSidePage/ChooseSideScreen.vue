<script setup lang="ts">

const props = defineProps({

  debateTopic: {
    type: String,
    required: true,
  }

})

const emit = defineEmits(["updateScreen"])

function handleChoice(side:boolean) {
  sessionStorage["side"] = side;
  emit("updateScreen");
}

</script>

<template>


  <div class="mainContainer">

    <h1>{{props.debateTopic}}</h1>

    <div class="buttons">
      <button
          @click="handleChoice(true)"
      >
        Agree
      </button>

      <button
          @click="handleChoice(false)"
      >
        Disagree
      </button>
    </div>


  </div>


</template>

<style scoped>

.mainContainer{
  display:flex;
  flex-direction: column;
  background: #fff;
  width: 90vw;
  height: 100vh;
  margin: 0 auto;
  color: black;
}

h1 {
  margin-top: 20%;
  text-align: center;
}

.buttons{
  margin: 0 auto auto;
}
button{
  margin: 5px;
}

</style>