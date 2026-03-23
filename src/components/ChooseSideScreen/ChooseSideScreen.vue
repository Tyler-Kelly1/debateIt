<script setup lang="ts">

import {useRouter} from "vue-router";
import {TakeServices} from "../../../Services/takesService";
import {UserService} from "../../../Services/userService";
import {AuthService} from "../../../Services/authService";
import {onMounted, ref} from "vue";


const router = useRouter()
const topic = ref('Loading Topic...')
const user_id = ref(AuthService.getUserId())

onMounted(() => {

  TakeServices.getTopic().then(
      data => {
        topic.value = data.topic
      }
  )


})

function handleChoice(side:boolean) {


  UserService.updateSide({
    id: user_id,
    side: side
  })

  router.push("/SubmitTake")

}

</script>

<template>


  <div class="mainContainer">

    <h1>{{topic}}</h1>

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