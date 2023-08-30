import ProfileHeader from "@/components/shared/ProfileHeader";
import { fetchUser, fetchUsers } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";

const Page = async () => {
    const user = await currentUser();
    if(!user) return null;
    const userInfo = await fetchUser(user.id);

    //fetch users
    const users = await fetchUsers({  
      userId : user.id,
      searchString : "",
      pageNumber : 1,
      pageSize : 25
    });

  return (
    <section>
        <h1 className='head-text mb-10'>
            Search
        </h1>

        {/** Search bar */}
    </section>
  )
}

export default Page