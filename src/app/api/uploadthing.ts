import {
    generateUploadButton,
    generateUploadDropzone,
  } from "@uploadthing/react";
import { OurFileRouter } from "./uploadthing/core";
  
  
  export const UploadButton = generateUploadButton<OurFileRouter>();
  export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
  