import { BASE_URL } from "../api/axios";

// ... inside component
            <UploadButton
                endpoint={endpoint}
                url={`${BASE_URL}/api/uploadthing`} // Use dynamic base URL
                onClientUploadComplete={(res) => {
                    console.log("Files: ", res);
                    if (res && res[0]) {
                        onChange(res[0].url);
                    }
                }}
                onUploadError={(error) => {
                    console.error("Upload error: ", error);
                    alert(`ERROR! ${error.message}`);
                }}
                appearance={{
                    button: "bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-all"
                }}
            />
            <p className="text-gray-400 text-sm mt-2">Upload Image (Max 4MB)</p>
        </div >
    );
};

export default ImageUpload;
