import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// Auth wrapper
const handleAuth = async () => {
    const { userId } = await auth();
    // const userId = auth();
    if (!userId) throw new UploadThingError("Unauthorized");
    return { userId };
};

// FileRouter for your app
export const ourFileRouter = {
    serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(() => handleAuth())
        .onUploadComplete(({ file, metadata }) => {
            // console.log("Upload complete:", file.url, metadata);
            // return { imageUrl: file.url };
        }),

    messageFile: f([
        "image",
        "pdf",
        "text/css",
        "audio/mp4",
        "video/mp4",
        "text/xml",
        "audio",
        "application/zip",
        "application/vnd.apple.pages",
    ])
        .middleware(() => handleAuth())
        .onUploadComplete(({ file, metadata }) => {
            // console.log("File uploaded:", file.url);
            // return { fileUrl: file.url };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;