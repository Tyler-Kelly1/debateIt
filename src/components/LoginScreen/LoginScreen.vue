
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

      <div
          @click="handleGoogleLogin"
          type="button"
      >

        <div class="flex items-center justify-center">
          <button class="flex items-center bg-white border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            <svg class="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="-0.5 0 48 48" version="1.1"> <title>Google-color</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Color-" transform="translate(-401.000000, -860.000000)"> <g id="Google" transform="translate(401.000000, 860.000000)"> <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" id="Fill-1" fill="#FBBC05"> </path> <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" id="Fill-2" fill="#EB4335"> </path> <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" id="Fill-3" fill="#34A853"> </path> <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" id="Fill-4" fill="#4285F4"> </path> </g> </g> </g> </svg>
            <span>Continue with Google</span>
          </button>
        </div>

      </div>

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