<script setup>

import {AuthService} from '/Services/authService.ts'
import {ref} from "vue";



const loggedIn = ref(false);

//Check if logged in

AuthService.isLoggedIn().then(status => {loggedIn.value = status});


</script>

<template>

  <div id = "nav">
    <router-link to="/"></router-link>
    <router-link to="/ChooseSide"></router-link>
    <router-link to="/SubmitTake"></router-link>
    <router-link to="/Login"></router-link>
  </div>

  <router-view/>



</template>

<style scoped>

</style>
