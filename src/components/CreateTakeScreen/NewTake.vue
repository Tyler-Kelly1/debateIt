<script setup lang="js">
import {onMounted, ref} from "vue";
import {TakeServices as TakeService, TakeServices} from "../../../Services/takesService";
import {AuthService} from "../../../Services/authService.ts";
import {useRouter} from "vue-router";


// 2. LOCAL STATE (Internal Variables)
// 'take' stores what the user is currently typing in the textarea.
const take = ref('')
const debateTopic = ref('Loading Topic...')
const userID = ref('')
const userSide = ref(null)
const router = useRouter()

// load all important information
onMounted(async () => {

  try {

    //Get Users ID (this is fine, do not fix later)
    userID.value = await AuthService.getUserId()

    //Get the topic
    TakeService.getTopic().then(data=>{debateTopic.value=data.topic})

    //Get Users Side for now (FIX LATER)
    userSide.value = sessionStorage.getItem("side");

    // check to make sure side hasn't been modified
    // Assume agree for now
    if (typeof(userID.value) !== 'boolean'){
      userSide.value = true;
    }



  } catch (err) {

  }


})


// 4. SUBMISSION LOGIC
async function handleSubmitTake(newTake) {

  // Freaking love this line of code so elegant
  const usersSelectedSide = userSide.value === "true";

  const dBFormattedTake = {

    message: newTake,
    user_id: userID.value,
    topic: debateTopic.value,
    side: usersSelectedSide

  }

  // Error handling if failed to insert new take
  try{
    await TakeServices.submitNewTake(dBFormattedTake)
    await router.push("/")
  }
  catch(err){
    console.log(err)
  }

}


// 4. SUBMISSION LOGIC
function handleTakeSubmit() {
  // Only submit if the user has actually typed something
  if (take.value) {

    // 'emit' sends data up the chain.
    // Argument 1: The name of the event ('submitTake')
    // Argument 2: The actual data object (The "Take")
    // Argument 3: The side chosen (The boolean from our toggle)
    handleSubmitTake(take.value)

    // RESET: Clear the text area after submitting so the user can type a new one
    take.value = ''
  }
}
</script>

<template>
  <div class="main">
    <h3>{{debateTopic}}</h3>

    <div class="inputWrapper">
      <textarea
          maxlength="200"
          v-model="take"
          placeholder="Type your opinion here..."
      ></textarea>
    </div>

    <div class="submitButtonContainer">
      <button @click="handleTakeSubmit">
        Submit
      </button>
    </div>

  </div>
</template>

<style scoped>
/* Layout styles for the input area */
.main {
  display: flex;
  flex-direction: column;
  background: red; /* Bright colors used for structural debugging */
  width: 80%;
  height: 80%;
  margin: auto;
}

.inputWrapper {
  margin: auto auto 0;
  width: 90%;
  background: yellow;
  align-content: center;
  height: fit-content;
}

.main textarea {
  resize: none; /* Prevents the user from dragging the box to change its size */
  width: 90%;
  border: none;
  padding: 10px;
}

.submitButtonContainer {
  display: flex;
  background-color: white;
  width: 90%;
  min-height: 30%;
  margin: auto;
}

</style>