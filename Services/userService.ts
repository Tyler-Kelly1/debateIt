import supabase from "../src/config/supabaseClient.js";

type User = {

    id: string;
    //Username: string;
    side: boolean;
}

export const UserService = {

    subscribeToUserUpdates(assignUserChange:(user:User)=>void) : any{

        return supabase

            .channel('user_updates') // Name the channel whatever you like

            .on(
                'postgres_changes',
                {
                    event: '*',    // listen for any change
                    schema: 'public',
                    table: 'Users'      // The table to watch
                },
                (payload:any) => {

                    // This 'payload' is the new row sent from the database!
                    const updatedUser : any = payload.new;

                    assignUserChange(updatedUser)

                }
            )

            .subscribe();

    },

    async updateSide(user: User) {
        const {error} = await supabase

            .from('Users')
            .update({side: user.side})
            .eq('id', user.id) // Filter by User ID

        if(error){
            throw Error("Connection to DB Failed! Could not update Side! Function: updateSide()");
        }
    },

    async getUserSide(user:User){

        const {data, error} =  await supabase
            .from('Users')
            .select(`side`)
            .eq('id',user.id);

        if (error) throw error;

        return data;
    }
}
