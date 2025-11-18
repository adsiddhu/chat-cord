import React from "react";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initail-profile";
import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import InitialModal from "@/components/modals/initial-modal";

const SetupPage = async () => {
  const profile = await initialProfile();

  const server = await db.server.findFirst({
    where: { members: { some: { profileId: profile.id } } },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  } else {
    return (
      <div>
        <UserButton />
        <InitialModal />
        <ModeToggle />
      </div>
    );
  }
};
export default SetupPage;