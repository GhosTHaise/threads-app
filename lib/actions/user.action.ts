"use server"

import { connectToDb } from "../mongoose"
import User from "../modals/user.model";
import { revalidatePath } from "next/cache";
import Thread from "../modals/thread.model";

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
        throw new Error(`Failed to create/update user : ${error.message}`);
    }
}

export async function fetchUser(userId : String){
    try {
        connectToDb();

        return await User.findOne({id : userId})
        //.populate({
        //    path : 'communities',
        //    model : Community
        //});
    } catch (error : any) {
        throw new Error(`Failed to fetch user : ${error.message}`)
    }
}

export async function fetchUserPosts(userId : String){
    try {
        connectToDb();

        //find all threads athored by user with the given id

        //TODO "Populate community"
        const threads = await User.findOne({ id : userId})
                .populate({
                    path : "threads",
                    model : Thread
                }).populate({
                    path : "children",
                    model : Thread,
                    populate  : {
                        path : "author",
                        model : User,
                        select : "name image id"
                    }
                })

            return threads;
    } catch (error : any) {
        throw new Error(`Failed to create/update user : ${error.message}`);
    }
}