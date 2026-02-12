import { put, del } from "@vercel/blob";

export async function uploadImage(file: Buffer, filename: string): Promise<string> {
  const blob = await put(filename, file, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return blob.url;
}

export async function deleteImage(url: string): Promise<void> {
  await del(url, {
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
}
