import { UploadDropzone } from "../lib/uploadthing";
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
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                console.log("Files:", res);
                if (res?.[0]) onChange(res[0].url);
            }}
            onUploadError={(error) => {
                console.error("Upload error:", error);
                alert(`ERROR! ${error.message}`);
            }}
            className="ut-label:text-blue-500 ut-allowed-content:text-gray-400 border-gray-600 bg-gray-800/50 hover:bg-gray-800/80 transition-all duration-200"
        />
    );
};

export default ImageUpload;
