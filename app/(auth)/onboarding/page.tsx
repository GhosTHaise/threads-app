import AccountProfile from "@/components/forms/AccountProfile";
import { currentUser } from "@clerk/nextjs";
import { userInfo } from "os";

async function Page() {
    const user = await currentUser();

    const usrInfo = {};
    const userData = {
        id : user?.id,
        objectId : userInfo?._id,
        username : userInfo?.username || user?.username || "",
        name : userInfo?.name || user?.firstName || "",
        bio : userInfo?.bio || "",
        image : userInfo?.image || user?.imageUrl
    }
    return(
        <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
            <h1 className="head-text">
                OnBoarding
            </h1>
            <p
                className="my-3 text-base-regular text-light-2"
            >
                Complete your profile now to use threads
            </p>
            <section
                className="mt-9 bg-dark-2 p-10"
            >
                <AccountProfile
                    user={userData}
                    btnTitle="Continue"
                />
            </section>
        </main>
    )
}

export default Page;