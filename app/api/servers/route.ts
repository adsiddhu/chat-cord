import React from "react";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { exportPages } from "next/dist/export/worker";
import { currentProfile } from "@/lib/current-profile";

export async function POST(req: Request) {
    try {
        const { name, imageUrl } = await req.json()
        const profile = await currentProfile()

        if (!profile) return new NextResponse("Un-authorized", { status: 401 })

    } catch (error) {
        console.log("[SERVERS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}