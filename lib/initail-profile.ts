import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import type { Profile } from "@prisma/client";

export const initialProfile = async (): Promise<Profile> => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const existingProfile = await db.profile.findUnique({
    where: { userId: user.id },
  });

  if (existingProfile) return existingProfile;

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });
  return newProfile;
};