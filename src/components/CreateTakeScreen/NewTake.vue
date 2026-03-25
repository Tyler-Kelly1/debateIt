<script setup lang="js">
import {onMounted, ref} from "vue";
import {TakeServices as TakeService, TakeServices} from "../../../Services/takesService";
import {AuthService} from "../../../Services/authService.ts";
import {useRouter} from "vue-router";
import {UserService} from "../../../Services/userService.ts";
import ErrorBox from "../GeneralComps/ErrorBox.vue"


// 2. LOCAL STATE (Internal Variables)
// 'take' stores what the user is currently typing in the textarea.
const take = ref('')
const debateTopic = ref(null)
const userID = ref('')
const userSide = ref(null)
const router = useRouter()
const loadingNextPage = ref(false)

const showError = ref(false);
const errorCode = ref("")


// load all important information
onMounted(async () => {

  try {

    //Get Users ID (this is fine, do not fix later)
    userID.value = await AuthService.getUserId()

    //Get the topic
    TakeService.getTopic().then(data=>{debateTopic.value=data.topic})

    //Get Users Side
    UserService.getUserSide(userID.value).then(data=>{userSide.value = data})

    UserService.doesUserHaveTakeAndSide(userID.value).then(data=>{console.log(data)})


    // check to make sure side hasn't been modified
    // Assume agree for now
    if (typeof(userSide.value) !== 'boolean'){
      userSide.value = true;
    }



  } catch (err) {

  }


})


// 4. SUBMISSION LOGIC
async function handleSubmitTake() {


  //first have to check if users has already submitted a take
  let userSubmittedTake = false;

  await UserService.doesUserHaveTakeAndSide(userID.value).then(data=>{
    userSubmittedTake = data.hasTake
  })

  if(userSubmittedTake){
    errorCode.value = "User has already submitted a take."
    showError.value = true
    return;
  }

  const newTake = take.value;

  const dBFormattedTake = {

    message: newTake,
    user_id: userID.value,
    topic: debateTopic.value,
    side: userSide.value

  }

  // Error handling if failed to insert new take
  try{

    await TakeServices.submitNewTake(dBFormattedTake)

    loadingNextPage.value = true


    setTimeout( async () => {
          await router.push("/home")
        }
        , 500)
  }
  catch(err){
    console.log(err)
  }

}


</script>

<template>

  <!-- Conditonal render if there was an error in logging in -->
  <div v-if="showError">
    <ErrorBox @close-error="()=>{showError= false}">{{errorCode}}</ErrorBox>
  </div>


  <div :class="{ 'opacity-0': loadingNextPage }" v-if="userSide !== null && debateTopic" class="bg-surface overflow-x-hidden min-h-screen flex items-center justify-center p-6 md:p-12 transition-opacity duration-600 ease-in-out">
  <main class="w-full max-w-4xl mx-auto flex flex-col justify-center min-h-[80vh]">
    <!-- Choice Indicator -->
    <div class="mb-8 flex items-center gap-3">
      <span :class="{'agreeColors' : userSide, 'disagreeColors' : !userSide}" class="text-[10px] uppercase tracking-[0.2em] font-black text-white px-3 py-1 glow-primary">
                    CURRENT STANCE
      </span>
      <div :class="{'agreeFlag' : userSide, 'disagreeFlag' : !userSide}" class="flex items-center gap-2 border-2 px-4 py-1 font-black uppercase text-sm">
        <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">
          <span v-if="userSide">
            check_circle
          </span>
          <span v-else>
            x_circle
          </span>
        </span>
        {{userSide}}
      </div>
    </div>
    <!-- Topic Section -->
    <section class="mb-12">
      <h1 class="text-4xl md:text-6xl font-black uppercase leading-[0.9] tracking-tighter mb-4">
        {{debateTopic}}
      </h1>
    </section>
    <!-- Input Area -->
    <section class="flex flex-col mb-12">
      <div class="relative group">
        <textarea v-model="take" :class="{'agreeTextInput' : userSide, 'disagreeTextInput' : !userSide}" class="w-full h-64 p-6 text-xl font-medium bg-surface-container-low border-2 border-black focus:ring-0 focus:outline-none resize-none kinetic-shadow transition-all  group-focus-within:shadow-none" placeholder="TYPE YOUR TAKE HERE..."></textarea>
      </div>
    </section>
    <!-- Submit Button & Footer -->
    <div class="w-full">
      <button @click="handleSubmitTake" :class="{'agreeColors' : userSide, 'disagreeColors' : !userSide}" class="w-full text-white font-black text-2xl py-6 border-2 border-black kinetic-shadow
      hover:scale-103 hover:shadow-none active:bg-primary-dim transition-all uppercase tracking-tighter">
        SUBMIT TAKE
      </button>
      <div class="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center px-2 gap-4">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-1">
            <span class="material-symbols-outlined text-xs">visibility</span>
            <span class="text-[10px] font-bold">PUBLIC</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="material-symbols-outlined text-xs">fingerprint</span>
            <span class="text-[10px] font-bold">ANONYMOUS</span>
          </div>
        </div>
        <div class="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          BY SUBMITTING YOU AGREE TO THE PROTOCOL
        </div>
      </div>
    </div>
  </main>
  </div>
</template>

<style scoped>

.agreeColors{
  background-color: #0021f3;
}

.disagreeColors{
  background-color: #c10007;
}

.agreeFlag{
  border-color: #0021f3;
  color: #0021f3;

}

.disagreeFlag{
  border-color: #c10007;
  color: #c10007;
}

.agreeTextInput{
  border-color: black;
}

.agreeTextInput:focus{
  border-color: #0021f3;
}

.disagreeTextInput{
  border-color: black;
}

.disagreeTextInput:focus{
  border-color: #c10007;
}




</style>