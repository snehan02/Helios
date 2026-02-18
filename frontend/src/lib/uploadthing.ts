import {
    generateUploadButton,
    generateUploadDropzone,
} from "@uploadthing/react";

// Import router types from backend
import type { OurFileRouter } from "../../../server/src/uploadthing";

// Generate components with URL override
export const UploadButton = generateUploadButton<OurFileRouter>({
    url: "https://helios-chi-six.vercel.app/api/uploadthing",
});

export const UploadDropzone = generateUploadDropzone<OurFileRouter>({
    url: "https://helios-chi-six.vercel.app/api/uploadthing",
});
