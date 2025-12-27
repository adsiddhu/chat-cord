import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
    req: Request,
    context: { params: { serverId: string } }
) {
    try {
        const params = await Promise.resolve(context.params);

        const { serverId } = params;

        const profile = await currentProfile()

        if (!profile) return new NextResponse("Unauthorized ", { status: 401 })

        const server = await db.server.delete({
            where: {
                id: serverId,
                profileId: profile.id
            }
        })
        return NextResponse.json(server)
    }
    catch (error) {
        console.log("[SERVER_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    context: { params: { serverId: string } }
) {
    try {
        const params = await Promise.resolve(context.params);

        const { serverId } = params;

        const profile = await currentProfile()
        const { name, imageUrl } = await req.json()

        if (!profile) return new NextResponse("Unauthorized ", { status: 401 })

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                name,
                imageUrl
            }
        })
        return NextResponse.json(server)
    }
    catch (error) {
        console.log("[SERVER_ID_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}