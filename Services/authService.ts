import supabase from "../src/config/supabaseClient.js";


export const AuthService = {

    async registerAccount(username: string, email: string, password: string) {

        // 1. Create the Auth Entry
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) throw error;

        // 2. Call the SQL Function (RPC)
        // We pass the new UUID and the Username to our database function
        const { error: rpcError } = await supabase.rpc('initialize_user_profile', {
            user_id: data.user.id,
            username_input: username
        });

        if (rpcError) throw rpcError;

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

    async getUserEmail() {
        const {data, error} = await supabase.auth.getUser();

        if (error) throw error;

        return data.user.email;
    }

}