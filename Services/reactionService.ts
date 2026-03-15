import supabase from "../src/config/supabaseClient.js";

type Reaction = {

    user_id: string;
    take_id: string;
    type: "Like" | "Dislike" | "None";

}

export const ReactionService = {

    subscribeToReactionsUpdates(assignReactionChange:(reaction:Reaction)=>void) : any{

        return supabase

            .channel('reaction_updates') // Name the channel whatever you like

            .on(
                'postgres_changes',
                {
                    event: '*',    // listen for any change
                    schema: 'public',
                    table: 'Reactions'      // The table to watch
                },
                (payload:any) => {

                    // This 'payload' is the new row sent from the database!
                    const updatedReaction : any = payload.new;

                    assignReactionChange(updatedReaction)

                }
            )

            .subscribe();

    },

    async submitNewReaction(newReaction: Reaction) {

        const {error} = await supabase

            .from('Reactions')
            .insert(newReaction)

        if(error){
            console.log(error)
            throw Error("Connection to DB Failed! Could not submit new Reaction! Function: submitNewReaction()");
        }


    },

    async updateReaction(newReaction: Reaction) {

        const {error} = await supabase

            .from('Reactions')
            .update({type:newReaction.type})
            .eq('user_id', newReaction.user_id) // Filter by User ID
            .eq('take_id', newReaction.take_id) // Filter by Take ID

        if(error){
            throw Error("Connection to DB Failed! Could not update Reaction! Function: updateReaction()");
        }

    }

}

