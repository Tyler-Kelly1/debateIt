import supabase from "../src/config/supabaseClient.js";


export const AuthService = {

    async registerAccount(username: string, email: string, password: string) {

        // 1. Create the Auth Entry
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    display_name: username // This goes into 'raw_user_meta_data'
                }
            }
        });

        if (error) throw error;

        return true;
    },

    async login(email: string, password: string) {

        const {data, error} = await supabase.auth.signInWithPassword({
            email,
            password
        })


        if (error) throw error

        return true


    },

    async logout(){

        const { error } = await supabase.auth.signOut();
        if (error) throw error
        console.log("Logged Out Successfully")
    },

    async isLoggedIn(){

        const {data, error} = await supabase.auth.getUser();
        console.log(data)
        if (error || !data) return false

        return true

    },

    async getUserSession() {

        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;
        
        return data.session;

    },

    async getUserId(){

        const {data, error} =  await supabase.auth.getUser();

        if (error) throw error;

        return data.user.id
    },

    async signInWithGoogle() {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/ChooseSide',
            },
        });

        if (error) throw error;
        return data;
    },

    async getUserEmail() {
        const {data, error} = await supabase.auth.getUser();

        if (error) throw error;

        return data.user.email;
    }

}