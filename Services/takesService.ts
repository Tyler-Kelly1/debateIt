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
                    event: '*',    // listen for any change
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

        //Error handing
        if(error) throw Error("Connection to DB Failed! Could not load all takes! Function: loadAlLTakes()");

        return {
            topic : data[0].topic,
            takes: data[0].Takes
        }



    },

    async submitNewTake(newTake:any): Promise<void>{

        const {error} = await supabase

            .from('Takes')
            .insert(newTake)

        if (error) {
            throw Error("Connection to DB Failed! Could not submit new Take! Function: submitNewTake()");
        }

    }

}

TakeServices.loadAllTakesAndTopic().then(r => console.log(r.takes[0]));

