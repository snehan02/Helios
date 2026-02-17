import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "../uploadthing";
import dotenv from "dotenv";

dotenv.config();

export const uploadThingRouter = createRouteHandler({
    router: uploadRouter,
    config: {
        uploadthingId: process.env.UPLOADTHING_APP_ID,
        uploadthingSecret: process.env.UPLOADTHING_SECRET,
    },
});
