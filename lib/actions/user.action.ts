"use server"

import { connectToDb } from "../mongoose"
import User from "../modals/user.model";
import { revalidatePath } from "next/cache";
export async function updateUser(
    userId : string,
    username : string,
    name : string,
    bio : string,
    image : string,
    path : string
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