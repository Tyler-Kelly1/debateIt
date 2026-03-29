import supabase from "../src/config/supabaseClient.js";

type FormattedTake = {
    take_id: string;
    message: string;
    user_id?: string|null;
    topic: string;
    side: boolean;
}

export const TakeServices = {

    /**
     * Subscribes to the 'Takes' table and buckets a new take when its detected
     * @param {Function} assignTakeToSide - The function to run when data changes.
     */

    subscribeToTakesUpdates(assignTakeToSide:(newTake : FormattedTake)=>void):any{

        return supabase

            .channel('take_updates') // Name the channel whatever you like

            .on(
                'postgres_changes',
                {
                    event: 'INSERT',    // listen for any change
                    schema: 'public',
                    table: 'Takes'      // The table to watch
                },
                (payload) => {

                    // This 'payload' is the new row sent from the database!
                    const newTake : any = payload.new;
                    console.log('Change received from DB!', newTake);

                    // Map the DB columns to your local reactive object format
                    const formattedTake : FormattedTake = {

                        take_id : newTake.take_id,
                        message : newTake.message,
                        user_id : newTake.user_id,
                        topic : newTake.topic,
                        side : newTake.side

                    };

                    //Insert Takes into appropiate buckets (side)
                    // Inject into the correct "bucket" based on the 'Agree' boolean

                    assignTakeToSide(formattedTake)


                }
            )
            .subscribe();

    },

    async loadAllTakesAndTopic(): Promise<any> {

        // We are selecting everything (*) from Debates and the related 'Takes' table.
        let {data, error} = await supabase
            .from('Debates')
            .select(`
            topic,
            Takes (
                take_id,
                message,
                user_id,
                topic,
                side,
                Reactions (
                user_id,
                type
                )
            )
            `)
            .eq("is_active", true)


        //Error handing
        if(error) throw Error("Connection to DB Failed! Could not load all takes! Function: loadAlLTakes()");


        return {
            topic : data[0].topic,
            takes: data[0].Takes
        }



    },

    async getTopic(){

        const {data, error} = await supabase

            .from('Debates')
            .select(``)
            .eq('is_active', true)

        if (error) throw Error("Connection to DB Failed! Could not load topic! Function: getTopic()");

        return {
            topic: data[0].topic,
            expiration_date: data[0].Expiration_Date
        }

    },

    async submitNewTake(newTake:any): Promise<void>{

        const {data: insertedTake, error} = await supabase

            .from('Takes')
            .insert(newTake)
            .select('take_id')
            .single();

        if (error) {
            throw Error("Connection to DB Failed! Could not submit new Take! Function: submitNewTake()");
        }

        // 2. Update the User's foreign key (take_id)
        // We assume newTake.user_id contains the current user's UUID
        const { error: updateError } = await supabase
            .from('Users')
            .update({ take_id: insertedTake.take_id })
            .eq('id', newTake.user_id);

        if (updateError) {
            throw Error("DB Failure: Could not link Take to User. Function: submitNewTake()");
        }

    }

}

