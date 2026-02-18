import { UploadButton } from "../lib/uploadthing";
import { X } from "lucide-react";

export const ImageUpload = ({
    value,
    onChange,
    onRemove,
    endpoint = "imageUploader",
}) => {
    if (value) {
        return (
            <div className="relative w-full h-48 border border-gray-700 rounded-lg overflow-hidden bg-gray-900 flex items-center justify-center group">
                <div className="absolute top-2 right-2 z-10">
                    <button
                        onClick={onRemove}
                        type="button"
                        className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-lg transition-all"
                    >
                        <X size={16} />
                    </button>
                </div>
                <img
                    src={value}
                    alt="Upload"
                    className="object-contain h-full w-full"
                />
            </div>
        );
    }

    return (
        <div className="w-full border-2 border-dashed border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-900/50 hover:bg-gray-900 transition-colors">
            <UploadButton
                endpoint={endpoint}
                onClientUploadComplete={(res) => {
                    console.log("Files:", res);
                    if (res?.[0]) onChange(res[0].url);
                }}
                onUploadError={(error) => {
                    console.error("Upload error:", error);
                    alert(`ERROR! ${error.message}`);
                }}
            />
            <p className="text-gray-400 text-sm mt-2">
                Upload Image (Max 4MB)
            </p>
        </div>
    );
};

export default ImageUpload;
