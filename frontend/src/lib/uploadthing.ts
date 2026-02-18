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

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const UploadButton = generateUploadButton<OurFileRouter>({
    url: `${BASE_URL}/api/uploadthing`,
});

export const UploadDropzone = generateUploadDropzone<OurFileRouter>({
    url: `${BASE_URL}/api/uploadthing`,
});
