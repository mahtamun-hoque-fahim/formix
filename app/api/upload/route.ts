import { auth } from "@clerk/nextjs/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs"; // Cloudinary SDK requires Node.js

const MAX_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB hard cap

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = req.headers.get("content-type") ?? "";
    if (!contentType.includes("multipart/form-data")) {
      return Response.json({ error: "Expected multipart/form-data" }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_SIZE_BYTES) {
      return Response.json(
        { error: `File too large. Maximum size is 20 MB.` },
        { status: 413 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadToCloudinary(buffer, file.name, "formix/uploads");

    return Response.json({
      url: result.url,
      publicId: result.publicId,
      name: file.name,
      size: result.bytes,
      format: result.format,
    });
  } catch (err) {
    console.error("[upload] POST error:", err);
    return Response.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
