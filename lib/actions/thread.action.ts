import { revalidatePath } from "next/cache";
import Thread from "../modals/thread.model";
import User from "../modals/user.model";
import { connectToDb } from "../mongoose";

interface Params{
    text : string;
    author : string;
    communityId : string | null;
    path : string;
}

export async function createThread({
    text,
    author,
    communityId,
    path
}:Params){
    connectToDb();

    try {
        const createdTread = await  Thread.create({
            text,
            author,
            community : null
        });
        // Update User model
        User.findByIdAndUpdate(author,{
            $push : {
                threads : createdTread._id
            }
        }
        );
        revalidatePath(path);
    } catch (error) {
        
    }
}