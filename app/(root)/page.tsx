
//app/page.tsx
import { fetchPosts } from "@/lib/actions/thread.action";
import { UserButton } from "@clerk/nextjs";
//<UserButton afterSignOutUrl="/"/>
export default async function Home() {
  const result = await fetchPosts(1,30);
  //console.log(result);
  
  //if(posts)
  return (
    <>
      <h1 className="head-text text-left">
        Home
      </h1>
    </>
  )
}