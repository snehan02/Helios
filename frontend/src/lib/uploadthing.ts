/// <reference types="vite/client" />
import {
    generateUploadButton,
    generateUploadDropzone,
} from "@uploadthing/react";

// Import router types from backend
import type { OurFileRouter } from "../../../server/src/uploadthing";

// Generate components with URL override
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const UploadButton = generateUploadButton<OurFileRouter>({
    url: `${BASE_URL}/api/uploadthing`,
});

export const UploadDropzone = generateUploadDropzone<OurFileRouter>({
    url: `${BASE_URL}/api/uploadthing`,
});
