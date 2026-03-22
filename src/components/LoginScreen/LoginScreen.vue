<script setup lang="js">
import {onMounted, ref} from "vue";
  import {AuthService} from "../../../Services/authService";
  import CreateUser from "../SignUpPage/CreateUser.vue";
  import {useRouter} from "vue-router";

  const hasAccount = ref(true)
  const email = ref("")
  const password = ref("")
const router = useRouter()



  function createUser() {
    hasAccount.value = false;
  }

  async function handleLogin(){

    // Attempt to log in
    try{

      await AuthService.login(email.value, password.value)

      await router.replace("/ChooseSide")

    }
    catch(error){


    }



  }

</script>

<template>
  <div v-if="hasAccount === true" class="login">
    <div class="title">Join the Debate!!</div>

    <div class="credentials">

      <form>

        <input placeholder="Username"
               style="width: 50%">

        <input placeholder="Email"
               v-model="email"
               style="width: 50%">

        <input placeholder="Password"
               v-model:="password"
               style="width: 50%">
      </form>

      <button
      @click="handleLogin"
      >Login</button>
      <button @click="createUser">Create an Account</button>
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