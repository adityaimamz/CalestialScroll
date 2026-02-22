import "dotenv/config";
import express from "express";
import { createRouteHandler } from "uploadthing/express";
import { ourFileRouter } from "./api/uploadthing";
import { z } from "zod";

const app = express();
const port = 3000;

const serverEnvSchema = z.object({
    UPLOADTHING_TOKEN: z.string().min(1),
});

const serverEnv = serverEnvSchema.safeParse(process.env);

if (!serverEnv.success) {
    console.error("Invalid server environment configuration:", serverEnv.error.flatten().fieldErrors);
    process.exit(1);
}

app.use(
    "/api/uploadthing",
    createRouteHandler({
        router: ourFileRouter,
        config: {
            token: serverEnv.data.UPLOADTHING_TOKEN,
        },
    })
);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
