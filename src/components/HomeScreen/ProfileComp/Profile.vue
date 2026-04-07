<script setup lang="ts">
import {onMounted, ref} from "vue";
import {AuthService} from "../../../../Services/authService";
import {UserService} from "../../../../Services/userService";
import {useRouter} from "vue-router"

const username = ref('');
const email = ref('');
const isOpen = ref(false);
const router = useRouter();

const props = defineProps({
  user_id: {
    type: String,
    default: 'test',
    required:true

  }
})

onMounted(async () => {

  try {
    username.value = await UserService.getUsername(props.user_id);
    email.value = await AuthService.getUserEmail();
  } catch (error) {
    console.error("Failed to load profile: " + error);
  }

});

async function handleLogout() {
  await AuthService.logout();
  await router.push('/login');
}



</script>

<template>

  <div class="relative">

    <!-- Trigger Button -->
    <button
        @click="isOpen = !isOpen"
        class="bg-blue-600 text-white px-4 py-2 rounded-md font-medium"
    >
      Menu
    </button>

    <!-- Dropdown -->
    <div
        v-if="isOpen"
        class="absolute top-full right-5 mt-1 w-67 bg-white border border-gray-200 rounded-md shadow-lg z-10"
    >
      <ul class="flex flex-col py-1">
        <li>
          <p class="block px-4 py-2 text-sm text-gray-700 text-center">
            {{username}}
          </p>
        </li>
        <li>
          <p class="block px-4 py-2 text-sm text-gray-700 text-center">
            {{email}}
          </p>
        </li>
        <li>
          <p @click="handleLogout()" class="block px-4 py-2 text-sm text-gray-700 text-center hover:bg-gray-100">
            Log Out
          </p>
        </li>
      </ul>
    </div>

  </div>

</template>

<style scoped>

</style>