import React from 'react'
import { currentUser } from '@clerk/nextjs';
import { fetchUser } from '@/lib/actions/user.action';
import { redirect } from 'next/navigation';
import { fetchThreadById } from '@/lib/actions/thread.action';
import ThreadCard from '@/components/cards/ThreadCard';
const Page = async ({params} : {params : { id : string}}) => {
    if(!params) return null;

    const user = await currentUser();
    if(!user) return null;

    const userInfo = await fetchUser(user.id);
    if(!userInfo?.onboarded) redirect("/onboarding");

    const thread = await fetchThreadById(params.id);
    return (
        <section className='relative'>
            <ThreadCard
                key={thread._id}
                id={thread._id}
                currentUserId={user?.id || ""}
                parentId={thread.parentId}
                content={thread.text}
                author={thread.author}
                community={thread.community}
                createdAt={thread.createdAt}
                comments={thread.children}
                />
        </section>
  )
}

export default Page