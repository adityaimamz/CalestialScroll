import { createUploadthing, type FileRouter, UTApi, UTFile } from "uploadthing/server";
import { createRouteHandler } from "uploadthing/next-legacy";
import sharp from "sharp";

const f = createUploadthing();
const utapi = new UTApi();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// Supported animated formats that should NOT be converted
const SKIP_CONVERSION_FORMATS = new Set(["image/gif", "image/avif"]);

/**
 * Converts an uploaded image to WebP format and uploads it
 * Skips conversion for already optimized formats (WebP, AVIF) and animations (GIF)
 * @returns The converted/optimized URL or the original URL if conversion is skipped
 */
async function convertToWebP(file: { url: string; type: string; name?: string; key: string }): Promise<{ url: string; wasConverted: boolean }> {
    // Skip conversion for already optimized formats
    if (file.type === "image/webp" || SKIP_CONVERSION_FORMATS.has(file.type)) {
        console.log(`Skipping conversion for ${file.type} - already optimized`);
        return { url: file.url, wasConverted: false };
    }

    try {
        const response = await fetch(file.url);
        if (!response.ok) {
            throw new Error(`Failed to download uploaded file: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const baseName = file.name?.replace(/\.[^.]+$/, "") || "upload";
        const webpBuffer = await sharp(Buffer.from(arrayBuffer))
            .webp({ quality: 82 })
            .toBuffer();

        const uploadResult = await utapi.uploadFiles(
            new UTFile([new Uint8Array(webpBuffer)], `${baseName}.webp`, { type: "image/webp" })
        );

        if (uploadResult?.data?.ufsUrl) {
            console.log(`WebP conversion successful: ${uploadResult.data.ufsUrl}`);
            
            // Delete original file if conversion succeeded
            if (file.key && uploadResult.data.key !== file.key) {
                try {
                    await utapi.deleteFiles(file.key);
                    console.log(`Original file deleted: ${file.key}`);
                } catch (deleteError) {
                    console.error("Failed to delete original file:", deleteError);
                }
            }
            
            return { url: uploadResult.data.ufsUrl, wasConverted: true };
        }

        if (uploadResult?.error) {
            console.error("WebP upload failed:", uploadResult.error);
        }
    } catch (error) {
        console.error("Failed to convert upload to WebP:", error);
    }

    console.log("Falling back to original file:", file.url);
    return { url: file.url, wasConverted: false };
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({
        "image/jpeg": { maxFileSize: "4MB", maxFileCount: 1 },
        "image/png": { maxFileSize: "4MB", maxFileCount: 1 },
        "image/webp": { maxFileSize: "4MB", maxFileCount: 1 },
        "image/gif": { maxFileSize: "4MB", maxFileCount: 1 },
        "image/avif": { maxFileSize: "4MB", maxFileCount: 1 },
        "image/svg+xml": { maxFileSize: "4MB", maxFileCount: 1 },
        "image/tiff": { maxFileSize: "4MB", maxFileCount: 1 },
        "image/x-icon": { maxFileSize: "4MB", maxFileCount: 1 },
    })
        // Set permissions and file types for this FileRoute
        .middleware(async ({ req }) => {
            // This code runs on your server before upload
            const user = await auth(req);

            // If you throw, the user will not be able to upload
            if (!user) throw new Error("Unauthorized");

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata.userId);
            console.log("file url", file.url);
            console.log("file type", file.type);

            const { url: optimizedUrl, wasConverted } = await convertToWebP(file);

            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return { 
                uploadedBy: metadata.userId, 
                webpUrl: optimizedUrl,
                wasConverted,
                originalType: file.type 
            };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

export default createRouteHandler({
    router: ourFileRouter,
    config: { token: process.env.UPLOADTHING_TOKEN },
});
