import { createRouter, createWebHistory } from 'vue-router';

// Import main app views
// the 'parent' comps

import HomeScreen from '../src/components/HomeScreen/HomeScreen.vue'
import LoginScreen from '../src/components/LoginScreen/LoginScreen.vue'
import {AuthService} from "../Services/authService.ts";
import ChooseSideScreen from "../src/components/ChooseSideScreen/ChooseSideScreen.vue";
import NewTake from "../src/components/CreateTakeScreen/NewTake.vue";
import CreateUser from "../src/components/SignUpPage/CreateUser.vue";
import {UserService} from "../Services/userService.ts";

const routes = [
    {
        path: '/home',
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
        component: ChooseSideScreen,
        alias: ['/']
    },

    {
        path: '/SubmitTake',
        name: 'SubmitTake',
        component: NewTake
    },

    {
        path: '/NewUser',
        name: 'NewUser',
        component: CreateUser
    },

];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// NAVIGATION GUARD: The "Bouncer" logic
router.beforeEach(async (to, from) => {


        const loggedIn = await AuthService.isLoggedIn();

        // 1. PUBLIC ACCESS CHECK
        // Allow users to reach Login or SignUp if they aren't logged in.
        if (!loggedIn) {

            if (to.name !== 'login' && to.name !== 'NewUser' && to.name !== 'ChooseSide') {
                return { name: 'login' };
            }
            console.log('Not logged in');


            return true; // Let them stay on Login/SignUp
        }
        console.log('loggedIn');
        // 2. THE CHECKPOINTS (For Logged In Users)
        // If they are logged in, we check their "Progress" in the daily cycle.

        let userId

        try{
            userId = await AuthService.getUserId();
        }
        catch(error){
            console.log(error);
        }

        let hasSide;
        let hasTake;

        try{
            //this isnt working?

            console.log("HERE")
            await UserService.doesUserHaveTakeAndSide(userId).then((res) => {

                hasSide = res.hasSide;
                hasTake = res.hasTake;
            })


        }
        catch(err){
            hasSide = false;
            hasTake = false;
        }

        // Order: Side -> Take -> Home

        console.log("side" + hasSide);
        console.log("take" + hasTake);

        // Checkpoint A: Do they have a side?
        if (!hasSide) {
            if (to.name !== 'ChooseSide') return { name: 'ChooseSide' };
            return true;
        }

        // Checkpoint B: Have they submitted a take?
        if (!hasTake) {
            if (to.name !== 'SubmitTake') return { name: 'SubmitTake' };
            return true;
        }

        if (hasTake && hasSide) {
            if (to.name !== 'home') return { name: 'home' };
            return true;
        }

        // Checkpoint C: Already finished? Don't let them go back to Side/Take/Login
        const restrictedAfterCompletion = ['login', 'ChooseSide', 'SubmitTake', 'NewUser'];
        if (restrictedAfterCompletion.includes(to.name)) {
            return { name: 'home' };
        }

        return true; // Finally, let them through to Home

});

export default router;