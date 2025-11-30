import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const uploadOnCloudinary = async (filePath) => {
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    if (!filePath) throw new Error("No file path provided");

    try {
        const uploadResult = await cloudinary.uploader.upload(filePath);
        fs.unlinkSync(filePath); // delete local file
        return uploadResult.secure_url; // return the URL string
    } catch (error) {
        fs.existsSync(filePath) && fs.unlinkSync(filePath); // safe delete
        console.error("Cloudinary Upload Error:", error.message);
        throw new Error("Failed to upload image to Cloudinary");
    }
}

export default uploadOnCloudinary;
