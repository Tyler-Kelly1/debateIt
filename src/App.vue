<script setup>

import HomeScreen from './components/HomeScreen.vue'
import LoginScreen from "./components/LoginComp/LoginScreen.vue";
import {AuthService} from '/Services/authService.ts'

import {ref} from "vue";


const loggedIn = ref(false);

//Check if logged in
AuthService.isLoggedIn().then(status => {loggedIn.value = status});
console.log(loggedIn.value);

</script>

<template>

  <div v-if="loggedIn">
    <HomeScreen/>

  </div>

  <div v-else>
    <LoginScreen/>
  </div>

</template>

<style scoped>

</style>
