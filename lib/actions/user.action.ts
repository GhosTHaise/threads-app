"use server"

import { connectToDb } from "../mongoose"
import User from "../modals/user.model";
import { revalidatePath } from "next/cache";

interface Params {
    userId : string,
    username : string,
    name : string,
    bio : string,
    image : string,
    path : string
}
export async function updateUser(
    {
        userId ,
        username ,
        name ,
        bio ,
        image ,
        path 
    } : Params
    ) : Promise<void>{
    try {
        connectToDb();

        await User.findOneAndUpdate(
            { id : userId},
            {
                username : username.toLocaleLowerCase(),
                name,
                bio,
                image,
                onboarded : true
            },
            {
                upsert : true
            }
        );

        if(path === "/profile/edit"){
            revalidatePath(path);
        }
    } catch (error : any) {
        throw new Error(`Failed to create/update user : ${error.message}`)
    }
}