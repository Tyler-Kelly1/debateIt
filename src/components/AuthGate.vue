<script setup lang="ts">
import { ref } from 'vue'
import supabase from "../config/supabaseClient.js"

const email = ref('')
const password = ref('')
const isLoggingIn = ref(true) // Toggles between Login and Sign-up
const errorMessage = ref('')
const userName = ref('')

const handleAuth = async () => {
  errorMessage.value = ''

  if (isLoggingIn.value) {
    // 1. LOGIN LOGIC
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })
    if (error) errorMessage.value = error.message
  } else {
    // 2. SIGN-UP LOGIC
    const { error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    })
    if (error) errorMessage.value = "Check your email for a confirmation link!"

    //Also need to update the public users table

  }
}
</script>

<template>
  <div class="auth-container">
    <h2>{{ isLoggingIn ? 'Welcome Back' : 'Join the Debate' }}</h2>

    <form @submit.prevent="handleAuth">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />

      <button type="submit">
        {{ isLoggingIn ? 'Login' : 'Create Account' }}
      </button>
    </form>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <button @click="isLoggingIn = !isLoggingIn" class="toggle-btn">
      {{ isLoggingIn ? 'Need an account? Sign Up' : 'Already have an account? Login' }}
    </button>
  </div>
</template>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  text-align: center;
}
input { display: block; width: 100%; margin: 10px 0; padding: 8px; }
.error { color: red; font-size: 0.8rem; }
.toggle-btn { background: none; border: none; color: blue; cursor: pointer; text-decoration: underline; }
</style>