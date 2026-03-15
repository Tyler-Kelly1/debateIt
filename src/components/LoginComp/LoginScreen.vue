<script setup lang="ts">
  import {ref} from "vue";
  import CreateUser from "./CreateUser.vue";

  const hasAccount = ref(true)

  function createUser(): void {
    hasAccount.value = false;
  }
</script>

<template>
  <div v-if="hasAccount === true" class="login">
    <div class="title">Join the Debate!!</div>

    <div class="credentials">
      <input placeholder="Username" style="width: 50%">
      <input placeholder="Email" style="width: 50%">
      <input placeholder="Password" style="width: 50%">
      <button>Login</button>
      <button @click="createUser">Create and Account</button>
    </div>
  </div>

  <div v-else class="create">
    <CreateUser></CreateUser>
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