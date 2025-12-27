import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function DELETE(
    req: Request,
    context: { params: Promise<{ memberId: string }> }
) {
    const { memberId } = await context.params;

    console.log("DELETE /api/members/:memberId =>", memberId);
    try {
        if (!memberId) return new NextResponse("Member ID Missing", { status: 400 })

        const profile = await currentProfile()
        if (!profile) return new NextResponse("Unauthorized", { status: 401 })

        const { searchParams } = new URL(req.url);
        console.log("searchParams => ", searchParams);
        const serverId = searchParams.get("serverId");

        if (!serverId) return new NextResponse("Server ID Missing", { status: 400 })

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                members: {
                    deleteMany: {
                        id: memberId,
                        profileId: {
                            not: profile.id
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: "asc"
                    }
                }
            }
        })
        return NextResponse.json(server)
    }
    catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}


export async function PATCH(
    req: Request,
    context: { params: { memberId: string } }
) {
    try {
        const params = await Promise.resolve(context.params);

        const profile = await currentProfile()
        const { searchParams } = new URL(req.url)
        const { role } = await req.json()
        const serverId = searchParams.get("serverId")

        if (!profile) return new NextResponse("Unauthorized", { status: 401 })
        if (!serverId) return new NextResponse("Server ID Missing", { status: 400 })
        if (!params.memberId) return new NextResponse("Member ID Missing", { status: 400 })

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                members: {
                    update: {
                        where: {
                            id: params.memberId,
                            profileId: {
                                not: profile.id
                            }
                        },
                        data: {
                            role
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: "asc"
                    }
                }
            }
        })
        return NextResponse.json(server)
    }
    catch (error) {
        console.log("[MEMBER_ID_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}