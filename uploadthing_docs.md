UploadThing React
React bindings for UploadThing.

factory
DEPRECATED
generateComponents
As of v6.2.1, the generateComponents function has been deprecated in favor of the generateUploadButton and generateUploadDropzone functions to improve tree-shaking.

The generateComponents function is used to generate the UploadButton and UploadDropzone components you use to interact with UploadThing. Generating components allows for fully typesafe components bound to the type of your file router.

utils/uploadthing.tsx
import { generateComponents } from "@uploadthing/react";
import type { OurFileRouter } from "~/app/api/uploadthing/core";
export const { UploadButton, UploadDropzone } =
  generateComponents<OurFileRouter>();

Copy
Copied!
factory
Since 6.2
generateUploadButton
The generateUploadButton function is used to generate the UploadButton component you use to interact with UploadThing. Generating components allows for fully typesafe components bound to the type of your file router.

utils/uploadthing.tsx
import { generateUploadButton } from "@uploadthing/react";
export const UploadButton = generateUploadButton<OurFileRouter>();

Copy
Copied!
Parameters
Name
url
Type
string | URL
Since 6.0
Description
The url to where you are serving your uploadthing file router.

Required if your route handler is not served from /api/uploadthing

Returns
UploadButton

factory
Since 6.2
generateUploadDropzone
The generateUploadDropzone function is used to generate the UploadDropzone component you use to interact with UploadThing. Generating components allows for fully typesafe components bound to the type of your file router.

utils/uploadthing.tsx
import { generateUploadDropzone } from "@uploadthing/react";
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

Copy
Copied!
Parameters
Name
url
Type
string | URL
Since 6.0
Description
The url to where you are serving your uploadthing file router.

Required if your route handler is not served from /api/uploadthing

Returns
UploadDropzone

factory
Since 5.0
generateReactHelpers
The generateReactHelpers function is used to generate the useUploadThing hook and the uploadFiles functions you use to interact with UploadThing in custom components. It takes your File Router as a generic

import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "~/app/api/uploadthing/core";
export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();

Copy
Copied!
Parameters
Name
url
Type
string | URL
Since 6.0
Description
The url to where you are serving your uploadthing file router.

Required if your route handler is not served from /api/uploadthing

Returns
Name
useUploadThing
Description
The typed useUploadThing hook

Name
uploadFiles
Description
The typed uploadFiles function

Name
getRouteConfig
Type
(endpoint: string) => ExpandedRouteConfig
Since 6.6
Description
Get the config for a given endpoint outside of React context.
Can only be used if the NextSSRPlugin is used in the app.

component
Since 5.0
UploadButton
We strongly recommend using the generateUploadButton function instead of importing it from @uploadthing/react directly for a fully typesafe component.

A simple button that opens the native file picker and uploads the selected files. The default button is shown below. See Theming on how to customize it.

No file chosenChoose file(s)
Allowed content
app/example-uploader.tsx
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "./api/uploadthing/core";
export const OurUploadButton = () => (
  <UploadButton<OurFileRouter>
    endpoint="imageUploader"
    onClientUploadComplete={(res) => {
      // Do something with the response
      console.log("Files: ", res);
      alert("Upload Completed");
    }}
    onUploadError={(error: Error) => {
      // Do something with the error.
      alert(`ERROR! ${error.message}`);
    }}
    onBeforeUploadBegin={(files) => {
      // Preprocess files before uploading (e.g. rename them)
      return files.map(
        (f) => new File([f], "renamed-" + f.name, { type: f.type }),
      );
    }}
    onUploadBegin={(name) => {
      // Do something once upload begins
      console.log("Uploading: ", name);
    }}
  />
);

Copy
Copied!
Props
Name
endpoint
Type
EndpointArg<FileRouter>
Required
Description
The name/slug of the route you want to upload to

The endpoint arg may be a string literal or a callback function:

await uploadFiles((routeRegistry) => routeRegistry.routeEndpoint, { ... })

Copy
Copied!
Using a callback function allows Go to Definition on routeEndpoint to take you straight to your backend file route definition, which is not possible when using a string literal parameter.

Name
input
Type
TInput
Since 5.0
Description
Input JSON data matching your validator set on the FileRoute to send with the request.

Name
headers
Type
HeadersInit | () => HeadersInit
Since 6.4
Description
Headers to be sent along the request to request the presigned URLs. Useful for authentication outside full-stack framework setups.

Name
onClientUploadComplete
Type
(UploadedFileResponse[]) => void
Since 5.0
Description
Callback function that runs after the serverside onUploadComplete callback.

export type UploadFileResponse<TServerOutput> = {
  name: string
  size: number
  key: string
  url: string
  customId: string | null
  // The data returned from the `onUploadComplete` callback on
  // the file route. Note that if `RouteOptions.awaitServerData`
  // isn't enabled this will be `null`.
  serverData: TServerOutput
}

Copy
Copied!
Name
onUploadError
Type
function
Since 5.0
Description
Callback function when that runs when an upload fails.

Name
onUploadAborted
Type
function
Since 6.7
Description
Callback function when that runs when an upload is aborted.

Name
uploadProgressGranularity
Type
'all' | 'fine' | 'coarse'
Default: coarseSince 7.3
Description
The granularity of which progress events are fired. 'all' forwards every progress event, 'fine' forwards events for every 1% of progress, 'coarse' forwards events for every 10% of progress.

Name
onUploadProgress
Type
function
Since 5.1
Description
Callback function that gets continuously called as the file is uploaded to the storage provider.

Name
onBeforeUploadBegin
Type
(files: File[]) => File[]
Since 6.0
Description
Callback function called before requesting the presigned URLs. The files returned are the files that will be uploaded, meaning you can use this to e.g. rename or resize the files.

Name
onUploadBegin
Type
({ file: string }) => void
Since 5.4
Description
Callback function called after the presigned URLs have been retrieved, just before the file is uploaded. Called once per file.

Name
disabled
Type
boolean
Default: falseSince 6.7
Description
Disables the button.

Name
config.appendOnPaste
Type
boolean
Default: falseSince 5.7
Description
Enables ability to paste files from clipboard when the button is focused.

Name
config.mode
Type
auto | manual
Default: autoSince 5.4
Description
Set the mode of the button. 'auto' triggers upload right after selection, 'manual' requires an extra click to start uploading.

Name
config.cn
Type
(classes: string[]) => string
Default: classes.join(' ')Since 7.0
Description
Function that merges classes together. May be required if you are are theming components with TailwindCSS and your classes are not applied correctly.

If you want to disable the button based on when your input is not satisfied, you can place your validator in a shared file, so that you can import it in both the server-side .input() and on the client-side for your disabled prop logic.

component
Since 5.0
UploadDropzone
We strongly recommend using the generateUploadDropzone function instead of importing it from @uploadthing/react directly for a fully typesafe component.

A react-dropzone powered dropzone that let's you drag and drop files to upload. The default dropzone is shown below. See Theming on how to customize it.

Choose a file or drag and drop
Allowed content
Ready
app/example-uploader.tsx
import { UploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "./api/uploadthing/core";
export const OurUploadDropzone = () => (
  <UploadDropzone<OurFileRouter>
    endpoint="withoutMdwr"
    onClientUploadComplete={(res) => {
      // Do something with the response
      console.log("Files: ", res);
      alert("Upload Completed");
    }}
    onUploadError={(error: Error) => {
      alert(`ERROR! ${error.message}`);
    }}
    onUploadBegin={(name) => {
      // Do something once upload begins
      console.log("Uploading: ", name);
    }}
    onDrop={(acceptedFiles) => {
      // Do something with the accepted files
      console.log("Accepted files: ", acceptedFiles);
    }}
  />
);

Copy
Copied!
Props
Name
endpoint
Type
EndpointArg<FileRouter>
Required
Description
The name/slug of the route you want to upload to upload to

The endpoint arg may be a string literal or a callback function:

await uploadFiles((routeRegistry) => routeRegistry.routeEndpoint, { ... })

Copy
Copied!
Using a callback function allows Go to Definition on routeEndpoint to take you straight to your backend file route definition, which is not possible when using a string literal parameter.

Name
input
Type
TInput
Since 5.0
Description
Input JSON data matching your validator set on the FileRoute to send with the request.

Name
headers
Type
HeadersInit | () => HeadersInit
Since 6.4
Description
Headers to be sent along the request to request the presigned URLs. Useful for authentication outside full-stack framework setups.

Name
onClientUploadComplete
Type
(UploadedFileResponse[]) => void
Since 5.0
Description
Callback function that runs after the serverside onUploadComplete callback.

export type UploadFileResponse<TServerOutput> = {
  name: string
  size: number
  key: string
  url: string
  customId: string | null
  // The data returned from the `onUploadComplete` callback on
  // the file route. Note that if `RouteOptions.awaitServerData`
  // isn't enabled this will be `null`.
  serverData: TServerOutput
}

Copy
Copied!
Name
onUploadError
Type
function
Since 5.0
Description
Callback function when that runs when an upload fails.

Name
onUploadAborted
Type
function
Since 6.7
Description
Callback function when that runs when an upload is aborted.

Name
uploadProgressGranularity
Type
'all' | 'fine' | 'coarse'
Default: coarseSince 7.3
Description
The granularity of which progress events are fired. 'all' forwards every progress event, 'fine' forwards events for every 1% of progress, 'coarse' forwards events for every 10% of progress.

Name
onUploadProgress
Type
function
Since 5.1
Description
Callback function that gets continuously called as the file is uploaded to the storage provider.

Name
onBeforeUploadBegin
Type
(files: File[]) => File[]
Since 6.0
Description
Callback function called before requesting the presigned URLs. The files returned are the files that will be uploaded, meaning you can use this to e.g. rename or resize the files.

Name
onUploadBegin
Type
({ file: string }) => void
Since 5.4
Description
Callback function called after the presigned URLs have been retrieved, just before the file is uploaded. Called once per file.

Name
disabled
Type
boolean
Default: falseSince 6.7
Description
Disables the button.

Name
config.appendOnPaste
Type
boolean
Default: falseSince 5.7
Description
Enables ability to paste files from clipboard when the button is focused.

Name
config.mode
Type
auto | manual
Default: manualSince 5.4
Description
Set the mode of the button. 'auto' triggers upload right after selection, 'manual' requires an extra click to start uploading.

Name
config.cn
Type
(classes: string[]) => string
Default: classes.join(' ')Since 7.0
Description
Function that merges classes together. May be required if you are are theming components with TailwindCSS and your classes are not applied correctly.

If you want to disable the dropzone based on when your input is not satisfied, you can place your validator in a shared file, so that you can import it in both the server-side .input() and on the client-side for your disabled prop logic.

hook
Since 5.6
useDropzone
This hook is currently a minified fork of react-dropzone ↗ with better ESM support. See their docs ↗ for reference.

You can import the minified hook from @uploadthing/react. If you need access to any of the removed APIs, you should import the original hook from react-dropzone.

This hook isn't strictly covered by semver as we might make changes to tailor it to our needs in a future minor release. Migration guides will be provided if this happens.

hook
Since 5.0
useUploadThing
This hook provides a function to start uploading, an isUploading state, and the permittedFileInfo which gives information about what file types, sizes and counts are allowed by the endpoint.

You have to generate this hook using the generateReactHelpers function.

Parameters
The first parameter is the route endpoint to upload to, and the second parameter is an options object:

The endpoint arg may be a string literal or a callback function:

useUploadThing((routeRegistry) => routeRegistry.routeEndpoint, { ... })

Copy
Copied!
Using a callback function allows Go to Definition on routeEndpoint to take you straight to your backend file route definition, which is not possible when using a string literal parameter.

Name
files
Type
File[]
RequiredSince 5.0
Description
An array of files to upload.

Name
headers
Type
HeadersInit | () => HeadersInit
Since 6.4
Description
Headers to be sent along the request to request the presigned URLs. Useful for authentication outside full-stack framework setups.

Name
signal
Type
AbortSignal
Since 6.7
Description
An abort signal to abort the upload.

Name
onClientUploadComplete
Type
(UploadedFileResponse[]) => void
Since 5.0
Description
Callback function that runs after the serverside onUploadComplete callback.

export type UploadFileResponse<TServerOutput> = {
  name: string
  size: number
  key: string
  url: string
  customId: string | null
  // The data returned from the `onUploadComplete` callback on
  // the file route. Note that if `RouteOptions.awaitServerData`
  // isn't enabled this will be `null`.
  serverData: TServerOutput
}

Copy
Copied!
Name
onUploadError
Type
function
Since 5.0
Description
Callback function when that runs when an upload fails.

Name
onUploadAborted
Type
function
Since 6.7
Description
Callback function when that runs when an upload is aborted.

Name
uploadProgressGranularity
Type
'all' | 'fine' | 'coarse'
Default: coarseSince 7.3
Description
The granularity of which progress events are fired. 'all' forwards every progress event, 'fine' forwards events for every 1% of progress, 'coarse' forwards events for every 10% of progress.

Name
onUploadProgress
Type
function
Since 5.1
Description
Callback function that gets continuously called as the file is uploaded to the storage provider.

Name
onUploadBegin
Type
({ file: string }) => void
Since 5.4
Description
Callback function called after the presigned URLs have been retrieved, just before the files are uploaded to the storage provider.

Returns
Name
startUpload
Type
(files: File[], input?: TInput) => void
Description
Function to start the upload. TInput is inferred from what you've defined on the fileroute on the backend.

Name
isUploading
Type
boolean
Description
Flag for if file(s) are currently uploading

Name
permittedFileTypes
Type
{ slug: string, config: ExpandedRouteConfig }
DEPRECATED
Description
Information on permitted file types, sizes, and counts etc.

Name
routeConfig
Type
ExpandedRouteConfig
Since 6.6
Description
Information on permitted file types, sizes, and counts etc.

Example
The following example shows a simple dropzone component using the useDropzone and useUploadThing hooks. For a more complete example, take a look at our prebuilt components ↗.

app/example-custom-uploader.tsx
import { useDropzone } from "@uploadthing/react";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";
import { useUploadThing } from "~/utils/uploadthing";
export function MultiUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);
  const { startUpload, routeConfig } = useUploadThing("myUploadEndpoint", {
    onClientUploadComplete: () => {
      alert("uploaded successfully!");
    },
    onUploadError: () => {
      alert("error occurred while uploading");
    },
    onUploadBegin: ({ file }) => {
      console.log("upload has begun for", file);
    },
  });
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes,
    ),
  });
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div>
        {files.length > 0 && (
          <button onClick={() => startUpload(files)}>
            Upload {files.length} files
          </button>
        )}
      </div>
      Drop files here!
    </div>
  );
}