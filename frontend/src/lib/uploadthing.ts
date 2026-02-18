/// <reference types="vite/client" />
import {
    generateUploadButton,
    generateUploadDropzone,
} from "@uploadthing/react";

// Define the router type locally to avoid importing from server
import type { FileRouter } from "uploadthing/server";

// This must match the router structure in server/src/uploadthing.ts
export type OurFileRouter = {
    imageUploader: {
        input: any;
        output: any;
        routerConfig: {
            uploadFormats: {
                image: {
                    maxFileSize: "4MB";
                    maxFileCount: 1;
                };
            };
        };
    };
} & FileRouter;

export const UploadButton = generateUploadButton<OurFileRouter>();

export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
