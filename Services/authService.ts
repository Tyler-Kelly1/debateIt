import supabase from "../src/config/supabaseClient.js";


export const AuthService = {

    async registerAccount(username: string, email: string, password: string) {

        const {data, error} = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) throw error

        //also need to update the user table with username

        const {error: userTableError} = await supabase
            .from('Users')
            .insert({id: data.user.id, username:username})

        if (userTableError) throw userTableError;

    },

    async login(email: string, password: string) {

        const {data, error} = await supabase.auth.signInWithPassword({
            email,
            password
        })
        if (error) throw error

        console.log("Logged In Successfully")



    },

    async logout(){

        const { error } = await supabase.auth.signOut();
        if (error) throw error
        console.log("Logged Out Successfully")
    },

    async isLoggedIn(){

        const {data, error} = await supabase.auth.getUser();

        if (error || !data) return false

        return true

    },

    async getUserSession() {

        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        return data.session;

    },

}
