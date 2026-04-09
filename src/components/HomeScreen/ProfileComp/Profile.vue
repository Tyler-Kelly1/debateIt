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
    <button
        @click="isOpen = !isOpen"
        class="bg-transparent text-black px-2 py-1 rounded-md text-sm"
    >
      Menu
    </button>

    <Transition name="menu-dropdown">
      <div
          v-if="isOpen"
          class="absolute top-full right-5 mt-1 w-67 bg-white border border-gray-200 rounded-md shadow-lg z-10 origin-top"
      >
        <ul class="flex flex-col py-1">
          <li>
            <p class="block px-4 py-2 text-sm text-gray-700 text-center">
              {{ username }}
            </p>
          </li>
          <li>
            <p class="block px-4 py-2 text-sm text-gray-700 text-center">
              {{ email }}
            </p>
          </li>
          <li>
            <p
                @click="handleLogout()"
                class="block px-4 py-2 text-sm text-gray-700 text-center hover:bg-gray-100"
            >
              Log Out
            </p>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.menu-dropdown-enter-active,
.menu-dropdown-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.menu-dropdown-enter-from,
.menu-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scaleY(0.95);
}

.menu-dropdown-enter-to,
.menu-dropdown-leave-from {
  opacity: 1;
  transform: translateY(0) scaleY(1);
}
</style>