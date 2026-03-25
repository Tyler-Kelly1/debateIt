import supabase from "../src/config/supabaseClient.js";


export const UserService = {

    async updateSide(userId: string, newSide:boolean) {

        const {error} = await supabase

            .from('Users')
            .update({side: newSide})
            .eq('id', userId) // Filter by User ID

        if(error){
            throw Error("Connection to DB Failed! Could not update Side! Function: updateSide()");
        }

    },

    async getUserSide(userId: string){

        const {data, error} =  await supabase

            .from('Users')
            .select(`side`)
            .eq('id', userId);

        if (error) throw error;

        return data[0].side;

    },


    async doesUserHaveTakeAndSide(userId: string){

        const {data, error} =  await supabase

            .from('Users')
            .select(`
            side,
            take_id
            `
            )
            .eq('id', userId);

        if (error) throw error;

        return{
            hasTake: data[0].take_id !== null,
            hasSide: data[0].side !== null
        }


    }
}

