import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "cover",
  },
});
const uploadFile = multer({ storage: cloudinaryStorage });
export default uploadFile;
