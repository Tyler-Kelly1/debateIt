import { createRouter, createWebHistory } from 'vue-router';

// Import main app views
// the 'parent' comps

import HomeScreen from '../src/components/HomeScreen/HomeScreen.vue'
import LoginScreen from '../src/components/LoginScreen/LoginScreen.vue'
import {AuthService} from "../Services/authService.ts";
import ChooseSideScreen from "../src/components/ChooseSideScreen/ChooseSideScreen.vue";
import NewTake from "../src/components/CreateTakeScreen/NewTake.vue";

const routes = [
    {
        path: '/',
        name:'home',
        component: HomeScreen },
    {
        path: '/login',
        name: 'login',
        component: LoginScreen
    },

    {
        path: '/ChooseSide',
        name: 'ChooseSide',
        component: ChooseSideScreen
    },

    {
        path: '/SubmitTake',
        name: 'SubmitTake',
        component: NewTake
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// NAVIGATION GUARD: The "Bouncer" logic
router.beforeEach(async (to, from) => {

    const loggedIn = await AuthService.isLoggedIn();

    // If trying to access Home but not logged in -> redirect to login
    if (to.name !== 'login' && !loggedIn) {
        return { name: 'login' };
    }

    // If already logged in and trying to go to login -> redirect to home
    if (to.name === 'login' && loggedIn) {
        return { name: 'home' };
    }
});

export default router;