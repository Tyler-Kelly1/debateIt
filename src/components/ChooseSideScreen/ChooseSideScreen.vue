<script setup lang="js">

import {useRouter} from "vue-router";
import {TakeServices} from "../../../Services/takesService";
import {UserService} from "../../../Services/userService";
import {AuthService} from "../../../Services/authService";
import {onMounted, ref} from "vue";
import CardSwipe from "./CardSwipe.vue";


const router = useRouter()
const topic = ref('Loading Topic...')
const loadingNextPage = ref(false)
const user_id = ref("")
const demo = ref(false)

onMounted(async () => {

  await new Promise(resolve => setTimeout(resolve, 100));

  //Checking if user is even logged in
  try{

    await AuthService.getUserId().then(user => {
      user_id.value = user
    })

  }
  catch(err){

      //if not, be prepared to send them to login after swipe
      // still have to give them the illusion of choice
      demo.value = true


  }


  TakeServices.getTopic().then(
      data => {
        topic.value = data.topic
      }
  )


})

async function handleChoice(side) {
  loadingNextPage.value = true;



  // If user is logged in aka, this is for real.
  if(!demo.value){

    try {
      // 1. Actually WAIT for the database to finish
      // This ensures the Navigation Guard sees 'hasSide = true'
      await UserService.updateSide(user_id.value, side);

      const navigationResult = await router.push({ name: 'SubmitTake' });

      console.log(navigationResult)

    } catch (error) {
      loadingNextPage.value = false;

      await router.replace("/ChooseSide");
    }

  }
  else{

    setTimeout(() => {
      router.replace("/login");
    }, 300);

  }

}

</script>

<template>

  <div :class="{ 'opacity-0': loadingNextPage }" class="bg-brutalist-white text-brutalist-black min-h-screen flex flex-col items-center font-sans transition-opacity duration-500 ease-in-out">

    <section class="w-full text-center md:mt-40 mt-20 mb-10 [@media(max-height:680px)]:mb-3 [@media(max-height:680px)]:mt-5">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-5xl md:text-6xl font-black uppercase leading-[0.9] tracking-tighter mb-4">
          {{topic}}
        </h1>
      </div>
    </section>

    <div class="">
      <CardSwipe @onSwipe="handleChoice"></CardSwipe>
    </div>

  </div>

</template>

<style scoped>


</style>