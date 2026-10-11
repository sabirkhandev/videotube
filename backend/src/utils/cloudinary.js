import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
import apiError from "./apiError.js";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        console.log("File is uploaded on cloudinary", response.url);

        fs.unlinkSync(localFilePath);
        
        return response;
    } catch (error) {
         console.error("CLOUDINARY UPLOAD ERROR DETECTED:", error);
        fs.unlinkSync(localFilePath);
        return null;
    }
};

const deleteFromCloudinary = async (publicId, resourceType = "image") => {
    try {
        if (!publicId) {
            throw new apiError(400, "Cannot get publicId");
        }
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
            invalidate: true,
        });
        return result;
    } catch (error) {
        console.error("Error while deleting file from cloudinary", error);
        return null;
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };
