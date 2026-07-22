const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

export interface CloudinaryUploadResult {
  publicId: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  resourceType: "image" | "video" | "raw";
}

// Unsigned upload — no API key/secret ever touches the browser, by design of the preset.
export async function uploadToCloudinary(
  file: File,
  folder?: string,
): Promise<CloudinaryUploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  if (folder) formData.append("folder", folder);

  const resourceType = file.type.startsWith("video/") ? "video" : "image";
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Cloudinary upload failed (${res.status}): ${body}`);
  }

  const data = await res.json();
  return {
    publicId: data.public_id,
    url: data.secure_url,
    width: data.width,
    height: data.height,
    format: data.format,
    bytes: data.bytes,
    resourceType: data.resource_type,
  };
}
