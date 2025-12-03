import React from "react";
import { currentProfile } from "@/lib/current-profile";
import { RedirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ServerSidebar } from "@/components/server/server-sidebar";

const ServerIdLayout = async ({
    children,
    params
}: {
    children: React.ReactNode;
        // params: { serverId: string };
        params: Promise<{ serverId: string }>;
    }) => {
    const { serverId } = await params;
    const profile = await currentProfile();

    if (!profile) return <RedirectToSignIn />;

    const server = await db.server.findFirst({
        where: {
            id: serverId,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if (!server) redirect("/");

    return (
        <div className="h-full">
            <div className="md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
                <ServerSidebar serverId={serverId} />
            </div>
            <main className="h-full md:pl-60">
                {children}
            </main>
        </div>
    );
};

export default ServerIdLayout;