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
                    src={value instanceof File ? URL.createObjectURL(value) : value}
                    alt="Upload"
                    className="object-contain h-full w-full"
                />
            </div>
        );
    }

    return (
        <div className="w-full h-32 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-gray-800/50 transition-all relative">
            <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        // Create a fake URL for preview
                        const previewUrl = URL.createObjectURL(file);
                        onChange(file); // Pass the File object, not URL
                    }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center text-gray-400">
                <span className="text-sm font-medium">Click to upload logo</span>
                <span className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max 4MB)</span>
            </div>
        </div>
    );
};

export default ImageUpload;