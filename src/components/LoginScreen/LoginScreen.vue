<script setup lang="js">
import {onMounted, ref} from "vue";
  import {AuthService} from "../../../Services/authService";
  import CreateUser from "../SignUpPage/CreateUser.vue";
  import {useRouter} from "vue-router";
  import ErrorBox from "../GeneralComps/ErrorBox.vue"

  const hasAccount = ref(true)
  const showError = ref(false);
  const errorCode = ref("")
  const email = ref("")
  const password = ref("")
  const router = useRouter()

  function createUser() {
    hasAccount.value = false;
  }

  async function handleLogin(){

    // Attempt to log in
    try{

      // Case 1: Email is empty
      if (!email.value) {
        errorCode.value = "Identity Required: Please enter an email.";
        throw Error()
      }

      // Case 2: Email format is wrong (Simple Regex)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value)) {
        errorCode.value = "Invalid Format: Check your email syntax.";
        throw Error()

      }

      // Case 3: Password is empty
      if (!password.value) {
        errorCode.value = "Access Denied: Password field is empty.";
        throw Error()

      }

      // Case 4: Password too short
      if (password.value.length < 6) {
        errorCode.value = "Security Breach: Password must be at least 6 characters.";
        throw Error()

      }

      await AuthService.login(email.value, password.value)

      await router.replace("/ChooseSide")


    }
    catch(error){
      errorCode.value = "Access Denied: Invalid Username or password";
      showError.value = true;
    }


  }

</script>

<template>


  <div class="bg-background text-on-background flex flex-col min-h-screen items-center justify-center p-6 selection:bg-primary selection:text-white">

    <!-- Conditonal render if there was an error in logging in -->
    <div v-if="showError">
      <ErrorBox @close-error="()=>{showError= false}">{{errorCode}}</ErrorBox>
    </div>

    <!-- Brand Anchor: DEBATE IT -->
  <header class="mb-12 text-center">
    <h1 class="text-7xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] mb-4">
      DEBATE<br/>IT.
    </h1>
    <div class="inline-block bg-black text-white px-3 py-1 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
      AUTHENTICATION REQUIRED // HUMAN ONLY ACCESS
    </div>
  </header>
  <!-- Main Authentication Block -->
    <div class="bg-white border-[2px] border-black p-8 md:p-12 shadow-brutal">

        <!-- ID Input Group -->

      <form @submit.prevent="handleLogin">
        <div class="space-y-2">
          <label class="block text-[10px] font-black tracking-[0.15em] text-black uppercase" >
            Email
          </label>
          <input v-model = "email" class="w-full border-2 border-black bg-white px-4 py-4 font-bold text-lg placeholder:text-zinc-300 focus:ring-0 rounded-none appearance-none" placeholder="JohnDoe@email.com" type="text"/>
        </div>
        <!-- Access Code Input Group -->
        <div class="space-y-2 pt-5 pb-6">
          <label class="block text-[10px] font-black tracking-[0.15em] text-black uppercase" >
            Password
          </label>
          <input v-model = "password" class="w-full border-2 border-black bg-white px-4 py-4 font-bold text-lg placeholder:text-zinc-300 focus:ring-0 rounded-none appearance-none" placeholder="********" type="password"/>
        </div>
        <!-- Primary Action -->
        <button class="w-full bg-[#0021f3] text-white tracking-[0.15em] font-black text-xl py-2 border-2 uppercase border-black  active:bg-primary-dark" type="submit">
          login
        </button>

      </form>

      <button @click="()=>{router.replace('/newUser')}" class="w-full bg-[#0021f3] text-white tracking-[0.1em] font-black text-xl py-2 border-2 mt-3 uppercase border-black  active:bg-primary-dark">
        Create an Account
      </button>

    </div>


  </div>

</template>

<style scoped>

.title
{
  text-align: center;
  font-size: 5rem;
}
.credentials
{
  display: flex;
  flex-direction: column;
  gap: 20px;
  border: solid;
  border-color: red;
}
.login
{
  display: flex;
  flex-direction: column;
  border: 1px solid yellow;
  width: 100%;
  height: 100vh;
  background: #10c84f;
  color: white;

}
.create
{
  display: flex;
  flex-direction: column;
  border: 1px solid yellow;
  width: 100%;
  height: 100vh;
}
</style>