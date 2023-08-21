//app/page.tsx
import { fetchPosts } from "@/lib/actions/thread.action";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";
//<UserButton afterSignOutUrl="/"/>
export default async function Home() {
  const user = await currentUser();
  const result = await fetchPosts(1,30);
  //console.log(result);
  
  //if(posts)
  return (
    <>
      <h1 className="head-text text-left">
        Home
      </h1>
      <section
       className="mt-9 flex flex-col gap-10">
        {
          result.posts.length === 0 ? (
            <p className="no-results">
              No threads found
            </p>
          ) : (
            <>
              {result.posts.map(post => (
                  <ThreadCard
                    key={post._id}
                    id={post._id}
                    currentUserId={user?.id}
                    parentId={post.parentId}
                    content={post.text}
                    author={post.author}
                    community={post.community}
                    createdAt={post.createdAt}
                    comments={post.children}
                  />
              ))}
            </>
          )
        }
      </section>
    </>
  )
}