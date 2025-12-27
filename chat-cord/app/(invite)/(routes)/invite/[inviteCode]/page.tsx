import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

interface InviteCodePageProps {
    params: {
        inviteCode: string;
    };
}

const InviteCodePage = async ({
    params: paramsPromise,
}: {
    params: Promise<{ inviteCode: string }>;
}) => {
    const params = await paramsPromise;

    console.log("Server Log → InviteCodePage Loaded ===>>> ", params);
    console.log("Invite code:", params.inviteCode);
    const profile = await currentProfile();

    if (!profile) {
        return redirect("/");
    }

    if (!params.inviteCode) {
        return redirect("/");
    }

    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        },
    });

    if (existingServer) {
        console.log(
            "This user already exist in the server. this was done by => ",
            profile.email
        );
        return redirect(`/servers/${existingServer.id}`);
    }

    const server = await db.server.update({
        where: {
            inviteCode: params.inviteCode,
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id
                    }
                ]
            }
        }
    });

    if (server) {
        console.log(
            "New user has joined the server. this was done by => ",
            profile.email,
            " The server name is => ",
            server.name
        );
        return redirect(`/servers/${server.id}`);
    }

    return null;
};

export default InviteCodePage;