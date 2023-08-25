import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async () => {
    const user = await currentUser();
    if(!user) return null;
    const userInfo = await fetchUser(user.id);
    
    if(!userInfo?.onboarded) redirect("/onboarding");
    return (
        <section>
            Profile
        </section>
    );
}

export default Page;