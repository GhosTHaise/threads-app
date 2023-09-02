"use server"

import { connectToDb } from "../mongoose"
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";

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
        throw new Error(`Failed to fetch user : ${error.message}`);
    }
}

export async function fetchUsers({
    userId,
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc"
} : {
    userId : string;
    searchString? : string;
    pageNumber? : number;
    pageSize? : number;
    sortBy? : SortOrder;
}){
    try {
        connectToDb();

        const skipAmount = (pageNumber - 1) * pageSize;

        const regex = new RegExp(searchString,"i");

        const query : FilterQuery<typeof User>= {
            id  : {
                $ne : userId
            }
        }

        if(searchString.trim() !== ""){
            query.$or = [
                { username : { $regex : regex}},
                { name : { $regex : regex}}
            ]
        }

        const sortOptions = {
            createdAt : sortBy
        };

        const usersQuery = User.find(query)
                        .sort(sortOptions)
                        .skip(skipAmount)
                        .limit(pageSize);
                        
        const totalUsersCount = await  User.countDocuments(query);
        
        const users = await usersQuery.exec();

        const isNext = totalUsersCount > skipAmount + users.length;

        return {users,isNext};
    } catch (error : any) {
        throw new Error(`Failed to fetch user : ${error.message}`);
    }
}

export async function getActivities(userId : string){
    try {
        connectToDb();

        //find all threads
        const userTreads = await Thread.find({ author : userId});
        
        //collect all the child threads ids (replies) from the 'children' field
        const childThreadIds = userTreads.reduce((acc,userThread) => {
            return acc.concat(userThread.children)
        },[]);

        const replies = await Thread.find({
            _id : { $in : childThreadIds},
            author : { $ne : userId}
        }).populate({
            path : "author",
            model : User,
            select : "name image _id"
        });

        return replies;

    } catch (error : any) {
        throw new Error(`Failed to fetch user : ${error.message}`);
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
                    model : Thread,
                    populate : {
                        path : "children",
                        model : Thread,
                        populate  : {
                            path : "author",
                            model : User,
                            select : "name image id"
                        }
                    }
                });

            return threads;
    } catch (error : any) {
        throw new Error(`Failed to create/update user : ${error.message}`);
    }
}