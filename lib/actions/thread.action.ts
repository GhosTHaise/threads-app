"use server"
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
export async function fetchPosts(pageNumber = 1,pageSize = 20){
    connectToDb();

    const skipAmount = (pageNumber - 1) * pageSize;
    //fetch posts that have no parents (top-level threads ...)
    const postsQuery = Thread.find({parentId : { $in : [null,undefined]}})
        .sort({createdAt : "desc"})
        .skip(skipAmount)
        .limit(pageSize)
        .populate({path : "author",model : User})
        .populate({
            path : "children",
            populate : {
                path : "author",
                model : User,
                select : "_id name parentId image" 
            }
        });
        const totalPostsCount = await Thread.countDocuments({parentId : { $in : [null,undefined]}});

        const posts = await postsQuery.exec();

        const isNext = totalPostsCount < skipAmount + posts.length;

        return { posts , isNext};
}
export async function createThread({
    text,
    author,
    communityId,
    path
}:Params){
    
    try {
        connectToDb();

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
    } catch (error : any) {
        throw new Error(`Error creating thread : ${error.message}`)
    }
}
export async function fetchThreadById(id : string){
    connectToDb();
    try {
        //TODO poulte community
        const thread = await Thread.findById(id).populate({
            path : "author",
            model : User,
            select : "_id id name image"
        }).populate({
            path : "children",
            populate : [
                {
                    path : "author",
                    model : User,
                    select : "_id id name image"
                },
                {
                    path : "children",
                    model : Thread,
                    populate : {
                        path : 'author',
                        model : User,
                        select : "_id id name parentId image"
                    }
                }
            ]
        }).exec();
        return thread;
    } catch (error : any) {
        throw new Error(`Error fetching thread : ${error.message}`)
    }
}