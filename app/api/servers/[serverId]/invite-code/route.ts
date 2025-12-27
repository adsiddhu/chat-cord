import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function PATCH(
    req: Request,
    context: { params: { serverId: string } }
) {
    try {
        const params = await Promise.resolve(context.params);
        const { serverId } = params;
        const profile = await currentProfile();
        if (!profile) return new NextResponse("Unauthorized", { status: 401 });
        if (!serverId) return new NextResponse("Server ID Missing", { status: 400 });

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            }, 
            data: {
                inviteCode: uuidv4(),
            },
        });

        return NextResponse.json(server);
    }

    catch (error) {
        console.log("[SERVER_ID]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}