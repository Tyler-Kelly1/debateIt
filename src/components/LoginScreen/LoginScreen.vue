
<script setup lang="js" >

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


  // Add to your handleLogin area
  async function handleGoogleLogin() {
    try {
      await AuthService.signInWithGoogle();
    } catch (error) {
      errorCode.value = "Google Auth Failed: Identity could not be verified.";
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
      AUTHENTICATION REQUIRED // CRITICAL THINK
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
        <button class="w-full bg-[#08cc4b] text-white tracking-[0.15em] font-black text-xl py-2 border-2 uppercase border-black  active:bg-primary-dark" type="submit">
          login
        </button>

      </form>

      <button @click="()=>{router.replace('/newUser')}" class="w-full bg-[#08cc4b] text-white tracking-[0.1em] font-black text-xl py-2 border-2 mt-3 uppercase border-black  active:bg-primary-dark">
        Create an Account
      </button>

    </div>

    <div class="mt-8 space-y-6">
      <div class="relative flex items-center">
        <div class="flex-grow border-t-2 border-black"></div>
        <span class="flex-shrink mx-4 text-[10px] font-black tracking-[0.2em] uppercase text-black">
      OR // EXTERNAL_PROVIDER
    </span>
        <div class="flex-grow border-t-2 border-black"></div>
      </div>

      <button
          @click="handleGoogleLogin"
          type="button"
          class="group relative w-full flex items-center justify-center gap-4 bg-white border-4 border-black p-4 transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal active:translate-x-0 active:translate-y-0 active:shadow-none"
      >

        Continue With Google
        <svg class="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>

        <span class="text-xl font-black uppercase tracking-widest">
    </span>

      </button>

      <p class="text-center text-[9px] font-bold uppercase tracking-widest opacity-50">
        Encrypted Handshake via Google Identity Services
      </p>
    </div>




  </div>

</template>

<style scoped>
.loginPage {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #efefef;
  padding: 30px;
}

.loginCard {
  width: 100%;
  max-width: 700px;
  background: #ffffff;
  border-radius: 22px;
  padding: 50px 48px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.loginCard h1 {
  margin: 0;
  font-size: 4rem;
  color: #08cc4b;
  font-weight: 800;
}

.subtext {
  margin-top: 8px;
  margin-bottom: 40px;
  font-size: 1.35rem;
  color: #355071;
}

.formGroup {
  text-align: left;
  margin-bottom: 24px;
}

.formGroup label {
  display: block;
  margin-bottom: 10px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #08cc4b;
}

.formGroup input {
  width: 100%;
  height: 76px;
  border: 1px solid #cfd5de;
  border-radius: 16px;
  background: #f3f4f6;
  padding: 0 22px;
  font-size: 1.1rem;
  outline: none;
}

.loginBtn {
  width: 100%;
  margin-top: 8px;
  height: 72px;
  border: none;
  border-radius: 16px;
  background: #08cc4b;
  color: white;
  font-size: 1.8rem;
  font-weight: 700;
  cursor: pointer;
}

.signupText {
  margin-top: 34px;
  font-size: 1.1rem;
  color: #355071;
}

.signupText span {
  color: #08b542;
  font-weight: 700;
  cursor: pointer;
}

.create {
  min-height: 100vh;
}
</style>