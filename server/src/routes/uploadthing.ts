import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "../uploadthing";
import dotenv from "dotenv";

dotenv.config();

console.log("✅ UploadThing Route Module Loaded");

export const uploadThingRouter = createRouteHandler({
    router: uploadRouter,
});
