import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  bytes: number;
  format: string;
  originalFilename: string;
}

export async function uploadToCloudinary(
  buffer: Buffer,
  originalName: string,
  folder = "formify/uploads"
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        public_id: sanitizeFilename(originalName),
      },
      (err, result) => {
        if (err || !result) return reject(err ?? new Error("Upload failed"));
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          bytes: result.bytes,
          format: result.format,
          originalFilename: result.original_filename,
        });
      }
    );
    stream.end(buffer);
  });
}

function sanitizeFilename(name: string): string {
  const ext = name.includes(".") ? name.split(".").pop() ?? "" : "";
  const base = name.replace(`.${ext}`, "").replace(/[^a-zA-Z0-9_-]/g, "_");
  return `${base}_${Date.now()}`;
}
