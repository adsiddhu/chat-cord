import React from "react";
import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import NavigationAction from "./navigation-action";


const NavigationSidebar = async () => {
    const profile = await currentProfile()

    if (!profile) return redirect("/")

    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })
    return (
        <div
            className="flex flex-col items-center h-full w-full py-3 gap-4 text-primary dark:bg-[#1E1F22]"
        >
            <NavigationAction/>
        </div>
    )
}
export default NavigationSidebar
