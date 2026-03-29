<script setup lang="js">


import {useRouter} from "vue-router";
import {ref} from "vue";
import {AuthService} from "../../../Services/authService.ts";
import ErrorBox from "../GeneralComps/ErrorBox.vue"
import {UserService} from "../../../Services/userService.ts";

const router = useRouter()

const email = ref("")
const password = ref("")
const password_confirmation = ref("")
const showErrorBox = ref(false)
const errorMessage = ref("") // Added to show feedback to the user


async function handleSubmit() {
  // 1. Reset error message
  errorMessage.value = ""

  // 2. Client-side Validation (The "Security Checkpoint")
  if (!email.value || !password.value) {
    showErrorBox.value = true
    errorMessage.value = "ERROR: Credentials Required"
    return
  }

  if (password.value !== password_confirmation.value) {
    showErrorBox.value = true
    errorMessage.value = "ERROR: Passwords Do Not Match"
    return
  }

  if (password.value.length < 8) {
    showErrorBox.value = true
    errorMessage.value = "ERROR: Password too short (Min 8 chars)"
    return
  }

  // 3. Service Layer Call (The "Relay Race")
  try {
    const success = await AuthService.registerAccount(email.value, password.value)

    //Then login to get browser token
    await AuthService.login(email.value, password.value)

    if (success) {
      // Direct the user to check their email or go to login
      await router.replace('/ChooseSide')
    }
  } catch (error) {
    // This catches the error we "threw" in the service layer
    showErrorBox.value = true
    errorMessage.value = error.message.toUpperCase()
  }

}





</script>

<template>

  <div v-if="showErrorBox">
    <ErrorBox @close-error="()=>{showErrorBox = false}">{{errorMessage}}</ErrorBox>
  </div>

  <div class="bg-surface text-on-surface font-body selection:bg-primary ">

    <div class="text-5xl font-black text-black text-center mt-10">
      DEBATE IT.
    </div>

  <div class="min-h-[calc(100vh-84px)] flex flex-col items-center justify-center p-6 bg-surface-container-low">
    <!-- Registration Core Container -->
    <div class="w-full max-w-xl bg-white border-2 shadow-brutal border-black p-5 md:p-12 relative overflow-hidden">

      <!-- Header Section -->
      <div class="mb-6">
        <div class="flex items-center gap-2 mb-2">
          <div class="h-4 w-4 bg-primary"></div>
          <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">PROTOCOL // INITIALIZATION</span>
        </div>
        <h1 class="text-2xl md:text-6xl font-black font-headline uppercase tracking-tighter leading-[0.9] mb-4">
          Create Account
        </h1>
        <p class="text-xs font-bold uppercase tracking-widest text-on-surface-variant border-l-4 border-primary pl-4">
          welcome to the the debate
        </p>
      </div>

      <!-- Registration Form -->
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <!-- Input Group 1 -->
        <div class="space-y-2">
          <label class="block text-[10px] font-bold uppercase tracking-[0.15em] text-black">
            Email
          </label>
          <div class="relative">
            <input v-model="email" class="w-full px-4 py-4 border-2 border-black bg-white focus:outline-none focus:border-primary font-bold tracking-widest placeholder:text-zinc-300 transition-all text-l" placeholder="JohnDoe@email.com" type="text"/>
            <div class="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
              <span class="material-symbols-outlined" data-icon="fingerprint">fingerprint</span>
            </div>
          </div>
        </div>
        <!-- Input Group 2 -->
        <div class="space-y-2">
          <label class="block text-[10px] font-bold uppercase tracking-[0.15em] text-black">
            Password
          </label>
          <div class="relative">
            <input v-model="password" class="w-full px-4 py-4 border-2 border-black bg-white focus:outline-none focus:border-primary font-bold tracking-widest placeholder:text-zinc-300 transition-all text-l" placeholder="********" type="password"/>
            <div class="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
              <span class="material-symbols-outlined" data-icon="lock">lock</span>
            </div>
          </div>
        </div>
        <!-- Input Group 3 -->
        <div class="space-y-2">
          <label class="block text-[10px] font-bold uppercase tracking-[0.15em] text-black">
            Confirm Password
          </label>
          <div class="relative">
            <input v-model="password_confirmation" class="w-full px-4 py-4 border-2 border-black bg-white focus:outline-none focus:ring-0 focus:border-primary font-bold tracking-widest placeholder:text-zinc-300 transition-all text-l" placeholder="********" type="password"/>
          </div>
        </div>

        <!-- Primary Action -->
        <button class="relative w-full py-6 bg-primary text-white border-2 border-black active:bg-primary-dark flex items-center justify-center gap-4" type="submit" >
          <span class="text-xl font-black uppercase tracking-widest">create account</span>
          <span class="material-symbols-outlined">arrow_forward</span>
        </button>

      </form>
      <!-- Secondary Footer Action -->
      <div class="mt-12 pt-8 border-t-2 border-black border-dashed flex flex-col md:flex-row items-center justify-between gap-4">

        <a @click="() => {router.push('/login')}" class="text-[10px] font-bold uppercase tracking-[0.15em] text-black hover:text-primary transition-colors flex items-center gap-2">
          <span class="material-symbols-outlined text-sm" data-icon="login">login</span>
          ALREADY_INITIALIZED?<br/> login
        </a>

      </div>
    </div>

  </div>
  </div>



</template>

<style scoped>
.title
{
  text-align: center;
  font-size: 5rem;
}
</style>